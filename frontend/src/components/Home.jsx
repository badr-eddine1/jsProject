import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Grid, Typography, Alert } from '@mui/material';
import Navbar from './Navbar';
import LogementCard from '../components/LogementCard';
import AddLogementDialog from '../components/AddLogementDialog';
import Reserver from '../components/Reserver';  // Ajouter l'import du composant Reserver

const Home = () => {
  
  const [logements, setLogements] = useState([]);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    prixParNuit: '',
    image: '',
    ville: '',
    pays: '',
    utilisateurId: '6638762e419d8f6cf58c33d0',
    dateArrivee: '',
    dateDepart: '',
  });
  const [message, setMessage] = useState({ text: '', type: '' });
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedCity, setSelectedCity] = useState('');
  const [openReservation, setOpenReservation] = useState(false);  // État pour gérer l'affichage du modal de réservation
  const [logementSelectionne, setLogementSelectionne] = useState(null);  // Logement sélectionné pour la réservation

  const availableCities = ['Casablanca', 'Marrakech', 'Rabat', 'Agadir'];

  useEffect(() => {
    fetchLogements();
  }, []);

  const fetchLogements = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/logements');
      setLogements(res.data);
    } catch (err) {
      console.error('Erreur:', err);
      setMessage({ text: 'Erreur lors de la récupération des logements.', type: 'error' });
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleAddLogement = async () => {
    try {
      await axios.post('http://localhost:5000/api/logements', formData);
      setMessage({ text: 'Logement ajouté avec succès!', type: 'success' });
      setOpen(false);
      fetchLogements();
      setFormData({
        titre: '',
        description: '',
        prixParNuit: '',
        image: '',
        ville: '',
        pays: '',
        utilisateurId: '6638762e419d8f6cf58c33d0',
        dateArrivee: '',
        dateDepart: '',
      });
    } catch (err) {
      console.error('Erreur ajout logement:', err);
      setMessage({ text: "Erreur lors de l'ajout du logement.", type: 'error' });
    }
  };

  const handleDeleteLogement = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/logements/${id}`);
      fetchLogements();
    } catch (err) {
      console.error('Erreur suppression logement:', err);
      setMessage({ text: "Erreur lors de la suppression du logement.", type: 'error' });
    }
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCitySelect = (city) => {
    setSelectedCity(city);
    handleClose();
  };

  const handleLogout = () => {
    console.log("Déconnexion...");
    // Rediriger vers la page login ici
  };

  const handleReservation = (logement) => {
    setLogementSelectionne(logement);  // Sélectionner le logement
    setOpenReservation(true);  // Ouvrir la fenêtre modale de réservation
  };

  const logementsToDisplay = selectedCity
    ? logements.filter((logement) => logement.ville === selectedCity)
    : logements;

  return (
    <>
      {message.text && (
        <Alert severity={message.type} sx={{ position: 'absolute', top: 16, left: '50%', transform: 'translateX(-50%)', width: '80%' }}>
          {message.text}
        </Alert>
      )}

      <Navbar
        handleClick={handleClick}
        anchorEl={anchorEl}
        handleClose={handleClose}
        availableCities={availableCities}
        handleCitySelect={handleCitySelect}
        selectedCity={selectedCity}
        handleLogout={handleLogout}
        setOpen={setOpen}
      />

      <Container sx={{ py: 5 }}>
        <Typography variant="h4" gutterBottom>
          Logements disponibles {selectedCity && `à ${selectedCity}`}
        </Typography>

        <Grid container spacing={4}>
          {logementsToDisplay.length === 0 ? (
            <Typography variant="body1" color="text.secondary" sx={{ width: '100%' }}>
              Aucun logement disponible.
            </Typography>
          ) : (
            logementsToDisplay.map((logement) => (
              <Grid item key={logement._id} xs={12} sm={6} md={4}>
                <LogementCard logement={logement} handleDeleteLogement={handleDeleteLogement} />
                <Grid container spacing={1} sx={{ mt: 1 }}>
                  <Grid item xs={6}>
                    <button
                      style={{
                        backgroundColor: '#1976d2',
                        color: 'white',
                        border: 'none',
                        padding: '8px 16px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        width: '100%',
                      }}
                      onClick={() => handleReservation(logement)}  // Passer le logement au modal
                    >
                      Réserver
                    </button>
                  </Grid>
                  <Grid item xs={6}>
                 
                  </Grid>
                </Grid>
              </Grid>
            ))
          )}
        </Grid>
      </Container>

      <AddLogementDialog
        open={open}
        setOpen={setOpen}
        formData={formData}
        handleChange={handleChange}
        handleAddLogement={handleAddLogement}
      />

      {/* Affichage de la fenêtre modale de réservation si un logement est sélectionné */}
      {logementSelectionne && (
        <Reserver
          open={openReservation}
          onClose={() => setOpenReservation(false)}
          logement={logementSelectionne}
        />
      )}
    </>
  );
};

export default Home;
