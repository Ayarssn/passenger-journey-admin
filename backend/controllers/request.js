import Request from '../models/request.js';
import User from '../models/user.js';  
import Notification from '../models/notification.js';
import { ADMIN } from '../utils/constants.js';
import mongoose from 'mongoose';

// Créer une nouvelle demande (user)
export const create = async (req, res) => {
  try {
    const {
      vehicleType, problemCategory, description, location,
    } = req.body;
    const userId = req.user.userId; // extrait du token

    const newRequest = new Request({
      userId: new mongoose.Types.ObjectId(userId),
      vehicleType,
      problemCategory,
      description,
      location,
      status: "pending",
      paymentStatus: "unpaid"
    });

    await newRequest.save();

    // Créer UNE seule notification destinée aux admins
    await Notification.create({
      message: `New towing request created by ${req.user.email}`,
      isForAdmin: true
    });

    // Émettre la notification en temps réel à tous les admins connectés
    global.io.emit('admin-notification', {
      message: `New towing request created by passenger with email ${req.user.email}`
    });

    // Émettre l'événement de nouvelle demande pour mise à jour en temps réel
    global.io.emit('request-created', newRequest);
    global.io.emit('requests-updated'); // Signal général pour rafraîchir les listes


    res.status(201).json(newRequest);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Récupérer les demandes (user)
export const getUser = async (req, res) => {
  try {
    const userId = req.user.userId;
    const requests = await Request.find({ userId })
      .populate('assignedBy', 'firstName lastName phone') // Populate admin info
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Annuler une demande (user)
export const cancel = async (req, res) => {
  try {
    const { id } = req.params;
    const request = await Request.findById(id);

    if (!request) return res.status(404).json({ message: "Request not found" });
    if (request.status !== "pending") {
      return res.status(400).json({ message: "Only pending requests can be cancelled" });
    }

    request.status = "cancelled";
    request.updatedAt = Date.now();
    await request.save();

    // Émettre les événements WebSocket pour mise à jour en temps réel
    global.io.emit('request-cancelled', request);
    global.io.emit('requests-updated');
    global.io.emit(`user-${request.userId}`, {
      type: 'request-cancelled',
      data: request
    });

    res.json({ message: "Request cancelled", request });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Récupérer toutes les demandes (admin)
export const getAll = async (req, res) => {
  try {
    const { status, vehicleType, startDate, endDate } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (vehicleType) filter.vehicleType = vehicleType;
    if (startDate && endDate) {
      filter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const requests = await Request.find(filter)
      .populate('userId', 'email phone cin firstName lastName') // look up the User document where userId, and bring back only the fields nom, prenom, email, phone, and CIN

    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Modifier le statut d'une demande (admin)
export const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { newStatus } = req.body;
    const adminId = req.user.userId; // Get the admin who is updating the status

    const updateData = { 
      status: newStatus, 
      updatedAt: Date.now() 
    };
    
    // If status is being changed from pending to accepted, set assignedBy
    if (newStatus === 'accepted') {
      updateData.assignedBy = adminId;
    }

    const updatedRequest = await Request.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    ).populate('assignedBy', 'firstName lastName phone');

    if (!updatedRequest) return res.status(404).json({ message: "Request not found" });

    // Notifier le passager
    await Notification.create({
      userId: updatedRequest.userId,
      message: `The status of your request has been updated: ${newStatus}`
    });

    // Émettre la notification en temps réel au passager connecté
    global.io.emit(`user-${updatedRequest.userId}`, {
      message: `The status of your request has been updated: ${newStatus}`,
      type: 'status-updated',
      data: updatedRequest
    });

    // Émettre les événements généraux pour mise à jour en temps réel
    global.io.emit('request-status-updated', updatedRequest);
    global.io.emit('requests-updated');
    global.io.emit('notifications-updated');

    res.json(updatedRequest);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
