import mongoose from 'mongoose';

const faqSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
    trim: true,
  },
  reponse: {
    type: String,
    required: true,
  },
});

// Création d'un index texte pour recherche plein texte
faqSchema.index({ question: 'text', reponse: 'text' });

const FAQ = mongoose.model('FAQ', faqSchema);

export default FAQ;
