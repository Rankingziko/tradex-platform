// ================================
// TRADEX - MAIN BACKEND SERVER
// ================================

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/database');
const { authMiddleware } = require('./config/auth');

// Load environment variables
dotenv.config();

const app = express();

// ================================
// SECURITY MIDDLEWARE
// ================================

app.use(helmet());

// CORS configuration that allows both localhost and ngrok domains
const corsOptions = {
  origin: function(origin, callback) {
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost',
      'http://127.0.0.1:3000',
      process.env.CLIENT_URL,
    ];
    
    // Allow any ngrok domain and http://localhost requests
    if (!origin || origin.includes('localhost') || origin.includes('127.0.0.1') || origin.includes('ngrok')) {
      callback(null, true);
    } else if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'), false);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP',
});

app.use('/api/', limiter);

// ================================
// BODY PARSER MIDDLEWARE
// ================================

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// ================================
// DATABASE CONNECTION
// ================================

connectDB();

// ================================
// ROUTES
// ================================

// Authentication routes
app.use('/api/auth', require('./routes/auth'));

// Public routes
app.use('/api/markets', require('./routes/markets'));

// Public payment methods endpoint
app.get('/api/payment-methods', (req, res) => {
  const methods = {
    opay: {
      name: 'OPay',
      icon: 'wallet',
      description: 'Send money via OPay',
      accountName: 'EBIYOR ZIKOREBAI',
      accountNumber: '8066824832',
      provider: 'OPay',
      minAmount: 100,
      maxAmount: 100000,
    },
    bank_transfer: {
      name: 'Bank Transfer',
      icon: 'building',
      description: 'Direct bank transfer',
      accountName: 'EBIYOR ZIKOROBAI',
      accountNumber: '8066824832',
      minAmount: 100,
      maxAmount: 500000,
    },
    naira: {
      name: 'Naira (NGN)',
      icon: 'coins',
      description: 'Nigerian Naira via OPay',
      currency: 'NGN',
      accountName: 'EBIYOR ZIKOROBI',
      paymentMethod: 'OPay',
      accountNumber: '8066824832',
      minAmount: 5000,
      maxAmount: 10000000,
    },
    bitcoin: {
      name: 'Bitcoin (BTC)',
      icon: 'bitcoin',
      description: 'Send Bitcoin directly',
      currency: 'BTC',
      minAmount: 0.001,
      maxAmount: 10,
      walletAddress: '1A1z7agoat3Z5QqRrXhKfvDkgvgPDk3bAV',
      networkFee: 'Variable',
    },
    ethereum: {
      name: 'Ethereum (ETH)',
      icon: 'ethereum',
      description: 'Send Ethereum directly',
      currency: 'ETH',
      minAmount: 0.01,
      maxAmount: 100,
      walletAddress: '0x742d35Cc6634C0532925a3b844Bc42e4b29234Be',
      networkFee: 'Variable',
    },
    usdt_trc20: {
      name: 'USDT (TRC20)',
      icon: 'coins',
      description: 'USDT on TRON network (cheaper fees)',
      currency: 'USDT',
      network: 'TRON',
      minAmount: 10,
      maxAmount: 100000,
      walletAddress: 'TKJHqVDTKBqNczBj7crZxPvVHXfZE8d8mY',
      networkFee: 'Minimal (~$1)',
    },
    usdt_bep20: {
      name: 'USDT (BEP20)',
      icon: 'coins',
      description: 'USDT on Binance Smart Chain',
      currency: 'USDT',
      network: 'BSC',
      minAmount: 10,
      maxAmount: 100000,
      walletAddress: '0x9F5B9Af3Bc9f0BedFf0Ee5dB5E4E5E4E5E4E5E4',
      networkFee: 'Low (~$1)',
    },
    bnb: {
      name: 'Binance Coin (BNB)',
      icon: 'coins',
      description: 'Send Binance Coin',
      currency: 'BNB',
      network: 'BSC',
      minAmount: 0.01,
      maxAmount: 500,
      walletAddress: '0xAb8483f64d9C6d1EcF9b849Ae677dD3315835cb2',
      networkFee: 'Low',
    },
    card: {
      name: 'Credit/Debit Card',
      icon: 'creditcard',
      description: 'Visa, Mastercard',
      minAmount: 50,
      maxAmount: 50000,
      processingTime: '1-3 minutes',
    },
  };
  res.json({ methods });
});

// Protected routes (require authentication)
app.use('/api/wallets', authMiddleware, require('./routes/wallets'));
app.use('/api/trades', authMiddleware, require('./routes/trades'));
app.use('/api/deposits', authMiddleware, require('./routes/deposits'));
app.use('/api/withdrawals', authMiddleware, require('./routes/withdrawals'));
app.use('/api/transfers', authMiddleware, require('./routes/transfers'));
app.use('/api/notifications', authMiddleware, require('./routes/notifications'));
app.use('/api/reports', authMiddleware, require('./routes/reports'));
app.use('/api/users', authMiddleware, require('./routes/users'));

// Admin routes
app.use('/api/admin', authMiddleware, require('./routes/admin'));

// ================================
// HEALTH CHECK ENDPOINT
// ================================

app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// ================================
// ERROR HANDLING
// ================================

app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
  });
});

// ================================
// 404 HANDLER
// ================================

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ================================
// START SERVER
// ================================

const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║     🚀 TRADEX BACKEND RUNNING 🚀      ║
╚════════════════════════════════════════╝
  
  ✅ Server running on port ${PORT}
  🔧 Environment: ${NODE_ENV}
  🌐 URL: http://localhost:${PORT}
  
  Available endpoints:
  - POST   /api/auth/register
  - POST   /api/auth/login
  - GET    /api/markets
  - POST   /api/trades (with auth)
  - GET    /api/wallets (with auth)
  - POST   /api/deposits (with auth)
  - GET    /api/health
  
  Start frontend with:
  cd ../client && npm start
  
  Database: MongoDB
  Ready to accept connections...
  `);
});

module.exports = app;
