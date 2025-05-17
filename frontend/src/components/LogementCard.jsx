import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  IconButton,
  Box,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const LogementCard = ({ logement, handleDeleteLogement }) => {
  return (
    <Card>
      <CardMedia
        component="img"
        height="200"
        image={logement.image || 'https://source.unsplash.com/random/800x600?house'}
        alt={logement.titre}
      />

      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">{logement.titre}</Typography>

          {handleDeleteLogement && (
            <IconButton
              onClick={() => handleDeleteLogement(logement._id)}
              color="error"
              size="small"
            >
              <DeleteIcon />
            </IconButton>
          )}
        </Box>

        <Typography variant="body2" color="text.secondary">
          {logement.ville}, {logement.pays}
        </Typography>

        <Typography variant="body1" fontWeight="bold" sx={{ mt: 1 }}>
          {logement.prixParNuit} MAD / nuit
        </Typography>
      </CardContent>
    </Card>
  );
};

export default LogementCard;
