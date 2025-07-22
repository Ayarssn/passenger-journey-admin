import express from 'express';
import authenticate from '../middleware/auth.js';
import { authorizeRole } from '../middleware/authorizeRole.js';


import {
  createRequest,
  getUserRequests,
  cancelRequest,
  getAllRequests,
  updateRequestStatus
} from '../controllers/request.js';

const router = express.Router();

// USER ROUTES
router.post('/requests',authenticate, createRequest);
router.get('/requests/:userId',authenticate, getUserRequests);
router.put('/requests/:id/cancel',authenticate, cancelRequest);

// ADMIN ROUTES
router.get('/AllRequests',authenticate,authorizeRole('admin'), getAllRequests);
router.put('/requests/:id/status', authenticate, authorizeRole('admin'), updateRequestStatus);

export default router;
