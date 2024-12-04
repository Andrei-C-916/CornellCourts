// src/pages/HomePage.tsx

import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import Navbar from "../components/Navbar";
import {
  Typography,
  Card,
  CardContent,
  Avatar,
  Button,
  Box,
  Fab,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Modal,
  List,
  ListItem,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./HomePage.css";

const HomePage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [games, setGames] = useState<any[]>([]);
  const [filteredGames, setFilteredGames] = useState<any[]>([]);
  const [selectedSport, setSelectedSport] = useState<string>("");
  const [usersMap, setUsersMap] = useState<{ [key: string]: any }>({});
  const [openModal, setOpenModal] = useState(false);
  const [modalUserList, setModalUserList] = useState<any[]>([]);

  const formatTime = (timestamp: string | Date): string => {
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat("en-US", {
      dateStyle: "short",
      timeStyle: "short",
    }).format(date);
  };

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/games");
        setGames(response.data);
        setFilteredGames(response.data);

        // Collect user IDs for fetching user data
        const userIdsSet = new Set<string>();
        response.data.forEach((game: any) => {
          if (game.createdBy) userIdsSet.add(game.createdBy);
          if (game.joinedUsers)
            game.joinedUsers.forEach((uid: string) => userIdsSet.add(uid));
        });

        // Fetch user data
        const userIds = Array.from(userIdsSet);
        const usersResponse = await axios.post(
          "http://localhost:5000/api/users/getUsers",
          {
            userIds,
          }
        );
        const usersData = usersResponse.data;

        // Map user data to user IDs
        const usersMap: { [key: string]: any } = {};
        usersData.forEach((user: any) => {
          usersMap[user.uid] = user;
        });

        setUsersMap(usersMap);
      } catch (error) {
        console.error("Error fetching games or users:", error);
      }
    };

    fetchGames();
  }, []);

  const handleSportFilter = (sport: string) => {
    setSelectedSport(sport);
    if (sport) {
      setFilteredGames(games.filter((game) => game.sport === sport));
    } else {
      setFilteredGames(games);
    }
  };

  const handleJoinGame = async (gameId: string) => {
    if (!user) {
      alert("You must be logged in to join a game.");
      return;
    }

    try {
      await axios.post(
        `http://localhost:5000/api/users/${user.uid}/joinedGames`,
        { gameId }
      );
      alert("Successfully joined the game!");
      const response = await axios.get("http://localhost:5000/api/games");
      setGames(response.data);
      setFilteredGames(response.data); // Refresh the filtered view
    } catch (error) {
      console.error("Error joining game:", error);
      alert("Failed to join the game.");
    }
  };

  const handleShowJoinedUsers = (game: any) => {
    const joinedUserIds = game.joinedUsers || [];
    const joinedUsers = joinedUserIds.map((uid: string) => usersMap[uid]);
    setModalUserList(joinedUsers);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setModalUserList([]);
  };

  return (
    <div className="home-page">
      <Navbar />
      <Box
        className="filter-container"
        sx={{ textAlign: "center", margin: "20px 0" }}
      >
        <Typography variant="h4" align="center" gutterBottom>
          Games Feed
        </Typography>
        <FormControl>
          <InputLabel id="sport-filter-label"></InputLabel>
          <Select
            labelId="sport-filter-label"
            value={selectedSport}
            onChange={(e) => handleSportFilter(e.target.value)}
            displayEmpty
          >
            <MenuItem value="">All Sports</MenuItem>
            <MenuItem value="football">Football</MenuItem>
            <MenuItem value="soccer">Soccer</MenuItem>
            <MenuItem value="volleyball">Volleyball</MenuItem>
            <MenuItem value="tennis">Tennis</MenuItem>
            <MenuItem value="pickleball">Pickleball</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <div className="feed">
        {filteredGames.length ? (
          filteredGames.map((game) => (
            <Card key={game.id} className="game-card">
              <CardContent>
                <Box display="flex" alignItems="center" marginBottom="10px">
                  <Avatar
                    src={usersMap[game.createdBy]?.photoURL || ""}
                    alt={usersMap[game.createdBy]?.displayName || "User"}
                    sx={{ marginRight: "10px" }}
                  />
                  <Typography variant="body1">
                    Created by:{" "}
                    {usersMap[game.createdBy]?.displayName || "Unknown"}
                  </Typography>
                </Box>
                <Typography variant="h5">{game.sport}</Typography>
                <Typography variant="body1">
                  Location: {game.location}
                </Typography>
                <Typography variant="body1">
                  Time: {formatTime(game.time)}
                </Typography>
                <Typography variant="body1">
                  <span
                    style={{ cursor: "pointer", color: "blue" }}
                    onClick={() => handleShowJoinedUsers(game)}
                  >
                    {game.joinedUsers?.length || 0} users have joined
                  </span>
                </Typography>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  marginTop="10px"
                >
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => handleJoinGame(game.id)}
                  >
                    Join Game
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => navigate(`/chat/${game.id}`)}
                  >
                    Chat
                  </Button>
                </Box>
              </CardContent>
            </Card>
          ))
        ) : (
          <Typography variant="body1">No games available</Typography>
        )}
      </div>
      {/* Floating Add Game Button */}
      <Fab
        color="primary"
        aria-label="add"
        onClick={() => navigate("/create-game")}
        sx={{
          position: "fixed",
          bottom: 20,
          right: 20,
        }}
      >
        <AddIcon />
      </Fab>
      {/* Modal to Display Joined Users */}
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="joined-users-modal"
        aria-describedby="list-of-users-who-joined"
      >
        <div className="modal-content">
          <Typography variant="h6" id="joined-users-modal">
            Users who joined
          </Typography>
          {modalUserList.length > 0 ? (
            <List>
              {modalUserList.map((user) => (
                <ListItem key={user.uid}>
                  <Avatar
                    src={user.photoURL}
                    alt={user.displayName}
                    sx={{ marginRight: "10px" }}
                  />
                  {user.displayName || user.email}
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography variant="body1">No users have joined yet.</Typography>
          )}
          <Button onClick={handleCloseModal}>Close</Button>
        </div>
      </Modal>
    </div>
  );
};

export default HomePage;
