import express from 'express';
import FAQ from '../models/chatData.js';
import verifyToken from '../middleware/authmiddlware.js';

const router = express.Router();

// 🔒 Ajouter une question/réponse (admin ou user autorisé)
router.post('/', verifyToken, async (req, res) => {
  try {
    const { question, reponse, categorie } = req.body;
    if (!question || !reponse) {
      return res.status(400).json({ message: 'Question et réponse sont requises.' });
    }

    const newFAQ = new FAQ({ question, reponse, categorie });
    const savedFAQ = await newFAQ.save();
    res.status(201).json(savedFAQ);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la création', error: err.message });
  }
});

// 📖 Récupérer toutes les questions/réponses
router.get('/', async (req, res) => {
  try {
    const faqs = await FAQ.find();
    res.status(200).json(faqs);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la récupération', error: err.message });
  }
});

// 🔄 Mettre à jour une FAQ par id
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const faq = await FAQ.findById(req.params.id);
    if (!faq) return res.status(404).json({ message: 'FAQ non trouvée' });

    const { question, reponse, categorie } = req.body;
    if (question) faq.question = question;
    if (reponse) faq.reponse = reponse;
    if (categorie) faq.categorie = categorie;

    await faq.save();
    res.status(200).json(faq);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour', error: err.message });
  }
});

// ❌ Supprimer une FAQ par id
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const deleted = await FAQ.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'FAQ non trouvée' });

    res.status(200).json({ message: 'FAQ supprimée avec succès' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la suppression', error: err.message });
  }
});

export default router;
