import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';  // Pour générer un token JWT
import User from '../models/users.js';

const router = express.Router();

// Route pour l'inscription d'un utilisateur (Signup)
router.post('/signup', async (req, res) => {
  const { fullName, email, password, phone } = req.body;

  try {
    // Vérification si les champs nécessaires sont présents
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: 'Please provide all the required fields (fullName, email, password).' });
    }

    // Vérification de l'existence de l'email dans la base de données
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered.' });
    }

    // Hashage du mot de passe
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Création d'un nouvel utilisateur
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
      phone,
    });

    // Sauvegarde de l'utilisateur dans la base de données
    await newUser.save();

    // Retourner une réponse de succès avec les informations de l'utilisateur (sans mot de passe)
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

// Route pour la connexion d'un utilisateur (Login)
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
  
    console.log('Request body:', req.body); // Vérifie que les données arrivent correctement
  
    try {
      if (!email || !password) {
        console.log('Missing fields:', { email, password });
        return res.status(400).json({ message: 'Please provide both email and password.' });
      }
  
      const user = await User.findOne({ email });
      console.log('User found:', user); // Vérifie si l'utilisateur existe
  
      if (!user) {
        return res.status(400).json({ message: 'Invalid email or password.' });
      }
      console.log('Password sent by user:', password);
      console.log('Hashed password in database:', user.password);
      
     
      
      const isPasswordValid = await bcrypt.compare(password, user.password);
      console.log('Password valid:', isPasswordValid); // Vérifie si le mot de passe correspond
 
      if (isPasswordValid) {
        return res.status(400).json({ message: 'Invalid email or password.' });
      }
  
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      console.log('JWT token generated:', token); // Vérifie si le token est généré
  
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
