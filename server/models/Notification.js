// ================================
// NOTIFICATION MODEL
// ================================

const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: ['trade', 'deposit', 'withdrawal', 'transfer', 'system', 'alert', 'market', 'website', 'report'],
    required: true,
  },
  title: String,
  message: String,
  icon: String,
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium',
  },
  data: mongoose.Schema.Types.Mixed,
  read: {
    type: Boolean,
    default: false,
  },
  actionUrl: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
