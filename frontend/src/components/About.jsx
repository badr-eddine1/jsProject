import React from 'react';
import {
  AppBar, Toolbar, Typography, Button, Box, Container, Grid, Paper, Card, CardMedia, CardContent, Link as MuiLink
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { Link as ScrollLink } from 'react-scroll';

// ---- Navbar ---- //
const Navbar = () => {
  return (
    <AppBar position="static" color="primary">
      <Toolbar sx={{ justifyContent: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            BIBM Hôtel
          </Typography>

          <ScrollLink to="about" smooth duration={1000}>
            <Button color="inherit">
              À propos
            </Button>
          </ScrollLink>

          <ScrollLink to="services" smooth duration={1000}>
            <Button color="inherit">
              Services
            </Button>
          </ScrollLink>

          <Button color="inherit" component={RouterLink} to="/home">
            Réserver
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

// ---- About Section ---- //
const About = () => {
  return (
    <Box id="about" sx={{ p: 4, backgroundColor: '#f5f5f5' }}>
      <Container>
        <Typography variant="h3" align="center" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2' }}>
          À propos de notre hôtel
        </Typography>
        <Typography variant="h5" color="textSecondary" paragraph align="center">
          Nous offrons une expérience inoubliable avec des chambres luxueuses, des services haut de gamme et un cadre exceptionnel.
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Card sx={{ boxShadow: 4 }}>
              <CardMedia
                component="img"
                height="250"
                image="/images/deluxe-room.jpg"
                alt="Chambre de luxe"
              />
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Confort et Luxe
                </Typography>
                <Typography variant="body1" color="textSecondary" paragraph>
                  Nos chambres offrent une vue imprenable, avec un confort pensé pour chaque détail.
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  component={RouterLink}
                  to="/home"
                >
                  Découvrez nos chambres
                </Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card sx={{ boxShadow: 4 }}>
              <CardMedia
                component="img"
                height="250"
                image="/images/hotel.jpg"
                alt="Services de l'hôtel"
              />
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Services Haut de Gamme
                </Typography>
                <Typography variant="body1" color="textSecondary" paragraph>
                  Spa, restaurant gastronomique, piscine, salle de sport… tout pour un séjour parfait.
                </Typography>
                <ScrollLink to="services" smooth duration={1000}>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                  >
                    Explorez nos services
                  </Button>
                </ScrollLink>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Box id="services" sx={{ mt: 6, textAlign: 'center' }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
            Pourquoi choisir notre hôtel ?
          </Typography>
          <Grid container spacing={4} sx={{ mt: 3 }}>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 4, boxShadow: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Emplacement idéal</Typography>
                <Typography variant="body1" color="textSecondary">
                  Situé au centre-ville, proche des principales attractions touristiques.
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 4, boxShadow: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Chambres élégantes</Typography>
                <Typography variant="body1" color="textSecondary">
                  Un design raffiné et des équipements modernes pour votre confort.
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 4, boxShadow: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Service exceptionnel</Typography>
                <Typography variant="body1" color="textSecondary">
                  Une équipe disponible 24/7 pour répondre à tous vos besoins.
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

// ---- Footer ---- //
const Footer = () => {
  return (
    <Box sx={{ backgroundColor: '#1976d2', p: 3, mt: 5 }}>
      <Container maxWidth="lg">
        
        <Typography variant="body2" align="center" sx={{ color: '#fff' }}>
          Suivez-nous :
          <MuiLink href="#" color="inherit" sx={{ ml: 1, mr: 1 }}>Facebook</MuiLink>|
          <MuiLink href="#" color="inherit" sx={{ ml: 1, mr: 1 }}>Instagram</MuiLink>|
          <MuiLink href="#" color="inherit" sx={{ ml: 1 }}>Twitter</MuiLink>
        </Typography>
      </Container>
    </Box>
  );
};

// ---- App Component ---- //
const App = () => {
  return (
    <div>
      <Navbar />
      <About />
      <Footer />
    </div>
  );
};

export default App;
