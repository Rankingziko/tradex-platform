// ================================
// DEPOSIT MODEL
// ================================

const mongoose = require('mongoose');

const depositSchema = new mongoose.Schema({
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
  method: {
    type: String,
    enum: ['crypto', 'bank_transfer', 'card', 'opay', 'bitcoin', 'ethereum', 'usdt_trc20', 'usdt_bep20', 'bnb'],
    required: true,
  },
  depositAddress: String,
  bankDetails: {
    bankName: String,
    accountNumber: String,
    accountHolder: String,
    phone: String,
  },
  paymentDetails: {
    provider: String,
    accountName: String,
    accountNumber: String,
    walletAddress: String,
  },
  transactionHash: String,
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'pending',
  },
  proofOfPayment: String,
  confirmations: {
    type: Number,
    default: 0,
  },
  requiredConfirmations: {
    type: Number,
    default: 3,
  },
  notes: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  confirmedAt: Date,
}, { timestamps: true });

module.exports = mongoose.model('Deposit', depositSchema);
