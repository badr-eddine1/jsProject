import mongoose from 'mongoose';



// Définir le schéma du logement
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
    type: String,
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
  timestamps: true, // Ajoute les champs createdAt et updatedAt
});

// Utiliser le modèle existant s'il existe déjà, sinon le créer
const Logement = mongoose.models.Logement || mongoose.model('Logement', logementSchema);

export default Logement;
