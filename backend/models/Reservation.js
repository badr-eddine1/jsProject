import mongoose from 'mongoose';
import Logement from './logement.js'; // Importer le modèle Logement
import User from './users.js'; // Importer le modèle User

const reservationSchema = new mongoose.Schema(
  {
    utilisateurId: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
    logementId: { type: mongoose.Schema.Types.ObjectId, ref: 'logement', required: true },
    dateArrivee: { type: Date, required: true },
    dateDepart: { type: Date, required: true },
    nombrePersonnes: { type: Number, required: true, min: 1 },
    telephone: { type: String, required: true },
    adresse: { type: String, required: true },
    preferences: { type: String, default: '' },
    montantTotal: { type: Number, required: true },
    statut: { type: String, default: 'en attente' }, // ou "confirmé"
  },
  { timestamps: true }
);

// Créer et exporter le modèle
const Reservation = mongoose.model('Reservation', reservationSchema);
export default Reservation;
