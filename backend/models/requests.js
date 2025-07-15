import mongoose from "mongoose";

// Definir le schema (plan du document)
const requestSchema = new mongoose.Schema({
  userId: String,          // Identifiant du passager 
  vehicleType: String,         // Type de véhicule (ex: car, truck)
  problemType: String,         // Type de problème (ex: batterie)
  description: String,         // Détails supplémentaires sur le problème
  status: {
    type: String,
    default: "pending"         
  },
  paymentStatus: {
    type: String,
    default: "unpaid"          
  },
  location: String,            // Emplacement (inside port / outside port)
  createdAt: {
    type: Date,
    default: Date.now          
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Créer et exporter le modèle
module.exports = mongoose.model("Request", requestSchema);
