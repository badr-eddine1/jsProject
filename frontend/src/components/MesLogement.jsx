import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  Alert,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Box,
  CircularProgress,
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  InputAdornment,
} from '@mui/material';
import {
  AccountCircle,
  Logout,
  Home,
  Apartment,
  Edit,
  Delete,
  Add,
  Search,
  DateRange,
  LocationOn,
  Close,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useMediaQuery, useTheme } from '@mui/material';

import Navbar from './navbar'; // Assure-toi que le chemin est bon
import AddLogementDialog from '../components/AddLogementDialog'; // Chemin à adapter

const MesLogements = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();

  const [logements, setLogements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // État pour ouvrir la modal d'ajout logement
  const [openAddLogement, setOpenAddLogement] = useState(false);

  // États pour édition logement
  const [openEdit, setOpenEdit] = useState(false);
  const [currentLogement, setCurrentLogement] = useState(null);
  const [editFormData, setEditFormData] = useState({
    titre: '',
    description: '',
    prixParNuit: '',
    image: '',
    ville: '',
    pays: '',
    dateArrivee: '',
    dateDepart: '',
  });

  const fetchMesLogements = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Vous devez être connecté.');

      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      const res = await axios.get('http://localhost:5000/api/logements/mes-logements', config);
      setLogements(res.data);
    } catch (err) {
      setMessage({ text: err.response?.data?.message || err.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMesLogements();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Voulez-vous vraiment supprimer ce logement ?')) return;

    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      await axios.delete(`http://localhost:5000/api/logements/${id}`, config);
      setMessage({ text: 'Logement supprimé avec succès.', type: 'success' });
      setLogements(logements.filter((logement) => logement._id !== id));
    } catch {
      setMessage({ text: 'Erreur lors de la suppression.', type: 'error' });
    }
  };

  const openEditModal = (logement) => {
    setCurrentLogement(logement);
    setEditFormData({
      titre: logement.titre,
      description: logement.description,
      prixParNuit: logement.prixParNuit,
      image: logement.image,
      ville: logement.ville,
      pays: logement.pays,
      dateArrivee: logement.dateArrivee ? logement.dateArrivee.substring(0, 10) : '',
      dateDepart: logement.dateDepart ? logement.dateDepart.substring(0, 10) : '',
    });
    setOpenEdit(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const res = await axios.put(
        `http://localhost:5000/api/logements/${currentLogement._id}`,
        editFormData,
        config
      );

      setLogements(logements.map((l) => (l._id === currentLogement._id ? res.data.logement : l)));
      setMessage({ text: 'Logement mis à jour avec succès.', type: 'success' });
      setOpenEdit(false);
    } catch {
      setMessage({ text: 'Erreur lors de la mise à jour.', type: 'error' });
    }
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('fullName');
    navigate('/loginForm');
  };

  const filteredLogements = logements.filter(
    (logement) =>
      logement.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      logement.ville.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading)
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress size={60} />
      </Box>
    );

  return (
    <>
         <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={() => navigate('/home')}
          >
            <Home />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Mes Logements
          </Typography>
          
          {/* Barre de recherche */}
          <Paper sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            px: 1, 
            mr: 2,
            borderRadius: 2,
            bgcolor: 'background.paper'
          }}>
            <InputAdornment position="start">
              <Search color="action" />
            </InputAdornment>
            <TextField
              placeholder="Rechercher..."
              variant="standard"
              size="small"
              InputProps={{ disableUnderline: true }}
              sx={{ width: 150 }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Paper>

          {/* Menu utilisateur */}
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            color="inherit"
          >
            <AccountCircle />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={() => navigate('/profile')}>Mon profil</MenuItem>
            <MenuItem onClick={handleLogout}>
              <Logout sx={{ mr: 1 }} /> Déconnexion
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Box sx={{ p: 2 }}>
        {message.text && (
          <Alert
            severity={message.type}
            onClose={() => setMessage({ text: '', type: '' })}
            sx={{ mb: 3 }}
          >
            {message.text}
          </Alert>
        )}

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            mb: 4,
            flexDirection: isMobile ? 'column' : 'row',
            gap: 2,
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
            <Apartment sx={{ verticalAlign: 'middle', mr: 1 }} />
            Mes Logements
          </Typography>

          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setOpenAddLogement(true)}
            sx={{ bgcolor: 'primary.main', '&:hover': { bgcolor: 'primary.dark' } }}
          >
            Ajouter un logement
          </Button>
        </Box>

        {/* Modal Ajout Logement */}
        <AddLogementDialog
          open={openAddLogement}
          onClose={() => setOpenAddLogement(false)}
          onSuccess={() => {
            setOpenAddLogement(false);
            fetchMesLogements();
            setMessage({ text: 'Logement ajouté avec succès.', type: 'success' });
          }}
        />

        {filteredLogements.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary">
              {searchTerm
                ? 'Aucun logement ne correspond à votre recherche'
                : "Vous n'avez aucun logement enregistré"}
            </Typography>
            {searchTerm && (
              <Button variant="outlined" sx={{ mt: 2 }} onClick={() => setSearchTerm('')}>
                Réinitialiser la recherche
              </Button>
            )}
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {filteredLogements.map((logement) => (
              <Grid key={logement._id} item xs={12} sm={6} md={4} lg={3}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.3s',
                    '&:hover': { transform: 'scale(1.02)' },
                  }}
                >
                  <CardMedia
                    component="img"
                    height="180"
                    image={logement.image || 'https://source.unsplash.com/random/800x600?house'}
                    alt={logement.titre}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h6" component="div">
                      {logement.titre}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <LocationOn color="action" sx={{ mr: 0.5, fontSize: '1rem' }} />
                      <Typography variant="body2" color="text.secondary">
                        {logement.ville}, {logement.pays}
                      </Typography>
                    </Box>
                    <Typography variant="h6" color="primary" sx={{ mb: 1 }}>
                      {logement.prixParNuit} MAD
                      <Typography component="span" variant="body2" color="text.secondary">
                        /nuit
                      </Typography>
                    </Typography>
                    {logement.dateArrivee && (
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                        <DateRange color="action" sx={{ mr: 0.5, fontSize: '1rem' }} />
                        <Typography variant="body2">
                          {new Date(logement.dateArrivee).toLocaleDateString()} -{' '}
                          {new Date(logement.dateDepart).toLocaleDateString()}
                        </Typography>
                      </Box>
                    )}
                  </CardContent>
                  <CardActions sx={{ justifyContent: 'space-between', p: 2 }}>
                    <Button
                      size="small"
                      color="primary"
                      startIcon={<Edit />}
                      onClick={() => openEditModal(logement)}
                    >
                      Modifier
                    </Button>
                    <Button
                      size="small"
                      color="error"
                      startIcon={<Delete />}
                      onClick={() => handleDelete(logement._id)}
                    >
                      Supprimer
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Modal d'édition */}
        <Dialog open={openEdit} onClose={() => setOpenEdit(false)} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white' }}>Modifier le logement</DialogTitle>
          <DialogContent sx={{ pt: 3 }}>
            {editFormData.image && (
              <Box sx={{ mb: 2, textAlign: 'center' }}>
                <img
                  src={editFormData.image}
                  alt="Aperçu de l'image"
                  style={{ maxWidth: '100%', maxHeight: 200, borderRadius: 8 }}
                />
              </Box>
            )}

            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Titre"
                  name="titre"
                  fullWidth
                  margin="normal"
                  value={editFormData.titre}
                  onChange={handleEditChange}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Prix par nuit (MAD)"
                  name="prixParNuit"
                  type="number"
                  fullWidth
                  margin="normal"
                  value={editFormData.prixParNuit}
                  onChange={handleEditChange}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Ville"
                  name="ville"
                  fullWidth
                  margin="normal"
                  value={editFormData.ville}
                  onChange={handleEditChange}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Pays"
                  name="pays"
                  fullWidth
                  margin="normal"
                  value={editFormData.pays}
                  onChange={handleEditChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Description"
                  name="description"
                  fullWidth
                  multiline
                  rows={3}
                  margin="normal"
                  value={editFormData.description}
                  onChange={handleEditChange}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Image URL"
                  name="image"
                  fullWidth
                  margin="normal"
                  value={editFormData.image}
                  onChange={handleEditChange}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <TextField
                    label="Date d'arrivée"
                    name="dateArrivee"
                    type="date"
                    fullWidth
                    margin="normal"
                    InputLabelProps={{ shrink: true }}
                    value={editFormData.dateArrivee}
                    onChange={handleEditChange}
                  />
                  <TextField
                    label="Date de départ"
                    name="dateDepart"
                    type="date"
                    fullWidth
                    margin="normal"
                    InputLabelProps={{ shrink: true }}
                    value={editFormData.dateDepart}
                    onChange={handleEditChange}
                  />
                </Box>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenEdit(false)}>Annuler</Button>
            <Button
              variant="contained"
              onClick={handleEditSubmit}
              sx={{ bgcolor: 'primary.main', '&:hover': { bgcolor: 'primary.dark' } }}
            >
              Enregistrer
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </>
  );
};

export default MesLogements;
