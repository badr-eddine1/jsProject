import React from 'react';
import { Box, Button, Typography, Grid, Card, CardContent } from '@mui/material';
import { Wifi, Bed, LocalDining } from '@mui/icons-material';

const Home = () => {
  return (
    <Box sx={{ p: 4 , backgroundColor: '#f5f5f5'}}>
      {/* Section d'accueil */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h2" component="h1" gutterBottom>
          Bienvenue à HotelBooking
        </Typography>
        <Typography variant="h6" color="textSecondary" paragraph>
          Profitez d'un séjour inoubliable dans nos chambres luxueuses et notre ambiance chaleureuse.
        </Typography>
        <Button variant="contained" color="primary" size="large" href="/chambres" sx={{ mr: 2 }}>
          Explorez nos chambres
        </Button>
        <Button variant="outlined" color="primary" size="large" href="/contact">
          Contactez-nous
        </Button>
      </Box>

      {/* Section des services */}
      <Typography variant="h4" component="h2" gutterBottom sx={{ textAlign: 'center', mb: 4 }}>
        Nos Services
      </Typography>
      <Grid container spacing={4}>
        {/* Carte pour chaque service */}
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ textAlign: 'center', p: 2 }}>
            <Bed color="primary" sx={{ fontSize: 50 }} />
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Chambres confortables
              </Typography>
              <Typography color="textSecondary">
                Des chambres modernes et équipées pour un séjour relaxant.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ textAlign: 'center', p: 2 }}>
            <LocalDining color="primary" sx={{ fontSize: 50 }} />
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Petit-déjeuner inclus
              </Typography>
              <Typography color="textSecondary">
                Dégustez un petit-déjeuner délicieux pour bien commencer la journée.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ textAlign: 'center', p: 2 }}>
            <Wifi color="primary" sx={{ fontSize: 50 }} />
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Wi-Fi gratuit
              </Typography>
              <Typography color="textSecondary">
                Profitez d'une connexion Internet rapide et gratuite.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Home;
