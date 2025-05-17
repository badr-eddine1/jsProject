import { Grid, Typography, Box, Button } from '@mui/material';
import LogementCard from './LogementCard';

const LogementList = ({ logements, onDelete, onReserve }) => (
  <Grid container spacing={4}>
    {logements.length === 0 ? (
      <Grid item xs={12}>
        <Typography variant="body1" color="text.secondary" align="center">
          Aucun logement disponible.
        </Typography>
      </Grid>
    ) : (
      logements.map((logement) => (
        <Grid item key={logement._id} xs={12} sm={6} md={4}>
          <LogementCard logement={logement} onDelete={onDelete} />
          
          {onReserve && (
            <Box sx={{ mt: 1 }}>
              <Button variant="contained" color="primary" fullWidth onClick={() => onReserve(logement)}>
                Réserver
              </Button>
            </Box>
          )}
        </Grid>
      ))
    )}
  </Grid>
);

export default LogementList;
