import React from 'react';
import { Box, Typography, Container, Grid, Paper, Card, CardMedia, CardContent, Button } from '@mui/material';


const About = () => {
  return (
    <Box sx={{ p: 4, backgroundColor: '#f5f5f5' }}>
      <Container>
        <Typography variant="h3" component="h1" gutterBottom align="center" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
          À propos de notre hôtel
        </Typography>
        <Typography variant="h5" color="textSecondary" paragraph align="center">
          Nous offrons une expérience inoubliable avec des chambres luxueuses, des services haut de gamme et un cadre exceptionnel pour vous détendre ou travailler.
        </Typography>

        <Grid container spacing={4}>
          {/* Première section : Confort et luxe */}
          <Grid item xs={12} md={6}>
            <Card sx={{ display: 'flex', flexDirection: 'column', boxShadow: 4 }}>
              <CardMedia
                component="img"
                height="250"
                image="/images/deluxe-room.jpg" // Image de chambre luxe
                alt="Chambre de luxe"
              />
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Confort et Luxe
                </Typography>
                <Typography variant="body1" color="textSecondary" paragraph>
                  Nos chambres spacieuses offrent une vue imprenable sur la ville. Profitez de l'élégance et du confort de chaque détail, conçu pour rendre votre séjour agréable.
                </Typography>
                <Button variant="contained" color="primary" fullWidth>
                  Découvrez nos chambres
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {/* Deuxième section : Services haut de gamme */}
          <Grid item xs={12} md={6}>
            <Card sx={{ display: 'flex', flexDirection: 'column', boxShadow: 4 }}>
              <CardMedia
                component="img"
                height="250"
                image="/images/hotel.jpg" // Image de services de l'hôtel
                alt="Services de l'hôtel"
              />
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Services Haut de Gamme
                </Typography>
                <Typography variant="body1" color="textSecondary" paragraph>
                  Nous proposons une gamme complète de services pour votre confort, y compris un spa, un restaurant gastronomique, une piscine et une salle de sport.
                </Typography>
                <Button variant="contained" color="primary" fullWidth>
                  Explorez nos services
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Section additionnelle : Pourquoi choisir notre hôtel ? */}
        <Box sx={{ mt: 6, textAlign: 'center' }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
            Pourquoi choisir notre hôtel ?
          </Typography>
          <Grid container spacing={4} sx={{ mt: 3 }}>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 4, boxShadow: 3, backgroundColor: '#ffffff', textAlign: 'center' }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Emplacement idéal</Typography>
                <Typography variant="body1" color="textSecondary">
                  Situé dans le centre-ville, proche de toutes les attractions touristiques, vous êtes à quelques pas des principaux sites.
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 4, boxShadow: 3, backgroundColor: '#ffffff', textAlign: 'center' }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Chambres élégantes</Typography>
                <Typography variant="body1" color="textSecondary">
                  Chaque chambre est conçue pour le confort et le luxe, avec des équipements modernes et un design soigné.
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 4, boxShadow: 3, backgroundColor: '#ffffff', textAlign: 'center' }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Service exceptionnel</Typography>
                <Typography variant="body1" color="textSecondary">
                  Notre équipe dévouée est à votre service 24/7 pour répondre à tous vos besoins et garantir un séjour sans souci.
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default About;
