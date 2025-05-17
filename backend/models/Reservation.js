import mongoose from 'mongoose';

const reservationSchema = new mongoose.Schema(
  {
    utilisateurId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    logementId: { type: mongoose.Schema.Types.ObjectId, ref: 'Logement', required: true },
    dateArrivee: { type: Date, required: true },
    dateDepart: { type: Date, required: true },
    nombrePersonnes: { type: Number, required: true, min: 1 },
    telephone: { type: String, required: true },
    adresse: { type: String, required: true },
    preferences: { type: String, default: '' },
    montantTotal: { type: Number, required: true },
    statut: { type: String, default: 'confirmé' },
  },
  { timestamps: true }
);

const Reservation = mongoose.model('Reservation', reservationSchema);
export default Reservation;
