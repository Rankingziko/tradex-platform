// ================================
// DATABASE CONFIGURATION
// ================================

const mongoose = require('mongoose');
const mockDB = require('./mock-database');

const connectDB = async () => {
  // Check if using mock database mode for testing
  const useMockDB = process.env.USE_MOCK_DB === 'true' || process.env.NODE_ENV === 'test';
  
  try {
    if (useMockDB) {
      console.log('🧪 Using Mock Database (In-Memory Mode)');
      console.log('⚠️  This is for testing only. Set up MongoDB Atlas for production.');
      await mockDB.connect();
      return;
    }

    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/tradex';
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
    });
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.warn('⚠️  MongoDB connection failed, attempting mock database...');
    console.warn('Error:', error.message.substring(0, 100));
    
    // Try mock database as fallback
    try {
      await mockDB.connect();
      console.log('📦 Using Mock Database as Fallback');
      console.log('✅ To use real MongoDB, set MONGODB_URI in .env');
    } catch (mockError) {
      console.error('❌ Both MongoDB and Mock DB failed:', mockError);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
