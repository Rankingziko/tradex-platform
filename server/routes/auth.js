// ================================
// AUTHENTICATION ROUTES
// ================================

const express = require('express');
const crypto = require('crypto');
const fileDB = require('../config/file-database');
const { generateToken, authMiddleware } = require('../config/auth');

const router = express.Router();

// Simple password hashing (alternative to bcrypt - works without external deps)
const hashPassword = (password) => {
  return crypto.createHash('sha256').update(password + 'salt123').digest('hex');
};

const verifyPassword = (inputPassword, hashedPassword) => {
  return hashPassword(inputPassword) === hashedPassword;
};

// Generate referral code
const generateReferralCode = () => {
  return 'TRX' + crypto.randomBytes(4).toString('hex').toUpperCase();
};

// Generate ID
const generateId = () => crypto.randomBytes(12).toString('hex');

// -------- REGISTER --------
router.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, email, password, confirmPassword } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    // Check password has letters and numbers
    if (!/[a-zA-Z]/.test(password) || !/\d/.test(password)) {
      return res.status(400).json({ error: 'Password must contain both letters and numbers' });
    }

    // Check if user exists
    const existingUser = await fileDB.getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = hashPassword(password);
    const referralCode = generateReferralCode();
    const userId = generateId();

    // Create user
    const user = await fileDB.createUser({
      _id: userId,
      firstName,
      lastName,
      email: email.toLowerCase(),
      password: hashedPassword,
      referralCode,
      balance: 0,
      role: 'trader',
    });

    // Create default wallets
    const cryptos = ['BTC', 'ETH', 'USDT', 'BNB', 'XRP'];
    for (const crypto of cryptos) {
      await fileDB.createWallet({
        userId: userId,
        currency: crypto,
        balance: 0,
        totalDeposited: 0,
        totalWithdrawn: 0,
        address: `${crypto.toLowerCase()}_address_${userId.substring(0, 8)}`,
      });
    }

    const token = generateToken(userId);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        referralCode: user.referralCode,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: error.message });
  }
});

// -------- LOGIN --------
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user
    const user = await fileDB.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Check password
    const passwordMatch = verifyPassword(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = generateToken(user._id);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        balance: user.balance || 0,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: error.message });
  }
});

// -------- GET CURRENT USER --------
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await fileDB.getUserById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        balance: user.balance || 0,
        role: user.role || 'trader',
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// -------- UPDATE PROFILE --------
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const { firstName, lastName, phone, country, profileImage } = req.body;
    
    const updateData = {};
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (phone) updateData.phone = phone;
    if (country) updateData.country = country;
    if (profileImage) updateData.profileImage = profileImage;

    const user = await fileDB.updateUser(req.userId, updateData);

    res.json({ 
      message: 'Profile updated', 
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        balance: user.balance || 0,
        role: user.role || 'trader',
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// -------- CHANGE PASSWORD --------
router.post('/change-password', authMiddleware, async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }

    const user = await fileDB.getUserById(req.userId);
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    const isPasswordValid = verifyPassword(currentPassword, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    const hashedPassword = hashPassword(newPassword);
    await fileDB.updateUser(req.userId, { password: hashedPassword });

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// -------- GOOGLE OAUTH --------
const passport = require('passport');
require('../config/google-oauth');

router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/google/callback',
  passport.authenticate('google', { session: false }),
  async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Google authentication failed' });
      }

      const token = generateToken(req.user._id);

      // Redirect to frontend with token
      const frontendUrl = process.env.CLIENT_URL || 'http://localhost:3000';
      res.redirect(
        `${frontendUrl}/dashboard?token=${token}&user=${encodeURIComponent(
          JSON.stringify({
            id: req.user._id,
            firstName: req.user.firstName,
            lastName: req.user.lastName,
            email: req.user.email,
            profileImage: req.user.profileImage,
          })
        )}`
      );
    } catch (error) {
      console.error('Google callback error:', error);
      res.redirect(`${process.env.CLIENT_URL || 'http://localhost:3000'}/login?error=${error.message}`);
    }
  }
);

// Verify Google credentials endpoint (for frontend to verify token)
router.post('/verify-google', async (req, res) => {
  try {
    const { googleToken } = req.body;

    if (!googleToken) {
      return res.status(400).json({ error: 'Google token is required' });
    }

    // You would verify the Google token here using Google's verification
    // For now, we're relying on the browser's Google login
    res.json({ message: 'Google verification would happen here' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
