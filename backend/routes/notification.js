import express from 'express';
import Notification from '../models/notification.js';
import authenticate from '../middleware/auth.js';

const router = express.Router();

// GET /notifications — admin voit toutes les notifs admin, passager voit les siennes
router.get('/', authenticate, async (req, res) => {
  try {
    const { userId, role } = req.user;

    let notifications = [];

    if (role === 'admin') {
      // Admin voit toutes les notifications destinées aux admins
      notifications = await Notification.find({ isForAdmin: true }).sort({ createdAt: -1 });
    } else {
      // Passager voit seulement ses propres notifications
      notifications = await Notification.find({ userId }).sort({ createdAt: -1 });
    }

    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH /notifications/:id/mark-as-seen — marquer une notif comme lue
router.patch('/:id/mark-as-seen', authenticate, async (req, res) => {
  try {
    const { id } = req.params;

    const notif = await Notification.findById(id);
    if (!notif) return res.status(404).json({ message: 'Notification non trouvée' });

    notif.seen = true;
    await notif.save();

    res.json({ message: 'Notification marquée comme lue', notification: notif });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;

// TODO: add new api for adming: get all notifications (seen, unseen)
