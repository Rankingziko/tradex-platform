// ================================
// WALLET ROUTES
// ================================

const express = require('express');
const fileDB = require('../config/file-database');
const { authMiddleware } = require('../config/auth');

const router = express.Router();

// -------- GET ALL WALLETS --------
router.get('/', authMiddleware, async (req, res) => {
  try {
    const wallets = await fileDB.getWallets(req.userId);
    const totalBalance = wallets.reduce((sum, w) => sum + (w.balance || 0), 0);

    res.json({ wallets, totalBalance });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// -------- GET WALLET BY CURRENCY --------
router.get('/:currency', authMiddleware, async (req, res) => {
  try {
    const wallet = await fileDB.getWallet(req.userId, req.params.currency.toUpperCase());

    if (!wallet) {
      return res.status(404).json({ error: 'Wallet not found' });
    }

    res.json({ wallet });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// -------- ADD WALLET --------
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { currency, address } = req.body;

    const existingWallet = await fileDB.getWallet(req.userId, currency.toUpperCase());

    if (existingWallet) {
      return res.status(400).json({ error: 'Wallet already exists' });
    }

    const wallet = await fileDB.createWallet({
      userId: req.userId,
      currency: currency.toUpperCase(),
      address,
      balance: 0,
      totalDeposited: 0,
      totalWithdrawn: 0,
    });

    res.status(201).json({ message: 'Wallet created', wallet });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// -------- UPDATE WALLET BALANCE (ADMIN ONLY) --------
router.put('/:id/balance', authMiddleware, async (req, res) => {
  try {
    const { amount, action } = req.body; // action: 'add' or 'subtract'

    const wallets = await fileDB.getWallets(req.userId);
    const targetWallet = wallets.find(w => w._id === req.params.id);
    
    if (!targetWallet) {
      return res.status(404).json({ error: 'Wallet not found' });
    }

    let newBalance = targetWallet.balance || 0;

    if (action === 'add') {
      newBalance += amount;
    } else if (action === 'subtract') {
      if (newBalance < amount) {
        return res.status(400).json({ error: 'Insufficient balance' });
      }
      newBalance -= amount;
    }

    const updated = await fileDB.updateWallet(req.params.id, { balance: newBalance });

    // Also update user's main balance
    const allWallets = await fileDB.getWallets(req.userId);
    const totalBalance = allWallets.reduce((sum, w) => sum + (w.balance || 0), 0);
    await fileDB.updateUser(req.userId, { balance: totalBalance });

    res.json({ message: 'Wallet updated', wallet: updated });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// -------- SEND FUNDS --------
router.post('/send', authMiddleware, async (req, res) => {
  try {
    const fs = require('fs');
    const path = require('path');
    const { recipientType, recipient, amount, currency, description } = req.body;

    if (!recipientType || !recipient || !amount || !currency) {
      return res.status(400).json({ error: 'Required fields missing' });
    }

    if (amount <= 0) {
      return res.status(400).json({ error: 'Amount must be greater than 0' });
    }

    // Get sender info
    const sender = await fileDB.getUserById(req.userId);
    if (!sender) {
      return res.status(404).json({ error: 'Sender not found' });
    }

    // Get sender's wallet
    const senderWallet = await fileDB.getWallet(req.userId, currency.toUpperCase());
    if (!senderWallet || senderWallet.balance < amount) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    // Deduct from sender
    const newSenderBalance = senderWallet.balance - amount;
    await fileDB.updateWallet(senderWallet._id, { balance: newSenderBalance });

    let transferData = {
      _id: `txfer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      senderId: req.userId,
      senderEmail: sender.email,
      senderName: `${sender.firstName} ${sender.lastName}`,
      recipientType,
      recipient,
      amount,
      currency: currency.toUpperCase(),
      description: description || '',
      status: 'completed',
      createdAt: new Date().toISOString(),
      completedAt: new Date().toISOString()
    };

    // Handle different recipient types
    if (recipientType === 'user') {
      // Send to another user on the site
      const recipientUser = await fileDB.getUserById(recipient);
      if (!recipientUser) {
        // Refund sender
        await fileDB.updateWallet(senderWallet._id, { balance: senderWallet.balance });
        return res.status(404).json({ error: 'Recipient user not found' });
      }

      if (recipientUser._id === req.userId) {
        // Refund sender
        await fileDB.updateWallet(senderWallet._id, { balance: senderWallet.balance });
        return res.status(400).json({ error: 'Cannot send to yourself' });
      }

      // Get or create recipient wallet
      let recipientWallet = await fileDB.getWallet(recipientUser._id, currency.toUpperCase());
      if (!recipientWallet) {
        recipientWallet = await fileDB.createWallet({
          userId: recipientUser._id,
          currency: currency.toUpperCase(),
          balance: amount,
          totalDeposited: amount,
          totalWithdrawn: 0
        });
      } else {
        await fileDB.updateWallet(recipientWallet._id, { balance: recipientWallet.balance + amount });
      }

      // Update recipient user's total balance
      const recipientWallets = await fileDB.getWallets(recipientUser._id);
      const recipientTotalBalance = recipientWallets.reduce((sum, w) => sum + (w.balance || 0), 0);
      await fileDB.updateUser(recipientUser._id, { balance: recipientTotalBalance });

      transferData.recipientId = recipientUser._id;
      transferData.recipientEmail = recipientUser.email;
      transferData.recipientName = `${recipientUser.firstName} ${recipientUser.lastName}`;
    } else if (recipientType === 'crypto') {
      // Send to crypto wallet address
      transferData.walletAddress = recipient;
      transferData.type = 'crypto_withdrawal';
    } else if (recipientType === 'bank') {
      // Send to bank account
      transferData.bankInfo = recipient;
      transferData.type = 'bank_transfer';
    }

    // Save transfer to file
    const transfersFile = path.join(__dirname, '../data/transfers.json');
    let transfers = [];
    if (fs.existsSync(transfersFile)) {
      const data = fs.readFileSync(transfersFile, 'utf8');
      transfers = JSON.parse(data) || [];
    }
    transfers.push(transferData);
    fs.writeFileSync(transfersFile, JSON.stringify(transfers, null, 2));

    // Update sender's total balance
    const senderWallets = await fileDB.getWallets(req.userId);
    const senderTotalBalance = senderWallets.reduce((sum, w) => sum + (w.balance || 0), 0);
    await fileDB.updateUser(req.userId, { balance: senderTotalBalance });

    // Log activity
    await fileDB.logActivity(req.userId, 'transfer', {
      type: recipientType,
      amount,
      currency,
      recipient: transferData.recipientEmail || recipient,
      description
    });

    res.json({
      message: `Funds sent successfully to ${recipientType}`,
      transfer: transferData
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
