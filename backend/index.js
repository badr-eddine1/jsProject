import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

import userRoutes from './routes/userRoute.js';
import logementRoutes from './routes/logementRoute.js';
import reservationRoutes from './routes/reservationRoute.js';
 import adminRoute from './routes/adminRoute.js'

 import paymentRoutes from './routes/payments.js';

 import faqRoutes from './routes/faqRoute.js';
 import chatbotRoutes from './routes/chatbot.js';

 

 

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connexion à la base de données
connectDB();

// Définir les routes principales
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/faq', faqRoutes);
app.use('/api/admin', adminRoute);
app.use('/api/payments', paymentRoutes);
app.use('/api/users', userRoutes);
app.use('/api/logements', logementRoutes);
app.use('/api/reservations', reservationRoutes);

// Route de test
app.get('/', (req, res) => {
  res.send('🚀 API is running...');
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`✅ Serveur en marche: http://localhost:${PORT}`);
});
