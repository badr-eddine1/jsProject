// backend/index.js
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoute.js';
import logementRoutes from './routes/logementRoute.js';

const app = express();
const PORT = 5000;


app.use(cors());
app.use(express.json());


connectDB();


app.use('/api/users', userRoutes);
app.use('/api/logements', logementRoutes);


app.get('/', (req, res) => {
  res.send('🚀 API is running...');
});


app.listen(PORT, () => {
  console.log(`✅ Serveur en marche: http://localhost:${PORT}`);
});
