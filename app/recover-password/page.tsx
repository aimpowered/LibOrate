"use client";
import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Typography, Container, Box } from '@mui/material';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage('');
    setError('');

    try {
      // Send a request to the back-end to handle the forgot password logic
      const response = await axios.post('/api/pwd-recover', { email });
      if (response.data.success) {
        setMessage('An email with your password has been sent.');
      } else {
        setError('Failed to send email. Please try again.');
      }
    } catch (err) {
      setError('An error occurred while sending the email.');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        mt={4}
      >
        <Typography variant="h4" gutterBottom>
          Forgot Password
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            type="email"
            fullWidth
            required
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Send Email
          </Button>
        </form>
        {message && (
          <Typography variant="body1" color="primary" mt={2}>
            {message}
          </Typography>
        )}
        {error && (
          <Typography variant="body1" color="error" mt={2}>
            {error}
          </Typography>
        )}
      </Box>
    </Container>
  );
};

export default ForgotPassword;
