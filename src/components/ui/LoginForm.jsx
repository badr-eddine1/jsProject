import React, { useState } from 'react';
import { Button, TextField, CircularProgress, Card, CardContent, CardHeader, Typography, Box } from '@mui/material';
import { Mail, Lock } from '@mui/icons-material';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitted(true);

    if (!email || !password) {
      setError('Both fields are required');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Simulate an async login request
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          if (email === 'test@example.com' && password === 'password123') {
            resolve('Success');
          } else {
            reject('Invalid credentials');
          }
        }, 1000);
      });

      alert('Logged in successfully!');
    } catch (error) {
      setError('Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card sx={{ maxWidth: 400, margin: 'auto', padding: 3 }}>
      <CardHeader title="Login" />
      <CardContent>
        <form onSubmit={handleSubmit}>
          {/* Email Input */}
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

          {/* Password Input */}
          <TextField
            label="Password"
            type="password"
            fullWidth
            variant="outlined"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={isSubmitted && !password}
            helperText={isSubmitted && !password ? 'Password is required' : ''}
            InputProps={{
              startAdornment: <Lock sx={{ marginRight: 1 }} />,
            }}
          />

          {/* Error message */}
          {error && <Typography color="error" sx={{ marginTop: 1 }}>{error}</Typography>}

          {/* Submit Button */}
          <Button
            variant="contained"
            fullWidth
            type="submit"
            disabled={isLoading}
            sx={{ marginTop: 2 }}
          >
            {isLoading ? <CircularProgress size={24} /> : 'Login'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default LoginForm;
