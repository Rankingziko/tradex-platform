// ================================
// WALLET MODEL
// ================================

const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  currency: {
    type: String,
    required: true, // BTC, ETH, USDT, etc.
  },
  balance: {
    type: Number,
    default: 0,
  },
  availableBalance: {
    type: Number,
    default: 0,
  },
  lockedBalance: {
    type: Number,
    default: 0,
  },
  address: String,
  totalDeposited: {
    type: Number,
    default: 0,
  },
  totalWithdrawn: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

module.exports = mongoose.model('Wallet', walletSchema);
