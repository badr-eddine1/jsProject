import React, { useState } from 'react';
import {
  Button,
  TextField,
  CircularProgress,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Box,
  IconButton,
  InputAdornment,
  Alert,
  useTheme,
  Fade,
  Link as MuiLink
} from '@mui/material';
import { 
  Mail, 
  Lock, 
  Visibility, 
  VisibilityOff,
  Login as LoginIcon,
  ArrowForward
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as yup from 'yup';

const LoginForm = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState({ text: '', severity: '' });

  // Schéma de validation avec yup
  const validationSchema = yup.object().shape({
    email: yup.string()
      .email('Please enter a valid email')
      .required('Email is required'),
    password: yup.string()
      .required('Password is required')
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Effacer les erreurs quand l'utilisateur modifie le champ
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateField = async (field, value) => {
    try {
      await yup.reach(validationSchema, field).validate(value);
      setErrors(prev => ({ ...prev, [field]: '' }));
    } catch (err) {
      setErrors(prev => ({ ...prev, [field]: err.message }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    validateField(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ text: '', severity: '' });

    try {
      // Validation complète
      await validationSchema.validate(formData, { abortEarly: false });

      const response = await fetch('http://localhost:5000/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Stockage des informations utilisateur
        localStorage.setItem('token', data.token);
        localStorage.setItem('fullName', data.user.fullName);
        localStorage.setItem('role', data.user.role || 'user');
        localStorage.setItem('email', data.user.email);

        setMessage({ 
          text: 'Login successful! Redirecting...', 
          severity: 'success' 
        });

        // Redirection après un court délai
        setTimeout(() => {
          navigate(data.user.role === 'admin' ? '/admin' : '/');
        }, 1500);
      } else {
        throw new Error(data.message || 'Invalid credentials');
      }
    } catch (error) {
      if (error.name === 'ValidationError') {
        const validationErrors = {};
        error.inner.forEach(err => {
          validationErrors[err.path] = err.message;
        });
        setErrors(validationErrors);
      } else {
        setMessage({ 
          text: error.message || 'An error occurred while logging in', 
          severity: 'error' 
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: theme.palette.mode === 'light' 
          ? 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' 
          : theme.palette.background.default,
        p: 2
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card 
          sx={{ 
            width: '100%',
            maxWidth: 450,
            boxShadow: theme.shadows[10],
            borderRadius: 4,
            overflow: 'hidden'
          }}
        >
          <Box
            sx={{
              background: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
              p: 3,
              textAlign: 'center'
            }}
          >
            <Typography variant="h4" component="h1" fontWeight="bold">
              Welcome Back
            </Typography>
            <Typography variant="subtitle1">
              Sign in to continue to your account
            </Typography>
          </Box>

          <CardContent sx={{ p: 4 }}>
            {message.text && (
              <Fade in={!!message.text}>
                <Alert 
                  severity={message.severity}
                  sx={{ mb: 3 }}
                >
                  {message.text}
                </Alert>
              </Fade>
            )}

            <form onSubmit={handleSubmit}>
              <TextField
                label="Email Address"
                name="email"
                type="email"
                fullWidth
                variant="outlined"
                margin="normal"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!errors.email}
                helperText={errors.email}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Mail color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 2 }}
              />

              <TextField
                label="Password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                fullWidth
                variant="outlined"
                margin="normal"
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!errors.password}
                helperText={errors.password}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton 
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 1 }}
              />

              <Box sx={{ textAlign: 'right', mb: 2 }}>
                <MuiLink 
                  component={Link} 
                  to="/forgot-password" 
                  color="text.secondary"
                  variant="body2"
                >
                  Forgot password?
                </MuiLink>
              </Box>

              <Button
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                type="submit"
                disabled={isLoading}
                startIcon={isLoading ? <CircularProgress size={20} /> : <LoginIcon />}
                endIcon={!isLoading && <ArrowForward />}
                sx={{
                  py: 1.5,
                  fontWeight: 'bold',
                  borderRadius: 2,
                  boxShadow: 'none',
                  '&:hover': {
                    boxShadow: theme.shadows[4],
                    transform: 'translateY(-2px)'
                  },
                  transition: 'all 0.2s ease'
                }}
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Button>

              <Typography 
                variant="body2" 
                align="center" 
                sx={{ mt: 3, color: 'text.secondary' }}
              >
                Don't have an account?{' '}
                <MuiLink 
                  component={Link} 
                  to="/signup" 
                  color="primary"
                  fontWeight="bold"
                >
                  Sign Up
                </MuiLink>
              </Typography>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </Box>
  );
};

export default LoginForm;