import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';  
import User from '../models/users.js';

const router = express.Router();

router.post('/signup', async (req, res) => {
  const { fullName, email, password, phone } = req.body;

  try {
  
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: 'Please provide all the required fields (fullName, email, password).' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered.' });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
      phone,
    });

    await newUser.save();
    res.status(201).json({
      message: 'User registered successfully!',
      user: {
        id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        phone: newUser.phone,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
  
    try {
      if (!email || !password) {
        console.log('Missing fields:', { email, password });
        return res.status(400).json({ message: 'Please provide both email and password.' });
      }
  
      const user = await User.findOne({ email });
      console.log('User found:', user);
  
      if (!user) {
        return res.status(400).json({ message: 'Invalid email or password.' });
      }
      const isPasswordValid = await bcrypt.compare(password, user.password);
     
 
      if (isPasswordValid) {
        return res.status(400).json({ message: 'Invalid email or password.' });
      }
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      console.log('JWT token generated:', token);
  
      res.status(200).json({
        message: 'Login successful!',
        token,
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          phone: user.phone,
        },
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Server error. Please try again later.' });
    }
  });
  

export default router;
