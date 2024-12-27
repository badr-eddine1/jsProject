import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Grid, Paper } from '@mui/material';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logic for submitting form data (e.g., API call)
    alert('Form submitted!');
  };

  return (
    <Box sx={{ p: 4, backgroundColor: '#f4f4f4' }}>
      <Typography variant="h3" gutterBottom align="center" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
        Contactez-nous
      </Typography>

      <Paper sx={{ p: 4, borderRadius: 2, boxShadow: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={4}>
            {/* Nom */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Nom"
                variant="outlined"
                fullWidth
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Grid>

            {/* Email */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Email"
                variant="outlined"
                fullWidth
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Grid>

            {/* Message */}
            <Grid item xs={12}>
              <TextField
                label="Message"
                variant="outlined"
                fullWidth
                multiline
                rows={6}
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
              />
            </Grid>

            {/* Submit Button */}
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2, padding: '10px' }}
              >
                Envoyer
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default Contact;
