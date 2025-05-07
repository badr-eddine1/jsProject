import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Container,
  Grid,
  Typography,
  Alert,
  Button,
  Box
} from '@mui/material';
import Navbar from './Navbar';
import LogementCard from '../components/LogementCard';
import AddLogementDialog from '../components/AddLogementDialog';
import Reserver from '../components/Reserver';

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
  const [openReservation, setOpenReservation] = useState(false);
  const [logementSelectionne, setLogementSelectionne] = useState(null);

  const availableCities = ['Casablanca', 'Marrakech', 'Rabat', 'Agadir'];

  useEffect(() => {
    fetchLogements();
  }, []);

  // Fonction pour récupérer les logements depuis l'API
  const fetchLogements = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/logements');
      console.log(res.data);  // Vérifie si les données sont récupérées correctement
      setLogements(res.data);
    } catch (err) {
      console.error('Erreur:', err);
      setMessage({ text: 'Erreur lors de la récupération des logements.', type: 'error' });
    }
  };

  // Gestion des changements dans les champs du formulaire
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Fonction pour ajouter un logement
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

  // Fonction pour supprimer un logement
  const handleDeleteLogement = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/logements/${id}`);
      fetchLogements();
    } catch (err) {
      console.error('Erreur suppression logement:', err);
      setMessage({ text: "Erreur lors de la suppression du logement.", type: 'error' });
    }
  };

  // Fonction pour ouvrir le modal de réservation
  const handleReservation = (logement) => {
    setLogementSelectionne(logement);
    setOpenReservation(true);
  };

  // Fonction de succès de la réservation
  const handleReservationSuccess = () => {
    fetchLogements();
    setMessage({ text: 'Réservation réussie !', type: 'success' });
    setOpenReservation(false); // Fermer la fenêtre de réservation
  };

  // Filtrer les logements selon la ville sélectionnée
  const logementsToDisplay = selectedCity
    ? logements.filter((logement) => logement.ville === selectedCity)
    : logements;

  // Effacer le message d'erreur après 3 secondes
  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => {
        setMessage({ text: '', type: '' });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <>
      {message.text && (
        <Alert
          severity={message.type}
          sx={{
            position: 'fixed',
            top: 16,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '80%',
            zIndex: 1200,
          }}
        >
          {message.text}
        </Alert>
      )}

      <Navbar
        handleClick={(e) => setAnchorEl(e.currentTarget)}
        anchorEl={anchorEl}
        handleClose={() => setAnchorEl(null)}
        availableCities={availableCities}
        handleCitySelect={(city) => {
          setSelectedCity(city);
          setAnchorEl(null);
        }}
        selectedCity={selectedCity}
        handleLogout={() => console.log("Déconnexion...")}
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
                <Box sx={{ mt: 1 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={() => handleReservation(logement)}
                  >
                    Réserver
                  </Button>
                </Box>
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

      {logementSelectionne && (
        <Reserver
          open={openReservation}
          onClose={() => setOpenReservation(false)}
          logement={logementSelectionne}
          handleReservationSuccess={handleReservationSuccess}
        />
      )}
    </>
  );
};

export default Home;
