import { AppBar, Toolbar, Typography, Button, Box, Menu, MenuItem } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { useNavigate } from 'react-router-dom'; // 🔥 important

const Navbar = ({ handleClick, anchorEl, handleClose, availableCities, handleCitySelect, selectedCity, setOpen }) => {
  const navigate = useNavigate(); // 🔥 pour la redirection

  const handleLogout = () => {
    console.log("Déconnexion...");
    navigate('/loginForm'); // 🔥 rediriger vers /login
  };

  return (
    <AppBar position="sticky" color="primary">
      <Toolbar>
        <Typography variant="h6" color="inherit" sx={{ flexGrow: 1 }}>
          BIBM
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'center', flexGrow: 1 }}>
          <Button color="inherit" onClick={handleClick} sx={{ marginRight: 2 }}>
            {selectedCity ? `Destination : ${selectedCity}` : 'Choisir une destination'}
          </Button>

          <Button color="inherit" startIcon={<AddIcon />} onClick={() => setOpen(true)}>
            Ajouter un logement
          </Button>
        </Box>

        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
          {availableCities.map((city, index) => (
            <MenuItem key={index} onClick={() => handleCitySelect(city)}>
              {city}
            </MenuItem>
          ))}
        </Menu>

        <Button color="inherit" startIcon={<ExitToAppIcon />} onClick={handleLogout} sx={{ marginLeft: 2 }}>
          Se déconnecter
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
