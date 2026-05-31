// ================================
// TRANSFER MODEL (P2P TRANSFERS)
// ================================

const mongoose = require('mongoose');

const transferSchema = new mongoose.Schema({
  senderUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  recipientUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  currency: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'cancelled'],
    default: 'completed',
  },
  reference: String,
  notes: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  completedAt: Date,
}, { timestamps: true });

module.exports = mongoose.model('Transfer', transferSchema);
