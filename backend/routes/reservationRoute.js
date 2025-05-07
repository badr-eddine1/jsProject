import express from 'express';
import Reservation from '../models/Reservation.js';

const router = express.Router();

// Créer une réservation
router.post('/', async (req, res) => {
  try {
    const { logementId, userId, dateArrivee, dateDepart, nombrePersonnes, telephone, adresse, preferences, montantTotal } = req.body;

    // Créer une nouvelle réservation
    const newReservation = new Reservation({
      logementId,
      userId,
      dateArrivee,
      dateDepart,
      nombrePersonnes,
      telephone,
      adresse,
      preferences,
      montantTotal,
    });

    // Sauvegarder la réservation dans la base de données
    await newReservation.save();

    // Répondre avec la réservation créée
    res.status(201).json({ message: 'Réservation effectuée avec succès', reservation: newReservation });
  } catch (err) {
    console.error('Erreur de réservation:', err);
    res.status(400).json({ message: 'Erreur lors de la création de la réservation', error: err.message });
  }
});

export default router;
