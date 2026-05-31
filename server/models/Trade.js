// ================================
// TRADE MODEL
// ================================

const mongoose = require('mongoose');

const tradeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  symbol: {
    type: String,
    required: true, // BTC/USD, ETH/USD, etc.
  },
  type: {
    type: String,
    enum: ['buy', 'sell'],
    required: true,
  },
  orderType: {
    type: String,
    enum: ['market', 'limit', 'stop-loss', 'take-profit'],
    default: 'market',
  },
  quantity: {
    type: Number,
    required: true,
  },
  entryPrice: {
    type: Number,
    required: true,
  },
  exitPrice: Number,
  leverage: {
    type: Number,
    default: 1,
  },
  stopLoss: Number,
  takeProfit: Number,
  status: {
    type: String,
    enum: ['open', 'closed', 'pending', 'cancelled'],
    default: 'open',
  },
  profitLoss: Number,
  profitLossPercentage: Number,
  commission: {
    type: Number,
    default: 0,
  },
  openedAt: {
    type: Date,
    default: Date.now,
  },
  closedAt: Date,
  notes: String,
}, { timestamps: true });

module.exports = mongoose.model('Trade', tradeSchema);
