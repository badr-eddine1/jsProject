import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config(); 
console.log(process.env.JWT_SECRET); 
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true, 
    });
    console.log('MongoDB connected');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1); 
  }
};

export default connectDB;
