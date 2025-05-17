import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Alert,
  Box,
  Grid,
  Typography,
  IconButton,
  InputAdornment,
  CircularProgress,
  useMediaQuery
} from '@mui/material';
import {
  Close,
  Title as TitleIcon,
  Description,
  Euro,
  LocationCity,
  Public,
  Image,
  CalendarToday,
  Star
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import * as yup from 'yup';

// Schéma de validation avec yup
const logementSchema = yup.object().shape({
  titre: yup.string().required('Le titre est requis').max(100, 'Le titre ne doit pas dépasser 100 caractères'),
  description: yup.string().required('La description est requise').max(500, 'La description ne doit pas dépasser 500 caractères'),
  prixParNuit: yup.number()
    .required('Le prix est requis')
    .positive('Le prix doit être positif')
    .max(10000, 'Le prix ne peut excéder 10 000€'),
  ville: yup.string().required('La ville est requise'),
  pays: yup.string().required('Le pays est requis'),
  image: yup.string()
    .required("L'URL de l'image est requise")
    .url("Doit être une URL valide"),
  dateArrivee: yup.date().required("La date d'arrivée est requise"),
  dateDepart: yup.date()
    .required("La date de départ est requise")
    .min(yup.ref('dateArrivee'), "La date de départ doit être après la date d'arrivée")
});

const AddLogementDialog = ({
  open,
  setOpen,
  formData = {},
  setFormData,
  onSuccess
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [previewImage, setPreviewImage] = useState('');

  useEffect(() => {
    if (!open) {
      // Réinitialiser le formulaire quand le dialogue est fermé
      setErrors({});
      setServerError('');
      setPreviewImage('');
    } else if (formData.image) {
      setPreviewImage(formData.image);
    }
  }, [open, formData.image]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Effacer l'erreur quand l'utilisateur corrige
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    
    // Mettre à jour l'aperçu de l'image
    if (name === 'image') {
      setPreviewImage(value);
    }
  };

  const validateField = async (field, value) => {
    try {
      await yup.reach(logementSchema, field).validate(value);
      setErrors(prev => ({ ...prev, [field]: '' }));
    } catch (err) {
      setErrors(prev => ({ ...prev, [field]: err.message }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    validateField(name, value);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setServerError('');
    
    try {
      // Validation complète
      await logementSchema.validate(formData, { abortEarly: false });
      
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Vous devez être connecté pour ajouter un logement.');
      }

      const res = await fetch('http://localhost:5000/api/logements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Erreur lors de l'ajout du logement.");
      }

      setOpen(false);
      if (onSuccess) onSuccess();
    } catch (err) {
      if (err.name === 'ValidationError') {
        const validationErrors = {};
        err.inner.forEach(error => {
          validationErrors[error.path] = error.message;
        });
        setErrors(validationErrors);
      } else {
        setServerError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={() => !loading && setOpen(false)}
      fullWidth
      maxWidth="md"
      fullScreen={isMobile}
    >
      <DialogTitle sx={{ position: 'relative', pr: 6 }}>
        <Typography variant="h6" component="div">
          {formData._id ? 'Modifier le logement' : 'Ajouter un nouveau logement'}
        </Typography>
        <IconButton
          aria-label="close"
          onClick={() => !loading && setOpen(false)}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
          disabled={loading}
        >
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        {serverError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {serverError}
          </Alert>
        )}

        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              label="Titre"
              name="titre"
              fullWidth
              margin="normal"
              value={formData.titre || ''}
              onChange={handleChange}
              onBlur={handleBlur}
              error={!!errors.titre}
              helperText={errors.titre}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <TitleIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              label="Description"
              name="description"
              fullWidth
              margin="normal"
              value={formData.description || ''}
              onChange={handleChange}
              onBlur={handleBlur}
              error={!!errors.description}
              helperText={errors.description}
              multiline
              rows={4}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Description color="action" />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              label="Prix par nuit (€)"
              name="prixParNuit"
              type="number"
              fullWidth
              margin="normal"
              value={formData.prixParNuit || ''}
              onChange={handleChange}
              onBlur={handleBlur}
              error={!!errors.prixParNuit}
              helperText={errors.prixParNuit}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Euro color="action" />
                  </InputAdornment>
                ),
                inputProps: { min: 1, step: 1 }
              }}
            />

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  label="Ville"
                  name="ville"
                  fullWidth
                  margin="normal"
                  value={formData.ville || ''}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={!!errors.ville}
                  helperText={errors.ville}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LocationCity color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Pays"
                  name="pays"
                  fullWidth
                  margin="normal"
                  value={formData.pays || ''}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={!!errors.pays}
                  helperText={errors.pays}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Public color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              label="URL de l'image"
              name="image"
              fullWidth
              margin="normal"
              value={formData.image || ''}
              onChange={handleChange}
              onBlur={handleBlur}
              error={!!errors.image}
              helperText={errors.image}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Image color="action" />
                  </InputAdornment>
                ),
              }}
            />

            {previewImage && (
              <Box sx={{ mt: 2, mb: 2, textAlign: 'center' }}>
                <Typography variant="subtitle2" gutterBottom>
                  Aperçu de l'image
                </Typography>
                <Box
                  component="img"
                  src={previewImage}
                  alt="Aperçu du logement"
                  sx={{
                    maxWidth: '100%',
                    maxHeight: 200,
                    borderRadius: 1,
                    border: `1px solid ${theme.palette.divider}`,
                  }}
                  onError={() => setPreviewImage('')}
                />
              </Box>
            )}

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  label="Date d'arrivée"
                  name="dateArrivee"
                  type="date"
                  fullWidth
                  margin="normal"
                  InputLabelProps={{ shrink: true }}
                  value={formData.dateArrivee || ''}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={!!errors.dateArrivee}
                  helperText={errors.dateArrivee}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CalendarToday color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Date de départ"
                  name="dateDepart"
                  type="date"
                  fullWidth
                  margin="normal"
                  InputLabelProps={{ shrink: true }}
                  value={formData.dateDepart || ''}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={!!errors.dateDepart}
                  helperText={errors.dateDepart}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CalendarToday color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>

            <Box sx={{ mt: 2, p: 2, backgroundColor: theme.palette.grey[100], borderRadius: 1 }}>
              <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <Star color="primary" sx={{ mr: 1 }} /> Conseils pour une bonne annonce
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • Utilisez un titre accrocheur<br />
                • Ajoutez des photos de qualité<br />
                • Soyez précis dans la description<br />
                • Vérifiez les dates de disponibilité
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button 
          onClick={() => setOpen(false)} 
          color="secondary"
          disabled={loading}
        >
          Annuler
        </Button>
        <Button 
          variant="contained" 
          onClick={handleSubmit}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          {formData._id ? 'Mettre à jour' : 'Ajouter le logement'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddLogementDialog;