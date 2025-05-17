import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/users.js';
import verifyToken from '../middleware/authmiddlware.js'; // ajout important

const router = express.Router();

// 🔹 Créer un compte
router.post('/signup', async (req, res) => {
  const { fullName, email, password, phone } = req.body;

  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: 'Veuillez remplir tous les champs requis.' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Cet email est déjà utilisé.' });
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
      message: 'Compte créé avec succès.',
      user: {
        id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role,  // Ajout du rôle ici, par défaut 'user'
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
});

// 🔹 Connexion
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: 'Veuillez fournir email et mot de passe.' });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Identifiants invalides.' });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(400).json({ message: 'Identifiants invalides.' });

    // Inclure le rôle dans le token JWT
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      message: 'Connexion réussie.',
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,  // On renvoie aussi le rôle dans la réponse
      },
    });
  } catch (error) {
    console.error('Erreur de connexion :', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
});

// 🔐 Récupérer profil connecté
router.get('/me', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// 🔐 Modifier profil connecté
router.put('/me', verifyToken, async (req, res) => {
  try {
    const { fullName, phone } = req.body;
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé.' });

    if (fullName) user.fullName = fullName;
    if (phone) user.phone = phone;

    await user.save();

    const updatedUser = user.toObject();
    delete updatedUser.password;

    res.json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur lors de la mise à jour du profil.' });
  }
});

export default router;
