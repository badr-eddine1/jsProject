import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Container,
  Grid,
  Typography,
  Alert,
  Button,
  Box,
  Paper,
  InputAdornment,
  TextField,
  Chip,
  CircularProgress,
  IconButton,
  Slider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  useMediaQuery
} from '@mui/material';
import {
  Search,
  FilterList,
  Add,
  LocationOn,
  Close,
  Euro,
  ArrowUpward,
  ArrowDownward,
  Event,
  Star
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import Navbar from './navbar';
import LogementCard from '../components/LogementCard';
import AddLogementDialog from '../components/AddLogementDialog';
import Reserver from '../components/Reserver';

const Home = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [logements, setLogements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    prixParNuit: '',
    image: '',
    ville: '',
    pays: '',
    dateArrivee: '',
    dateDepart: '',
  });
  const [message, setMessage] = useState({ text: '', type: '' });
  const [selectedCity, setSelectedCity] = useState('');
  const [openReservation, setOpenReservation] = useState(false);
  const [logementSelectionne, setLogementSelectionne] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [sortOption, setSortOption] = useState('');
  const [minRating, setMinRating] = useState(0);

  const availableCities = ['Tous', 'Casablanca', 'Marrakech', 'Rabat', 'Agadir'];
  const ratings = [0, 1, 2, 3, 4, 5];

  useEffect(() => {
    fetchLogements();
  }, []);

  const fetchLogements = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/logements');
      setLogements(res.data);
    } catch (err) {
      console.error('Erreur:', err);
      setMessage({ text: 'Erreur lors de la récupération des logements.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleReservation = (logement) => {
    setLogementSelectionne(logement);
    setOpenReservation(true);
  };

  const handleReservationSuccess = () => {
    fetchLogements();
    setMessage({ text: 'Réservation réussie !', type: 'success' });
    setOpenReservation(false);
  };

  const filterByCity = (logements) => {
    return selectedCity && selectedCity !== 'Tous'
      ? logements.filter(logement => logement.ville === selectedCity)
      : logements;
  };

  const filterBySearch = (logements) => {
    return searchQuery
      ? logements.filter(logement => 
          logement.titre.toLowerCase().includes(searchQuery.toLowerCase()) || 
          logement.ville.toLowerCase().includes(searchQuery.toLowerCase()))
      : logements;
  };

  const filterByPrice = (logements) => {
    return logements.filter(logement => 
      logement.prixParNuit >= priceRange[0] && logement.prixParNuit <= priceRange[1]
    );
  };

  const filterByRating = (logements) => {
    return minRating > 0
      ? logements.filter(logement => (logement.rating || 0) >= minRating)
      : logements;
  };

  const sortLogements = (logements) => {
    return [...logements].sort((a, b) => {
      switch(sortOption) {
        case 'price-asc':
          return a.prixParNuit - b.prixParNuit;
        case 'price-desc':
          return b.prixParNuit - a.prixParNuit;
        case 'date-newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'date-oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        default:
          return 0;
      }
    });
  };

  const filteredLogements = sortLogements(
    filterByRating(
      filterByPrice(
        filterBySearch(
          filterByCity(logements)
        )
      )
    )
  );

  const formatPrice = (value) => `${value}€`;

  const resetFilters = () => {
    setSelectedCity('');
    setSearchQuery('');
    setPriceRange([0, 1000]);
    setSortOption('');
    setMinRating(0);
  };

  return (
    <Box sx={{ backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
      <Navbar 
        onAddClick={() => setOpenAddDialog(true)}
        onLogout={() => console.log('Déconnexion...')}
      />

      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* En-tête */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 4,
          flexWrap: 'wrap',
          gap: 2
        }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            {selectedCity && selectedCity !== 'Tous' ? `Logements à ${selectedCity}` : 'Tous nos logements'}
          </Typography>
          
          {!isMobile && (
            <Button 
              variant="contained" 
              startIcon={<Add />}
              onClick={() => setOpenAddDialog(true)}
              sx={{ 
                bgcolor: 'primary.main',
                '&:hover': { bgcolor: 'primary.dark' }
              }}
            >
              Ajouter un logement
            </Button>
          )}
        </Box>

        {/* Filtres */}
        <Paper sx={{ p: 3, mb: 4, borderRadius: 2, boxShadow: 1 }}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: showFilters ? 2 : 0 }}>
            <TextField
              placeholder="Rechercher..."
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{ width: isMobile ? '100%' : 250 }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            <FormControl size="small" sx={{ minWidth: isMobile ? '100%' : 180 }}>
              <InputLabel>Ville</InputLabel>
              <Select
                value={selectedCity || 'Tous'}
                label="Ville"
                onChange={(e) => setSelectedCity(e.target.value === 'Tous' ? '' : e.target.value)}
              >
                {availableCities.map(city => (
                  <MenuItem key={city} value={city}>{city}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <Button 
              startIcon={<FilterList />}
              onClick={() => setShowFilters(!showFilters)}
              size="small"
              variant="outlined"
            >
              {showFilters ? 'Masquer filtres' : 'Plus de filtres'}
            </Button>
          </Box>

          {/* Filtres avancés */}
          {showFilters && (
            <Box sx={{ mt: 3 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography gutterBottom sx={{ mb: 1 }}>Fourchette de prix</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                    <Euro color="action" />
                    <Slider
                      value={priceRange}
                      onChange={(e, newValue) => setPriceRange(newValue)}
                      valueLabelDisplay="auto"
                      min={0}
                      max={1000}
                      step={10}
                      valueLabelFormat={formatPrice}
                      sx={{ flexGrow: 1 }}
                    />
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="caption">{priceRange[0]}€</Typography>
                    <Typography variant="caption">{priceRange[1]}€</Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} md={3}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Note minimale</InputLabel>
                    <Select
                      value={minRating}
                      label="Note minimale"
                      onChange={(e) => setMinRating(e.target.value)}
                      startAdornment={
                        <InputAdornment position="start">
                          <Star color="action" />
                        </InputAdornment>
                      }
                    >
                      {ratings.map(rating => (
                        <MenuItem key={rating} value={rating}>
                          {rating === 0 ? 'Toutes notes' : `${rating}+ étoiles`}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={3}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Trier par</InputLabel>
                    <Select
                      value={sortOption}
                      label="Trier par"
                      onChange={(e) => setSortOption(e.target.value)}
                    >
                      <MenuItem value="">Par défaut</MenuItem>
                      <MenuItem value="price-asc">
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <ArrowUpward fontSize="small" sx={{ mr: 1 }} />
                          Prix croissant
                        </Box>
                      </MenuItem>
                      <MenuItem value="price-desc">
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <ArrowDownward fontSize="small" sx={{ mr: 1 }} />
                          Prix décroissant
                        </Box>
                      </MenuItem>
                      <MenuItem value="date-newest">
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Event fontSize="small" sx={{ mr: 1 }} />
                          Plus récents
                        </Box>
                      </MenuItem>
                      <MenuItem value="rating">
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Star fontSize="small" sx={{ mr: 1 }} />
                          Meilleures notes
                        </Box>
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>

              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <Button 
                  onClick={resetFilters}
                  variant="text"
                  size="small"
                >
                  Réinitialiser les filtres
                </Button>
              </Box>
            </Box>
          )}
        </Paper>

        {/* Message d'alerte */}
        {message.text && (
          <Alert
            severity={message.type}
            sx={{ mb: 3 }}
            action={
              <IconButton
                size="small"
                color="inherit"
                onClick={() => setMessage({ text: '', type: '' })}
              >
                <Close fontSize="small" />
              </IconButton>
            }
          >
            {message.text}
          </Alert>
        )}

        {/* Liste des logements */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
            <CircularProgress size={60} />
          </Box>
        ) : filteredLogements.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary">
              {searchQuery || selectedCity || priceRange[0] > 0 || priceRange[1] < 1000 || minRating > 0 
                ? 'Aucun logement ne correspond à vos critères' 
                : 'Aucun logement disponible'}
            </Typography>
            {(searchQuery || selectedCity || priceRange[0] > 0 || priceRange[1] < 1000 || minRating > 0) && (
              <Button 
                variant="outlined" 
                sx={{ mt: 2 }}
                onClick={resetFilters}
              >
                Réinitialiser les filtres
              </Button>
            )}
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {filteredLogements.map(logement => (
              <Grid item key={logement._id} xs={12} sm={6} md={4} lg={3}>
                <LogementCard 
                  logement={logement}
                  onReserve={() => handleReservation(logement)}
                />
                <Box sx={{ mt: 1, textAlign: 'center' }}>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    fullWidth
                    onClick={() => handleReservation(logement)}
                    sx={{ 
                      mt: 1,
                      bgcolor: 'primary.main',
                      '&:hover': { bgcolor: 'primary.dark' }
                    }}
                  >
                    Réserver
                  </Button>
                </Box>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Bouton flottant pour mobile */}
        {isMobile && (
          <Box sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
          }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<Add />}
              onClick={() => setOpenAddDialog(true)}
              sx={{
                borderRadius: '50%',
                width: 56,
                height: 56,
                minWidth: 0,
                boxShadow: 3,
                bgcolor: 'primary.main',
                '&:hover': { bgcolor: 'primary.dark' }
              }}
            />
          </Box>
        )}
      </Container>

      {/* Dialogues */}
      <AddLogementDialog
        open={openAddDialog}
        setOpen={setOpenAddDialog}
        formData={formData}
        setFormData={setFormData}
        onSuccess={() => {
          fetchLogements();
          setMessage({ text: 'Logement ajouté avec succès!', type: 'success' });
        }}
      />

      {openReservation && logementSelectionne && (
        <Reserver
          logement={logementSelectionne}
          open={openReservation}
          onClose={() => setOpenReservation(false)}
          onSuccess={handleReservationSuccess}
        />
      )}
    </Box>
  );
};

export default Home;