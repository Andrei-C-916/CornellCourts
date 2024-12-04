// src/pages/UpdateGamePage.tsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const UpdateGamePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [sport, setSport] = useState("");
  const [location, setLocation] = useState("");
  const [time, setTime] = useState("");

  useEffect(() => {
    const fetchGame = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/games/${id}`
        );
        const game = response.data;

        // Ensure that only the creator can edit the game
        if (user && user.uid === game.createdBy) {
          setSport(game.sport);
          setLocation(game.location);
          setTime(game.time);
        } else {
          alert("You are not authorized to edit this game");
          navigate("/");
        }
      } catch (error) {
        console.error("Error fetching game:", error);
      }
    };

    fetchGame();
  }, [id, user, navigate]);

  const handleUpdateGame = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const gameData = { sport, location, time };
      await axios.put(`http://localhost:5000/api/games/${id}`, gameData);
      alert("Game updated successfully");
      navigate("/");
    } catch (error) {
      console.error("Error updating game:", error);
      alert("Failed to update game");
    }
  };

  return (
    <div>
      <h1>Update Game</h1>
      <form onSubmit={handleUpdateGame}>
        <input
          type="text"
          placeholder="Sport Type"
          value={sport}
          onChange={(e) => setSport(e.target.value)}
        />
        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <input
          type="text"
          placeholder="Time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />
        <button type="submit">Update Game</button>
      </form>
    </div>
  );
};

export default UpdateGamePage;
