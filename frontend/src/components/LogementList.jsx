import { Grid, Typography } from '@mui/material';
import LogementCard from './LogementCard';

const LogementList = ({ logements, onDelete }) => (
  <Grid container spacing={4}>
    {logements.length === 0 ? (
      <Typography variant="body1" color="text.secondary" sx={{ width: '100%' }}>
        Aucun logement disponible.
      </Typography>
    ) : (
      logements.map((logement) => (
        <Grid item key={logement._id} xs={12} sm={6} md={4}>
          <LogementCard logement={logement} onDelete={onDelete} />
        </Grid>
      ))
    )}
  </Grid>
);

export default LogementList;
