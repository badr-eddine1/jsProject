import express from 'express';
import axios from 'axios';

const router = express.Router();

// Context for the assistant
const SYSTEM_PROMPT = `You are a helpful assistant for a hotel booking website called BIBM Hôtel. 
Your role is to provide accurate and helpful information about:
- Room availability and booking procedures
- Hotel amenities and services
- Location and nearby attractions
- Pricing and special offers
- Check-in and check-out procedures
- Cancellation policies

Important guidelines:
1. Always reply in the same language as the user's question (French or English)
2. Be concise but informative
3. If you're not sure about specific details, suggest contacting the hotel directly
4. Maintain a professional and friendly tone
5. Don't make up information about prices or availability
6. For booking-related questions, guide users to the booking system`;

// POST /api/chatbot/ask
router.post('/ask', async (req, res) => {
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'Message is required.' });
  }

  try {
    const geminiRes = await axios.post(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent',
      {
        contents: [
          { role: 'user', parts: [{ text: `${SYSTEM_PROMPT}\n\nUser: ${message}` }] }
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      },
      {
        headers: { 'Content-Type': 'application/json' },
        params: { key: process.env.GEMINI_API_KEY }
      }
    );

    const aiReply = geminiRes.data.candidates?.[0]?.content?.parts?.[0]?.text || "Désolé, je n'ai pas compris.";
    res.json({ reply: aiReply });
  } catch (error) {
    console.error('Gemini error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Erreur lors de la communication avec Gemini.' });
  }
});

export default router;
