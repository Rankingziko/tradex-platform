// ================================
// TRADING ROUTES
// ================================

const express = require('express');
const fileDB = require('../config/file-database');
const { authMiddleware } = require('../config/auth');
const crypto = require('crypto');

const router = express.Router();

// Helper: Generate trade ID
const generateTradeId = () => crypto.randomBytes(12).toString('hex');

// -------- PLACE TRADE --------
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { symbol, type, quantity, entryPrice, orderType, leverage, stopLoss, takeProfit } = req.body;

    if (!symbol || !type || !quantity || !entryPrice) {
      return res.status(400).json({ error: 'Required fields missing' });
    }

    // Get user wallet (USDT or main trading currency)
    const wallet = await fileDB.getWalletByUserAndCurrency(req.userId, 'USDT');
    if (!wallet) {
      return res.status(404).json({ error: 'Trading wallet not found' });
    }

    const requiredAmount = quantity * entryPrice * (leverage || 1);

    if (type === 'buy' && wallet.balance < requiredAmount) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    const trade = {
      _id: generateTradeId(),
      userId: req.userId,
      symbol,
      type,
      quantity,
      entryPrice,
      orderType: orderType || 'market',
      leverage: leverage || 1,
      stopLoss,
      takeProfit,
      status: 'open',
      openedAt: new Date().toISOString(),
    };

    await fileDB.createTrade(trade);

    res.status(201).json({
      message: 'Trade placed successfully',
      trade,
    });
  } catch (error) {
    console.error('Trade error:', error);
    res.status(500).json({ error: error.message });
  }
});

// -------- GET USER TRADES --------
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { status } = req.query;
    const trades = await fileDB.getTradesByUserId(req.userId);
    
    let filtered = trades;
    if (status) {
      filtered = trades.filter(t => t.status === status);
    }

    const openTrades = filtered.filter(t => t.status === 'open');
    const closedTrades = filtered.filter(t => t.status === 'closed');
    const totalProfit = closedTrades.reduce((sum, t) => sum + (t.profitLoss || 0), 0);

    res.json({
      trades: filtered,
      openTrades,
      closedTrades,
      totalProfit,
      totalTrades: filtered.length,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// -------- CLOSE TRADE --------
router.put('/:id/close', authMiddleware, async (req, res) => {
  try {
    const { exitPrice } = req.body;
    const trade = await fileDB.getTradeById(req.params.id);

    if (!trade) {
      return res.status(404).json({ error: 'Trade not found' });
    }

    if (trade.userId !== req.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // Calculate profit/loss
    let profitLoss = 0;
    if (trade.type === 'buy') {
      profitLoss = (exitPrice - trade.entryPrice) * trade.quantity;
    } else {
      profitLoss = (trade.entryPrice - exitPrice) * trade.quantity;
    }

    const profitLossPercentage = ((exitPrice - trade.entryPrice) / trade.entryPrice) * 100;

    const updatedTrade = {
      ...trade,
      exitPrice,
      status: 'closed',
      closedAt: new Date().toISOString(),
      profitLoss,
      profitLossPercentage,
    };

    await fileDB.updateTrade(req.params.id, updatedTrade);

    res.json({
      message: 'Trade closed successfully',
      trade: updatedTrade,
    });
  } catch (error) {
    console.error('Close trade error:', error);
    res.status(500).json({ error: error.message });
  }
});

// -------- GET TRADE BY ID --------
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const trade = await fileDB.getTradeById(req.params.id);

    if (!trade || trade.userId !== req.userId) {
      return res.status(404).json({ error: 'Trade not found' });
    }

    res.json({ trade });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
