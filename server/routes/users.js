// ================================
// USERS ROUTES
// ================================

const express = require('express');
const fileDB = require('../config/file-database');
const { authMiddleware } = require('../config/auth');

const router = express.Router();

// -------- GET ALL USERS --------
router.get('/', authMiddleware, async (req, res) => {
  try {
    const fs = require('fs');
    const path = require('path');
    
    const usersFile = path.join(__dirname, '../data/users.json');
    const usersData = fs.readFileSync(usersFile, 'utf8');
    const allUsers = JSON.parse(usersData) || [];
    
    const users = allUsers.map(u => ({
      _id: u._id,
      email: u.email,
      firstName: u.firstName || '',
      lastName: u.lastName || '',
      username: u.username || '',
      balance: u.balance || 0,
      createdAt: u.createdAt
    }));

    res.json({ users });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
