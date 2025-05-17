import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Menu,
  MenuItem,
  IconButton,
  Avatar,
  Badge,
  Divider,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  useTheme,
  Paper
} from '@mui/material';
import {
  Add as AddIcon,
  ExitToApp as ExitToAppIcon,
  AccountCircle as AccountCircleIcon,
  Home as HomeIcon,
  LocationOn as LocationIcon,
  Apartment as ApartmentIcon,
  Info as InfoIcon,
  Notifications as NotificationsIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Navbar = ({
  handleClick,
  anchorEl,
  handleClose,
  availableCities = [],
  handleCitySelect,
  selectedCity,
  onAddClick,
  notificationCount = 0
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [user, setUser] = useState(null);
  const [profileAnchorEl, setProfileAnchorEl] = useState(null);
  const [notificationsAnchorEl, setNotificationsAnchorEl] = useState(null);
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
        localStorage.setItem('email', userData.email);
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
    localStorage.removeItem('email');
    navigate('/loginForm');
    handleProfileClose();
  };

  const handleHomeClick = () => {
    navigate('/');
  };

  const handleProfileClick = (event) => {
    setProfileAnchorEl(event.currentTarget);
  };

  const handleProfileClose = () => {
    setProfileAnchorEl(null);
  };

  const handleNotificationsClick = (event) => {
    setNotificationsAnchorEl(event.currentTarget);
  };

  const handleNotificationsClose = () => {
    setNotificationsAnchorEl(null);
  };

  const goToProfile = () => {
    handleProfileClose();
    navigate('/profile');
  };

  const goToMyListings = () => {
    navigate('/mes-logements');
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    const names = name.split(' ');
    return names.map(n => n[0]).join('').toUpperCase();
  };

  return (
    <AppBar 
      position="sticky" 
      color="default"
      sx={{ 
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[1],
        borderBottom: `1px solid ${theme.palette.divider}`
      }}
    >
      <Toolbar sx={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        px: { xs: 2, md: 4 }
      }}>
        {/* Logo et partie gauche */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              onClick={handleHomeClick}
              sx={{ 
                textTransform: 'none',
                color: theme.palette.text.primary,
                mr: 2
              }}
            >
              <Typography 
                variant="h6" 
                component="div"
                sx={{ 
                  fontWeight: 'bold',
                  background: theme.palette.mode === 'dark' 
                    ? 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)' 
                    : 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                BIBM
              </Typography>
            </Button>
          </motion.div>

          {!isMobile && (
            <Button 
              color="inherit" 
              onClick={handleHomeClick}
              startIcon={<HomeIcon />}
              sx={{ 
                color: theme.palette.text.secondary,
                '&:hover': {
                  color: theme.palette.primary.main
                }
              }}
            >
              Accueil
            </Button>
          )}
        </Box>

        {/* Centre : Navigation principale */}
        {!isMobile && (
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center',
            gap: 1
          }}>
            

            {user && (
              <>
                <Button
                  color="inherit"
                  startIcon={<AddIcon />}
                  onClick={onAddClick}
                  sx={{ 
                    color: theme.palette.text.secondary,
                    '&:hover': {
                      backgroundColor: theme.palette.action.hover
                    }
                  }}
                >
                  Ajouter
                </Button>

                <Button
                  color="inherit"
                  startIcon={<ApartmentIcon />}
                  onClick={goToMyListings}
                  sx={{ 
                    color: theme.palette.text.secondary,
                    '&:hover': {
                      backgroundColor: theme.palette.action.hover
                    }
                  }}
                >
                  Mes logements
                </Button>
              </>
            )}
          </Box>
        )}

        {/* Partie droite : Profil utilisateur */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {user ? (
            <>
              <IconButton 
                color="inherit"
                onClick={handleNotificationsClick}
                sx={{ 
                  color: theme.palette.text.secondary,
                  '&:hover': {
                    backgroundColor: theme.palette.action.hover
                  }
                }}
              >
                <Badge badgeContent={notificationCount} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>

              <IconButton 
                onClick={handleProfileClick}
                sx={{ p: 0 }}
              >
                <Avatar 
                  sx={{ 
                    bgcolor: theme.palette.primary.main,
                    width: 36, 
                    height: 36,
                    fontSize: 14
                  }}
                >
                  {getInitials(user.fullName)}
                </Avatar>
              </IconButton>
            </>
          ) : (
            <>
              <Button 
                color="inherit"
                onClick={() => navigate('/loginForm')}
                sx={{ 
                  color: theme.palette.text.secondary,
                  '&:hover': {
                    backgroundColor: theme.palette.action.hover
                  }
                }}
              >
                Connexion
              </Button>
              <Button 
                variant="contained"
                color="primary"
                onClick={() => navigate('/signupForm')}
                sx={{ 
                  ml: 1,
                  boxShadow: 'none',
                  '&:hover': {
                    boxShadow: theme.shadows[2]
                  }
                }}
              >
                Inscription
              </Button>
            </>
          )}
        </Box>

        {/* Menu sélection ville */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          PaperProps={{
            sx: {
              width: 200,
              maxHeight: 300,
              mt: 1
            }
          }}
        >
          <Typography variant="subtitle2" sx={{ px: 2, py: 1, fontWeight: 'bold' }}>
            Choisir une destination
          </Typography>
          <Divider />
          {availableCities.map((city, index) => (
            <MenuItem 
              key={index} 
              onClick={() => handleCitySelect(city)}
              selected={selectedCity === city}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: theme.palette.action.selected
                }
              }}
            >
              <ListItemIcon>
                <LocationIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary={city} />
            </MenuItem>
          ))}
        </Menu>

        {/* Menu Notifications */}
        <Menu
          anchorEl={notificationsAnchorEl}
          open={Boolean(notificationsAnchorEl)}
          onClose={handleNotificationsClose}
          PaperProps={{
            sx: {
              width: 320,
              maxHeight: 400,
              mt: 1
            }
          }}
        >
          <Typography variant="subtitle2" sx={{ px: 2, py: 1, fontWeight: 'bold' }}>
            Notifications ({notificationCount})
          </Typography>
          <Divider />
          {notificationCount > 0 ? (
            <Box sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="body2">Vous avez {notificationCount} nouvelles notifications</Typography>
            </Box>
          ) : (
            <Box sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="body2">Aucune nouvelle notification</Typography>
            </Box>
          )}
        </Menu>

        {/* Menu Profil */}
        <Menu
          anchorEl={profileAnchorEl}
          open={Boolean(profileAnchorEl)}
          onClose={handleProfileClose}
          PaperProps={{
            sx: {
              width: 240,
              mt: 1
            }
          }}
        >
          <Box sx={{ px: 2, py: 1 }}>
            <Typography variant="subtitle2" fontWeight="bold">
              {user?.fullName || 'Utilisateur'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {localStorage.getItem('email') || ''}
            </Typography>
          </Box>
          <Divider />
          <MenuItem onClick={goToProfile}>
            <ListItemIcon>
              <AccountCircleIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Mon profil</ListItemText>
          </MenuItem>
          <MenuItem onClick={goToMyListings}>
            <ListItemIcon>
              <ApartmentIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Mes logements</ListItemText>
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleLogout}>
            <ListItemIcon>
              <ExitToAppIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Déconnexion</ListItemText>
          </MenuItem>
        </Menu>
      </Toolbar>

      {/* Menu mobile */}
      {isMobile && (
        <Paper 
          elevation={0} 
          sx={{ 
            display: 'flex', 
            justifyContent: 'space-around', 
            p: 1,
            borderTop: `1px solid ${theme.palette.divider}`
          }}
        >
          <IconButton onClick={handleHomeClick}>
            <HomeIcon />
          </IconButton>
          <IconButton onClick={handleClick}>
            <LocationIcon color={selectedCity ? 'primary' : 'inherit'} />
          </IconButton>
          {user && (
            <>
              <IconButton onClick={onAddClick}>
                <AddIcon />
              </IconButton>
              <IconButton onClick={goToMyListings}>
                <ApartmentIcon />
              </IconButton>
            </>
          )}
        </Paper>
      )}
    </AppBar>
  );
};

export default Navbar;