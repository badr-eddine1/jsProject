import express from 'express';
import Stripe from 'stripe';
import verifyToken from '../middleware/authmiddlware.js'; // ton middleware d’auth si tu en as un

const router = express.Router();

// Initialise Stripe avec la clé secrète du .env
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Route POST pour créer un PaymentIntent
router.post('/create-payment-intent', verifyToken, async (req, res) => {
  try {
    const { amount } = req.body; // montant en centimes (ex : 1000 = 10,00€)

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Montant invalide.' });
    }

    // Création du PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'eur',
      // tu peux ajouter d'autres options ici comme payment_method_types
    });

    // Renvoie le client secret au frontend pour la confirmation du paiement
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Erreur création PaymentIntent:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la création du paiement.' });
  }
});

export default router;
