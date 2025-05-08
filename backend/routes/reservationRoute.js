// routes/reservationRoute.js
import express from 'express';
import Reservation from '../models/Reservation.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { logementId, userId, dateArrivee, dateDepart, nombrePersonnes, telephone, adresse, preferences, montantTotal } = req.body;
    const newReservation = new Reservation({
      logementId,
      userId,
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

export default router;
