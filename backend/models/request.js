import mongoose from "mongoose";
import { USER } from '../utils/constants.js';

// Définir le schéma
const requestSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: USER, // référence au modèle User
    required: true
  },
  vehicleType: {
    type: String,
    required: true
  },
  problemCategory: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ""
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'completed', 'cancelled'],
    default: "pending"
  },
  paymentStatus: {
    type: String,
    default: "unpaid"
  },
  location: {
      type: String,
      required: true
  },
  assignedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: USER, // référence au modèle User (admin qui a accepté la demande)
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const Request = mongoose.model("Request", requestSchema);

export default Request;
