// * Initialise Express.
// * Connecte MongoDB (via connectDB).
// * Crée une route /

import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
// Load environment variables from .env file
dotenv.config();

const app = express();


app.get('/', (req, res) => {
    res.send('Server is ready');
});

console.log(process.env.MONGO_URI);

app.listen(5000, () => {
    connectDB(); // Connect to MongoDB
    console.log('Server starrted at http://localhost:5000');
});
