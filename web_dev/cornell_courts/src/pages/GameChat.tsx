// src/pages/GameChat.tsx

import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { TextField, Button, Box, Typography } from "@mui/material";
import { db } from "../firebaseConfig";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { useAuth } from "../contexts/AuthContext";
import Navbar from "../components/Navbar";

const GameChat: React.FC = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const q = query(
      collection(db, "chats", gameId!, "messages"),
      orderBy("createdAt", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedMessages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(fetchedMessages);
    });

    return unsubscribe;
  }, [gameId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !user) return;

    try {
      await addDoc(collection(db, "chats", gameId!, "messages"), {
        text: newMessage,
        createdAt: serverTimestamp(),
        uid: user.uid,
        displayName: user.displayName,
      });
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div>
      <Navbar />
      <Box sx={{ padding: "20px", marginTop: "64px" }}>
        <Typography variant="h4" gutterBottom>
          Game Chat
        </Typography>
        <Box
          sx={{ marginBottom: "20px", maxHeight: "60vh", overflowY: "auto" }}
        >
          {messages.map((message) => (
            <Box
              key={message.id}
              sx={{
                marginBottom: "10px",
                textAlign: message.uid === user?.uid ? "right" : "left",
              }}
            >
              <Typography variant="subtitle2" color="textSecondary">
                {message.displayName || "Unknown"} •{" "}
                {message.createdAt
                  ? message.createdAt.toDate().toLocaleString()
                  : "Sending..."}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  display: "inline-block",
                  padding: "10px",
                  borderRadius: "10px",
                  backgroundColor:
                    message.uid === user?.uid ? "#dcf8c6" : "#f1f0f0",
                }}
              >
                {message.text}
              </Typography>
            </Box>
          ))}
          <div ref={messagesEndRef} />
        </Box>
        <TextField
          fullWidth
          label="Type your message"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          sx={{ marginBottom: "10px" }}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              handleSendMessage();
            }
          }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSendMessage}
          disabled={!newMessage.trim()}
        >
          Send
        </Button>
      </Box>
    </div>
  );
};

export default GameChat;
