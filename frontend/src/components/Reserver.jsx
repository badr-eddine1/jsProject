import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Alert, Typography, Paper } from '@mui/material';

const Reserver = ({ open, onClose, logement }) => {
  const [formData, setFormData] = useState({
    logementId: logement._id,
    userId: '6638762e419d8f6cf58c33d0', 
    dateArrivee: '',
    dateDepart: '',
    nombrePersonnes: 1,
    telephone: '',
    adresse: '',
    preferences: '',
    montantTotal: logement.prixParNuit || 0
  });

  const [error, setError] = useState('');
  const [reservationSuccess, setReservationSuccess] = useState(false);
  const [showInvoice, setShowInvoice] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    // Simuler la réservation réussie
    setReservationSuccess(true);
    setShowInvoice(true);
  };

  const handlePaymentSubmit = () => {
    // Simuler le paiement
    alert('Paiement effectué avec succès !');
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Réserver {logement.titre}</DialogTitle>
      <DialogContent>
        {error && <Alert severity="error">{error}</Alert>}

        {reservationSuccess && !showInvoice && (
          <Alert severity="success">Réservation effectuée avec succès !</Alert>
        )}

        {!showInvoice ? (
          <>
            <TextField
              label="Date d'arrivée"
              type="date"
              name="dateArrivee"
              value={formData.dateArrivee}
              onChange={handleChange}
              fullWidth
              margin="normal"
              InputLabelProps={{ shrink: true }}
              required
            />

            <TextField
              label="Date de départ"
              type="date"
              name="dateDepart"
              value={formData.dateDepart}
              onChange={handleChange}
              fullWidth
              margin="normal"
              InputLabelProps={{ shrink: true }}
              required
            />

            <TextField
              label="Nombre de personnes"
              type="number"
              name="nombrePersonnes"
              value={formData.nombrePersonnes}
              onChange={handleChange}
              fullWidth
              margin="normal"
              inputProps={{ min: 1 }}
              required
            />

            <TextField
              label="Téléphone"
              name="telephone"
              value={formData.telephone}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />

            <TextField
              label="Adresse"
              name="adresse"
              value={formData.adresse}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />

            <TextField
              label="Préférences (JSON facultatif)"
              name="preferences"
              value={formData.preferences}
              onChange={handleChange}
              fullWidth
              margin="normal"
              placeholder='{"vue":"mer"}'
            />

            <TextField
              label="Montant total"
              type="number"
              name="montantTotal"
              value={formData.montantTotal}
              onChange={handleChange}
              fullWidth
              margin="normal"
              InputProps={{ readOnly: true }}
            />

            <DialogActions>
              <Button onClick={onClose} color="secondary">Annuler</Button>
              <Button onClick={handleSubmit} variant="contained" color="primary">Réserver</Button>
            </DialogActions>
          </>
        ) : (
          // Affichage de la facture
          <>
            <Paper style={{ padding: '16px', marginBottom: '16px' }}>
              <Typography variant="h6">Facture</Typography>
              <Typography>Date d'arrivée: {formData.dateArrivee}</Typography>
              <Typography>Date de départ: {formData.dateDepart}</Typography>
              <Typography>Nombre de personnes: {formData.nombrePersonnes}</Typography>
              <Typography>Montant total: {formData.montantTotal} €</Typography>
            </Paper>

            {/* Formulaire de paiement */}
            <TextField
              label="Numéro de carte"
              name="cardNumber"
              value={paymentDetails.cardNumber}
              onChange={(e) => setPaymentDetails({ ...paymentDetails, cardNumber: e.target.value })}
              fullWidth
              margin="normal"
              required
            />

            <TextField
              label="Date d'expiration"
              name="expiryDate"
              value={paymentDetails.expiryDate}
              onChange={(e) => setPaymentDetails({ ...paymentDetails, expiryDate: e.target.value })}
              fullWidth
              margin="normal"
              required
            />

            <TextField
              label="CVV"
              name="cvv"
              value={paymentDetails.cvv}
              onChange={(e) => setPaymentDetails({ ...paymentDetails, cvv: e.target.value })}
              fullWidth
              margin="normal"
              required
            />

            <DialogActions>
              <Button onClick={onClose} color="secondary">Annuler</Button>
              <Button onClick={handlePaymentSubmit} variant="contained" color="primary">Payer</Button>
            </DialogActions>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default Reserver;
