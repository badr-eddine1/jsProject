import React from 'react';
import { Box, Typography, Grid,Button, Card, CardMedia, CardContent } from '@mui/material';

const Room = () => {
  
  const rooms = [
    {
      id: 1,
      name: 'Chambre Deluxe',
      description: 'Une expérience de luxe avec vue sur la mer.',
      image: '/images/deluxe-room.jpg',
      superficie:'30 m²',
      prix:'120'

    },
    {
      id: 2,
      name: 'Chambre Standard',
      description: 'Une chambre confortable avec vue sur le jardin.',
      image: '/images/2.jpg',
      superficie:'40 m²',
      prix:'140'
    },
    {
      id: 3,
      name: 'Suite Présidentielle',
      description: 'Un luxe incomparable avec salon privé.',
      image: '/images/3.jpg',
      superficie:'20 m²',
      prix:'100'
    },
    {
      id: 4,
      name: 'Chambre Familiale',
      description: 'Idéale pour des séjours en famille.',
      image: '/images/4.jpg',
      superficie:'15 m²',
      prix:'80'
    },
    {
      id: 5,
      name: 'Chambre Deluxe',
      description: 'Une expérience de luxe avec vue sur la mer.',
      image: '/images/5.jpg',
      superficie:'30 m²',
      prix:'120'

    },
    {
      id: 6,
      name: 'Chambre Standard',
      description: 'Une chambre confortable avec vue sur le jardin.',
      image: '/images/6.jpg',
      superficie:'40 m²',
      prix:'140'
    },
    {
      id: 7,
      name: 'Suite Présidentielle',
      description: 'Un luxe incomparable avec salon privé.',
      image: '/images/7.jpg',
      superficie:'20 m²',
      prix:'100'
    },
    {
      id: 8,
      name: 'Chambre Deluxe',
      description: 'Une expérience de luxe avec vue sur la mer.',
      image: '/images/8.jpg',
      superficie:'30 m²',
      prix:'120'

    },
    
    {
      id: 9,
      name: 'Chambre Familiale',
      description: 'Idéale pour des séjours en famille.',
      image: '/images/10.jpg',
      superficie:'15 m²',
      prix:'80'
    },
    
  ];

  return (
    <Box  sx={{ p: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        Nos Chambres
      </Typography>
      <Typography variant="h5" color="textSecondary" paragraph>
        Découvrez notre gamme de chambres adaptées à tous vos besoins.
      </Typography>

      <Grid container spacing={4}>
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
              <Typography variant="h6" gutterBottom>
                Détails de la chambre
              </Typography>
              <ul>
                <li><Typography color="textSecondary">{room.superficie}</Typography></li>
                <li><Typography color="textSecondary">Lit king-size</Typography></li>
                <li><Typography color="textSecondary">Vue panoramique sur la ville</Typography></li>
                <li><Typography color="textSecondary">Wi-Fi gratuit</Typography></li>
                <li><Typography color="textSecondary">Télévision à écran plat</Typography></li>
                <li><Typography color="textSecondary">Climatisation et chauffage</Typography></li>
              </ul>

              <Typography variant="h5" color="primary" gutterBottom>
                Tarif: {room.prix} € / nuit
              </Typography>

              <Button variant="contained" color="primary" size="large" href="/reservation">
                Réservez maintenant
              </Button>
            </CardContent>
            </Card>
          </Grid>
        ))

        }
      </Grid>
      
    </Box>
    
  );
};

export default Room;