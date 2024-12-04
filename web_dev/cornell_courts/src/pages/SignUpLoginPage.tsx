// src/pages/SignUpLoginPage.tsx

import React, { useEffect } from "react";
import { Button, Typography, Box } from "@mui/material";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import "./SignUpLoginPage.css";

const SignUpLoginPage: React.FC = () => {
  const { user, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleSignIn = async () => {
    await signInWithGoogle();
  };

  return (
    <div className="sign-up-page">
      {/* Top Left Section */}
      <Box className="header">
        <Typography variant="h1" className="title">
          Cornell Courts
        </Typography>
        <Typography variant="h3" className="tagline">
          Connect. Play. Stay Active.
        </Typography>
      </Box>

      {/* Right Section */}
      <Box className="info-section">
        <Typography variant="h4" className="info-item">
          Discover and join pickup games nearby.
        </Typography>
        <Typography variant="h4" className="info-item">
          Create games and invite your friends.
        </Typography>
        <Typography variant="h4" className="info-item">
          Filter games by sport, location, and skill level.
        </Typography>
      </Box>

      {/* Bottom Left Section */}
      <Box className="sign-in-section">
        <Button
          variant="contained"
          color="primary"
          onClick={handleSignIn}
          className="sign-in-button"
        >
          Sign in to get started!
        </Button>
      </Box>
    </div>
  );
};

export default SignUpLoginPage;
