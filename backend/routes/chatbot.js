import express from 'express';
import FAQ from '../models/chatData.js';

const router = express.Router();

// Route POST pour poser une question au chatbot
router.post('/ask', async (req, res) => {
  try {
    const { question } = req.body;
    if (!question || question.trim() === '') {
      return res.status(400).json({ message: 'Veuillez fournir une question.' });
    }

    // Recherche plein texte dans la base FAQ
    const faqs = await FAQ.find(
      { $text: { $search: question } },
      { score: { $meta: "textScore" } }
    )
    .sort({ score: { $meta: "textScore" } })
    .limit(3);

    if (faqs.length === 0) {
      return res.json({ reponse: "Je n'ai pas trouvé de réponse. Peux-tu reformuler ?" });
    }

    // Renvoyer les réponses sous forme de liste
    const reponses = faqs.map(faq => faq.reponse);

    res.json({ reponses });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur lors de la recherche de réponse." });
  }
});

export default router;
