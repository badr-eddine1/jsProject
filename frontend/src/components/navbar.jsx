import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Menu, MenuItem, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ handleClick, anchorEl, handleClose, availableCities, handleCitySelect, selectedCity, setOpen }) => {
  const [user, setUser] = useState(null);  // État pour stocker les informations de l'utilisateur
  const navigate = useNavigate();
  const [profileAnchorEl, setProfileAnchorEl] = useState(null);

  // Fonction pour récupérer les informations de l'utilisateur
  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');  // Récupérer le token depuis le stockage local
      if (!token) {
        console.log('Token non trouvé');
        return;
      }

      const response = await fetch('http://localhost:5000/api/users/me', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`, // Ajouter le token dans les en-têtes de la requête
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData); // Mettre à jour l'état avec les données de l'utilisateur
      } else {
        console.log('Utilisateur non trouvé');
      }
    } catch (err) {
      console.error('Erreur lors de la récupération des données utilisateur', err);
    }
  };

  // Utilise useEffect pour récupérer les données dès que le composant est monté
  useEffect(() => {
    fetchUserData();
  }, []);

  const handleLogout = () => {
    console.log("Déconnexion...");
    localStorage.removeItem('token');  // Retirer le token du stockage local
    navigate('/loginForm');
  };

  const handleAbout = () => {
    navigate('/');
  };

  const handleProfileClick = (event) => {
    setProfileAnchorEl(event.currentTarget);
  };

  const handleProfileClose = () => {
    setProfileAnchorEl(null);
  };

  return (
    <AppBar position="sticky" color="primary">
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        {/* Left side: Logo */}
        <Typography variant="h6" color="inherit">
          BIBM
        </Typography>

        {/* Center: About + Choisir destination + Ajouter un logement */}
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1, justifyContent: 'center' }}>
          <Button color="inherit" onClick={handleAbout} sx={{ marginRight: 2 }}>
            About
          </Button>

          <Button color="inherit" onClick={handleClick} sx={{ marginRight: 2 }}>
            {selectedCity ? `Destination : ${selectedCity}` : 'Choisir une destination'}
          </Button>

          <Button color="inherit" startIcon={<AddIcon />} onClick={() => setOpen(true)}>
            Ajouter un logement
          </Button>
        </Box>

        {/* Right side: Profil + Nom utilisateur */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="body1" sx={{ marginRight: 1 }}>
            Bonjour, {user?.fullName || 'Utilisateur'}
          </Typography>

          <IconButton color="inherit" onClick={handleProfileClick}>
            <AccountCircleIcon />
          </IconButton>
        </Box>

        {/* Menus */}
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
          {availableCities.map((city, index) => (
            <MenuItem key={index} onClick={() => handleCitySelect(city)}>
              {city}
            </MenuItem>
          ))}
        </Menu>

        <Menu anchorEl={profileAnchorEl} open={Boolean(profileAnchorEl)} onClose={handleProfileClose}>
          <MenuItem disabled>Connecté en tant que : {user?.fullName || 'Utilisateur'}</MenuItem>
          <MenuItem onClick={handleLogout}>
            <ExitToAppIcon fontSize="small" sx={{ marginRight: 1 }} />
            Se déconnecter
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
