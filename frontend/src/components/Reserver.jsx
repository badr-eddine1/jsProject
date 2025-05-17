import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Alert,
  Typography,
  Paper,
  Box,
  Stepper,
  Step,
  StepLabel,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  useMediaQuery
} from '@mui/material';
import {
  Close,
  CalendarToday,
  People,
  Phone,
  Home,
  Star,
  CreditCard,
  CheckCircle
} from '@mui/icons-material';
import axios from 'axios';
import dayjs from 'dayjs';
import { useTheme } from '@mui/material/styles';

// Stripe imports
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

// Composant formulaire de paiement Stripe amélioré
const CheckoutForm = ({ clientSecret, onSuccess, onError, amount }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [completed, setCompleted] = useState(false);
  const theme = useTheme();

  const handleSubmitPayment = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);
    setError(null);

    try {
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            address: {
              country: 'FR' // Adaptez selon vos besoins
            }
          }
        }
      });

      if (error) {
        throw error;
      }

      if (paymentIntent.status === 'succeeded') {
        setCompleted(true);
        setTimeout(() => onSuccess(paymentIntent), 1500);
      }
    } catch (err) {
      setError(err.message);
      if (onError) onError(err);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
        <CreditCard sx={{ mr: 1 }} /> Paiement sécurisé
      </Typography>
      
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Montant à payer: <strong>{amount}€</strong>
      </Typography>

      {!completed ? (
        <form onSubmit={handleSubmitPayment}>
          <Paper variant="outlined" sx={{ p: 2, mb: 2, borderRadius: 2 }}>
            <CardElement 
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: theme.palette.text.primary,
                    '::placeholder': {
                      color: theme.palette.text.secondary,
                    },
                  },
                },
              }}
            />
          </Paper>
          
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={!stripe || processing}
            sx={{ py: 1.5 }}
          >
            {processing ? 'Traitement en cours...' : `Payer ${amount}€`}
          </Button>
        </form>
      ) : (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <CheckCircle sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />
          <Typography variant="h6" color="success.main">
            Paiement réussi !
          </Typography>
        </Box>
      )}
    </Box>
  );
};

const Reserver = ({ open, onClose, logement, onSuccess }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    logementId: logement._id,
    dateArrivee: '',
    dateDepart: '',
    nombrePersonnes: 1,
    telephone: '',
    adresse: '',
    preferences: '',
    montantTotal: logement.prixParNuit || 0,
    nombreNuits: 0,
  });

  const [error, setError] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) {
      // Réinitialiser le formulaire quand le dialogue est fermé
      setActiveStep(0);
      setFormData({
        logementId: logement._id,
        dateArrivee: '',
        dateDepart: '',
        nombrePersonnes: 1,
        telephone: '',
        adresse: '',
        preferences: '',
        montantTotal: logement.prixParNuit || 0,
        nombreNuits: 0,
      });
      setError('');
      setClientSecret('');
    }
  }, [open, logement]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Calcul automatique du nombre de nuits et du montant
    if (name === 'dateArrivee' || name === 'dateDepart') {
      if (formData.dateArrivee && formData.dateDepart) {
        const arrivee = dayjs(formData.dateArrivee);
        const depart = dayjs(formData.dateDepart);
        const nights = depart.diff(arrivee, 'day');
        
        if (nights > 0) {
          const total = logement.prixParNuit * nights;
          setFormData(prev => ({
            ...prev,
            nombreNuits: nights,
            montantTotal: total
          }));
        }
      }
    }
  };

  const handleNext = () => {
    setActiveStep(prevActiveStep => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1);
  };

  const handleSubmitReservation = async () => {
    try {
      setLoading(true);
      setError('');

      const token = localStorage.getItem('token');
      if (!token) {
        setError("Vous devez être connecté pour réserver.");
        return;
      }

      // Validation des dates
      const arrivee = dayjs(formData.dateArrivee);
      const depart = dayjs(formData.dateDepart);
      const nights = depart.diff(arrivee, 'day');

      if (nights <= 0) {
        setError("La date de départ doit être après la date d'arrivée.");
        return;
      }

      const payload = {
        ...formData,
        montantTotal: logement.prixParNuit * nights,
        nombreNuits: nights
      };

      // Envoi réservation au backend (sans paiement)
      const res = await axios.post('http://localhost:5000/api/reservations', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.status === 201) {
        // Demande de création PaymentIntent pour Stripe
        const paymentRes = await axios.post('http://localhost:5000/api/payments/create-payment-intent', {
          amount: Math.round(payload.montantTotal * 100), // centimes
          metadata: {
            reservationId: res.data._id,
            logementId: logement._id
          }
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });

        setClientSecret(paymentRes.data.clientSecret);
        handleNext();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la réservation');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = (paymentIntent) => {
    if (onSuccess) onSuccess();
    setTimeout(() => onClose(), 2000);
  };

  const steps = ['Détails de la réservation', 'Paiement'];

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      fullWidth 
      maxWidth="md"
      fullScreen={isMobile}
    >
      <DialogTitle sx={{ position: 'relative' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Réservation - {logement.titre}
          </Typography>
          <IconButton
            edge="end"
            onClick={onClose}
            sx={{ position: isMobile ? 'relative' : 'absolute', right: 8, top: 8 }}
          >
            <Close />
          </IconButton>
        </Box>
        
        <Stepper activeStep={activeStep} sx={{ mt: 3 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </DialogTitle>

      <DialogContent dividers>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {activeStep === 0 && (
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Date d'arrivée"
                  type="date"
                  name="dateArrivee"
                  value={formData.dateArrivee}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CalendarToday color="action" />
                      </InputAdornment>
                    ),
                  }}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Date de départ"
                  type="date"
                  name="dateDepart"
                  value={formData.dateDepart}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CalendarToday color="action" />
                      </InputAdornment>
                    ),
                  }}
                  required
                />
              </Grid>
            </Grid>

            <TextField
              label="Nombre de personnes"
              type="number"
              name="nombrePersonnes"
              value={formData.nombrePersonnes}
              onChange={handleChange}
              fullWidth
              margin="normal"
              inputProps={{ min: 1, max: logement.capacite || 10 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <People color="action" />
                  </InputAdornment>
                ),
              }}
              required
            />

            <TextField
              label="Téléphone"
              name="telephone"
              value={formData.telephone}
              onChange={handleChange}
              fullWidth
              margin="normal"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Phone color="action" />
                  </InputAdornment>
                ),
              }}
              required
            />

            <TextField
              label="Adresse complète"
              name="adresse"
              value={formData.adresse}
              onChange={handleChange}
              fullWidth
              margin="normal"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Home color="action" />
                  </InputAdornment>
                ),
              }}
              required
            />

            <TextField
              label="Préférences spéciales"
              name="preferences"
              value={formData.preferences}
              onChange={handleChange}
              fullWidth
              margin="normal"
              multiline
              rows={3}
              placeholder="Ex: Allergies, besoins particuliers, etc."
            />

            <Paper elevation={0} sx={{ p: 2, mt: 3, backgroundColor: theme.palette.grey[100], borderRadius: 2 }}>
              <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <Star color="primary" sx={{ mr: 1 }} /> Récapitulatif
              </Typography>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Prix par nuit:</Typography>
                <Typography variant="body2">{logement.prixParNuit}€</Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Nombre de nuits:</Typography>
                <Typography variant="body2">{formData.nombreNuits || 0}</Typography>
              </Box>
              
              <Divider sx={{ my: 1 }} />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="subtitle1">Total:</Typography>
                <Typography variant="subtitle1" fontWeight="bold">
                  {formData.montantTotal}€
                </Typography>
              </Box>
            </Paper>
          </Box>
        )}

        {activeStep === 1 && clientSecret && (
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <CheckoutForm
              clientSecret={clientSecret}
              onSuccess={handlePaymentSuccess}
              onError={(err) => setError(err.message)}
              amount={formData.montantTotal}
            />
          </Elements>
        )}
      </DialogContent>

      {activeStep === 0 && (
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={onClose} color="secondary" sx={{ mr: 2 }}>
            Annuler
          </Button>
          <Button
            onClick={handleSubmitReservation}
            variant="contained"
            color="primary"
            disabled={!formData.dateArrivee || !formData.dateDepart || loading}
          >
            {loading ? 'Validation...' : 'Continuer vers le paiement'}
          </Button>
        </DialogActions>
      )}

      {activeStep === 1 && (
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleBack} color="secondary">
            Retour
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
};

export default Reserver;