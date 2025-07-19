// Initialise Express
// Connecte MongoDB (via connectDB)
// Charge les routes admin et user
// Démarre le serveur sur le port 5000

import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import RequestRoutes from './routes/request.js';
 // Import des routes 

dotenv.config();

const app = express();

// Middleware pour lire les JSON dans les requêtes
app.use(express.json());

// Connexion à la base de données MongoDB
connectDB();

// Routes de l’administrateur (liste, acceptation, rejet, changement de statut,créer une demande, consulter ses demandes)
app.use('/api', RequestRoutes);

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
