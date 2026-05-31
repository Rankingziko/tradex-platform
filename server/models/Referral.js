// ================================
// REFERRAL MODEL
// ================================

const mongoose = require('mongoose');

const referralSchema = new mongoose.Schema({
  referrerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  referredUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'verified'],
    default: 'pending',
  },
  commissionPercentage: {
    type: Number,
    default: 10,
  },
  totalCommission: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  verifiedAt: Date,
}, { timestamps: true });

module.exports = mongoose.model('Referral', referralSchema);
