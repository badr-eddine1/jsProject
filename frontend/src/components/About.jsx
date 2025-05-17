import React from 'react';
import {
  AppBar, Toolbar, Typography, Button, Box, Container, Grid, Paper, Card, CardMedia, CardContent,
  Link as MuiLink, useTheme, useMediaQuery, IconButton, Divider, Stack, Avatar
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { Link as ScrollLink } from 'react-scroll';
import {
  Menu as MenuIcon,
  Facebook, Twitter, Instagram, Room, Star, Hotel, Restaurant, Pool, FitnessCenter, Spa
} from '@mui/icons-material';

// ---- Navbar ---- //
const Navbar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <AppBar position="sticky" elevation={0} sx={{ 
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      color: theme.palette.primary.main
    }}>
      <Container maxWidth="xl">
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar src="/logo.png" alt="BIBM Hôtel" sx={{ width: 50, height: 50 }} />
            <Typography variant="h6" sx={{ 
              fontWeight: 'bold',
              background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              BIBM Hôtel
            </Typography>
          </Box>

          {isMobile ? (
            <IconButton color="inherit">
              <MenuIcon />
            </IconButton>
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <ScrollLink to="about" smooth duration={500} offset={-70}>
                <Button color="inherit" sx={{ fontWeight: 600 }}>
                  À propos
                </Button>
              </ScrollLink>

              <ScrollLink to="services" smooth duration={500} offset={-70}>
                <Button color="inherit" sx={{ fontWeight: 600 }}>
                  Services
                </Button>
              </ScrollLink>

              <Button 
                variant="contained" 
                color="primary" 
                component={RouterLink} 
                to="/home"
                sx={{ 
                  fontWeight: 600,
                  borderRadius: 50,
                  px: 3,
                  boxShadow: 'none',
                  '&:hover': { boxShadow: '0px 3px 5px rgba(0,0,0,0.2)' }
                }}
              >
                Réserver
              </Button>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

// ---- About Section ---- //
const About = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box id="about" sx={{ 
      pt: 10,
      pb: 10,
      background: 'linear-gradient(to bottom, #f9f9f9 0%, #ffffff 100%)'
    }}>
      <Container maxWidth="xl">
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="overline" color="primary" sx={{ letterSpacing: 3 }}>
            LUXE & CONFORT
          </Typography>
          <Typography variant="h3" sx={{ 
            fontWeight: 'bold',
            mt: 1,
            mb: 3,
            background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Découvrez notre oasis urbain
          </Typography>
          <Typography variant="h6" color="textSecondary" sx={{ maxWidth: 800, mx: 'auto' }}>
            Un havre de paix au cœur de la ville, où élégance et modernité se rencontrent pour créer une expérience inoubliable.
          </Typography>
        </Box>

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Card sx={{ 
              borderRadius: 3,
              overflow: 'hidden',
              boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
              transition: 'transform 0.3s',
              '&:hover': { transform: 'translateY(-5px)' }
            }}>
              <CardMedia
                component="img"
                height="350"
                image="/images/deluxe-room.jpg"
                alt="Chambre de luxe"
              />
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
                  Nos Chambres Exclusives
                </Typography>
                <Typography variant="body1" color="textSecondary" paragraph sx={{ mb: 3 }}>
                  Des espaces lumineux et raffinés, conçus pour votre bien-être avec des matériaux nobles et une décoration contemporaine.
                </Typography>
                <Button
                  variant="outlined"
                  color="primary"
                  fullWidth
                  component={RouterLink}
                  to="/home"
                  sx={{
                    borderRadius: 50,
                    py: 1.5,
                    borderWidth: 2,
                    '&:hover': { borderWidth: 2 }
                  }}
                >
                  Explorer nos chambres
                </Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card sx={{ 
              borderRadius: 3,
              overflow: 'hidden',
              boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
              transition: 'transform 0.3s',
              '&:hover': { transform: 'translateY(-5px)' }
            }}>
              <CardMedia
                component="img"
                height="350"
                image="https://blog-media.but.fr/wp-content/uploads/2023/06/2-chambre-teinte-claire.jpg"
                alt="Services de l'hôtel"
              />
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
                  Nos Prestations
                </Typography>
                <Typography variant="body1" color="textSecondary" paragraph sx={{ mb: 3 }}>
                  Une gamme complète de services haut de gamme pour sublimer votre séjour et répondre à vos moindres désirs.
                </Typography>
                <ScrollLink to="services" smooth duration={500} offset={-70}>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{
                      borderRadius: 50,
                      py: 1.5,
                      boxShadow: 'none',
                      '&:hover': { boxShadow: '0px 3px 5px rgba(0,0,0,0.2)' }
                    }}
                  >
                    Découvrir nos services
                  </Button>
                </ScrollLink>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

// ---- Services Section ---- //
const Services = () => {
  const theme = useTheme();

  const serviceItems = [
    { icon: <Restaurant fontSize="large" />, title: "Restaurant Gastronomique", description: "Cuisine raffinée par nos chefs étoilés" },
    { icon: <Pool fontSize="large" />, title: "Piscine Panoramique", description: "Avec vue imprenable sur la ville" },
    { icon: <Spa fontSize="large" />, title: "Spa Luxueux", description: "Soins et massages personnalisés" },
    { icon: <FitnessCenter fontSize="large" />, title: "Centre de Fitness", description: "Équipements haut de gamme" },
    { icon: <Room fontSize="large" />, title: "Conciergerie", description: "Service 24h/24" },
    { icon: <Hotel fontSize="large" />, title: "Chambres VIP", description: "Suite présidentielle disponible" }
  ];

  return (
    <Box id="services" sx={{ 
      py: 10,
      backgroundColor: theme.palette.background.default
    }}>
      <Container maxWidth="xl">
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="overline" color="primary" sx={{ letterSpacing: 3 }}>
            NOS PRESTATIONS
          </Typography>
          <Typography variant="h3" sx={{ 
            fontWeight: 'bold',
            mt: 1,
            mb: 3
          }}>
            Une expérience incomparable
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {serviceItems.map((service, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Paper sx={{ 
                p: 4,
                height: '100%',
                borderRadius: 3,
                textAlign: 'center',
                transition: 'all 0.3s',
                '&:hover': { 
                  transform: 'translateY(-5px)',
                  boxShadow: '0 15px 30px rgba(0,0,0,0.1)'
                }
              }}>
                <Box sx={{ 
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  backgroundColor: theme.palette.primary.light,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 3,
                  color: theme.palette.primary.main
                }}>
                  {service.icon}
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {service.title}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {service.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

// ---- Footer ---- //
const Footer = () => {
  const theme = useTheme();

  return (
    <Box sx={{ 
      backgroundColor: theme.palette.primary.dark,
      color: theme.palette.common.white,
      pt: 6,
      pb: 3
    }}>
      <Container maxWidth="xl">
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar src="/logo.png" alt="BIBM Hôtel" sx={{ width: 50, height: 50, mr: 2 }} />
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                BIBM Hôtel
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ mb: 2 }}>
              123 Avenue des Champs-Élysées<br />
              75008 Paris, France
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Tél: +33 1 23 45 67 89<br />
              Email: contact@bibmhotel.com
            </Typography>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
              Liens rapides
            </Typography>
            <Stack spacing={1}>
              <MuiLink href="#" color="inherit" underline="hover">Accueil</MuiLink>
              <MuiLink href="#about" color="inherit" underline="hover">À propos</MuiLink>
              <MuiLink href="#services" color="inherit" underline="hover">Services</MuiLink>
              <MuiLink href="#" color="inherit" underline="hover">Chambres</MuiLink>
              <MuiLink href="#" color="inherit" underline="hover">Contact</MuiLink>
            </Stack>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
              Suivez-nous
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              <IconButton sx={{ color: 'inherit' }}>
                <Facebook />
              </IconButton>
              <IconButton sx={{ color: 'inherit' }}>
                <Instagram />
              </IconButton>
              <IconButton sx={{ color: 'inherit' }}>
                <Twitter />
              </IconButton>
            </Box>
            <Typography variant="body2">
              Abonnez-vous à notre newsletter pour recevoir nos offres spéciales
            </Typography>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, backgroundColor: 'rgba(255,255,255,0.1)' }} />

        <Typography variant="body2" align="center">
          © {new Date().getFullYear()} BIBM Hôtel. Tous droits réservés.
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
      <Services />
      <Footer />
    </div>
  );
};

export default App;