import React from 'react';
import { Box, Typography, Grid, Button, Card, CardMedia, CardContent } from '@mui/material';
import {Link} from 'react-router-dom';
const Room = () => {
  // Liste des chambres avec leurs détails
  const rooms = [
    {
      id: 1,
      name: 'Chambre Deluxe',
      description: 'Une expérience de luxe avec vue sur la mer.',
      image: '/images/deluxe-room.jpg',
      superficie: '30 m²',
      prix: 120,
    },
    {
      id: 2,
      name: 'Chambre Standard',
      description: 'Une chambre confortable avec vue sur le jardin.',
      image: '/images/2.jpg',
      superficie: '40 m²',
      prix: 140,
    },
  ];

  return (
    <Box
     id="homeroom"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center', 
        minHeight: '100vh', 
        backgroundColor: '#f5f5f5',
      }}
    >
      <Typography variant="h3" component="h1" gutterBottom>
        Nos Chambres
      </Typography>
      <Typography variant="h5" color="textSecondary" paragraph>
        Découvrez notre gamme de chambres adaptées à tous vos besoins.
      </Typography>

      {/* Affichage des chambres sous forme de cartes */}
      <Grid container spacing={4} justifyContent="center">
        {rooms.map((room) => (
          <Grid item xs={12} sm={6} md={4} key={room.id}>
            <Card>
              <CardMedia
                component="img"
                height="200"
                image={room.image}
                alt={room.name}
              />
              <CardContent>
              <Typography variant="h5" color="textSecondary" paragraph>
        Découvrez notre gamme de chambres adaptées à tous vos besoins.
      </Typography>
              </CardContent>
            </Card>
        
          </Grid>
          
        ))}
          
      </Grid>
      <Typography variant="h5" color="textSecondary" paragraph>
        pour plus d'informations
      </Typography>
      <Button 
      variant="contained" 
      color="primary" 
      size="large"
       component={Link}
     to={'chambres'} 
       >
                 plus information
                </Button>

    </Box>
  );
};

export default Room;
