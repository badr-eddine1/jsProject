import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();  // Charger les variables d'environnement à partir de .env
console.log(process.env.JWT_SECRET); 
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,  // Option pour le parseur URL MongoDB
      useUnifiedTopology: true,  // Option pour activer le moteur de topologie unifiée
    });
    console.log('MongoDB connected');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1); // Arrêter l'application en cas d'erreur
  }
};

export default connectDB;
