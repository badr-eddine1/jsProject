import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Box,
  InputAdornment,
  IconButton,
  Alert,
  LinearProgress,
  Link,
  Paper,
  useTheme
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { 
  Visibility, 
  VisibilityOff, 
  Email, 
  Person, 
  Phone,
  ArrowForward,
  CheckCircle,
  Error
} from '@mui/icons-material';
import * as yup from 'yup';
import { motion } from 'framer-motion';

const SignupForm = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    agreeToTerms: false,
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    message: '',
    color: 'error'
  });
  const [message, setMessage] = useState({ text: '', severity: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Schéma de validation avec yup
  const validationSchema = yup.object().shape({
    fullName: yup.string()
      .required('Full name is required')
      .min(3, 'Name must be at least 3 characters'),
    email: yup.string()
      .email('Please enter a valid email')
      .required('Email is required'),
    password: yup.string()
      .required('Password is required')
      .min(8, 'Password must be at least 8 characters'),
    confirmPassword: yup.string()
      .oneOf([yup.ref('password'), null], 'Passwords must match')
      .required('Please confirm your password'),
    agreeToTerms: yup.boolean()
      .oneOf([true], 'You must accept the terms and conditions')
  });

  // Évalue la force du mot de passe
  const evaluatePasswordStrength = (password) => {
    let score = 0;
    const messages = [];
    const colors = ['error', 'warning', 'info', 'success'];
    
    if (password.length >= 8) score++;
    else messages.push('At least 8 characters');
    
    if (/[A-Z]/.test(password)) score++;
    else messages.push('At least one uppercase letter');
    
    if (/[0-9]/.test(password)) score++;
    else messages.push('At least one number');
    
    if (/[^A-Za-z0-9]/.test(password)) score++;
    else messages.push('At least one special character');
    
    return {
      score,
      message: messages.length > 0 ? `Missing: ${messages.join(', ')}` : 'Strong password!',
      color: colors[score] || 'error'
    };
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;

    setFormData(prev => ({
      ...prev,
      [name]: newValue,
    }));

    // Effacer les erreurs quand l'utilisateur modifie le champ
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }

    // Évaluer la force du mot de passe
    if (name === 'password') {
      setPasswordStrength(evaluatePasswordStrength(value));
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
    setIsSubmitting(true);
    setMessage({ text: '', severity: '' });

    try {
      // Validation complète
      await validationSchema.validate(formData, { abortEarly: false });

      const response = await fetch('http://localhost:5000/api/users/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ 
          text: 'Account successfully created! Redirecting to login...', 
          severity: 'success' 
        });
        setTimeout(() => navigate('/login'), 2000);
      } else {
        throw new Error(data.message || 'Registration failed');
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
          text: error.message || 'Error during sign up. Please try again.', 
          severity: 'error' 
        });
      }
    } finally {
      setIsSubmitting(false);
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
            maxWidth: 500, 
            width: '100%',
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
              Create Your Account
            </Typography>
            <Typography variant="subtitle1">
              Start booking your next adventure today
            </Typography>
          </Box>

          <CardContent sx={{ p: 4 }}>
            {message.text && (
              <Alert 
                severity={message.severity}
                icon={message.severity === 'success' ? <CheckCircle /> : <Error />}
                sx={{ mb: 3 }}
              >
                {message.text}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    label="Full Name"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    fullWidth
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Person color="action" />
                        </InputAdornment>
                      ),
                    }}
                    error={!!errors.fullName}
                    helperText={errors.fullName}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    fullWidth
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Email color="action" />
                        </InputAdornment>
                      ),
                    }}
                    error={!!errors.email}
                    helperText={errors.email}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    label="Password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    fullWidth
                    variant="outlined"
                    InputProps={{
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
                    error={!!errors.password}
                    helperText={errors.password}
                  />
                  <Box sx={{ mt: 1 }}>
                    <LinearProgress 
                      variant="determinate" 
                      value={passwordStrength.score * 25} 
                      color={passwordStrength.color}
                      sx={{ height: 4, borderRadius: 2 }}
                    />
                    <Typography 
                      variant="caption" 
                      color={`${passwordStrength.color}.main`}
                      sx={{ mt: 0.5, display: 'block' }}
                    >
                      {passwordStrength.message}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    label="Confirm Password"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    fullWidth
                    variant="outlined"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton 
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            edge="end"
                          >
                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    label="Phone Number (Optional)"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    fullWidth
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Phone color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        name="agreeToTerms"
                        checked={formData.agreeToTerms}
                        onChange={handleChange}
                        color="primary"
                      />
                    }
                    label={
                      <Typography variant="body2">
                        I agree to the{' '}
                        <Link href="#" color="primary">
                          Terms and Conditions
                        </Link>
                      </Typography>
                    }
                  />
                  {errors.agreeToTerms && (
                    <Typography variant="caption" color="error" sx={{ display: 'block', mt: -1 }}>
                      {errors.agreeToTerms}
                    </Typography>
                  )}
                </Grid>

                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    size="large"
                    disabled={isSubmitting}
                    endIcon={<ArrowForward />}
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
                    {isSubmitting ? 'Creating Account...' : 'Create Account'}
                  </Button>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="body2" align="center" sx={{ mt: 2 }}>
                    Already have an account?{' '}
                    <Link 
                      href="#" 
                      color="primary" 
                      fontWeight="bold"
                      onClick={() => navigate('/loginForm')}
                    >
                      Sign In
                    </Link>
                  </Typography>
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </Box>
  );
};

export default SignupForm;