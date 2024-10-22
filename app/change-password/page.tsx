"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { TextField, Button, Typography, Container, Box } from "@mui/material";
import { useSearchParams } from "next/navigation";

const ResetPassword: React.FC = () => {
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  //const { token } = queryParameterValue as String;

  useEffect(() => {
    if (!token) {
      setError("Invalid or expired token.");
    }
  }, [token]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage("");
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      // Send a request to the backend to reset the password
      const response = await axios.post("/api/reset-password", {
        token,
        newPassword,
      });

      if (response.data.success) {
        setMessage("Password has been reset successfully.");
      } else {
        setError("Failed to reset password. Token may have expired.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="max-w-md w-full p-6 bg-white rounded-lg">
        <h1 className="text-2xl font-semibold mb-6 text-center">
          Reset Password
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              placeholder="New Password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
              required
            />
          </div>
          <div className="mb-4">
            <input
              placeholder="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
              required
            />
          </div>
          <div className="flex justify-center items-center mt-8">
            <button
              type="submit"
              className="w-full text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
              style={{ maxWidth: "170px", backgroundColor: "#d68071" }}
            >
              Reset Password
            </button>
          </div>
        </form>

        {message && <p className="mt-8 text-center text-gray-500">{message}</p>}
        {error && <p className="mt-8 text-center text-red-500">{error}</p>}
      </div>
    </div>
  );
};

export default ResetPassword;
