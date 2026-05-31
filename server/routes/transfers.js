// ================================
// TRANSFER/P2P ROUTES
// ================================

const express = require('express');
const Transfer = require('../models/Transfer');
const User = require('../models/User');
const Wallet = require('../models/Wallet');
const Notification = require('../models/Notification');
const { authMiddleware } = require('../config/auth');

const router = express.Router();

// -------- SEND FUNDS TO USER --------
router.post('/send', authMiddleware, async (req, res) => {
  try {
    const { recipientEmail, currency, amount, reference } = req.body;

    if (!recipientEmail || !currency || !amount) {
      return res.status(400).json({ error: 'Required fields missing' });
    }

    const recipient = await User.findOne({ email: recipientEmail.toLowerCase() });
    if (!recipient) {
      return res.status(404).json({ error: 'Recipient not found' });
    }

    if (recipient._id.toString() === req.userId) {
      return res.status(400).json({ error: 'Cannot send to yourself' });
    }

    const senderWallet = await Wallet.findOne({
      userId: req.userId,
      currency: currency.toUpperCase(),
    });

    if (!senderWallet || senderWallet.balance < amount) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    const recipientWallet = await Wallet.findOne({
      userId: recipient._id,
      currency: currency.toUpperCase(),
    });

    if (!recipientWallet) {
      return res.status(404).json({ error: 'Recipient wallet not found' });
    }

    // Create transfer
    const transfer = new Transfer({
      senderUserId: req.userId,
      recipientUserId: recipient._id,
      currency: currency.toUpperCase(),
      amount,
      reference,
      status: 'completed',
      completedAt: new Date(),
    });

    await transfer.save();

    // Update wallets
    senderWallet.balance -= amount;
    recipientWallet.balance += amount;

    await senderWallet.save();
    await recipientWallet.save();

    // Update user balances
    const senderWallets = await Wallet.find({ userId: req.userId });
    const senderBalance = senderWallets.reduce((sum, w) => sum + w.balance, 0);
    await User.findByIdAndUpdate(req.userId, { balance: senderBalance });

    const recipientWallets = await Wallet.find({ userId: recipient._id });
    const recipientBalance = recipientWallets.reduce((sum, w) => sum + w.balance, 0);
    await User.findByIdAndUpdate(recipient._id, { balance: recipientBalance });

    // Send notifications
    await Notification.create({
      userId: req.userId,
      type: 'transfer',
      title: 'Transfer Sent',
      message: `You sent ${amount} ${currency} to ${recipient.firstName} ${recipient.lastName}`,
    });

    await Notification.create({
      userId: recipient._id,
      type: 'transfer',
      title: 'Transfer Received',
      message: `You received ${amount} ${currency} from ${req.headers['user-name'] || 'User'}`,
    });

    res.json({
      message: 'Transfer completed successfully',
      transfer,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// -------- GET TRANSFER HISTORY --------
router.get('/', authMiddleware, async (req, res) => {
  try {
    const sent = await Transfer.find({ senderUserId: req.userId })
      .populate('recipientUserId', 'firstName lastName email')
      .sort({ createdAt: -1 });

    const received = await Transfer.find({ recipientUserId: req.userId })
      .populate('senderUserId', 'firstName lastName email')
      .sort({ createdAt: -1 });

    res.json({ sent, received });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
