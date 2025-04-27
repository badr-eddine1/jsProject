import { Card, CardMedia, CardContent, Typography, IconButton } from '@mui/material';
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
        <Typography variant="h6">{logement.titre}</Typography>
        <Typography variant="body2" color="text.secondary">
          {logement.ville}, {logement.pays}
        </Typography>
        <Typography variant="body1" fontWeight="bold">
          {logement.prixParNuit} MAD / nuit
        </Typography>
        <IconButton onClick={() => handleDeleteLogement(logement._id)} color="error">
          <DeleteIcon />
        </IconButton>
      </CardContent>
    </Card>
  );
};

export default LogementCard;
