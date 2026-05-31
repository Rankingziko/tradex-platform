// ================================
// KYC DOCUMENT MODEL
// ================================

const mongoose = require('mongoose');

const kycDocumentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  documentType: {
    type: String,
    enum: ['passport', 'national_id', 'driver_license'],
    required: true,
  },
  documentNumber: String,
  frontImage: String,
  backImage: String,
  status: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending',
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
  verifiedAt: Date,
  rejectionReason: String,
}, { timestamps: true });

module.exports = mongoose.model('KycDocument', kycDocumentSchema);
