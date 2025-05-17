import React from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  IconButton, 
  Divider,
  useTheme,
  useMediaQuery,
  Container, // Ajouté ici
  Card       // Ajouté ici
} from '@mui/material';
import { 
  Phone, 
  Email, 
  LocationOn, 
  Facebook, 
  Twitter, 
  Instagram, 
  LinkedIn,
  ContactMail,
  Share
} from '@mui/icons-material';

const Contact = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box
      id="contact"
      sx={{
        backgroundColor: theme.palette.primary.dark,
        color: theme.palette.common.white,
        py: 6,
        px: isMobile ? 2 : 10,
        position: 'relative',
        width: '100%',
      }}
    >
      <Container maxWidth="lg">
        <Typography 
          variant="h4" 
          align="center" 
          gutterBottom 
          sx={{ 
            mb: 4,
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <ContactMail sx={{ mr: 2, fontSize: '2rem' }} />
          Contactez-nous
        </Typography>

        <Grid container spacing={6} justifyContent="center">
          {/* Contact Information */}
          <Grid item xs={12} md={4}>
            <Card sx={{ 
              p: 3,
              height: '100%',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              borderRadius: 2,
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
            }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
                Informations de contact
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Phone color="secondary" sx={{ mr: 2, fontSize: '1.5rem' }} />
                <Box>
                  <Typography variant="body1" color="textSecondary">Téléphone</Typography>
                  <Typography variant="h6" component="a" href="tel:+212612345678" sx={{ 
                    color: 'inherit', 
                    textDecoration: 'none',
                    '&:hover': { color: theme.palette.secondary.main }
                  }}>
                    +212 6 12 34 56 78
                  </Typography>
                </Box>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Email color="secondary" sx={{ mr: 2, fontSize: '1.5rem' }} />
                <Box>
                  <Typography variant="body1" color="textSecondary">Email</Typography>
                  <Typography variant="h6" component="a" href="mailto:contact@gmail.com" sx={{ 
                    color: 'inherit', 
                    textDecoration: 'none',
                    '&:hover': { color: theme.palette.secondary.main }
                  }}>
                    contact@gmail.com
                  </Typography>
                </Box>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <LocationOn color="secondary" sx={{ mr: 2, fontSize: '1.5rem' }} />
                <Box>
                  <Typography variant="body1" color="textSecondary">Adresse</Typography>
                  <Typography variant="h6">
                    123, Mhamid, Marrakech, Maroc
                  </Typography>
                </Box>
              </Box>
            </Card>
          </Grid>

          {/* Social Media */}
          <Grid item xs={12} md={4}>
            <Card sx={{ 
              p: 3,
              height: '100%',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              borderRadius: 2,
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
            }}>
              <Typography variant="h6" gutterBottom sx={{ 
                fontWeight: 'bold', 
                mb: 3,
                display: 'flex',
                alignItems: 'center'
              }}>
                <Share sx={{ mr: 1 }} />
                Suivez-nous
              </Typography>
              
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                gap: 2,
                flexWrap: 'wrap'
              }}>
                {[
                  { icon: <Facebook />, url: 'https://facebook.com', color: '#4267B2' },
                  { icon: <Twitter />, url: 'https://twitter.com', color: '#1DA1F2' },
                  { icon: <Instagram />, url: 'https://instagram.com', color: '#E1306C' },
                  { icon: <LinkedIn />, url: 'https://linkedin.com', color: '#0077B5' }
                ].map((social, index) => (
                  <IconButton 
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      color: social.color,
                      '&:hover': { 
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                        transform: 'translateY(-3px)'
                      },
                      transition: 'all 0.3s ease',
                      width: 56,
                      height: 56
                    }}
                  >
                    {social.icon}
                  </IconButton>
                ))}
              </Box>
              
              <Typography variant="body1" sx={{ mt: 3, textAlign: 'center' }}>
                Rejoignez notre communauté pour les dernières actualités et offres spéciales
              </Typography>
            </Card>
          </Grid>
        </Grid>

        <Divider sx={{ 
          my: 4, 
          backgroundColor: 'rgba(255, 255, 255, 0.2)' 
        }} />

        <Typography 
          variant="body2" 
          align="center"
          sx={{ opacity: 0.8 }}
        >
          © {new Date().getFullYear()} BIBM Hôtel. Tous droits réservés.
        </Typography>
      </Container>
    </Box>
  );
};

export default Contact;