import React, { useState } from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  IconButton,
  Box,
  Chip,
  Rating,
  Tooltip,
  useTheme,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  LocationOn as LocationIcon,
  Euro as EuroIcon,
  Star as StarIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const LogementCard = ({ 
  logement, 
  onDelete,
  onEdit,
  showActions = true,
  elevation = 1 
}) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const handleDeleteClick = () => {
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    onDelete(logement._id);
    setOpenDeleteDialog(false);
  };

  const handleCancelDelete = () => {
    setOpenDeleteDialog(false);
  };

  const handleEditClick = () => {
    if (onEdit) onEdit(logement._id);
  };

  const handleCardClick = () => {
    navigate(`/logements/${logement._id}`);
  };

  const toggleFavorite = (e) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  return (
    <>
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.2 }}
      >
        <Card 
          elevation={elevation}
          sx={{ 
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            cursor: 'pointer',
            borderRadius: 2,
            overflow: 'hidden',
            '&:hover': {
              boxShadow: theme.shadows[6]
            },
            transition: 'all 0.3s ease'
          }}
          onClick={handleCardClick}
        >
          {/* En-tête avec image */}
          <Box sx={{ position: 'relative' }}>
            <CardMedia
              component="img"
              height="200"
              image={imageError ? 'https://source.unsplash.com/random/800x600?house' : logement.image}
              alt={logement.titre}
              onError={handleImageError}
              sx={{
                objectFit: 'cover',
                filter: theme.palette.mode === 'dark' ? 'brightness(0.9)' : 'none'
              }}
            />
            
            {/* Badges et actions */}
            <Box sx={{ 
              position: 'absolute',
              top: 8,
              right: 8,
              display: 'flex',
              gap: 1
            }}>
              {logement.promotion && (
                <Chip
                  label="Promotion"
                  color="error"
                  size="small"
                  sx={{ 
                    fontWeight: 'bold',
                    backdropFilter: 'blur(4px)',
                    backgroundColor: 'rgba(255,255,255,0.8)'
                  }}
                />
              )}
              
              <IconButton
                onClick={toggleFavorite}
                sx={{ 
                  backgroundColor: 'rgba(255,255,255,0.8)',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.9)'
                  }
                }}
              >
                {isFavorite ? (
                  <FavoriteIcon color="error" />
                ) : (
                  <FavoriteBorderIcon />
                )}
              </IconButton>
            </Box>
          </Box>

          {/* Contenu de la carte */}
          <CardContent sx={{ flexGrow: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="h6" component="h3" noWrap>
                {logement.titre}
              </Typography>
              
              {showActions && onDelete && (
                <Box sx={{ display: 'flex', gap: 1 }}>
                  {onEdit && (
                    <Tooltip title="Modifier">
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditClick();
                        }}
                        size="small"
                        color="primary"
                        sx={{
                          backgroundColor: theme.palette.primary.light,
                          '&:hover': {
                            backgroundColor: theme.palette.primary.main,
                            color: 'white'
                          }
                        }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
                  
                  <Tooltip title="Supprimer">
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteClick();
                      }}
                      size="small"
                      color="error"
                      sx={{
                        backgroundColor: theme.palette.error.light,
                        '&:hover': {
                          backgroundColor: theme.palette.error.main,
                          color: 'white'
                        }
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              )}
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <LocationIcon color="action" fontSize="small" sx={{ mr: 0.5 }} />
              <Typography variant="body2" color="text.secondary">
                {logement.ville}, {logement.pays}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Rating
                value={logement.rating || 0}
                precision={0.5}
                readOnly
                size="small"
                emptyIcon={<StarIcon fontSize="inherit" />}
              />
              <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                ({logement.reviewsCount || 0} avis)
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
              <Typography variant="body1" fontWeight="bold">
                <EuroIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                {logement.prixParNuit} / nuit
              </Typography>

             
            </Box>
          </CardContent>
        </Card>
      </motion.div>

      {/* Dialog de confirmation de suppression */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleCancelDelete}
        onClick={(e) => e.stopPropagation()}
      >
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Êtes-vous sûr de vouloir supprimer le logement "{logement.titre}" ? Cette action est irréversible.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} color="primary">
            Annuler
          </Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default LogementCard;