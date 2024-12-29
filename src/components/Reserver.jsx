import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Grid, Card, CardContent, Alert } from '@mui/material';

const PaymentForm = () => {
  const [paymentInfo, setPaymentInfo] = useState({
    cardName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });

  const [successMessage, setSuccessMessage] = useState(''); // État pour le message de succès

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPaymentInfo({ ...paymentInfo, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccessMessage('Paiement réussi ! Merci pour votre réservation.'); // Affiche le message de succès
    setPaymentInfo({
      cardName: '',
      cardNumber: '',
      expiryDate: '',
      cvv: '',
    });

    // Masquer le message après quelques secondes (optionnel)
    setTimeout(() => {
      setSuccessMessage('');
    }, 5000);
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 20 }}>
      <Card sx={{ width: '100%', maxWidth: 1000, boxShadow: 3 }}>
        <CardContent>
          {/* Affichage du message de succès */}
          {successMessage && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {successMessage}
            </Alert>
          )}

          <Typography variant="h4" component="h1" gutterBottom align="center">
            Paiement 
          </Typography>
          <Typography variant="body1" color="textSecondary" align="center" gutterBottom>
            Entrez vos informations de paiement pour compléter votre réservation.
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Nom sur la carte"
                  name="cardName"
                  value={paymentInfo.cardName}
                  onChange={handleChange}
                  fullWidth
                  required
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Numéro de carte"
                  name="cardNumber"
                  value={paymentInfo.cardNumber}
                  onChange={handleChange}
                  fullWidth
                  required
                  margin="normal"
                  type="text"
                  inputProps={{ maxLength: 16 }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Date d'expiration"
                  name="expiryDate"
                  value={paymentInfo.expiryDate}
                  onChange={handleChange}
                  fullWidth
                  required
                  margin="normal"
                  placeholder="MM/AA"
                  type="text"
                  inputProps={{ maxLength: 5 }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="CVV"
                  name="cvv"
                  value={paymentInfo.cvv}
                  onChange={handleChange}
                  fullWidth
                  required
                  margin="normal"
                  type="password"
                  inputProps={{ maxLength: 3 }}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  fullWidth
                  sx={{ mt: 2 }}
                >
                  Confirmer le Paiement
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default PaymentForm;

