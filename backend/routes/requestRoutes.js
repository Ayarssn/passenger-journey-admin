import express from 'express';
import Request from '../models/requests.js';

const router = express.Router();

/*
 ******* GET /api/requests*******
*/

router.get('/api/requests', async (req, res) => {
  try {
    const requests = await Request.find();
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});