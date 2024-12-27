import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Button, Card, CardMedia, CardContent } from '@mui/material';
import axios from 'axios';

const Room = () => {
  const [rooms, setRooms] = useState([]);

  // Récupérer les données depuis l'API au chargement du composant
  useEffect(() => {
    axios
      .get('http://localhost:5000/api/rooms')
      .then((response) => {
        setRooms(response.data);
      })
      .catch((error) => {
        console.error('Erreur lors de la récupération des chambres', error);
      });
  }, []);

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        Nos Chambres
      </Typography>
      <Typography variant="h5" color="textSecondary" paragraph>
        Découvrez notre gamme de chambres adaptées à tous vos besoins.
      </Typography>

      {/* Affichage des chambres sous forme de cartes */}
      <Grid container spacing={4}>
        {rooms.map((room) => (
          <Grid item xs={12} sm={6} md={4} key={room._id}>
            <Card sx={{ '&:hover': { boxShadow: 10 }, transition: 'box-shadow 0.3s ease' }}>
              <CardMedia
                component="img"
                height="200"
                image={room.image}
                alt={room.name}
                sx={{ objectFit: 'cover' }}
              />
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {room.name}
                </Typography>
                <Typography color="textSecondary">{room.description}</Typography>
                <Typography color="textSecondary">{room.superficie}</Typography>
                <Typography variant="h5" color="primary" gutterBottom>
                  Tarif: {room.prix} € / nuit
                </Typography>
                <Button variant="contained" color="primary" size="large" href="/reservation">
                  Réservez maintenant
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Room;
