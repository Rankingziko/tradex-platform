// ================================
// MARKET DATA MODEL (FOR CACHE)
// ================================

const mongoose = require('mongoose');

const marketDataSchema = new mongoose.Schema({
  symbol: {
    type: String,
    required: true,
    unique: true, // BTC, ETH, etc
  },
  currentPrice: Number,
  previousPrice: Number,
  priceChange: Number,
  percentChange: Number,
  marketCap: Number,
  volume24h: Number,
  high24h: Number,
  low24h: Number,
  lastUpdated: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

module.exports = mongoose.model('MarketData', marketDataSchema);
