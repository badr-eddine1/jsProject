import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import MenuIcon from '@mui/icons-material/Menu';
import { Link } from 'react-scroll'; // Pour le scroll
import { Link as RouterLink } from 'react-router-dom'; // Pour la navigation React Router

const Navbar = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const navItems = ['Accueil', 'Chambres', 'A propos', 'Contact'];

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ backgroundColor: '#1976d2' }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 0.5 }}>
            BMBI
          </Typography>

          {/* Desktop Navbar */}
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            {navItems.map((item) => (
              <Button
                key={item}
                sx={{ color: '#fff', textTransform: 'none', marginRight: 2 }}
                component={Link} // Pour le scroll
                to={item.toLowerCase()} // Nom de la section sur la page
                smooth={true}
                duration={1000}
              >
                {item}
              </Button>
            ))}
          </Box>

          {/* Connexion button for desktop */}
          <Button
            variant="outlined"
            color="inherit"
            sx={{ display: { xs: 'none', md: 'block' }, borderColor: '#fff' }}
            component={RouterLink} // Utilisez RouterLink pour la navigation
            to="/LoginForm"
          >
            Connexion
          </Button>

          {/* Mobile Navbar */}
          <Box sx={{ display: { xs: 'block', md: 'none' } }}>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              onClick={handleMenuOpen}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              {navItems.map((item) => (
                <MenuItem
                  key={item}
                  onClick={handleMenuClose}
                  component={Link} // Pour le scroll
                  to={item.toLowerCase()} // Nom de la section
                  smooth={true}
                  duration={1000}
                >
                  {item}
                </MenuItem>
              ))}
              <MenuItem onClick={handleMenuClose} component={RouterLink} to="/LoginForm">
                Connexion
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Navbar;
