import express from 'express';
import authenticate from '../middleware/auth.js';
import { authorizeRole } from '../middleware/authorizeRole.js';
import { ADMIN } from '../utils/constants.js';

import {
  create,
  getUser,
  cancel,
  getAll,
  updateStatus
} from '../controllers/request.js';

const router = express.Router();

// USER ROUTES
router.post('/requests', authenticate, create);
router.get('/requests/:userId', authenticate, getUser);
router.put('/requests/:id/cancel', authenticate, cancel);

// ADMIN ROUTES
router.get('/AllRequests', authenticate, authorizeRole(ADMIN), getAll);
router.put('/requests/:id/status', authenticate, authorizeRole(ADMIN), updateStatus);

export default router;
