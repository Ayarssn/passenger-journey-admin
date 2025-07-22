import Request from '../models/request.js';
import User from '../models/user.js';  
import Notification from '../models/notification.js';


// Créer une nouvelle demande (user)
export const createRequest = async (req, res) => {
  try {
    const { vehicleType, problemCategory, description, location } = req.body;
    const userId = req.user.userId; // extrait du token

    const newRequest = new Request({
      userId,
      vehicleType,
      problemCategory,
      description,
      location,
      status: "pending",
      paymentStatus: "unpaid"
    });

    await newRequest.save();

    // Créer une notification pour les admins
    const adminUsers = await User.find({ role: 'admin' });
    const notifications = adminUsers.map(admin => ({
      userId: admin._id,
      message: `Nouvelle demande de dépannage créée par ${req.user.email}`
    }));
    await Notification.insertMany(notifications);

    res.status(201).json(newRequest);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Récupérer les demandes (user)
export const getUserRequests = async (req, res) => {
  try {
    const userId = req.user.userId; // extrait du token
    const requests = await Request.find({ userId }).sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Annuler une demande (user)
export const cancelRequest = async (req, res) => {
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

    res.json({ message: "Request cancelled", request });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Récupérer toutes les demandes (admin)
export const getAllRequests = async (req, res) => {
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

    const requests = await Request.find(filter);
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Modifier le statut d'une demande (admin)
export const updateRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { newStatus } = req.body;

    const updatedRequest = await Request.findByIdAndUpdate(
      id,
      { status: newStatus, updatedAt: Date.now() },
      { new: true }
    );

    if (!updatedRequest) return res.status(404).json({ message: "Request not found" });

    // Notifier le passager
    await Notification.create({
      userId: updatedRequest.userId,
      message: `Le statut de votre demande a été mis à jour : ${newStatus}`
    });

    res.json(updatedRequest);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
