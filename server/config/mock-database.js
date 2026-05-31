// ================================
// MOCK DATABASE - IN-MEMORY MODE
// Use this for instant testing while setting up MongoDB Atlas
// ================================

const fs = require('fs');
const path = require('path');

// In-memory storage
let mockDatabase = {
  users: [],
  wallets: [],
  deposits: [],
  trades: [],
  withdrawals: [],
  transfers: [],
  notifications: [],
  referrals: [],
  marketData: [],
};

// Initialize with demo data
const initializeMockDB = () => {
  mockDatabase.users = [
    {
      _id: 'demo-user-1',
      email: 'demo@tradex.com',
      password: '$2b$10$xyz', // bcrypt hash for "demo123"
      username: 'demouser',
      firstName: 'Demo',
      lastName: 'Trader',
      phoneNumber: '+1234567890',
      totalBalance: 8500,
      createdAt: new Date('2025-01-01'),
    }
  ];

  mockDatabase.wallets = [
    {
      _id: 'wallet-1',
      userId: 'demo-user-1',
      currency: 'USDT',
      balance: 5000,
      totalDeposited: 5000,
      totalWithdrawn: 0,
    },
    {
      _id: 'wallet-2',
      userId: 'demo-user-1',
      currency: 'BTC',
      balance: 0.15,
      totalDeposited: 0.15,
      totalWithdrawn: 0,
    },
    {
      _id: 'wallet-3',
      userId: 'demo-user-1',
      currency: 'ETH',
      balance: 1.5,
      totalDeposited: 1.5,
      totalWithdrawn: 0,
    },
  ];

  mockDatabase.deposits = [
    {
      _id: 'deposit-1',
      userId: 'demo-user-1',
      currency: 'USDT',
      amount: 2500,
      method: 'crypto',
      status: 'confirmed',
      depositAddress: 'usdt_wallet_demo-user-1',
      createdAt: new Date('2025-01-10'),
      confirmedAt: new Date('2025-01-11'),
    },
    {
      _id: 'deposit-2',
      userId: 'demo-user-1',
      currency: 'USDT',
      amount: 2500,
      method: 'crypto',
      status: 'confirmed',
      depositAddress: 'usdt_wallet_demo-user-1',
      createdAt: new Date('2025-01-15'),
      confirmedAt: new Date('2025-01-16'),
    },
  ];

  mockDatabase.notifications = [
    {
      _id: 'notif-1',
      userId: 'demo-user-1',
      type: 'deposit',
      title: 'Deposit Confirmed',
      message: 'Your deposit of 2500 USDT has been confirmed',
      read: true,
      createdAt: new Date('2025-01-11'),
    }
  ];
};

// Mock MongoDB-like operations
class MockDB {
  constructor() {
    initializeMockDB();
  }

  async connect() {
    console.log('✅ Mock Database Connected (In-Memory Mode)');
    return true;
  }

  // Collection operations
  collection(collectionName) {
    return new MockCollection(collectionName);
  }

  // Get mock data
  getData() {
    return mockDatabase;
  }

  // Reset to initial state
  reset() {
    initializeMockDB();
  }
}

class MockCollection {
  constructor(collectionName) {
    this.collectionName = collectionName;
  }

  async insertOne(doc) {
    if (!mockDatabase[this.collectionName]) {
      mockDatabase[this.collectionName] = [];
    }
    const newDoc = { _id: generateId(), ...doc, createdAt: new Date() };
    mockDatabase[this.collectionName].push(newDoc);
    return { insertedId: newDoc._id };
  }

  async findOne(query) {
    const collection = mockDatabase[this.collectionName] || [];
    return collection.find(doc => matchesQuery(doc, query)) || null;
  }

  async find(query) {
    const collection = mockDatabase[this.collectionName] || [];
    return collection.filter(doc => matchesQuery(doc, query));
  }

  async updateOne(query, update) {
    const collection = mockDatabase[this.collectionName] || [];
    const index = collection.findIndex(doc => matchesQuery(doc, query));
    if (index >= 0) {
      const $set = update.$set || update;
      collection[index] = { ...collection[index], ...$set };
      return { modifiedCount: 1 };
    }
    return { modifiedCount: 0 };
  }

  async deleteOne(query) {
    const collection = mockDatabase[this.collectionName] || [];
    const index = collection.findIndex(doc => matchesQuery(doc, query));
    if (index >= 0) {
      collection.splice(index, 1);
      return { deletedCount: 1 };
    }
    return { deletedCount: 0 };
  }

  async findOneAndUpdate(query, update) {
    const collection = mockDatabase[this.collectionName] || [];
    const index = collection.findIndex(doc => matchesQuery(doc, query));
    if (index >= 0) {
      const $set = update.$set || update;
      const before = collection[index];
      collection[index] = { ...collection[index], ...$set };
      return { value: collection[index] };
    }
    return { value: null };
  }
}

// Helper functions
function generateId() {
  return 'id_' + Math.random().toString(36).substr(2, 9);
}

function matchesQuery(doc, query) {
  for (const key in query) {
    if (doc[key] !== query[key]) {
      return false;
    }
  }
  return true;
}

module.exports = new MockDB();
