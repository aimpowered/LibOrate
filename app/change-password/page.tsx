"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, Button, Typography, Container, Box } from '@mui/material';
import { useSearchParams } from 'next/navigation'

const ResetPassword: React.FC = () => {
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string>('');
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  //const { token } = queryParameterValue as String;


  useEffect(() => {
    if (!token) {
      setError('Invalid or expired token.');
    }
  }, [token]);


  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage('');
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      // Send a request to the backend to reset the password
      const response = await axios.post('/api/reset-password', { token, newPassword });

      if (response.data.success) {
        setMessage('Password has been reset successfully.');
      } else {
        setError('Failed to reset password. Token may have expired.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" mt={4}>
        <Typography variant="h4" gutterBottom>
          Reset Password
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="New Password"
            type="password"
            fullWidth
            required
            margin="normal"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <TextField
            label="Confirm Password"
            type="password"
            fullWidth
            required
            margin="normal"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Reset Password
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

export default ResetPassword;
