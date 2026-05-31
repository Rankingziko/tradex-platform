// ================================
// ADMIN LOG MODEL
// ================================

const mongoose = require('mongoose');

const adminLogSchema = new mongoose.Schema({
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  action: {
    type: String,
    enum: ['deposit_approved', 'deposit_rejected', 'withdrawal_approved', 'withdrawal_rejected', 'user_verified', 'user_suspended', 'broadcast_sent', 'balance_adjusted'],
    required: true,
  },
  targetUserId: mongoose.Schema.Types.ObjectId,
  targetId: String, // ID of deposit/withdrawal/etc
  details: String,
  changes: mongoose.Schema.Types.Mixed,
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

module.exports = mongoose.model('AdminLog', adminLogSchema);
