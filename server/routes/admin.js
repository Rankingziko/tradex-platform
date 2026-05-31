// ================================
// ADMIN ROUTES
// ================================

const express = require('express');
const fileDB = require('../config/file-database');
const { authMiddleware } = require('../config/auth');

const router = express.Router();

// Admin authentication middleware
const isAdmin = async (req, res, next) => {
  try {
    const user = await fileDB.getUserById(req.userId);
    if (!user || user.email !== 'admin@tradex.com') {
      return res.status(403).json({ error: 'Admin access required' });
    }
    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// -------- GET DASHBOARD STATS --------
router.get('/stats/dashboard', authMiddleware, isAdmin, async (req, res) => {
  try {
    const fs = require('fs');
    const path = require('path');
    
    // Read deposits from file
    const depositsFile = path.join(__dirname, '../data/deposits.json');
    const depositsData = fs.readFileSync(depositsFile, 'utf8');
    const allDeposits = JSON.parse(depositsData) || [];
    
    const confirmedDeposits = allDeposits.filter(d => d.status === 'confirmed');
    const totalDepositAmount = confirmedDeposits.reduce((sum, d) => sum + (d.amount || 0), 0);

    res.json({
      totalDeposits: confirmedDeposits.length,
      totalDepositAmount,
      pendingDeposits: allDeposits.filter(d => d.status === 'pending').length,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// -------- GET ALL USERS WITH BALANCES --------
router.get('/users', authMiddleware, isAdmin, async (req, res) => {
  try {
    const fs = require('fs');
    const path = require('path');
    
    // Read users from file
    const usersFile = path.join(__dirname, '../data/users.json');
    const usersData = fs.readFileSync(usersFile, 'utf8');
    const users = JSON.parse(usersData) || [];
    
    // Get wallets data
    const walletsFile = path.join(__dirname, '../data/wallets.json');
    const walletsData = fs.readFileSync(walletsFile, 'utf8');
    const wallets = JSON.parse(walletsData) || [];
    
    // Combine users with their wallet balances
    const usersWithBalance = users
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .map(user => {
        const userWallets = wallets.filter(w => w.userId === user._id);
        const totalBalance = userWallets.reduce((sum, w) => sum + (w.balance || 0), 0);
        
        return {
          _id: user._id,
          email: user.email,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          balance: totalBalance,
          wallets: userWallets.map(w => ({
            currency: w.currency,
            balance: w.balance || 0
          })),
          createdAt: user.createdAt,
          isAdmin: user.email === 'admin@tradex.com'
        };
      });

    res.json({ users: usersWithBalance, total: usersWithBalance.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// -------- GET PENDING DEPOSITS --------
router.get('/deposits/pending', authMiddleware, isAdmin, async (req, res) => {
  try {
    const fs = require('fs');
    const path = require('path');
    
    const depositsFile = path.join(__dirname, '../data/deposits.json');
    const depositsData = fs.readFileSync(depositsFile, 'utf8');
    const allDeposits = JSON.parse(depositsData) || [];
    
    const pendingDeposits = allDeposits
      .filter(d => d.status === 'pending')
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

    res.json({ deposits: pendingDeposits, total: pendingDeposits.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// -------- SUSPEND/ACTIVATE USER --------
// -------- APPROVE DEPOSIT --------
router.put('/deposits/:id/approve', authMiddleware, isAdmin, async (req, res) => {
  try {
    const fs = require('fs');
    const path = require('path');
    const depositId = req.params.id;
    
    const depositsFile = path.join(__dirname, '../data/deposits.json');
    const depositsData = fs.readFileSync(depositsFile, 'utf8');
    const allDeposits = JSON.parse(depositsData) || [];
    
    const depositIndex = allDeposits.findIndex(d => d._id === depositId);
    if (depositIndex < 0) {
      return res.status(404).json({ error: 'Deposit not found' });
    }

    const deposit = allDeposits[depositIndex];
    deposit.status = 'confirmed';
    deposit.confirmedAt = new Date().toISOString();
    deposit.confirmedBy = req.userId;
    allDeposits[depositIndex] = deposit;
    fs.writeFileSync(depositsFile, JSON.stringify(allDeposits, null, 2));

    // Credit the wallet
    const wallet = await fileDB.getWallet(deposit.userId, deposit.currency);
    if (wallet) {
      await fileDB.updateWallet(wallet._id, {
        balance: (wallet.balance || 0) + deposit.amount,
        totalDeposited: (wallet.totalDeposited || 0) + deposit.amount,
      });

      // Update user balance
      const wallets = await fileDB.getWallets(deposit.userId);
      const totalBalance = wallets.reduce((sum, w) => sum + (w.balance || 0), 0);
      await fileDB.updateUser(deposit.userId, { balance: totalBalance });
    }

    res.json({ message: 'Deposit approved successfully', deposit });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// -------- REJECT DEPOSIT --------
router.put('/deposits/:id/reject', authMiddleware, isAdmin, async (req, res) => {
  try {
    const fs = require('fs');
    const path = require('path');
    const { reason } = req.body;
    const depositId = req.params.id;
    
    const depositsFile = path.join(__dirname, '../data/deposits.json');
    const depositsData = fs.readFileSync(depositsFile, 'utf8');
    const allDeposits = JSON.parse(depositsData) || [];
    
    const depositIndex = allDeposits.findIndex(d => d._id === depositId);
    if (depositIndex < 0) {
      return res.status(404).json({ error: 'Deposit not found' });
    }

    const deposit = allDeposits[depositIndex];
    deposit.status = 'cancelled';
    deposit.rejectionReason = reason;
    deposit.rejectedBy = req.userId;
    deposit.rejectedAt = new Date().toISOString();
    allDeposits[depositIndex] = deposit;
    fs.writeFileSync(depositsFile, JSON.stringify(allDeposits, null, 2));

    res.json({ message: 'Deposit rejected successfully', deposit });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// -------- GET ALL DEPOSITS --------
router.get('/deposits', authMiddleware, isAdmin, async (req, res) => {
  try {
    const fs = require('fs');
    const path = require('path');
    
    const depositsFile = path.join(__dirname, '../data/deposits.json');
    const depositsData = fs.readFileSync(depositsFile, 'utf8');
    const allDeposits = JSON.parse(depositsData) || [];
    
    const sorted = allDeposits.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json({ deposits: sorted, total: sorted.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// -------- FREEZE/UNFREEZE USER ACCOUNT --------
router.put('/users/:userId/freeze', authMiddleware, isAdmin, async (req, res) => {
  try {
    const { freeze } = req.body;
    const user = await fileDB.updateUser(req.params.userId, { frozen: freeze });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ 
      message: freeze ? 'Account frozen successfully' : 'Account unfrozen successfully', 
      user 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// -------- ADD FUNDS TO USER --------
router.put('/users/:userId/add-funds', authMiddleware, isAdmin, async (req, res) => {
  try {
    const { amount, currency = 'USD', description } = req.body;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    // Get or create wallet
    let wallet = await fileDB.getWallet(req.params.userId, currency);
    if (!wallet) {
      wallet = await fileDB.createWallet({
        userId: req.params.userId,
        currency,
        balance: amount,
        totalDeposited: amount
      });
    } else {
      wallet = await fileDB.updateWallet(wallet._id, {
        balance: (wallet.balance || 0) + amount,
        totalDeposited: (wallet.totalDeposited || 0) + amount
      });
    }

    // Update user total balance
    const wallets = await fileDB.getWallets(req.params.userId);
    const totalBalance = wallets.reduce((sum, w) => sum + (w.balance || 0), 0);
    await fileDB.updateUser(req.params.userId, { balance: totalBalance });

    res.json({ 
      message: 'Funds added successfully',
      amount,
      newBalance: wallet.balance,
      description
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// -------- REMOVE FUNDS FROM USER --------
router.put('/users/:userId/remove-funds', authMiddleware, isAdmin, async (req, res) => {
  try {
    const { amount, currency = 'USD', description } = req.body;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    const wallet = await fileDB.getWallet(req.params.userId, currency);
    if (!wallet) {
      return res.status(404).json({ error: 'Wallet not found' });
    }

    const newBalance = (wallet.balance || 0) - amount;
    if (newBalance < 0) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    await fileDB.updateWallet(wallet._id, { balance: newBalance });

    // Update user total balance
    const wallets = await fileDB.getWallets(req.params.userId);
    const totalBalance = wallets.reduce((sum, w) => sum + (w.balance || 0), 0);
    await fileDB.updateUser(req.params.userId, { balance: totalBalance });

    res.json({ 
      message: 'Funds removed successfully',
      amount,
      newBalance,
      description
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// -------- RESET USER BALANCE --------
router.put('/users/:userId/reset-balance', authMiddleware, isAdmin, async (req, res) => {
  try {
    const { newBalance = 0, currency = 'USD' } = req.body;
    
    // Get or create wallet
    let wallet = await fileDB.getWallet(req.params.userId, currency);
    if (!wallet) {
      wallet = await fileDB.createWallet({
        userId: req.params.userId,
        currency,
        balance: newBalance,
        totalDeposited: 0
      });
    } else {
      wallet = await fileDB.updateWallet(wallet._id, {
        balance: newBalance
      });
    }

    // Update user total balance
    const wallets = await fileDB.getWallets(req.params.userId);
    const totalBalance = wallets.reduce((sum, w) => sum + (w.balance || 0), 0);
    await fileDB.updateUser(req.params.userId, { balance: totalBalance });

    res.json({ 
      message: 'Balance reset successfully',
      newBalance,
      totalUserBalance: totalBalance
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// -------- GET USER ACTIVITY LOGS --------
router.get('/users/:userId/activity', authMiddleware, isAdmin, async (req, res) => {
  try {
    const fs = require('fs');
    const path = require('path');
    const userId = req.params.userId;

    // Get user info
    const user = await fileDB.getUserById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get wallet balances
    const wallets = await fileDB.getWallets(userId);
    const walletBalances = wallets.map(w => ({
      currency: w.currency,
      balance: w.balance || 0,
      totalDeposited: w.totalDeposited || 0,
      totalWithdrawn: w.totalWithdrawn || 0
    }));

    // Get trade history
    const tradesFile = path.join(__dirname, '../data/trades.json');
    const tradesData = fs.readFileSync(tradesFile, 'utf8');
    const allTrades = JSON.parse(tradesData) || [];
    const trades = allTrades.filter(t => t.userId === userId).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Get deposit history
    const depositsFile = path.join(__dirname, '../data/deposits.json');
    const depositsData = fs.readFileSync(depositsFile, 'utf8');
    const allDeposits = JSON.parse(depositsData) || [];
    const deposits = allDeposits.filter(d => d.userId === userId).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Get withdrawal history
    const withdrawals = await fileDB.getWithdrawals(userId);
    const sortedWithdrawals = withdrawals.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Get activity logs
    const activities = await fileDB.getActivities(userId);

    // Separate different activity types
    const loginHistory = activities.filter(a => a.type === 'login').map(a => ({
      timestamp: a.createdAt,
      type: 'Login',
      details: a.details
    }));

    const deviceActivity = activities.filter(a => a.type === 'device').map(a => ({
      timestamp: a.createdAt,
      type: 'Device Activity',
      details: a.details
    }));

    res.json({
      user: {
        _id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        createdAt: user.createdAt
      },
      walletBalances,
      tradeHistory: trades.slice(0, 50), // Last 50 trades
      depositHistory: deposits.slice(0, 50), // Last 50 deposits
      withdrawalHistory: sortedWithdrawals.slice(0, 50), // Last 50 withdrawals
      loginHistory: loginHistory.slice(0, 30), // Last 30 logins
      deviceActivity: deviceActivity.slice(0, 30), // Last 30 device activities
      allActivities: activities.slice(0, 100) // Last 100 activities
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// -------- GET ALL TRANSACTIONS --------
router.get('/transactions', authMiddleware, isAdmin, async (req, res) => {
  try {
    const fs = require('fs');
    const path = require('path');
    
    // Read all data files
    const usersFile = path.join(__dirname, '../data/users.json');
    const usersData = fs.readFileSync(usersFile, 'utf8');
    const users = JSON.parse(usersData) || [];

    const depositsFile = path.join(__dirname, '../data/deposits.json');
    const depositsData = fs.readFileSync(depositsFile, 'utf8');
    const allDeposits = JSON.parse(depositsData) || [];

    const withdrawalsFile = path.join(__dirname, '../data/withdrawals.json');
    const withdrawalsData = fs.readFileSync(withdrawalsFile, 'utf8');
    const allWithdrawals = JSON.parse(withdrawalsData) || [];

    const tradesFile = path.join(__dirname, '../data/trades.json');
    const tradesData = fs.readFileSync(tradesFile, 'utf8');
    const allTrades = JSON.parse(tradesData) || [];

    // Create user map for quick lookup
    const userMap = {};
    users.forEach(u => {
      userMap[u._id] = { email: u.email, firstName: u.firstName, lastName: u.lastName };
    });

    // Combine all transactions
    const transactions = [];

    // Add deposits
    allDeposits.forEach(d => {
      const user = userMap[d.userId];
      transactions.push({
        _id: d._id,
        type: 'deposit',
        userId: d.userId,
        userName: user ? `${user.firstName} ${user.lastName}` : 'Unknown',
        userEmail: user?.email || 'N/A',
        amount: d.amount,
        currency: d.currency || 'USD',
        method: d.method,
        status: d.status,
        createdAt: d.createdAt,
        icon: '📥',
        color: 'blue'
      });
    });

    // Add withdrawals
    allWithdrawals.forEach(w => {
      const user = userMap[w.userId];
      transactions.push({
        _id: w._id,
        type: 'withdrawal',
        userId: w.userId,
        userName: user ? `${user.firstName} ${user.lastName}` : 'Unknown',
        userEmail: user?.email || 'N/A',
        amount: w.amount,
        currency: w.currency || 'USD',
        status: w.status || 'pending',
        createdAt: w.createdAt,
        icon: '📤',
        color: 'orange'
      });
    });

    // Add trades
    allTrades.forEach(t => {
      const user = userMap[t.userId];
      transactions.push({
        _id: t._id,
        type: 'trade',
        userId: t.userId,
        userName: user ? `${user.firstName} ${user.lastName}` : 'Unknown',
        userEmail: user?.email || 'N/A',
        pair: t.pair || t.symbol,
        tradeType: t.type,
        amount: t.amount,
        price: t.price,
        profit: t.profit,
        status: 'completed',
        createdAt: t.createdAt,
        icon: '📊',
        color: 'green'
      });
    });

    // Sort by date (newest first)
    const sortedTransactions = transactions.sort((a, b) => 
      new Date(b.createdAt) - new Date(a.createdAt)
    );

    // Calculate summary
    const summary = {
      totalTransactions: sortedTransactions.length,
      depositCount: allDeposits.length,
      withdrawalCount: allWithdrawals.length,
      tradeCount: allTrades.length,
      totalDepositAmount: allDeposits.reduce((sum, d) => sum + (d.amount || 0), 0),
      totalWithdrawalAmount: allWithdrawals.reduce((sum, w) => sum + (w.amount || 0), 0),
      totalTradeVolume: allTrades.reduce((sum, t) => sum + ((t.amount || 0) * (t.price || 0)), 0),
      pendingDeposits: allDeposits.filter(d => d.status === 'pending').length,
      pendingWithdrawals: allWithdrawals.filter(w => w.status === 'pending').length
    };

    res.json({ 
      transactions: sortedTransactions,
      summary,
      total: sortedTransactions.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// -------- GET ALL USERS' COMPREHENSIVE LOGS --------
router.get('/all-logs', authMiddleware, isAdmin, async (req, res) => {
  try {
    const fs = require('fs');
    const path = require('path');

    // Get all users
    const usersFile = path.join(__dirname, '../data/users.json');
    const usersData = fs.readFileSync(usersFile, 'utf8');
    const users = JSON.parse(usersData) || [];

    // Read all data files
    const tradesFile = path.join(__dirname, '../data/trades.json');
    const tradesData = fs.readFileSync(tradesFile, 'utf8');
    const allTrades = JSON.parse(tradesData) || [];

    const depositsFile = path.join(__dirname, '../data/deposits.json');
    const depositsData = fs.readFileSync(depositsFile, 'utf8');
    const allDeposits = JSON.parse(depositsData) || [];

    const withdrawalsFile = path.join(__dirname, '../data/withdrawals.json');
    const withdrawalsData = fs.readFileSync(withdrawalsFile, 'utf8');
    const allWithdrawals = JSON.parse(withdrawalsData) || [];

    // Get wallets for all users
    const walletsFile = path.join(__dirname, '../data/wallets.json');
    const walletsData = fs.readFileSync(walletsFile, 'utf8');
    const allWallets = JSON.parse(walletsData) || [];

    // Get activities for all users
    const activitiesFile = path.join(__dirname, '../data/activities.json');
    let allActivities = [];
    if (fs.existsSync(activitiesFile)) {
      const activitiesData = fs.readFileSync(activitiesFile, 'utf8');
      allActivities = JSON.parse(activitiesData) || [];
    }

    // Get notifications for all users
    const notificationsFile = path.join(__dirname, '../data/notifications.json');
    let allNotifications = [];
    if (fs.existsSync(notificationsFile)) {
      const notificationsData = fs.readFileSync(notificationsFile, 'utf8');
      allNotifications = JSON.parse(notificationsData) || [];
    }

    // Build comprehensive logs for all users
    const userLogs = users.map(user => {
      const userWallets = allWallets.filter(w => w.userId === user._id);
      const walletBalances = userWallets.map(w => ({
        currency: w.currency,
        balance: w.balance || 0,
        totalDeposited: w.totalDeposited || 0,
        totalWithdrawn: w.totalWithdrawn || 0
      }));

      const trades = allTrades.filter(t => t.userId === user._id).slice(0, 100);
      const deposits = allDeposits.filter(d => d.userId === user._id).slice(0, 100);
      const withdrawals = allWithdrawals.filter(w => w.userId === user._id).slice(0, 100);
      const userActivities = allActivities.filter(a => a.userId === user._id).slice(0, 100);
      const transfers = userActivities.filter(a => a.type === 'transfer');
      const loginHistory = userActivities.filter(a => a.type === 'login');
      const deviceActivity = userActivities.filter(a => a.type === 'device');
      const userNotifications = allNotifications.filter(n => n.userId === user._id).slice(0, 50);

      return {
        user: {
          _id: user._id,
          email: user.email,
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          username: user.username || '',
          createdAt: user.createdAt
        },
        walletBalances,
        tradeHistory: trades,
        depositHistory: deposits,
        withdrawalHistory: withdrawals,
        transferHistory: transfers,
        loginHistory,
        deviceActivity,
        notifications: userNotifications,
        stats: {
          totalTrades: trades.length,
          totalDeposits: deposits.length,
          totalWithdrawals: withdrawals.length,
          totalTransfers: transfers.length,
          totalBalance: walletBalances.reduce((sum, w) => sum + w.balance, 0),
          totalWallets: userWallets.length
        }
      };
    });

    res.json({ 
      userLogs,
      total: userLogs.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
