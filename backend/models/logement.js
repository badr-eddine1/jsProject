import mongoose from 'mongoose';

const logementSchema = mongoose.Schema({
  titre: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  prixParNuit: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  ville: {
    type: String,
    required: true,
  },
  pays: {
    type: String,
    required: true,
  },
  utilisateurId: {
    type: mongoose.Schema.Types.ObjectId,  // <== changer ici
    ref: 'User',                           // <== ajouter cette ligne
    required: true,
  },
  dateArrivee: {
    type: Date,
    required: true,
  },
  dateDepart: {
    type: Date,
    required: true,
  },
}, {
  timestamps: true,
});

const Logement = mongoose.models.Logement || mongoose.model('Logement', logementSchema);

export default Logement;
