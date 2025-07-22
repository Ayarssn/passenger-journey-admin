// Initialise Express
// Connecte MongoDB (via connectDB)
// Charge les routes admin et user
// Démarre le serveur sur le port 5000

import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import requestRoutes from './routes/request.js';
import authRoutes from './routes/auth.js';

dotenv.config({ path: './backend/.env' });
console.log('JWT_SECRET loaded:', process.env.JWT_SECRET); // Ajoute ce log juste après

const app = express();

// Middleware pour lire les JSON dans les requêtes
app.use(express.json());

// Connexion à la base de données MongoDB
connectDB();

// Routes de l’administrateur (liste, acceptation, rejet, changement de statut,créer une demande, consulter ses demandes)
app.use('/api', requestRoutes);
app.use('/api/auth', authRoutes);

// Route d’accueil pour tester le serveur
app.get('/', (req, res) => {
    res.send('Server is ready');
});

// Affichage de la chaîne de connexion (à ne pas garder en production)
console.log(process.env.MONGO_URI);

// Démarrage du serveur
app.listen(5000, () => {
    console.log('Server started at http://localhost:5000');
});
