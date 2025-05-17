import React from 'react';
import {
  Grid,
  Typography,
  Box,
  Button,
  Paper,
  useMediaQuery,
  useTheme,
  CircularProgress,
  Pagination,
  ToggleButton,
  ToggleButtonGroup,
  InputAdornment,
  TextField,
  IconButton
} from '@mui/material';
import {
  Search as SearchIcon,
  Tune as FilterIcon,
  ViewList as ListIcon,
  GridView as GridIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import LogementCard from './LogementCard';
import { motion, AnimatePresence } from 'framer-motion';

const LogementList = ({ 
  logements, 
  onDelete, 
  onReserve,
  onEdit,
  loading = false,
  pagination = null,
  onPageChange,
  onSortChange,
  onSearch,
  showFilters = false,
  onToggleFilters,
  currentView = 'grid',
  onViewChange
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [searchQuery, setSearchQuery] = React.useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(searchQuery);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    if (onSearch) onSearch('');
  };

  return (
    <Box sx={{ width: '100%' }}>
      {/* Barre d'outils avec recherche et filtres */}
      <Paper 
        elevation={1} 
        sx={{ 
          p: 2, 
          mb: 4,
          borderRadius: 2,
          backgroundColor: theme.palette.background.paper
        }}
      >
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: isMobile ? 'column' : 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2
          }}
        >
          {/* Barre de recherche */}
          <form onSubmit={handleSearch} style={{ flexGrow: 1 }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Rechercher un logement..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: searchQuery && (
                  <IconButton onClick={handleClearSearch} size="small">
                    <CloseIcon fontSize="small" />
                  </IconButton>
                )
              }}
              sx={{
                maxWidth: 500,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 4
                }
              }}
            />
          </form>

          {/* Contrôles de vue et filtres */}
          <Box sx={{ display: 'flex', gap: 1 }}>
            <ToggleButtonGroup
              value={currentView}
              exclusive
              onChange={(e, newView) => onViewChange && onViewChange(newView)}
              size="small"
            >
              <ToggleButton value="grid" aria-label="Vue grille">
                <GridIcon />
              </ToggleButton>
              <ToggleButton value="list" aria-label="Vue liste" disabled>
                <ListIcon />
              </ToggleButton>
            </ToggleButtonGroup>

            <Button
              variant={showFilters ? 'contained' : 'outlined'}
              startIcon={<FilterIcon />}
              onClick={onToggleFilters}
              size={isMobile ? 'small' : 'medium'}
            >
              Filtres
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* État de chargement */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress size={60} />
        </Box>
      )}

      {/* Liste vide */}
      {!loading && logements.length === 0 && (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            Aucun logement ne correspond à votre recherche
          </Typography>
          <Button 
            variant="outlined" 
            sx={{ mt: 2 }}
            onClick={handleClearSearch}
          >
            Réinitialiser la recherche
          </Button>
        </Paper>
      )}

      {/* Liste des logements */}
      <AnimatePresence>
        {!loading && logements.length > 0 && (
          <Grid container spacing={3}>
            {logements.map((logement) => (
              <Grid 
                item 
                key={logement._id} 
                xs={12} 
                sm={6} 
                md={4} 
                lg={3}
                component={motion.div}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <LogementCard 
                  logement={logement} 
                  onDelete={onDelete}
                  onEdit={onEdit}
                />
                
                {onReserve && (
                  <Box sx={{ mt: 1 }}>
                    <Button 
                      variant="contained" 
                      color="primary" 
                      fullWidth 
                      onClick={() => onReserve(logement)}
                      sx={{
                        borderRadius: 2,
                        py: 1,
                        textTransform: 'none',
                        '&:hover': {
                          boxShadow: theme.shadows[4],
                          transform: 'translateY(-2px)'
                        },
                        transition: 'all 0.2s ease'
                      }}
                    >
                      Réserver
                    </Button>
                  </Box>
                )}
              </Grid>
            ))}
          </Grid>
        )}
      </AnimatePresence>

      {/* Pagination */}
      {!loading && pagination && pagination.totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination
            count={pagination.totalPages}
            page={pagination.currentPage}
            onChange={(e, page) => onPageChange(page)}
            color="primary"
            shape="rounded"
            size={isMobile ? 'small' : 'medium'}
            sx={{
              '& .MuiPaginationItem-root': {
                borderRadius: 2
              }
            }}
          />
        </Box>
      )}
    </Box>
  );
};

export default LogementList;