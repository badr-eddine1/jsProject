import express from 'express';
import verifyToken from '../middleware/authmiddlware.js';
import verifyAdmin from '../middleware/verifyAdmin.js';
import User from '../models/users.js';
import Logement from '../models/logement.js';
import Reservation from '../models/Reservation.js';

const router = express.Router();

// --- Utilisateurs ---

// Liste des utilisateurs
router.get('/users', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la récupération des utilisateurs', error: err.message });
  }
});

// Modifier un utilisateur (ex: rôle, infos)
router.put('/users/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });

    Object.assign(user, req.body);
    await user.save();

    const userObj = user.toObject();
    delete userObj.password; // Ne jamais renvoyer password

    res.json({ message: 'Utilisateur mis à jour', user: userObj });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour de l\'utilisateur', error: err.message });
  }
});

// Suppression utilisateur
router.delete('/users/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'Utilisateur supprimé' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la suppression de l\'utilisateur', error: err.message });
  }
});

// --- Logements ---

// Liste de tous les logements avec utilisateur peuplé
router.get('/logements', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const logements = await Logement.find().populate('utilisateurId', 'fullName email');
    res.json(logements);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la récupération des logements', error: err.message });
  }
});

// Modifier un logement
router.put('/logements/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const logement = await Logement.findById(req.params.id);
    if (!logement) return res.status(404).json({ message: 'Logement non trouvé' });

    Object.assign(logement, req.body);
    await logement.save();

    res.json({ message: 'Logement mis à jour', logement });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour du logement', error: err.message });
  }
});

// Suppression logement
router.delete('/logements/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    await Logement.findByIdAndDelete(req.params.id);
    res.json({ message: 'Logement supprimé' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la suppression du logement', error: err.message });
  }
});

// --- Réservations ---

// Liste de toutes les réservations (avec logements et utilisateurs peuplés)
router.get('/reservations', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const reservations = await Reservation.find()
      .populate('utilisateurId', 'fullName email')
      .populate('logementId', 'titre ville pays');
    res.json(reservations);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la récupération des réservations', error: err.message });
  }
});

// Détail d’une réservation
router.get('/reservations/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id)
      .populate('utilisateurId', 'fullName email')
      .populate('logementId', 'titre ville pays');
    if (!reservation) return res.status(404).json({ message: 'Réservation non trouvée' });
    res.json(reservation);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la récupération de la réservation', error: err.message });
  }
});

// Modifier une réservation (ex : statut)
router.put('/reservations/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) return res.status(404).json({ message: 'Réservation non trouvée' });

    Object.assign(reservation, req.body);
    await reservation.save();

    res.json({ message: 'Réservation mise à jour', reservation });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour de la réservation', error: err.message });
  }
});

// Supprimer une réservation
router.delete('/reservations/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    await Reservation.findByIdAndDelete(req.params.id);
    res.json({ message: 'Réservation supprimée' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la suppression de la réservation', error: err.message });
  }
});

export default router;
