// ================================
// WITHDRAWAL MODEL
// ================================

const mongoose = require('mongoose');

const withdrawalSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  currency: {
    type: String,
    required: true, // BTC, ETH, USDT, USD
  },
  amount: {
    type: Number,
    required: true,
  },
  fee: {
    type: Number,
    default: 0,
  },
  method: {
    type: String,
    enum: ['crypto', 'bank_transfer'],
    required: true,
  },
  walletAddress: String,
  bankDetails: {
    bankName: String,
    accountNumber: String,
    accountHolder: String,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'completed'],
    default: 'pending',
  },
  adminApprovedBy: mongoose.Schema.Types.ObjectId,
  transactionHash: String,
  securityPin: String,
  notes: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  approvedAt: Date,
  completedAt: Date,
}, { timestamps: true });

module.exports = mongoose.model('Withdrawal', withdrawalSchema);
