// ================================
// FILE-BASED DATABASE (JSON Storage)
// With In-Memory Caching for Performance
// ================================

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const DB_DIR = path.join(__dirname, '../data');
const USERS_FILE = path.join(DB_DIR, 'users.json');
const WALLETS_FILE = path.join(DB_DIR, 'wallets.json');
const DEPOSITS_FILE = path.join(DB_DIR, 'deposits.json');
const TRADES_FILE = path.join(DB_DIR, 'trades.json');
const ACTIVITY_FILE = path.join(DB_DIR, 'activity.json');
const WITHDRAWALS_FILE = path.join(DB_DIR, 'withdrawals.json');

// In-memory cache
const cache = {
  users: [],
  wallets: [],
  deposits: [],
  trades: [],
  activity: [],
  withdrawals: [],
  lastLoadTime: 0,
};

const CACHE_DURATION = 5000; // 5 seconds

// Ensure data directory exists
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

// Initialize files if they don't exist
const initializeFiles = () => {
  if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, JSON.stringify([], null, 2));
  }
  if (!fs.existsSync(WALLETS_FILE)) {
    fs.writeFileSync(WALLETS_FILE, JSON.stringify([], null, 2));
  }
  if (!fs.existsSync(DEPOSITS_FILE)) {
    fs.writeFileSync(DEPOSITS_FILE, JSON.stringify([], null, 2));
  }
  if (!fs.existsSync(TRADES_FILE)) {
    fs.writeFileSync(TRADES_FILE, JSON.stringify([], null, 2));
  }
  if (!fs.existsSync(ACTIVITY_FILE)) {
    fs.writeFileSync(ACTIVITY_FILE, JSON.stringify([], null, 2));
  }
  if (!fs.existsSync(WITHDRAWALS_FILE)) {
    fs.writeFileSync(WITHDRAWALS_FILE, JSON.stringify([], null, 2));
  }
};

// Read JSON file with caching
const readData = (file, cacheKey) => {
  try {
    // Return cached data if still fresh
    if (cacheKey && Date.now() - cache.lastLoadTime < CACHE_DURATION && cache[cacheKey].length > 0) {
      return cache[cacheKey];
    }

    const data = fs.readFileSync(file, 'utf8');
    const parsed = JSON.parse(data);
    
    if (cacheKey) {
      cache[cacheKey] = parsed;
      cache.lastLoadTime = Date.now();
    }
    
    return parsed;
  } catch (err) {
    console.error(`Error reading ${file}:`, err);
    return [];
  }
};

// Write JSON file
const writeData = (file, data, cacheKey) => {
  try {
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
    if (cacheKey) {
      cache[cacheKey] = data;
      cache.lastLoadTime = Date.now();
    }
  } catch (err) {
    console.error(`Error writing ${file}:`, err);
  }
};

// UUID generator
const generateId = () => crypto.randomBytes(12).toString('hex');

// ================================
// FILE DB CLASS
// ================================

class FileDatabase {
  constructor() {
    initializeFiles();
  }

  // ---- USERS ----
  async getUserByEmail(email) {
    const users = readData(USERS_FILE, 'users');
    return users.find(u => u.email === email.toLowerCase()) || null;
  }

  async getUserById(id) {
    const users = readData(USERS_FILE, 'users');
    return users.find(u => u._id === id) || null;
  }

  async getAllUsers() {
    return readData(USERS_FILE, 'users');
  }

  async createUser(userData) {
    const users = readData(USERS_FILE, 'users');
    const newUser = {
      _id: userData._id || generateId(),
      ...userData,
      createdAt: new Date().toISOString(),
    };
    users.push(newUser);
    writeData(USERS_FILE, users, 'users');
    return newUser;
  }

  async updateUser(id, updates) {
    const users = readData(USERS_FILE, 'users');
    const index = users.findIndex(u => u._id === id);
    if (index >= 0) {
      users[index] = { ...users[index], ...updates, updatedAt: new Date().toISOString() };
      writeData(USERS_FILE, users, 'users');
      return users[index];
    }
    return null;
  }

  // ---- WALLETS ----
  async createWallet(walletData) {
    const wallets = readData(WALLETS_FILE, 'wallets');
    const newWallet = {
      _id: generateId(),
      ...walletData,
      createdAt: new Date().toISOString(),
    };
    wallets.push(newWallet);
    writeData(WALLETS_FILE, wallets, 'wallets');
    return newWallet;
  }

  async getWallets(userId) {
    const wallets = readData(WALLETS_FILE, 'wallets');
    return wallets.filter(w => w.userId === userId);
  }

  async getWallet(userId, currency) {
    const wallets = readData(WALLETS_FILE, 'wallets');
    return wallets.find(w => w.userId === userId && w.currency === currency) || null;
  }

  async getWalletByUserAndCurrency(userId, currency) {
    return this.getWallet(userId, currency);
  }

  async updateWallet(id, updates) {
    const wallets = readData(WALLETS_FILE, 'wallets');
    const index = wallets.findIndex(w => w._id === id);
    if (index >= 0) {
      wallets[index] = { ...wallets[index], ...updates };
      writeData(WALLETS_FILE, wallets, 'wallets');
      return wallets[index];
    }
    return null;
  }

  // ---- DEPOSITS ----
  async createDeposit(depositData) {
    const deposits = readData(DEPOSITS_FILE, 'deposits');
    const newDeposit = {
      _id: generateId(),
      ...depositData,
      createdAt: new Date().toISOString(),
    };
    deposits.push(newDeposit);
    writeData(DEPOSITS_FILE, deposits, 'deposits');
    return newDeposit;
  }

  async getDeposits(userId) {
    const deposits = readData(DEPOSITS_FILE, 'deposits');
    return deposits.filter(d => d.userId === userId);
  }

  async getDepositById(id) {
    const deposits = readData(DEPOSITS_FILE, 'deposits');
    return deposits.find(d => d._id === id) || null;
  }

  async updateDeposit(id, updates) {
    const deposits = readData(DEPOSITS_FILE, 'deposits');
    const index = deposits.findIndex(d => d._id === id);
    if (index >= 0) {
      deposits[index] = { ...deposits[index], ...updates };
      writeData(DEPOSITS_FILE, deposits, 'deposits');
      return deposits[index];
    }
    return null;
  }

  // ---- TRADES ----
  async createTrade(tradeData) {
    const trades = readData(TRADES_FILE, 'trades');
    const newTrade = {
      _id: tradeData._id || generateId(),
      ...tradeData,
      createdAt: new Date().toISOString(),
    };
    trades.push(newTrade);
    writeData(TRADES_FILE, trades, 'trades');
    return newTrade;
  }

  async getTrades(userId) {
    const trades = readData(TRADES_FILE, 'trades');
    return trades.filter(t => t.userId === userId);
  }

  async getTradesByUserId(userId) {
    return this.getTrades(userId);
  }

  async getTradeById(id) {
    const trades = readData(TRADES_FILE, 'trades');
    return trades.find(t => t._id === id) || null;
  }

  async updateTrade(id, updates) {
    const trades = readData(TRADES_FILE, 'trades');
    const index = trades.findIndex(t => t._id === id);
    if (index >= 0) {
      trades[index] = { ...trades[index], ...updates };
      writeData(TRADES_FILE, trades, 'trades');
      return trades[index];
    }
    return null;
  }

  // ---- ACTIVITY LOGGING ----
  async logActivity(userId, type, details = {}) {
    const activities = readData(ACTIVITY_FILE, 'activity');
    const activity = {
      _id: generateId(),
      userId,
      type,
      details,
      createdAt: new Date().toISOString(),
    };
    activities.push(activity);
    writeData(ACTIVITY_FILE, activities, 'activity');
    return activity;
  }

  async getActivities(userId) {
    const activities = readData(ACTIVITY_FILE, 'activity');
    return activities.filter(a => a.userId === userId).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  async getAllActivities() {
    const activities = readData(ACTIVITY_FILE, 'activity');
    return activities.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  // ---- WITHDRAWALS ----
  async createWithdrawal(withdrawalData) {
    const withdrawals = readData(WITHDRAWALS_FILE, 'withdrawals');
    const newWithdrawal = {
      _id: generateId(),
      ...withdrawalData,
      createdAt: new Date().toISOString(),
    };
    withdrawals.push(newWithdrawal);
    writeData(WITHDRAWALS_FILE, withdrawals, 'withdrawals');
    return newWithdrawal;
  }

  async getWithdrawals(userId) {
    const withdrawals = readData(WITHDRAWALS_FILE, 'withdrawals');
    return withdrawals.filter(w => w.userId === userId);
  }

  // ---- GENERAL ----
  async deleteAll() {
    writeData(USERS_FILE, []);
    writeData(WALLETS_FILE, []);
    writeData(DEPOSITS_FILE, []);
    writeData(TRADES_FILE, []);
  }
}

module.exports = new FileDatabase();
