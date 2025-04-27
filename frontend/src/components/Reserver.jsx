import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, Typography } from '@mui/material';
import axios from 'axios';

const Reserver = ({ open, onClose, logement, handleReservationSuccess }) => {
  const [dates, setDates] = useState({ dateArrivee: '', dateDepart: '' });
  const [nombrePersonnes, setNombrePersonnes] = useState(1);
  const [telephone, setTelephone] = useState('');
  const [adresse, setAdresse] = useState('');
  const [preferences, setPreferences] = useState({ litDouble: false, vueMer: false });

  // États pour le paiement
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    cardHolderName: '',
    expiryDate: '',
    cvv: ''
  });

  const [showPaymentForm, setShowPaymentForm] = useState(false); // Nouveau state pour afficher la section de paiement

  // Gestion des changements dans les champs de saisie
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'dateArrivee' || name === 'dateDepart') {
      setDates((prev) => ({ ...prev, [name]: value }));
    } else if (name === 'cardNumber' || name === 'cardHolderName' || name === 'expiryDate' || name === 'cvv') {
      setCardDetails((prev) => ({ ...prev, [name]: value }));
    } else if (name === 'telephone') {
      setTelephone(value);
    } else if (name === 'adresse') {
      setAdresse(value);
    } else {
      setNombrePersonnes(value);
    }
  };

  const handleReserver = () => {
    if (!dates.dateArrivee || !dates.dateDepart || !telephone || !adresse) {
      alert("Veuillez remplir toutes les informations.");
      return;
    }

    // Passer à la section de paiement une fois la réservation de base confirmée
    setShowPaymentForm(true);
  };

  const handleFinaliserReservation = async () => {
    if (!cardDetails.cardNumber || !cardDetails.cardHolderName || !cardDetails.expiryDate || !cardDetails.cvv) {
      alert("Veuillez compléter les informations de paiement.");
      return;
    }

    try {
      const reservationData = {
        logementId: logement._id,
        dateArrivee: dates.dateArrivee,
        dateDepart: dates.dateDepart,
        nombrePersonnes,
        telephone,
        adresse,
        preferences,
        paiement: {
          cardNumber: cardDetails.cardNumber,
          cardHolderName: cardDetails.cardHolderName,
          expiryDate: cardDetails.expiryDate,
          cvv: cardDetails.cvv
        }
      };

      // Envoie des données de réservation au backend
      await axios.post('http://localhost:5000/api/reservations', reservationData);
      handleReservationSuccess();  // Appel de la fonction de succès
      onClose();  // Ferme la boîte de dialogue après réservation réussie
    } catch (error) {
      console.error('Erreur lors de la réservation:', error);
      alert('Erreur lors de la réservation. Veuillez réessayer.');
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Réserver un logement</DialogTitle>
      <DialogContent>
        <Typography variant="body1" gutterBottom>
          Vous réservez le logement: {logement.titre}
        </Typography>
        
        <TextField
          label="Date d'arrivée"
          type="date"
          name="dateArrivee"
          fullWidth
          value={dates.dateArrivee}
          onChange={handleChange}
          InputLabelProps={{
            shrink: true,
          }}
          sx={{ mb: 2 }}
        />
        
        <TextField
          label="Date de départ"
          type="date"
          name="dateDepart"
          fullWidth
          value={dates.dateDepart}
          onChange={handleChange}
          InputLabelProps={{
            shrink: true,
          }}
          sx={{ mb: 2 }}
        />
        
        <TextField
          label="Nombre de personnes"
          type="number"
          name="nombrePersonnes"
          fullWidth
          value={nombrePersonnes}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />
        
        <TextField
          label="Numéro de téléphone"
          type="text"
          name="telephone"
          fullWidth
          value={telephone}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />

        <TextField
          label="Adresse"
          type="text"
          name="adresse"
          fullWidth
          value={adresse}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />
        
        {showPaymentForm && (
          <>
            <Typography variant="h6" sx={{ mt: 2 }}>
              Détails du paiement
            </Typography>

            <TextField
              label="Numéro de carte"
              type="text"
              name="cardNumber"
              fullWidth
              value={cardDetails.cardNumber}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />
            
            <TextField
              label="Nom du titulaire"
              type="text"
              name="cardHolderName"
              fullWidth
              value={cardDetails.cardHolderName}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />

            <TextField
              label="Date d'expiration"
              type="month"
              name="expiryDate"
              fullWidth
              value={cardDetails.expiryDate}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />
            
            <TextField
              label="CVV"
              type="text"
              name="cvv"
              fullWidth
              value={cardDetails.cvv}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />
          </>
        )}
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose} color="secondary">Annuler</Button>
        {!showPaymentForm ? (
          <Button onClick={handleReserver} color="primary">Passer au paiement</Button>
        ) : (
          <Button onClick={handleFinaliserReservation} color="primary">Finaliser la réservation</Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default Reserver;
