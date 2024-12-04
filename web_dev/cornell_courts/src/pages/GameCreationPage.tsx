// src/pages/GameCreationPage.tsx

import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Container,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import Navbar from "../components/Navbar";

const GameCreationPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [sport, setSport] = useState("");
  const [location, setLocation] = useState("");
  const [time, setTime] = useState("");

  const handleCreateGame = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      alert("You must be logged in to create a game.");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/games", {
        sport,
        location,
        time,
        createdBy: user.uid,
      });

      alert("Game created successfully!");
      navigate("/");
    } catch (error) {
      console.error("Error creating game:", error);
      alert("Failed to create game.");
    }
  };

  return (
    <div>
      <Navbar />
      <Container maxWidth="sm">
        <h2>Create a New Game</h2>
        <form onSubmit={handleCreateGame}>
          <FormControl fullWidth margin="normal">
            <InputLabel id="sport-label">Sport</InputLabel>
            <Select
              labelId="sport-label"
              value={sport}
              onChange={(e) => setSport(e.target.value)}
              required
            >
              <MenuItem value="football">Football</MenuItem>
              <MenuItem value="soccer">Soccer</MenuItem>
              <MenuItem value="volleyball">Volleyball</MenuItem>
              <MenuItem value="tennis">Tennis</MenuItem>
              <MenuItem value="pickleball">Pickleball</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Time"
            type="datetime-local"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            required
          />
          <Button type="submit" variant="contained" color="primary">
            Create Game
          </Button>
        </form>
      </Container>
    </div>
  );
};

export default GameCreationPage;
