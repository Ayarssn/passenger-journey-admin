import mongoose from 'mongoose';
import { USER } from '../utils/constants.js';

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: USER, required: false }, // destinataire
  message: { type: String, required: true },
  isForAdmin: { type: Boolean, default: false },
  seen: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Notification', notificationSchema);
