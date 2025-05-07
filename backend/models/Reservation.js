import mongoose from 'mongoose';
import Logement from './logement.js'; // Importer le modèle Logement
import User from './users.js'; // Importer le modèle User

const reservationSchema = new mongoose.Schema(
  {
    logementId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Logement',
      required: true,
      validate: {
        // Valider que le logement existe dans la base de données
        validator: async function (value) {
          const logement = await Logement.findById(value);
          return logement != null;
        },
        message: 'Le logement sélectionné n\'existe pas.',
      },
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      validate: {
        // Valider que l'utilisateur existe dans la base de données
        validator: async function (value) {
          const user = await User.findById(value);
          return user != null;
        },
        message: 'L\'utilisateur n\'existe pas.',
      },
    },
    dateArrivee: {
      type: Date,
      required: true,
      validate: {
        validator: function (value) {
          return value > new Date();
        },
        message: 'La date d\'arrivée doit être dans le futur.',
      },
    },
    dateDepart: {
      type: Date,
      required: true,
      validate: {
        validator: function (value) {
          return value > this.dateArrivee;
        },
        message: 'La date de départ doit être après la date d\'arrivée.',
      },
    },
    nombrePersonnes: {
      type: Number,
      required: true,
      min: [1, 'Le nombre de personnes doit être au moins 1'],
    },
    telephone: {
      type: String,
      required: true,
    },
    adresse: {
      type: String,
      required: true,
    },
    preferences: {
      type: Object,
    },
    montantTotal: {
      type: Number,
      required: true,
      min: [0, 'Le montant total ne peut pas être négatif'],
    },
    statut: {
      type: String,
      enum: ['confirmée', 'annulée', 'en attente'],
      default: 'en attente',
    },
  },
  { timestamps: true }
);

// Hook pour vérifier si le logement est déjà réservé aux mêmes dates
reservationSchema.pre('save', async function (next) {
  const { logementId, dateArrivee, dateDepart } = this;

  const existingReservation = await mongoose.model('Reservation').findOne({
    logementId,
    $or: [
      { dateArrivee: { $lt: dateDepart, $gte: dateArrivee } }, // Date d'arrivée est dans la période de réservation existante
      { dateDepart: { $gt: dateArrivee, $lte: dateDepart } }, // Date de départ est dans la période de réservation existante
    ],
  });

  if (existingReservation) {
    return next(new Error('Le logement est déjà réservé pour ces dates.'));
  }

  next();
});

// Créer et exporter le modèle Reservation
const Reservation = mongoose.model('Reservation', reservationSchema);

export default Reservation;
