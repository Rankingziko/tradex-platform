// ================================
// USER MODEL
// ================================

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: String,
  country: String,
  profileImage: String,
  verified: {
    type: Boolean,
    default: false,
  },
  twoFactorEnabled: {
    type: Boolean,
    default: false,
  },
  twoFactorSecret: String,
  kycVerified: {
    type: Boolean,
    default: false,
  },
  kycStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  bankAccounts: [
    {
      accountNumber: String,
      bankName: String,
      accountHolder: String,
      verified: Boolean,
    },
  ],
  walletAddresses: [
    {
      address: String,
      currency: String,
      verified: Boolean,
    },
  ],
  balance: {
    type: Number,
    default: 0,
  },
  referralCode: String,
  referredBy: String,
  referralEarnings: {
    type: Number,
    default: 0,
  },
  vipLevel: {
    type: String,
    enum: ['bronze', 'silver', 'gold', 'platinum'],
    default: 'bronze',
  },
  notificationSettings: {
    emailNotifications: { type: Boolean, default: true },
    pushNotifications: { type: Boolean, default: true },
    tradeAlerts: { type: Boolean, default: true },
    depositAlerts: { type: Boolean, default: true },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  lastLogin: Date,
  accountStatus: {
    type: String,
    enum: ['active', 'suspended', 'closed'],
    default: 'active',
  },
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);
