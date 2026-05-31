// ================================
// TRADEX - Backend Main Server
// ================================

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

dotenv.config();

const app = express();

// ================================
// MIDDLEWARE
// ================================

app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use('/api/', limiter);

// ================================
// MONGODB CONNECTION
// ================================

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/tradex', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error('❌ MongoDB error:', err));

// ================================
// DATABASE MODELS
// ================================

// User Model
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  fullName: String,
  phone: String,
  country: String,
  profileImage: String,
  balance: {
    type: Number,
    default: 0
  },
  totalProfit: {
    type: Number,
    default: 0
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  twoFactorEnabled: {
    type: Boolean,
    default: false
  },
  kycVerified: {
    type: Boolean,
    default: false
  },
  referralCode: String,
  referredBy: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

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

const User = mongoose.model('User', userSchema);

// Wallet Model
const walletSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  walletAddress: String,
  crypto: String, // BTC, ETH, USDT
  balance: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Wallet = mongoose.model('Wallet', walletSchema);

// Trade Model
const tradeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  pair: String, // BTC/USD, ETH/USD, etc
  type: String, // BUY or SELL
  orderType: String, // MARKET or LIMIT
  amount: Number,
  price: Number,
  stopLoss: Number,
  takeProfit: Number,
  leverage: {
    type: Number,
    default: 1
  },
  status: {
    type: String,
    enum: ['OPEN', 'CLOSED', 'PENDING'],
    default: 'OPEN'
  },
  profit: Number,
  openedAt: {
    type: Date,
    default: Date.now
  },
  closedAt: Date
});

const Trade = mongoose.model('Trade', tradeSchema);

// Deposit Model
const depositSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  method: String, // CRYPTO, BANK_TRANSFER
  crypto: String, // BTC, ETH, USDT
  amount: Number,
  walletAddress: String,
  transactionId: String,
  proofImage: String,
  status: {
    type: String,
    enum: ['PENDING', 'CONFIRMED', 'REJECTED'],
    default: 'PENDING'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Deposit = mongoose.model('Deposit', depositSchema);

// Withdrawal Model
const withdrawalSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  method: String, // CRYPTO, BANK_TRANSFER
  crypto: String,
  amount: Number,
  walletAddress: String,
  bankAccount: String,
  fee: Number,
  status: {
    type: String,
    enum: ['PENDING', 'APPROVED', 'COMPLETED', 'REJECTED'],
    default: 'PENDING'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Withdrawal = mongoose.model('Withdrawal', withdrawalSchema);

// Transfer Model
const transferSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recipientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: Number,
  status: {
    type: String,
    enum: ['COMPLETED', 'PENDING', 'FAILED'],
    default: 'COMPLETED'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Transfer = mongoose.model('Transfer', transferSchema);

// Notification Model
const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: String,
  message: String,
  type: String, // TRADE, DEPOSIT, WITHDRAWAL, SYSTEM
  read: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Notification = mongoose.model('Notification', notificationSchema);

// ================================
// AUTH MIDDLEWARE
// ================================

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// ================================
// AUTH ROUTES
// ================================

// Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const user = new User({
      username,
      email,
      password,
      referralCode: 'REF' + Math.random().toString(36).substr(2, 9).toUpperCase(),
      balance: 1000 // Starting balance for demo
    });

    await user.save();

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '30d' }
    );

    res.json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        balance: user.balance
      },
      token
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '30d' }
    );

    res.json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        balance: user.balance,
        totalProfit: user.totalProfit
      },
      token
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ================================
// USER ROUTES
// ================================

// Get user profile
app.get('/api/user/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update profile
app.put('/api/user/profile', authenticateToken, async (req, res) => {
  try {
    const { fullName, phone, country, profileImage } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { fullName, phone, country, profileImage },
      { new: true }
    ).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ================================
// TRADE ROUTES
// ================================

// Place trade
app.post('/api/trades/place', authenticateToken, async (req, res) => {
  try {
    const { pair, type, orderType, amount, price, stopLoss, takeProfit, leverage } = req.body;

    const trade = new Trade({
      userId: req.user.userId,
      pair,
      type,
      orderType,
      amount,
      price,
      stopLoss,
      takeProfit,
      leverage: leverage || 1,
      status: 'OPEN'
    });

    await trade.save();

    // Update user balance
    const user = await User.findById(req.user.userId);
    const tradeValue = amount * price;
    
    if (type === 'BUY') {
      user.balance -= tradeValue;
    } else {
      user.balance += tradeValue;
    }
    
    await user.save();

    res.json({ success: true, trade });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Close trade
app.post('/api/trades/:tradeId/close', authenticateToken, async (req, res) => {
  try {
    const { closingPrice } = req.body;
    const trade = await Trade.findById(req.params.tradeId);

    if (!trade) return res.status(404).json({ error: 'Trade not found' });

    const openValue = trade.amount * trade.price;
    const closeValue = trade.amount * closingPrice;
    const profit = trade.type === 'BUY' ? closeValue - openValue : openValue - closeValue;

    trade.status = 'CLOSED';
    trade.profit = profit;
    trade.closedAt = new Date();
    await trade.save();

    // Update user balance and total profit
    const user = await User.findById(req.user.userId);
    user.balance += closeValue;
    user.totalProfit += profit;
    await user.save();

    // Create notification
    const notification = new Notification({
      userId: req.user.userId,
      title: 'Trade Closed',
      message: `${trade.pair} ${trade.type} trade closed with ${profit > 0 ? 'profit' : 'loss'} of $${Math.abs(profit).toFixed(2)}`,
      type: 'TRADE'
    });
    await notification.save();

    res.json({ success: true, profit });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user trades
app.get('/api/trades', authenticateToken, async (req, res) => {
  try {
    const trades = await Trade.find({ userId: req.user.userId }).sort({ createdAt: -1 });
    res.json(trades);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ================================
// DEPOSIT ROUTES
// ================================

// Create deposit
app.post('/api/deposits/create', authenticateToken, async (req, res) => {
  try {
    const { method, crypto, amount, walletAddress, transactionId, proofImage } = req.body;

    const deposit = new Deposit({
      userId: req.user.userId,
      method,
      crypto,
      amount,
      walletAddress,
      transactionId,
      proofImage,
      status: 'PENDING'
    });

    await deposit.save();

    res.json({ success: true, deposit });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get deposits
app.get('/api/deposits', authenticateToken, async (req, res) => {
  try {
    const deposits = await Deposit.find({ userId: req.user.userId }).sort({ createdAt: -1 });
    res.json(deposits);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ================================
// WITHDRAWAL ROUTES
// ================================

// Create withdrawal
app.post('/api/withdrawals/create', authenticateToken, async (req, res) => {
  try {
    const { method, crypto, amount, walletAddress, bankAccount, fee } = req.body;

    const user = await User.findById(req.user.userId);
    const totalAmount = amount + (fee || 0);

    if (user.balance < totalAmount) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    const withdrawal = new Withdrawal({
      userId: req.user.userId,
      method,
      crypto,
      amount,
      walletAddress,
      bankAccount,
      fee: fee || 0,
      status: 'PENDING'
    });

    await withdrawal.save();

    // Deduct from balance
    user.balance -= totalAmount;
    await user.save();

    res.json({ success: true, withdrawal });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get withdrawals
app.get('/api/withdrawals', authenticateToken, async (req, res) => {
  try {
    const withdrawals = await Withdrawal.find({ userId: req.user.userId }).sort({ createdAt: -1 });
    res.json(withdrawals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ================================
// TRANSFER ROUTES
// ================================

// Send transfer
app.post('/api/transfers/send', authenticateToken, async (req, res) => {
  try {
    const { recipientEmail, amount } = req.body;

    const recipient = await User.findOne({ email: recipientEmail });
    if (!recipient) {
      return res.status(404).json({ error: 'Recipient not found' });
    }

    const sender = await User.findById(req.user.userId);
    if (sender.balance < amount) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    // Create transfer record
    const transfer = new Transfer({
      senderId: req.user.userId,
      recipientId: recipient._id,
      amount,
      status: 'COMPLETED'
    });

    await transfer.save();

    // Update balances
    sender.balance -= amount;
    recipient.balance += amount;

    await sender.save();
    await recipient.save();

    // Create notifications
    new Notification({
      userId: req.user.userId,
      title: 'Transfer Sent',
      message: `Sent $${amount} to ${recipient.email}`,
      type: 'TRANSFER'
    }).save();

    new Notification({
      userId: recipient._id,
      title: 'Transfer Received',
      message: `Received $${amount} from ${sender.email}`,
      type: 'TRANSFER'
    }).save();

    res.json({ success: true, transfer });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get transfers
app.get('/api/transfers', authenticateToken, async (req, res) => {
  try {
    const transfers = await Transfer.find({
      $or: [
        { senderId: req.user.userId },
        { recipientId: req.user.userId }
      ]
    }).sort({ createdAt: -1 });
    res.json(transfers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ================================
// NOTIFICATIONS ROUTES
// ================================

// Get notifications
app.get('/api/notifications', authenticateToken, async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user.userId })
      .sort({ createdAt: -1 })
      .limit(20);
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mark as read
app.put('/api/notifications/:id/read', authenticateToken, async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { read: true });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ================================
// MARKET DATA ROUTES
// ================================

// Get crypto prices (mock data - integrate with Binance API)
app.get('/api/markets/crypto', async (req, res) => {
  const cryptoData = [
    { symbol: 'BTC', name: 'Bitcoin', price: 43250.50, change24h: 5.32, marketCap: 845000000000 },
    { symbol: 'ETH', name: 'Ethereum', price: 2310.75, change24h: 3.15, marketCap: 277000000000 },
    { symbol: 'XRP', name: 'Ripple', price: 0.5432, change24h: -2.15, marketCap: 29000000000 },
    { symbol: 'SOL', name: 'Solana', price: 186.45, change24h: 4.78, marketCap: 63000000000 },
    { symbol: 'ADA', name: 'Cardano', price: 0.9876, change24h: 1.45, marketCap: 35000000000 }
  ];
  res.json(cryptoData);
});

// Get forex prices (mock data)
app.get('/api/markets/forex', async (req, res) => {
  const forexData = [
    { pair: 'EUR/USD', price: 1.0850, change24h: 0.25 },
    { pair: 'GBP/USD', price: 1.2680, change24h: 0.45 },
    { pair: 'USD/JPY', price: 149.50, change24h: -0.15 },
    { pair: 'USD/CAD', price: 1.3620, change24h: -0.35 },
    { pair: 'XAU/USD', price: 2345.60, change24h: 1.80 }
  ];
  res.json(forexData);
});

// ================================
// ADMIN ROUTES
// ================================

// Get all deposits (Admin)
app.get('/api/admin/deposits', authenticateToken, async (req, res) => {
  try {
    // Check if user is admin
    const deposits = await Deposit.find().populate('userId', 'username email').sort({ createdAt: -1 });
    res.json(deposits);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Approve deposit
app.post('/api/admin/deposits/:id/approve', authenticateToken, async (req, res) => {
  try {
    const deposit = await Deposit.findByIdAndUpdate(
      req.params.id,
      { status: 'CONFIRMED' },
      { new: true }
    );

    const user = await User.findById(deposit.userId);
    user.balance += deposit.amount;
    await user.save();

    res.json({ success: true, deposit });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ================================
// ERROR HANDLING
// ================================

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// ================================
// START SERVER
// ================================

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 TRADEX Server running on port ${PORT}`);
  console.log(`📊 API ready at http://localhost:${PORT}/api`);
});

module.exports = app;
