// Initialise Express
// Connecte MongoDB (via connectDB)
// Charge les routes admin et user
// Démarre le serveur sur le port 5000
import dotenv from 'dotenv';
dotenv.config({ path: './backend/.env' });
import http from 'http';
import { Server } from 'socket.io';
import { connectDB } from './config/db.js';
import requestRoutes from './routes/request.js';
import authRoutes from './routes/auth.js';
import notificationRoutes from './routes/notification.js';
import express from 'express';
import cors from "cors";
console.log('JWT_SECRET loaded:', process.env.JWT_SECRET); // Ajoute ce log juste après

const app = express();
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

// Middleware pour lire les JSON dans les requêtes
app.use(express.json());

// Connexion à la base de données MongoDB
connectDB();

// Création du serveur HTTP avec Express
const server = http.createServer(app);

// Initialisation de Socket.io
const io = new Server(server, {             // <-- Création serveur Socket.io lié au serveur HTTP
  cors: {
    origin: '*', // Ajuster ici avec l'URL de ton frontend en prod
    methods: ['GET', 'POST'],
  },
});

// Rendre l'instance io accessible globalement dans l'app
global.io = io; //Stockage global pour usage dans les controllers

// Gestion des connexions Socket.io
io.on('connection', (socket) => {
  console.log('🟢 New client connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('🔴 Client disconnected:', socket.id);
  });
});

// Routes de l’administrateur (liste, acceptation, rejet, changement de statut,créer une demande, consulter ses demandes,notifications)
app.use('/api', requestRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/notifications', notificationRoutes);

// Route d’accueil pour tester le serveur
app.get('/', (req, res) => {
    res.send('Server is ready');
});

// Affichage de la chaîne de connexion (à ne pas garder en production)
console.log(process.env.MONGO_URI);

// Démarrage du serveur
server.listen(5000, () => {
    console.log('Server started at http://localhost:5000');
});
