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
  problemType: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ""
  },
  status: {
    type: String,
    default: "pending" // initialement en attente
  },
  paymentStatus: {
    type: String,
    default: "unpaid" // par défaut non payé
  },
  // Champ de localisation version GeoJSON (pour maps)
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
    default: Date.now // automatiquement rempli
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Exporter le modèle
const Request = mongoose.model("Request", requestSchema);

export default Request;
