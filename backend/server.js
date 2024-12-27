// server.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const roomRoutes = require('./Routes/rooms'); // Importer les routes

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // Pour analyser les données JSON

// Connecter à MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log('Error connecting to MongoDB:', err));

// Utiliser les routes de chambres
app.use('/api/rooms', roomRoutes);

// Définir une route de test
app.get('/', (req, res) => {
  res.send('Welcome to Hotel Booking API');
});

// Démarrer le serveur
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
