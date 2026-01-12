const express = require('express');
const authenticate = require('../middleware/auth');
const Notification = require('../models/Notification');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Get current user's notifications
router.get('/', async (req, res, next) => {
  try {
    const notifications = await Notification.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(notifications);
  } catch (error) {
    next(error);
  }
});

// Mark all as seen
router.post('/mark-all-seen', async (req, res, next) => {
  try {
    await Notification.updateMany(
      { userId: req.user._id, seen: false },
      { $set: { seen: true } }
    );
    res.json({ message: 'All notifications marked as seen' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;


