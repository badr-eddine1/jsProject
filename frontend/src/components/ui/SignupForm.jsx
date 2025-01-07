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
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';  // Import de useNavigate
import { Visibility, VisibilityOff, Email, Person, Phone } from '@mui/icons-material';

const SignupForm = () => {
  const navigate = useNavigate(); // Hook pour la navigation
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
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [message, setMessage] = useState(''); // État pour le message

  const validatePassword = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: '',
    }));

    if (name === 'password') {
      setPasswordStrength(validatePassword(value));
    }
  };

  useEffect(() => {
    if (formData.confirmPassword && formData.password !== formData.confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: 'Passwords do not match',
      }));
    } else {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: '',
      }));
    }
  }, [formData.password, formData.confirmPassword]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
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
        setMessage('Account successfully created!'); // Message de succès
        setTimeout(() => {
          navigate('/LoginForm');  // Redirection après 3 secondes
        }, 3000);  // Délai de 3 secondes avant la redirection
      } else {
        setMessage(`Error: ${data.message}`); // Message d'erreur
      }
    } catch (error) {
      console.error('Error during sign up:', error);
      setMessage('Error during sign up. Please try again.');
    }
  };

  return (
    <Card sx={{ maxWidth: 500, mx: 'auto', mt: 5, marginTop: 20 }}>
      <CardHeader
        title="Create Your Account"
        subheader="Start booking your next adventure today"
        sx={{ textAlign: 'center' }}
      />
      <CardContent>
        <form onSubmit={handleSubmit}>
          {/* Message d'alerte */}
          {message && (
            <Alert severity={message.startsWith('Error') ? 'error' : 'success'}>
              {message}
            </Alert>
          )}

          <Grid container spacing={2}>
            {/* Full Name */}
            <Grid item xs={12}>
              <TextField
                label="Full Name"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person />
                    </InputAdornment>
                  ),
                }}
                error={!!errors.fullName}
                helperText={errors.fullName}
              />
            </Grid>

            {/* Email */}
            <Grid item xs={12}>
              <TextField
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email />
                    </InputAdornment>
                  ),
                }}
                error={!!errors.email}
                helperText={errors.email}
              />
            </Grid>

            {/* Password */}
            <Grid item xs={12}>
              <TextField
                label="Password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                fullWidth
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                error={!!errors.password}
                helperText={errors.password}
              />
            </Grid>

            {/* Confirm Password */}
            <Grid item xs={12}>
              <TextField
                label="Confirm Password"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={handleChange}
                fullWidth
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword}
              />
            </Grid>

            {/* Phone Number */}
            <Grid item xs={12}>
              <TextField
                label="Phone Number (Optional)"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Phone />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            {/* Terms and Conditions */}
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    name="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onChange={handleChange}
                  />
                }
                label="I agree to the terms and conditions"
              />
              {errors.agreeToTerms && (
                <Typography variant="body2" color="error">
                  {errors.agreeToTerms}
                </Typography>
              )}
            </Grid>

            {/* Submit Button */}
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={!formData.agreeToTerms}
              >
                Create Account
              </Button>
            </Grid>

            {/* Redirection Button to Login */}
            {message && !message.startsWith('Error') && (
              <Grid item xs={12} mt={2}>
                <Button
                  variant="outlined"
                  color="primary"
                  fullWidth
                  onClick={() => navigate('/login')}
                >
                  Go to Login
                </Button>
              </Grid>
            )}
          </Grid>
        </form>
      </CardContent>
    </Card>
  );
};

export default SignupForm;
