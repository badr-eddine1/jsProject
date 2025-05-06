import express from 'express';
import Logement from '../models/logement.js';

const router = express.Router();

// Route pour ajouter un logement
router.post('/', async (req, res) => {
  try {
    const { titre, description, prixParNuit, image, ville, pays, utilisateurId, dateArrivee, dateDepart } = req.body;
    
    const newLogement = new Logement({
      titre,
      description,
      prixParNuit,
      image,
      ville,
      pays,
      utilisateurId,
      dateArrivee,
      dateDepart,
    });

    const savedLogement = await newLogement.save();

    res.status(201).json({
      message: 'Logement ajouté avec succès',
      logement: savedLogement,
    });
  } catch (err) {
    res.status(400).json({ message: 'Erreur lors de l\'ajout du logement', error: err.message });
  }
});

// Route pour obtenir tous les logements
router.get('/', async (req, res) => {
  try {
    const logements = await Logement.find();
    res.status(200).json(logements);
  } catch (err) {
    res.status(400).json({ message: 'Erreur lors de la récupération des logements', error: err.message });
  }
});

export default router;
