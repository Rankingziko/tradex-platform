// ================================
// REPORT ROUTES (MAILBOX)
// ================================

const express = require('express');
const Report = require('../models/Report');
const User = require('../models/User');
const Notification = require('../models/Notification');
const { authMiddleware } = require('../config/auth');

const router = express.Router();

// -------- SUBMIT REPORT --------
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { category, subject, message, priority } = req.body;

    if (!category || !subject || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const user = await User.findById(req.userId);

    const report = new Report({
      userId: req.userId,
      userEmail: user.email,
      category,
      subject,
      message,
      priority: priority || 'medium',
    });

    await report.save();

    // Create notification for admin
    const admins = await User.find({ role: 'admin' });
    for (const admin of admins) {
      await Notification.create({
        userId: admin._id,
        type: 'system',
        title: 'New Support Report',
        message: `${user.firstName} ${user.lastName} submitted a ${priority || 'medium'} priority report`,
        data: { reportId: report._id, category },
      });
    }

    // Create notification for user
    await Notification.create({
      userId: req.userId,
      type: 'system',
      title: 'Report Submitted',
      message: `Your ${category} report has been submitted successfully. Our team will review it shortly.`,
      data: { reportId: report._id },
    });

    res.status(201).json({
      message: 'Report submitted successfully',
      report,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// -------- GET USER REPORTS --------
router.get('/my-reports', authMiddleware, async (req, res) => {
  try {
    const reports = await Report.find({ userId: req.userId })
      .sort({ createdAt: -1 });

    res.json({ reports });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// -------- GET SINGLE REPORT --------
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }

    // Check if user is owner or admin
    if (report.userId.toString() !== req.userId && req.userRole !== 'admin') {
      return res.status(403).json({ error: 'Not authorized' });
    }

    // Increment views
    report.views += 1;
    await report.save();

    res.json({ report });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// -------- UPDATE REPORT STATUS (Admin only) --------
router.put('/:id/status', authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['open', 'in-progress', 'resolved', 'closed'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const report = await Report.findByIdAndUpdate(
      req.params.id,
      { status, updatedAt: new Date() },
      { new: true }
    );

    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }

    // Notify user of status change
    await Notification.create({
      userId: report.userId,
      type: 'system',
      title: 'Report Status Updated',
      message: `Your report status has been updated to: ${status}`,
      data: { reportId: report._id, newStatus: status },
    });

    res.json({ message: 'Report status updated', report });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// -------- ADD ADMIN RESPONSE --------
router.post('/:id/respond', authMiddleware, async (req, res) => {
  try {
    const { response } = req.body;

    if (!response) {
      return res.status(400).json({ error: 'Response message required' });
    }

    const report = await Report.findByIdAndUpdate(
      req.params.id,
      {
        adminResponse: {
          respondedBy: req.userId,
          response,
          respondedAt: new Date(),
        },
        updatedAt: new Date(),
      },
      { new: true }
    );

    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }

    // Notify user of response
    const user = await User.findById(report.userId);
    await Notification.create({
      userId: report.userId,
      type: 'system',
      title: 'New Response to Your Report',
      message: `A support staff member has responded to your ${report.category} report.`,
      data: { reportId: report._id },
    });

    res.json({ message: 'Response added', report });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
