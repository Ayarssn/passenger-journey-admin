import express from 'express';
import {
  createRequest,
  getUserRequests,
  cancelRequest,
  getAllRequests,
  updateRequestStatus
} from '../controllers/request.js';

const router = express.Router();

// USER ROUTES
router.post('/requests', createRequest);
router.get('/requests/:userId', getUserRequests);
router.put('/requests/:id/cancel', cancelRequest);

// ADMIN ROUTES
router.get('/AllRequests', getAllRequests);
router.put('/requests/:id/status', updateRequestStatus);

export default router;
