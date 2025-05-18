import React, { useEffect, useState, useMemo } from 'react';
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
  CircularProgress,
  IconButton,
  Slider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  useMediaQuery,
  Fab,

  Paper as MuiPaper,
} from '@mui/material';
import {
  Search,
  FilterList,
  Add,
  Close,
  Chat as ChatIcon,
  Send as SendIcon,
} from '@mui/icons-material';
import { useTheme, styled } from '@mui/material/styles';
import { v4 as uuidv4 } from 'uuid';

import Navbar from './navbar';
import LogementCard from '../components/LogementCard';
import AddLogementDialog from '../components/AddLogementDialog';
import Reserver from '../components/Reserver';

// Styles personnalisés
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(4),
  borderRadius: 12,
  boxShadow: theme.shadows[3],
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: theme.shadows[6],
  },
}));

const PriceSlider = styled(Slider)(({ theme }) => ({
  color: theme.palette.primary.main,
  height: 6,
  '& .MuiSlider-thumb': {
    width: 16,
    height: 16,
    backgroundColor: '#fff',
    border: `2px solid ${theme.palette.primary.main}`,
  },
  '& .MuiSlider-valueLabel': {
    backgroundColor: theme.palette.primary.main,
    borderRadius: 4,
    padding: '2px 8px',
  },
}));

// Chatbot styles
const ChatbotContainer = styled(MuiPaper)(({ theme }) => ({
  position: 'fixed',
  bottom: 80,
  right: 24,
  width: 320,
  maxHeight: 400,
  display: 'flex',
  flexDirection: 'column',
  borderRadius: 12,
  boxShadow: theme.shadows[5],
  backgroundColor: theme.palette.background.paper,
  zIndex: 1300,
}));

const ChatHeader = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: '#fff',
  padding: theme.spacing(1, 2),
  borderTopLeftRadius: 12,
  borderTopRightRadius: 12,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
}));

const ChatMessages = styled(Box)({
  flex: 1,
  overflowY: 'auto',
  padding: '8px 16px',
});

const ChatInputArea = styled('form')({
  display: 'flex',
  padding: '8px 16px',
  borderTop: '1px solid #ddd',
});

const ChatMessage = ({ message, isUser }) => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: isUser ? 'flex-end' : 'flex-start',
      mb: 1,
    }}
  >
    <Box
      sx={{
        maxWidth: '75%',
        bgcolor: isUser ? 'primary.main' : 'grey.300',
        color: isUser ? 'primary.contrastText' : 'text.primary',
        p: 1.5,
        borderRadius: 2,
        fontSize: 14,
        whiteSpace: 'pre-wrap',
      }}
    >
      {message.text}
    </Box>
  </Box>
);

const Home = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // États principaux logement
  const [logements, setLogements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [selectedCity, setSelectedCity] = useState('');
  const [openReservation, setOpenReservation] = useState(false);
  const [logementSelectionne, setLogementSelectionne] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [sortOption, setSortOption] = useState('');
  const [minRating, setMinRating] = useState(0);
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);

  // Chatbot states
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { text: "Bonjour ! Comment puis-je vous aider aujourd'hui ?", isUser: false }
  ]);
  const [chatLoading, setChatLoading] = useState(false);
  const [chatError, setChatError] = useState('');

  const availableCities = ['Tous', 'Casablanca', 'Marrakech', 'Rabat', 'Agadir'];
  const ratings = [0, 1, 2, 3, 4, 5];

  // Filtrage count
  useEffect(() => {
    let count = 0;
    if (selectedCity && selectedCity !== 'Tous') count++;
    if (searchQuery) count++;
    if (priceRange[0] !== 0 || priceRange[1] !== 1000) count++;
    if (minRating > 0) count++;
    if (sortOption) count++;
    setActiveFiltersCount(count);
  }, [selectedCity, searchQuery, priceRange, minRating, sortOption]);

  useEffect(() => {
    fetchLogements();
  }, []);

  const fetchLogements = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get('http://localhost:5000/api/logements');
      setLogements(res.data);
    } catch (err) {
      console.error('Erreur:', err);
      setError('Erreur lors de la récupération des logements.');
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
    setMessage({ text: 'Réservation réussie !', type: 'success' });
    setOpenReservation(false);
  };

  // Mémoïsation filtres
  const filterByCity = useMemo(() => (logements) => {
    return selectedCity && selectedCity !== 'Tous'
      ? logements.filter((logement) => logement.ville === selectedCity)
      : logements;
  }, [selectedCity]);

  const filterBySearch = useMemo(() => (logements) => {
    return searchQuery
      ? logements.filter(
          (logement) =>
            logement.titre.toLowerCase().includes(searchQuery.toLowerCase()) ||
            logement.ville.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : logements;
  }, [searchQuery]);

  const filterByPrice = useMemo(() => (logements) => {
    return logements.filter(
      (logement) => logement.prixParNuit >= priceRange[0] && logement.prixParNuit <= priceRange[1]
    );
  }, [priceRange]);

  const filterByRating = useMemo(() => (logements) => {
    return minRating > 0 ? logements.filter((logement) => (logement.rating || 0) >= minRating) : logements;
  }, [minRating]);

  const sortLogements = useMemo(() => (logements) => {
    return [...logements].sort((a, b) => {
      switch (sortOption) {
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
  }, [sortOption]);

  // Filtres appliqués
  const filteredLogements = useMemo(() => {
    let result = [...logements];
    result = filterByCity(result);
    result = filterBySearch(result);
    result = filterByPrice(result);
    result = filterByRating(result);
    result = sortLogements(result);
    return result;
  }, [logements, filterByCity, filterBySearch, filterByPrice, filterByRating, sortLogements]);

  // Gestion chatbot
  const sendChatMessage = async (e) => {
    e.preventDefault();
    if (!chatInput.trim() || chatLoading) return;

    const userMsg = { text: chatInput.trim(), isUser: true };
    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput('');
    setChatLoading(true);
    setChatError('');

    try {
      const res = await axios.post('http://localhost:5000/api/chatbot/ask', {
        message: userMsg.text
      });

      const botMsg = {
        text: res.data.reply || "Désolé, je n'ai pas compris. Pouvez-vous reformuler ?",
        isUser: false,
      };
      setChatMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      setChatError("Erreur lors de la communication avec l'assistant. Veuillez réessayer.");
      setChatMessages((prev) => [
        ...prev,
        { text: "Erreur lors de la communication avec l'assistant. Veuillez réessayer.", isUser: false },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <Container maxWidth="lg" sx={{ my: 4 }}>
        <Typography
          variant="h4"
          component="h1"
          sx={{ mb: 3, fontWeight: 700, fontFamily: 'Arial, sans-serif', color: '#1976d2' }}
        >
          Découvrez les meilleurs logements
        </Typography>

        {message.text && (
          <Alert
            severity={message.type === 'success' ? 'success' : 'error'}
            onClose={() => setMessage({ text: '', type: '' })}
            sx={{ mb: 3, fontWeight: 'bold' }}
          >
            {message.text}
          </Alert>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, flexWrap: 'wrap', gap: 2 }}>
          <TextField
            label="Recherche"
            variant="outlined"
            size="small"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ flex: 1, minWidth: 200 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />

          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>Ville</InputLabel>
            <Select
              value={selectedCity}
              label="Ville"
              onChange={(e) => setSelectedCity(e.target.value)}
              size="small"
            >
              {availableCities.map((city) => (
                <MenuItem key={city} value={city}>
                  {city}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button
            variant="outlined"
            startIcon={<FilterList />}
            onClick={() => setShowFilters((prev) => !prev)}
            sx={{ minWidth: 120 }}
          >
            Filtres {activeFiltersCount > 0 && `(${activeFiltersCount})`}
          </Button>

          <Button variant="contained" startIcon={<Add />} onClick={() => setOpenAddDialog(true)}>
            Ajouter logement
          </Button>
        </Box>

        {showFilters && (
          <StyledPaper>
            <Typography variant="subtitle1" gutterBottom>
              Prix par nuit (en €)
            </Typography>
            <PriceSlider
              value={priceRange}
              onChange={(e, newValue) => setPriceRange(newValue)}
              valueLabelDisplay="auto"
              min={0}
              max={1000}
              step={10}
            />

            <Box sx={{ mt: 3 }}>
              <FormControl fullWidth>
                <InputLabel>Note minimale</InputLabel>
                <Select
                  value={minRating}
                  label="Note minimale"
                  onChange={(e) => setMinRating(Number(e.target.value))}
                  size="small"
                >
                  {ratings.map((r) => (
                    <MenuItem key={r} value={r}>
                      {r} étoile{r > 1 ? 's' : ''}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Box sx={{ mt: 3 }}>
              <FormControl fullWidth>
                <InputLabel>Tri</InputLabel>
                <Select
                  value={sortOption}
                  label="Tri"
                  onChange={(e) => setSortOption(e.target.value)}
                  size="small"
                >
                  <MenuItem value="">Aucun</MenuItem>
                  <MenuItem value="price-asc">Prix croissant</MenuItem>
                  <MenuItem value="price-desc">Prix décroissant</MenuItem>
                  <MenuItem value="date-newest">Plus récent</MenuItem>
                  <MenuItem value="date-oldest">Plus ancien</MenuItem>
                  <MenuItem value="rating">Meilleure note</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </StyledPaper>
        )}

        {loading ? (
          <Box sx={{ textAlign: 'center', mt: 5 }}>
            <CircularProgress />
            <Typography sx={{ mt: 2 }}>Chargement des logements...</Typography>
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : filteredLogements.length === 0 ? (
          <Typography variant="h6" sx={{ mt: 4, textAlign: 'center' }}>
            Aucun logement trouvé.
          </Typography>
        ) : (
          <Grid container spacing={3}>
            {filteredLogements.map((logement) => (
              <Grid item xs={12} sm={6} md={4} key={logement._id}>
                <LogementCard logement={logement} onReserve={() => handleReservation(logement)} />
              </Grid>
            ))}
          </Grid>
        )}

        <AddLogementDialog open={openAddDialog} onClose={() => setOpenAddDialog(false)} onAdded={fetchLogements} />

        {logementSelectionne && (
          <Reserver
            open={openReservation}
            logement={logementSelectionne}
            onClose={() => setOpenReservation(false)}
            onSuccess={handleReservationSuccess}
          />
        )}
      </Container>

      {/* Chatbot flottant */}
      <Fab
        color="primary"
        aria-label="chatbot"
        onClick={() => setChatOpen((prev) => !prev)}
        sx={{ position: 'fixed', bottom: 24, right: 24, zIndex: 1400 }}
      >
        <ChatIcon />
      </Fab>

      {chatOpen && (
        <ChatbotContainer>
          <ChatHeader>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Assistant Chatbot
            </Typography>
            <IconButton onClick={() => setChatOpen(false)} sx={{ color: '#fff' }}>
              <Close />
            </IconButton>
          </ChatHeader>

          <ChatMessages>
            {chatMessages.map((msg, idx) => (
              <ChatMessage key={idx} message={msg} isUser={msg.isUser} />
            ))}
            {chatLoading && (
              <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 1 }}>
                <Box sx={{ bgcolor: 'grey.300', color: 'text.primary', p: 1.5, borderRadius: 2, fontSize: 14 }}>
                  <CircularProgress size={18} sx={{ mr: 1 }} /> Assistant rédige une réponse...
                </Box>
              </Box>
            )}
          </ChatMessages>

          <ChatInputArea onSubmit={sendChatMessage}>
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              placeholder="Tapez votre message..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              autoComplete="off"
            />
            <IconButton type="submit" color="primary" disabled={!chatInput.trim()}>
              <SendIcon />
            </IconButton>
          </ChatInputArea>
        </ChatbotContainer>
      )}
    </>
  );
};

export default Home;
