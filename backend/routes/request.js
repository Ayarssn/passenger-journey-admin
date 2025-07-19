import express from 'express';
import Request from '../models/request.js';

const router = express.Router();

/* ========== USER ROUTES ========== */

/*
POST /api/user/requests
Créer une nouvelle demande par un utilisateur
*/
router.post('/requests', async (req, res) => {
  try {
    const {
      userId,
      vehicleType,
      problemType,
      description,
      location, // format : { type: "Point", coordinates: [lng, lat] }
    } = req.body;

    const newRequest = new Request({
      userId,
      vehicleType,
      problemType,
      description,
      location,
      status: "pending",
      paymentStatus: "unpaid"
    });

    await newRequest.save();
    res.status(201).json(newRequest);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/*
GET /api/user/requests/:userId
Récupérer toutes les demandes d'un utilisateur
*/
router.get('/requests/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const requests = await Request.find({ userId }).sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/*
PUT /api/user/requests/:id/cancel
Annuler une demande si elle est encore en attente
*/
router.put('/requests/:id/cancel', async (req, res) => {
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
});


/* ========== ADMIN ROUTES ========== */

/*
GET /api/requests
Liste toutes les demandes, avec filtres optionnels (statut, type véhicule, date)
*/
router.get('/AllRequests', async (req, res) => {
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
});

/*
PUT /api/requests/:id/status
Changer le statut d'une demande (admin)
*/
router.put('/requests/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { newStatus } = req.body;

    const updatedRequest = await Request.findByIdAndUpdate(
      id,
      { status: newStatus, updatedAt: Date.now() },
      { new: true }
    );

    if (!updatedRequest) return res.status(404).json({ message: "Request not found" });

    res.json(updatedRequest);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
