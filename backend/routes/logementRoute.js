import express from 'express';
import Logement from '../models/logement.js';
import Reservation from '../models/Reservation.js';  // Import pour vérifier réservations
import verifyToken from '../middleware/authmiddlware.js'; // adapte selon ton middleware

const router = express.Router();

// 🔒 Ajouter un logement (utilisateur connecté)
router.post('/', verifyToken, async (req, res) => {
  try {
    const {
      titre,
      description,
      prixParNuit,
      image,
      ville,
      pays,
      dateArrivee,
      dateDepart,
    } = req.body;

    const newLogement = new Logement({
      titre,
      description,
      prixParNuit,
      image,
      ville,
      pays,
      utilisateurId: req.user.userId, // ID depuis token JWT
      dateArrivee,
      dateDepart,
    });

    const savedLogement = await newLogement.save();

    res.status(201).json({
      message: 'Logement ajouté avec succès',
      logement: savedLogement,
    });
  } catch (err) {
    res.status(400).json({
      message: "Erreur lors de l'ajout du logement",
      error: err.message,
    });
  }
});

// 🔒 Récupérer tous les logements publics (non protégée)
router.get('/', async (req, res) => {
  try {
    const logements = await Logement.find();
    res.status(200).json(logements);
  } catch (err) {
    res.status(400).json({
      message: "Erreur lors de la récupération des logements",
      error: err.message,
    });
  }
});

// 🔒 Récupérer uniquement les logements de l’utilisateur connecté
router.get('/mes-logements', verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const logements = await Logement.find({ utilisateurId: userId });
    res.status(200).json(logements);
  } catch (err) {
    res.status(400).json({
      message: "Erreur lors de la récupération des logements personnels",
      error: err.message,
    });
  }
});

// 🔒 Mettre à jour un logement (propriétaire uniquement)
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const logementId = req.params.id;

    // Vérifier appartenance du logement
    const logement = await Logement.findOne({ _id: logementId, utilisateurId: userId });
    if (!logement) return res.status(404).json({ message: "Logement non trouvé ou accès refusé" });

    // Mise à jour
    Object.assign(logement, req.body);
    await logement.save();

    res.status(200).json({ message: "Logement mis à jour", logement });
  } catch (err) {
    res.status(400).json({
      message: "Erreur lors de la mise à jour du logement",
      error: err.message,
    });
  }
});

// 🔒 Supprimer un logement (propriétaire uniquement)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const logementId = req.params.id;

    const logement = await Logement.findOneAndDelete({ _id: logementId, utilisateurId: userId });
    if (!logement) return res.status(404).json({ message: "Logement non trouvé ou accès refusé" });

    res.status(200).json({ message: "Logement supprimé avec succès" });
  } catch (err) {
    res.status(400).json({
      message: "Erreur lors de la suppression du logement",
      error: err.message,
    });
  }
});

// 🔎 Recherche logements disponibles selon critères et dates
router.post('/recherche', async (req, res) => {
  try {
    const { ville, pays, dateArrivee, dateDepart, prixMax } = req.body;

    if (!dateArrivee || !dateDepart) {
      return res.status(400).json({ message: 'Veuillez fournir les dates d’arrivée et de départ.' });
    }

    // Construire filtre destination et prix max
    const filtre = {};
    if (ville) filtre.ville = ville;
    if (pays) filtre.pays = pays;
    if (prixMax) filtre.prixParNuit = { $lte: prixMax };

    // Trouver logements selon critères
    const logements = await Logement.find(filtre);

    // Filtrer logements indisponibles sur dates
    const logementsDisponibles = [];

    for (const logement of logements) {
      const chevauchement = await Reservation.findOne({
        logementId: logement._id,
        $or: [
          {
            dateArrivee: { $lt: new Date(dateDepart) },
            dateDepart: { $gt: new Date(dateArrivee) },
          },
        ],
      });

      if (!chevauchement) {
        logementsDisponibles.push(logement);
      }
    }

    res.status(200).json(logementsDisponibles);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur lors de la recherche', error: err.message });
  }
});

export default router;
