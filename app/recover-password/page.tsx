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
        <div className="flex items-center justify-center min-h-screen bg-white">
            <div className="max-w-md w-full p-6 bg-white rounded-lg">
            <Typography variant="h4" gutterBottom className="text-2xl font-semibold mb-6 text-center">
                Input your email to change your password
            </Typography>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                <TextField
                    placeholder="Email"
                    type="email"
                    id="email"
                    name="email"
                    className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                </div>
                <div className="flex justify-center items-center mt-8">
                <Button 
                    type="submit" 
                    variant="contained" 
                    fullWidth 
                    className="w-full text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                    style={{ maxWidth: "150px", backgroundColor: "#d68071" }}
                >
                    Send Email
                </Button>
                </div>
            </form>
            {message && (
                <Typography variant="body1" color="primary" className="mt-2 text-center text-gray-500">
                {message}
                </Typography>
            )}
            {error && (
                <Typography variant="body1" color="error" className="mt-2 text-center text-red-500">
                {error}
                </Typography>
            )}
            </div>
        </div>
    </Container>

  );
};

export default ForgotPassword;
