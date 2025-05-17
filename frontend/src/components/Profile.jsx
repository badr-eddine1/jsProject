import React, { useEffect, useState, useCallback } from 'react';
import {
  AppBar,
  Toolbar,
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
  Avatar,
  Paper,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Skeleton
} from '@mui/material';
import {
  AccountCircle,
  ArrowBack,
  Logout,
  Save,
  Cancel
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

const Profile = () => {
  const theme = useTheme();

  const [userData, setUserData] = useState(null);
  const [initialData, setInitialData] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [errors, setErrors] = useState({
    fullName: '',
    email: '',
    phone: '',
  });
  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);

  const fetchUserData = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/users/me', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Erreur lors de la récupération');
      }

      const data = await res.json();
      setUserData(data);
      setInitialData(data);
      setFormData({
        fullName: data.fullName || '',
        email: data.email || '',
        phone: data.phone || '',
      });
    } catch (error) {
      setMessage({ text: error.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    let valid = true;
    const newErrors = { ...errors };

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Le nom est requis';
      valid = false;
    }

    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Email invalide';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });

    if (!validate()) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/users/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Erreur lors de la mise à jour');
      }

      const data = await res.json();
      setUserData(data);
      setInitialData(data);
      setMessage({ text: 'Profil mis à jour avec succès', type: 'success' });
      localStorage.setItem('fullName', data.fullName);
    } catch (error) {
      setMessage({ text: error.message, type: 'error' });
    }
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  if (loading) {
    return (
      <Box>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Chargement...
            </Typography>
          </Toolbar>
        </AppBar>
        <Container sx={{ mt: 5 }}>
          <Skeleton variant="text" width="60%" height={60} />
          <Skeleton variant="rectangular" height={100} sx={{ my: 2 }} />
          <Skeleton variant="rectangular" height={100} />
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static" elevation={0}>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="back"
            sx={{ mr: 2 }}
            onClick={() => window.history.back()}
          >
            <ArrowBack />
          </IconButton>

          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Mon Profil
          </Typography>

          <div>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <AccountCircle fontSize="large" />
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
              open={open}
              onClose={handleClose}
            >
              <MenuItem onClick={handleClose}>Mon compte</MenuItem>
              <MenuItem onClick={() => {
                localStorage.removeItem('token');
                window.location.href = '/loginForm';
              }}>
                <Logout sx={{ mr: 1 }} /> Déconnexion
              </MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
            <Avatar
              sx={{
                width: 80,
                height: 80,
                bgcolor: theme.palette.primary.main, // couleur principale ici
                fontSize: '2rem',
                mr: 3
              }}
            >
              {userData?.fullName?.charAt(0) || 'U'}
            </Avatar>
            <Typography variant="h4" component="h1">
              {userData?.fullName || 'Utilisateur'}
            </Typography>
          </Box>

          <Divider sx={{ my: 3 }} />

          {message.text && (
            <Alert severity={message.type} sx={{ mb: 3 }}>
              {message.text}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
              Informations personnelles
            </Typography>

            <TextField
              label="Nom complet"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
              error={!!errors.fullName}
              helperText={errors.fullName}
              InputProps={{
                startAdornment: (
                  <AccountCircle color="action" sx={{ mr: 1 }} />
                ),
              }}
            />

            <TextField
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              fullWidth
              margin="normal"
              type="email"
              required
              disabled
              error={!!errors.email}
              helperText={errors.email}
              sx={{ mt: 3 }}
            />

            <TextField
              label="Téléphone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              fullWidth
              margin="normal"
              sx={{ mt: 3 }}
            />

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
              <Button
                variant="outlined"
                color="secondary"
                startIcon={<Cancel />}
                sx={{ mr: 2 }}
                onClick={() => setFormData(initialData)}
              >
                Annuler
              </Button>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                startIcon={<Save />}
              >
                Enregistrer
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Profile;
