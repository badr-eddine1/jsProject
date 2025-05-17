import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Menu,
  MenuItem,
  IconButton
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useNavigate } from 'react-router-dom';

const Navbar = ({
  handleClick,
  anchorEl,
  handleClose,
  availableCities = [],
  handleCitySelect,
  selectedCity,
  onAddClick // Prop corrigée pour ouvrir modal ajout logement
}) => {
  const [user, setUser] = useState(null);
  const [profileAnchorEl, setProfileAnchorEl] = useState(null);
  const navigate = useNavigate();

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        const storedName = localStorage.getItem('fullName');
        if (storedName) setUser({ fullName: storedName });
        return;
      }

      const response = await fetch('http://localhost:5000/api/users/me', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        localStorage.setItem('fullName', userData.fullName);
        localStorage.setItem('role', userData.role || 'user');
      } else {
        const storedName = localStorage.getItem('fullName');
        if (storedName) setUser({ fullName: storedName });
      }
    } catch (err) {
      const storedName = localStorage.getItem('fullName');
      if (storedName) setUser({ fullName: storedName });
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('fullName');
    localStorage.removeItem('role');
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

  const goToProfile = () => {
    setProfileAnchorEl(null);
    navigate('/profile');
  };

  return (
    <AppBar position="sticky" color="primary">
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        {/* Logo */}
        <Typography variant="h6" color="inherit">
          BIBM
        </Typography>

        {/* Centre : About + Choisir destination + Ajouter logement + Mes logements */}
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1, justifyContent: 'center' }}>
          <Button color="inherit" onClick={handleAbout} sx={{ marginRight: 2 }}>
            About
          </Button>

          <Button color="inherit" onClick={handleClick} sx={{ marginRight: 2 }}>
            {selectedCity ? `Destination : ${selectedCity}` : 'Choisir une destination'}
          </Button>

          <Button
            color="inherit"
            startIcon={<AddIcon />}
            onClick={onAddClick}  
            sx={{ marginRight: 2 }}
          >
            Ajouter un logement
          </Button>

          <Button
            color="inherit"
            onClick={() => navigate('/mes-logements')}
            sx={{ marginRight: 2 }}
          >
            Mes Logements
          </Button>
        </Box>

        {/* Profil utilisateur */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="body1" sx={{ marginRight: 1 }}>
            Bonjour, {user?.fullName || 'Utilisateur'}
          </Typography>

          <IconButton color="inherit" onClick={handleProfileClick}>
            <AccountCircleIcon />
          </IconButton>
        </Box>

        {/* Menu sélection ville */}
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
          {availableCities.map((city, index) => (
            <MenuItem key={index} onClick={() => handleCitySelect(city)}>
              {city}
            </MenuItem>
          ))}
        </Menu>

        {/* Menu Profil */}
        <Menu anchorEl={profileAnchorEl} open={Boolean(profileAnchorEl)} onClose={handleProfileClose}>
          <MenuItem disabled>Connecté en tant que : {user?.fullName || 'Utilisateur'}</MenuItem>
          <MenuItem onClick={goToProfile}>
            <AccountCircleIcon fontSize="small" sx={{ marginRight: 1 }} />
            Profil
          </MenuItem>
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
