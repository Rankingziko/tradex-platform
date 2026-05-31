// ================================
// WITHDRAWAL ROUTES
// ================================

const express = require('express');
const Withdrawal = require('../models/Withdrawal');
const Wallet = require('../models/Wallet');
const Notification = require('../models/Notification');
const { authMiddleware } = require('../config/auth');

const router = express.Router();

// -------- CREATE WITHDRAWAL --------
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { currency, amount, method, walletAddress, bankDetails, securityPin } = req.body;

    if (!currency || !amount || !method) {
      return res.status(400).json({ error: 'Required fields missing' });
    }

    const wallet = await Wallet.findOne({
      userId: req.userId,
      currency: currency.toUpperCase(),
    });

    if (!wallet || wallet.balance < amount) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    // Calculate fee (0.5% example)
    const fee = amount * 0.005;

    const withdrawal = new Withdrawal({
      userId: req.userId,
      currency: currency.toUpperCase(),
      amount,
      fee,
      method,
      walletAddress: method === 'crypto' ? walletAddress : null,
      bankDetails: method === 'bank_transfer' ? bankDetails : null,
      securityPin,
      status: 'pending',
    });

    await withdrawal.save();

    // Lock the balance
    wallet.balance -= (amount + fee);
    wallet.lockedBalance += (amount + fee);
    await wallet.save();

    await Notification.create({
      userId: req.userId,
      type: 'withdrawal',
      title: 'Withdrawal Requested',
      message: `Withdrawal of ${amount} ${currency} is pending admin approval`,
    });

    res.status(201).json({
      message: 'Withdrawal request created',
      withdrawal,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// -------- GET USER WITHDRAWALS --------
router.get('/', authMiddleware, async (req, res) => {
  try {
    const withdrawals = await Withdrawal.find({ userId: req.userId }).sort({ createdAt: -1 });

    const stats = {
      totalWithdrawals: withdrawals.reduce((sum, w) => sum + w.amount, 0),
      pendingWithdrawals: withdrawals.filter(w => w.status === 'pending').length,
      completedWithdrawals: withdrawals.filter(w => w.status === 'completed').length,
    };

    res.json({ withdrawals, stats });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// -------- APPROVE WITHDRAWAL (ADMIN) --------
router.put('/:id/approve', async (req, res) => {
  try {
    const withdrawal = await Withdrawal.findById(req.params.id);
    if (!withdrawal) {
      return res.status(404).json({ error: 'Withdrawal not found' });
    }

    withdrawal.status = 'completed';
    withdrawal.approvedAt = new Date();
    withdrawal.completedAt = new Date();
    await withdrawal.save();

    const wallet = await Wallet.findOne({
      userId: withdrawal.userId,
      currency: withdrawal.currency,
    });

    if (wallet) {
      wallet.lockedBalance = Math.max(0, wallet.lockedBalance - (withdrawal.amount + withdrawal.fee));
      wallet.totalWithdrawn += withdrawal.amount;
      await wallet.save();
    }

    await Notification.create({
      userId: withdrawal.userId,
      type: 'withdrawal',
      title: 'Withdrawal Completed',
      message: `Your withdrawal of ${withdrawal.amount} ${withdrawal.currency} has been completed!`,
    });

    res.json({ message: 'Withdrawal approved', withdrawal });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// -------- REJECT WITHDRAWAL (ADMIN) --------
router.put('/:id/reject', async (req, res) => {
  try {
    const { reason } = req.body;
    const withdrawal = await Withdrawal.findById(req.params.id);

    if (!withdrawal) {
      return res.status(404).json({ error: 'Withdrawal not found' });
    }

    withdrawal.status = 'rejected';
    withdrawal.notes = reason;
    await withdrawal.save();

    // Refund the balance
    const wallet = await Wallet.findOne({
      userId: withdrawal.userId,
      currency: withdrawal.currency,
    });

    if (wallet) {
      wallet.balance += (withdrawal.amount + withdrawal.fee);
      wallet.lockedBalance = Math.max(0, wallet.lockedBalance - (withdrawal.amount + withdrawal.fee));
      await wallet.save();
    }

    await Notification.create({
      userId: withdrawal.userId,
      type: 'withdrawal',
      title: 'Withdrawal Rejected',
      message: `Your withdrawal has been rejected. Reason: ${reason}`,
    });

    res.json({ message: 'Withdrawal rejected', withdrawal });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
