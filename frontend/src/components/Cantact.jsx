import React from 'react';
import { Box, Typography, Grid, IconButton } from '@mui/material';
import { Phone, Email, LocationOn, Facebook, Twitter, Instagram, LinkedIn } from '@mui/icons-material';

const FooterContact = () => {
  return (
    <Box
      id="contact" // Ajoutez un id pour la navigation
      sx={{
        backgroundColor: '#212121',
        color: 'white',
        p: 4,
        position: 'relative',
        bottom: 0,
        width: '100%',
      }}
    >
      <Grid container spacing={4} justifyContent="center">
        {/* Informations de contact */}
        <Grid item xs={12} sm={6} md={3}>
          <Typography variant="h6" gutterBottom>
            Informations de contact
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Phone color="primary" sx={{ mr: 2 }} />
            <Typography>+212 6 12 34 56 78</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Email color="primary" sx={{ mr: 2 }} />
            <Typography>contact@gmail.com</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <LocationOn color="primary" sx={{ mr: 2 }} />
            <Typography>123, Mhamid, Marrakech, Maroc</Typography>
          </Box>
        </Grid>

  
        <Grid item xs={12} sm={6} md={3}>
          <Typography variant="h6" gutterBottom>
            Suivez-nous
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
            <IconButton color="primary" href="https://facebook.com" target="_blank">
              <Facebook />
            </IconButton>
            <IconButton color="primary" href="https://twitter.com" target="_blank">
              <Twitter />
            </IconButton>
            <IconButton color="primary" href="https://instagram.com" target="_blank">
              <Instagram />
            </IconButton>
            <IconButton color="primary" href="https://linkedin.com" target="_blank">
              <LinkedIn />
            </IconButton>
          </Box>
        </Grid>
      </Grid>
      
    
      <Box sx={{ textAlign: 'center', mt: 3 }}>
        <Typography variant="body2">
         
        </Typography>
      </Box>
    </Box>
  );
};

export default FooterContact;
