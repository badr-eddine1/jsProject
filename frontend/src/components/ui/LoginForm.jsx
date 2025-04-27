import React, { useState } from 'react';
import { Button, TextField, CircularProgress, Card, CardContent, CardHeader, Typography, Box, IconButton, InputAdornment } from '@mui/material';
import { Mail, Lock, Visibility, VisibilityOff } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitted(true);

    if (!email || !password) {
      setError('Both fields are required');
      return;
    }

    setIsLoading(true);
    setError('');

    console.log('Sending data:', { email, password });

    try {
      const response = await fetch('http://localhost:5000/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Logged in successfully!');
        navigate('/'); 
      } else {
        setError(data.message || 'Invalid credentials');
      }
    } catch (error) {
      setError('An error occurred while logging in');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box id="LoginForm" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <Card sx={{ maxWidth: 400, width: '100%', padding: 3 }}>
        <CardHeader title="Login" />
        <CardContent>
          <form onSubmit={handleSubmit}>

            <TextField
              label="Email"
              type="email"
              fullWidth
              variant="outlined"
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={isSubmitted && !email}
              helperText={isSubmitted && !email ? 'Email is required' : ''}
              InputProps={{
                startAdornment: <Mail sx={{ marginRight: 1 }} />,
              }}
            />
            <TextField
              label="Password"
              type={showPassword ? 'text' : 'password'}
              fullWidth
              variant="outlined"
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={isSubmitted && !password}
              helperText={isSubmitted && !password ? 'Password is required' : ''}
              InputProps={{
                startAdornment: <Lock sx={{ marginRight: 1 }} />,
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
            />
            {error && <Typography color="error" sx={{ marginTop: 1 }}>{error}</Typography>}
            <Button
              variant="contained"
              fullWidth
              type="submit"
              disabled={isLoading}
              sx={{ marginTop: 2 }}
            >
              {isLoading ? <CircularProgress size={24} /> : 'Login'}
            </Button>
            <Typography sx={{ marginTop: 2 }} align="center">
              Don't have an account? <Link to="/SignupForm">Sign Up</Link>
            </Typography>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default LoginForm;
