// ================================
// DEPOSIT ROUTES
// ================================

const express = require('express');
const fileDB = require('../config/file-database');
const { authMiddleware } = require('../config/auth');

const router = express.Router();

// -------- PAYMENT METHODS WITH DETAILS --------
const paymentMethods = {
  opay: {
    name: 'OPay',
    icon: 'wallet',
    description: 'Send money via OPay',
    accountName: 'EBIYOR ZIKOREBAI',
    accountNumber: '8066824832',
    provider: 'OPay',
    minAmount: 100,
    maxAmount: 100000,
  },
  bank_transfer: {
    name: 'Bank Transfer',
    icon: 'building',
    description: 'Direct bank transfer',
    accountName: 'EBIYOR ZIKOROBAI',
    accountNumber: '8066824832',
    bankName: 'Bank Account',
    minAmount: 100,
    maxAmount: 500000,
  },
  naira: {
    name: 'Naira (NGN)',
    icon: 'coins',
    description: 'Nigerian Naira via OPay',
    currency: 'NGN',
    accountName: 'EBIYOR ZIKOROBI',
    paymentMethod: 'OPay',
    accountNumber: '8066824832',
    minAmount: 5000,
    maxAmount: 10000000,
  },
  bitcoin: {
    name: 'Bitcoin (BTC)',
    icon: 'bitcoin',
    description: 'Send Bitcoin directly',
    currency: 'BTC',
    minAmount: 0.001,
    maxAmount: 10,
    walletAddress: '1A1z7agoat3Z5QqRrXhKfvDkgvgPDk3bAV',
    networkFee: 'Variable',
  },
  ethereum: {
    name: 'Ethereum (ETH)',
    icon: 'ethereum',
    description: 'Send Ethereum directly',
    currency: 'ETH',
    minAmount: 0.01,
    maxAmount: 100,
    walletAddress: '0x742d35Cc6634C0532925a3b844Bc42e4b29234Be',
    networkFee: 'Variable',
  },
  usdt_trc20: {
    name: 'USDT (TRC20)',
    icon: 'coins',
    description: 'USDT on TRON network (cheaper fees)',
    currency: 'USDT',
    network: 'TRON',
    minAmount: 10,
    maxAmount: 100000,
    walletAddress: 'TKJHqVDTKBqNczBj7crZxPvVHXfZE8d8mY',
    networkFee: 'Minimal (~$1)',
  },
  usdt_bep20: {
    name: 'USDT (BEP20)',
    icon: 'coins',
    description: 'USDT on Binance Smart Chain',
    currency: 'USDT',
    network: 'BSC',
    minAmount: 10,
    maxAmount: 100000,
    walletAddress: '0x9F5B9Af3Bc9f0BedFf0Ee5dB5E4E5E4E5E4E5E4',
    networkFee: 'Low (~$1)',
  },
  bnb: {
    name: 'Binance Coin (BNB)',
    icon: 'coins',
    description: 'Send Binance Coin',
    currency: 'BNB',
    network: 'BSC',
    minAmount: 0.01,
    maxAmount: 500,
    walletAddress: '0xAb8483f64d9C6d1EcF9b849Ae677dD3315835cb2',
    networkFee: 'Low',
  },
  card: {
    name: 'Credit/Debit Card',
    icon: 'creditcard',
    description: 'Visa, Mastercard',
    minAmount: 50,
    maxAmount: 50000,
    processingTime: '1-3 minutes',
  },
};

// -------- GET PAYMENT METHODS --------
router.get('/methods', (req, res) => {
  res.json({ methods: paymentMethods });
});

// -------- CREATE DEPOSIT --------
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { currency, amount, method, bankDetails, depositAddress, paymentDetails } = req.body;

    if (!currency || !amount || !method) {
      return res.status(400).json({ error: 'Required fields missing' });
    }

    const methodInfo = paymentMethods[method];
    if (!methodInfo) {
      return res.status(400).json({ error: 'Invalid payment method' });
    }

    if (amount < methodInfo.minAmount || amount > methodInfo.maxAmount) {
      return res.status(400).json({ 
        error: `Amount must be between ${methodInfo.minAmount} and ${methodInfo.maxAmount}` 
      });
    }

    const deposit = await fileDB.createDeposit({
      userId: req.userId,
      currency: currency.toUpperCase(),
      amount,
      method,
      depositAddress: depositAddress || paymentMethods[method].walletAddress || `${currency.toLowerCase()}_wallet_${req.userId}`,
      bankDetails: method === 'bank_transfer' ? bankDetails : null,
      paymentDetails: ['opay', 'bitcoin', 'ethereum', 'usdt_trc20', 'usdt_bep20', 'bnb'].includes(method) ? paymentDetails : null,
      status: 'pending',
      transactionId: 'TXN-' + Date.now(),
    });

    res.status(201).json({
      message: 'Deposit created',
      deposit,
      methodDetails: methodInfo,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// -------- GET USER DEPOSITS --------
router.get('/', authMiddleware, async (req, res) => {
  try {
    const deposits = await fileDB.getDeposits(req.userId);

    const stats = {
      totalDeposits: deposits.reduce((sum, d) => sum + (d.amount || 0), 0),
      pendingDeposits: deposits.filter(d => d.status === 'pending').length,
      confirmedDeposits: deposits.filter(d => d.status === 'confirmed').length,
    };

    res.json({ deposits, stats });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// -------- APPROVE DEPOSIT (ADMIN) --------
router.put('/:id/approve', async (req, res) => {
  try {
    const deposit = await fileDB.getDepositById(req.params.id);
    if (!deposit) {
      return res.status(404).json({ error: 'Deposit not found' });
    }

    // Update deposit status
    const updated = await fileDB.updateDeposit(req.params.id, {
      status: 'confirmed',
      confirmedAt: new Date().toISOString(),
      confirmations: 10,
    });

    // Add funds to wallet
    const wallet = await fileDB.getWallet(deposit.userId, deposit.currency);
    if (wallet) {
      await fileDB.updateWallet(wallet._id, {
        balance: (wallet.balance || 0) + deposit.amount,
        totalDeposited: (wallet.totalDeposited || 0) + deposit.amount,
      });

      // Update user balance
      const wallets = await fileDB.getWallets(deposit.userId);
      const totalBalance = wallets.reduce((sum, w) => sum + (w.balance || 0), 0);
      await fileDB.updateUser(deposit.userId, { balance: totalBalance });
    }

    res.json({ message: 'Deposit approved', deposit: updated });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// -------- REJECT DEPOSIT (ADMIN) --------
router.put('/:id/reject', async (req, res) => {
  try {
    const { reason } = req.body;
    const deposit = await fileDB.getDepositById(req.params.id);

    if (!deposit) {
      return res.status(404).json({ error: 'Deposit not found' });
    }

    const updated = await fileDB.updateDeposit(req.params.id, {
      status: 'cancelled',
      notes: reason,
    });

    res.json({ message: 'Deposit rejected', deposit: updated });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
