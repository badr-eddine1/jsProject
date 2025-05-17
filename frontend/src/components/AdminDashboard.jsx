import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Tabs,
  Tab,
  Box,
  CircularProgress,
  Snackbar,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Avatar,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Badge,
  Card,
  CardContent,
  Grid,
  Divider,
  useMediaQuery,
  InputAdornment,
  FormControl, // Ajouté ici
  InputLabel,  // Ajouté ici
  Select
} from '@mui/material';
import {
  Logout,
  Edit,
  Delete,
  Search,
  MoreVert,
  Person,
  Apartment,
  CalendarToday,
  CheckCircle,
  Cancel,
  Dashboard,
  FilterList
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [tabIndex, setTabIndex] = useState(0);
  const [users, setUsers] = useState([]);
  const [logements, setLogements] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const [editUserOpen, setEditUserOpen] = useState(false);
  const [editedUser, setEditedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [filter, setFilter] = useState('all');

  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const navigate = useNavigate();

  useEffect(() => {
    if (!token || role !== 'admin') {
      setSnackbar({ open: true, message: 'Accès refusé : vous devez être admin', severity: 'error' });
      setTimeout(() => navigate('/'), 2000);
      return;
    }
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const [usersRes, logementsRes, reservationsRes] = await Promise.all([
        axios.get('http://localhost:5000/api/admin/users', config),
        axios.get('http://localhost:5000/api/admin/logements', config),
        axios.get('http://localhost:5000/api/admin/reservations', config),
      ]);
      setUsers(usersRes.data);
      setLogements(logementsRes.data);
      setReservations(reservationsRes.data);
    } catch {
      setSnackbar({ open: true, message: 'Erreur lors du chargement des données', severity: 'error' });
    }
    setLoading(false);
  };

  const handleTabChange = (event, newValue) => setTabIndex(newValue);
  const handleCloseSnackbar = () => setSnackbar(prev => ({ ...prev, open: false }));

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/loginForm');
  };

  const handleDelete = async (type, id) => {
    if (!window.confirm(`Supprimer ce ${type} ?`)) return;
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.delete(`http://localhost:5000/api/admin/${type}s/${id}`, config);
      setSnackbar({ open: true, message: `${type.charAt(0).toUpperCase() + type.slice(1)} supprimé(e)`, severity: 'success' });
      fetchData();
    } catch {
      setSnackbar({ open: true, message: `Erreur lors de la suppression`, severity: 'error' });
    }
  };

  const openEditUserModal = (user) => {
    setEditedUser(user);
    setEditUserOpen(true);
  };

  const closeEditUserModal = () => {
    setEditUserOpen(false);
    setEditedUser(null);
  };

  const handleSaveUser = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.put(`http://localhost:5000/api/admin/users/${editedUser._id}`, {
        fullName: editedUser.fullName,
        phone: editedUser.phone || '',
      }, config);
      setSnackbar({ open: true, message: 'Utilisateur modifié', severity: 'success' });
      fetchData();
      closeEditUserModal();
    } catch {
      setSnackbar({ open: true, message: 'Erreur lors de la modification', severity: 'error' });
    }
  };

  const handleMenuClick = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const filteredReservations = reservations.filter(res => {
    if (filter === 'all') return true;
    return res.statut === filter;
  });

  const filteredData = {
    0: users.filter(u => u.fullName.toLowerCase().includes(searchTerm.toLowerCase())),
    1: logements.filter(l => l.titre.toLowerCase().includes(searchTerm.toLowerCase())),
    2: filteredReservations.filter(r => 
      r.utilisateurId?.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.logementId?.titre.toLowerCase().includes(searchTerm.toLowerCase()))
  };

  const stats = {
    users: users.length,
    logements: logements.length,
    reservations: reservations.length,
    activeReservations: reservations.filter(r => r.statut === 'confirmé').length
  };

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <CircularProgress size={60} />
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* AppBar */}
      <AppBar position="fixed" sx={{ zIndex: theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Dashboard sx={{ mr: 1 }} />
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Tableau de bord Admin
          </Typography>
          <IconButton color="inherit" onClick={handleMenuClick}>
            <MoreVert />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleLogout}>
              <Logout sx={{ mr: 1 }} /> Déconnexion
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>Utilisateurs</Typography>
                <Typography variant="h4">{stats.users}</Typography>
                <Person color="primary" sx={{ fontSize: 40, opacity: 0.2, float: 'right' }} />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>Logements</Typography>
                <Typography variant="h4">{stats.logements}</Typography>
                <Apartment color="primary" sx={{ fontSize: 40, opacity: 0.2, float: 'right' }} />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>Réservations</Typography>
                <Typography variant="h4">{stats.reservations}</Typography>
                <CalendarToday color="primary" sx={{ fontSize: 40, opacity: 0.2, float: 'right' }} />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>Confirmées</Typography>
                <Typography variant="h4">{stats.activeReservations}</Typography>
                <CheckCircle color="primary" sx={{ fontSize: 40, opacity: 0.2, float: 'right' }} />
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Search and Tabs */}
        <Paper sx={{ p: 2, mb: 3 }}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 2 }}>
            <TextField
              size="small"
              placeholder="Rechercher..."
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ flexGrow: 1, maxWidth: 400 }}
            />
            {tabIndex === 2 && (
              <FormControl size="small" sx={{ minWidth: 180 }}>
                <InputLabel>Filtrer par statut</InputLabel>
                <Select
                  value={filter}
                  label="Filtrer par statut"
                  onChange={(e) => setFilter(e.target.value)}
                  startAdornment={<FilterList color="action" sx={{ mr: 1 }} />}
                >
                  <MenuItem value="all">Tous</MenuItem>
                  <MenuItem value="confirmé">Confirmées</MenuItem>
                  <MenuItem value="annulé">Annulées</MenuItem>
                  <MenuItem value="en attente">En attente</MenuItem>
                </Select>
              </FormControl>
            )}
          </Box>
        </Paper>

        <Tabs 
          value={tabIndex} 
          onChange={handleTabChange} 
          variant="scrollable"
          scrollButtons="auto"
          sx={{ mb: 2 }}
        >
          <Tab label="Utilisateurs" icon={<Person />} iconPosition="start" />
          <Tab label="Logements" icon={<Apartment />} iconPosition="start" />
          <Tab label="Réservations" icon={<CalendarToday />} iconPosition="start" />
        </Tabs>

        {/* Users Tab */}
        {tabIndex === 0 && (
          <TableContainer component={Paper} elevation={3}>
            <Table>
              <TableHead sx={{ backgroundColor: theme.palette.primary.light }}>
                <TableRow>
                  <TableCell>Utilisateur</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Rôle</TableCell>
                  <TableCell>Statut</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredData[0].length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">Aucun utilisateur trouvé</TableCell>
                  </TableRow>
                ) : (
                  filteredData[0].map(user => (
                    <TableRow key={user._id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar src={user.avatar} alt={user.fullName} />
                          <Box>
                            <Typography fontWeight="bold">{user.fullName}</Typography>
                            <Typography variant="body2" color="textSecondary">{user.phone || '-'}</Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Chip 
                          label={user.role || 'user'} 
                          color={user.role === 'admin' ? 'primary' : 'default'} 
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={user.isActive ? 'Actif' : 'Actif'} 
                          color={user.isActive ? 'success' : 'success'} 
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell align="right">
                        <IconButton onClick={() => openEditUserModal(user)} color="primary">
                          <Edit />
                        </IconButton>
                        <IconButton onClick={() => handleDelete('user', user._id)} color="error">
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Logements Tab */}
        {tabIndex === 1 && (
          <TableContainer component={Paper} elevation={3}>
            <Table>
              <TableHead sx={{ backgroundColor: theme.palette.primary.light }}>
                <TableRow>
                  <TableCell>Logement</TableCell>
                  <TableCell>Lieu</TableCell>
                  <TableCell>Prix</TableCell>
                  <TableCell>Propriétaire</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredData[1].length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">Aucun logement trouvé</TableCell>
                  </TableRow>
                ) : (
                  filteredData[1].map(logement => (
                    <TableRow key={logement._id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar 
                            variant="rounded" 
                            src={logement.image} 
                            alt={logement.titre} 
                            sx={{ width: 60, height: 60 }}
                          />
                          <Typography fontWeight="bold">{logement.titre}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        {logement.ville}, {logement.pays}
                      </TableCell>
                      <TableCell>
                        {logement.prixParNuit} €/nuit
                      </TableCell>
                      <TableCell>
                        {logement.utilisateurId?.fullName || 'Inconnu'}
                      </TableCell>
                      <TableCell align="right">
                        <IconButton onClick={() => handleDelete('logement', logement._id)} color="error">
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Reservations Tab */}
        {tabIndex === 2 && (
          <TableContainer component={Paper} elevation={3}>
            <Table>
              <TableHead sx={{ backgroundColor: theme.palette.primary.light }}>
                <TableRow>
                  <TableCell>Réservation</TableCell>
                  <TableCell>Logement</TableCell>
                  <TableCell>Dates</TableCell>
                  <TableCell>Statut</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredData[2].length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">Aucune réservation trouvée</TableCell>
                  </TableRow>
                ) : (
                  filteredData[2].map(reservation => (
                    <TableRow key={reservation._id} hover>
                      <TableCell>
                        <Box>
                          <Typography fontWeight="bold">{reservation.utilisateurId?.fullName || 'Inconnu'}</Typography>
                          <Typography variant="body2" color="textSecondary">
                            {reservation.nombrePersonnes} pers.
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography>{reservation.logementId?.titre || 'Inconnu'}</Typography>
                        <Typography variant="body2" color="textSecondary">
                          {reservation.logementId?.ville || ''}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography>
                          {new Date(reservation.dateArrivee).toLocaleDateString()}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          au {new Date(reservation.dateDepart).toLocaleDateString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={reservation.statut} 
                          color={
                            reservation.statut === 'confirmé' ? 'success' : 
                            reservation.statut === 'annulé' ? 'error' : 'warning'
                          } 
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="right">
                        <IconButton onClick={() => handleDelete('reservation', reservation._id)} color="error">
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>

      {/* Edit User Dialog */}
      <Dialog open={editUserOpen} onClose={closeEditUserModal} maxWidth="sm" fullWidth>
        <DialogTitle>Modifier l'utilisateur</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nom complet"
                value={editedUser?.fullName || ''}
                onChange={(e) => setEditedUser({ ...editedUser, fullName: e.target.value })}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                value={editedUser?.email || ''}
                margin="normal"
                disabled
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Téléphone"
                value={editedUser?.phone || ''}
                onChange={(e) => setEditedUser({ ...editedUser, phone: e.target.value })}
                margin="normal"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeEditUserModal}>Annuler</Button>
          <Button onClick={handleSaveUser} variant="contained" color="primary">
            Enregistrer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminDashboard;