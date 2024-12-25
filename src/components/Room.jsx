import React from 'react';
import { Box, Typography, Button, Card, CardMedia, CardContent, Grid } from '@mui/material';

const Room = () => {
  return (
    <Box sx={{ p: 4 }}>
      {/* Section d'information sur la chambre */}
      <Typography variant="h3" component="h1" gutterBottom>
        Chambre Deluxe
      </Typography>
      <Typography variant="h5" color="textSecondary" paragraph>
        Profitez d'une expérience de luxe avec nos chambres spacieuses et élégantes. Chaque chambre est équipée des meilleurs équipements pour vous offrir un séjour confortable.
      </Typography>

      {/* Grid pour afficher l'image et les détails */}
      <Grid container spacing={4}>
        {/* Image de la chambre */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardMedia
              component="img"
              height="400"
              image="/images/deluxe-room.jpg" // Image de la chambre
              alt="Chambre Deluxe"
            />
          </Card>
        </Grid>

        {/* Détails de la chambre */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Détails de la chambre
              </Typography>
              <ul>
                <li><Typography color="textSecondary">Superficie: 30 m²</Typography></li>
                <li><Typography color="textSecondary">Lit king-size</Typography></li>
                <li><Typography color="textSecondary">Vue panoramique sur la ville</Typography></li>
                <li><Typography color="textSecondary">Wi-Fi gratuit</Typography></li>
                <li><Typography color="textSecondary">Télévision à écran plat</Typography></li>
                <li><Typography color="textSecondary">Climatisation et chauffage</Typography></li>
              </ul>

              <Typography variant="h5" color="primary" gutterBottom>
                Tarif: 120 € / nuit
              </Typography>

              <Button variant="contained" color="primary" size="large" href="/reservation">
                Réservez maintenant
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Room;
