import express from 'express';
import Notification from '../models/notification.js';
import authenticate from '../middleware/auth.js';

const router = express.Router();

// GET /notifications — voir toutes ses notifications
router.get('/', authenticate, async (req, res) => {
  try {
    const userId = req.user.userId;
    const notifications = await Notification.find({ userId }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
