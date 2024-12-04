// src/pages/ProfilePage.tsx

import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useAuth } from "../contexts/AuthContext";
import {
  Avatar,
  Typography,
  Card,
  CardContent,
  Box,
  Container,
} from "@mui/material";
import axios from "axios";
import "./ProfilePage.css";

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [joinedGames, setJoinedGames] = useState<any[]>([]);

  useEffect(() => {
    const fetchJoinedGames = async () => {
      if (!user) return;

      try {
        const response = await axios.get(
          `http://localhost:5000/api/users/${user.uid}/joinedGames`
        );
        setJoinedGames(response.data);
      } catch (error) {
        console.error("Error fetching joined games:", error);
      }
    };

    fetchJoinedGames();
  }, [user]);

  return (
    <div className="profile-page">
      <Navbar />
      <Container>
        <Box textAlign="center" marginTop={4}>
          <Avatar
            src={user?.photoURL || ""}
            alt={user?.displayName || "Profile Picture"}
            style={{ width: "100px", height: "100px", margin: "0 auto" }}
          />
          <Typography variant="h5" marginTop={2}>
            {user?.displayName}
          </Typography>
          <Typography variant="body1">{user?.email}</Typography>
        </Box>

        <Typography variant="h6" marginTop={4} marginBottom={2}>
          Games You've Joined
        </Typography>

        <div className="games-container">
          {joinedGames.length > 0 ? (
            joinedGames.map((game) => (
              <Card key={game.id} className="game-card">
                <CardContent>
                  <Typography variant="h6">{game.sport}</Typography>
                  <Typography variant="body1">
                    Location: {game.location}
                  </Typography>
                  <Typography variant="body1">Time: {game.time}</Typography>
                </CardContent>
              </Card>
            ))
          ) : (
            <Typography variant="body1">
              You haven't joined any games yet.
            </Typography>
          )}
        </div>
      </Container>
    </div>
  );
};

export default ProfilePage;
