import mongoose from "mongoose";

// Définir le schéma
const requestSchema = new mongoose.Schema({
  userId: {
    type: String,
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
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      default: [0, 0]
    }
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

// Exporter le modèle
const Request = mongoose.model("Request", requestSchema);

export default Request;
