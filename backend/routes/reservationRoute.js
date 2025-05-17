import express from 'express';
import Reservation from '../models/Reservation.js';
import verifyToken from '../middleware/authmiddlware.js';

const router = express.Router();

// 🔒 Créer une réservation
router.post('/', verifyToken, async (req, res) => {
  try {
    const {
      logementId,
      dateArrivee,
      dateDepart,
      nombrePersonnes,
      telephone,
      adresse,
      preferences,
      montantTotal
    } = req.body;

    const newReservation = new Reservation({
      logementId,
      utilisateurId: req.user.userId,
      dateArrivee,
      dateDepart,
      nombrePersonnes,
      telephone,
      adresse,
      preferences,
      montantTotal
    });

    const savedReservation = await newReservation.save();
    res.status(201).json(savedReservation);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la création de la réservation', error: err.message });
  }
});

// 🔒 Récupérer les réservations de l'utilisateur connecté
router.get('/me', verifyToken, async (req, res) => {
  try {
    const reservations = await Reservation.find({ utilisateurId: req.user.userId }).populate('logementId');
    res.status(200).json(reservations);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la récupération', error: err.message });
  }
});

// 🔒 Supprimer une réservation (si utilisateur est le créateur)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({ message: 'Réservation introuvable' });
    }

    if (reservation.utilisateurId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Action non autorisée' });
    }

    await reservation.deleteOne();
    res.status(200).json({ message: 'Réservation supprimée avec succès' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la suppression', error: err.message });
  }
});

export default router;
