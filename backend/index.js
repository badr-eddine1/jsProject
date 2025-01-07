import express from 'express';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoute.js';  // Importer le fichier des routes utilisateur
import cors from 'cors';

const app = express();

// Middleware pour le parsing des JSON
app.use(express.json());
app.use(cors());

// Connexion à la base de données
connectDB();

// Utiliser les routes utilisateurs
app.use('/api/users', userRoutes);  // Toutes les routes définies dans userRoute.js commenceront par /api/users

// Route par défaut (facultatif, pour vérifier si l'application fonctionne)
app.get('/', (req, res) => {
  res.send('API is running');
});

// Lancer l'application sur le port 5000
app.listen(5000, () => {
  console.log('App is running on port 5000');
});
