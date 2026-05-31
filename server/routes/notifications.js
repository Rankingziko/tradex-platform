// ================================
// NOTIFICATION ROUTES
// ================================

const express = require('express');
const Notification = require('../models/Notification');
const { authMiddleware } = require('../config/auth');

const router = express.Router();

// -------- GET NOTIFICATIONS --------
router.get('/', authMiddleware, async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .limit(50);

    const unread = notifications.filter(n => !n.read).length;

    res.json({ notifications, unread });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// -------- GET UNREAD COUNT --------
router.get('/unread/count', authMiddleware, async (req, res) => {
  try {
    const unread = await Notification.countDocuments({
      userId: req.userId,
      read: false
    });

    res.json({ unread });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// -------- CREATE NOTIFICATION --------
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { userId, type, title, message, icon, priority, data, actionUrl } = req.body;

    const notification = new Notification({
      userId,
      type,
      title,
      message,
      icon,
      priority: priority || 'medium',
      data,
      actionUrl,
    });

    await notification.save();

    res.status(201).json({ notification });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// -------- MARK AS READ --------
router.put('/:id/read', authMiddleware, async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );

    res.json({ notification });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// -------- MARK ALL AS READ --------
router.put('/read/all', authMiddleware, async (req, res) => {
  try {
    await Notification.updateMany(
      { userId: req.userId, read: false },
      { read: true }
    );

    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// -------- DELETE NOTIFICATION --------
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await Notification.findByIdAndDelete(req.params.id);
    res.json({ message: 'Notification deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// -------- BROADCAST MARKET NOTIFICATION --------
router.post('/broadcast/market', authMiddleware, async (req, res) => {
  try {
    const { symbol, title, message, change } = req.body;

    // Create notification for current user (in real app, would broadcast to all users)
    const notification = new Notification({
      userId: req.userId,
      type: 'market',
      title: title || `${symbol} Alert`,
      message: message || `Market movement detected on ${symbol}`,
      icon: 'TrendingUp',
      priority: Math.abs(change) > 5 ? 'high' : 'medium',
      data: { symbol, change },
    });

    await notification.save();
    res.status(201).json({ notification });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// -------- BROADCAST WEBSITE NOTIFICATION --------
router.post('/broadcast/website', authMiddleware, async (req, res) => {
  try {
    const { title, message, priority } = req.body;

    // Create notification for current user
    const notification = new Notification({
      userId: req.userId,
      type: 'website',
      title,
      message,
      icon: 'AlertCircle',
      priority: priority || 'medium',
    });

    await notification.save();
    res.status(201).json({ notification });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
