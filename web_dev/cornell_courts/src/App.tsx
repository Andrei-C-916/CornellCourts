// src/App.tsx

import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import HomePage from "./pages/HomePage";
import SignUpLoginPage from "./pages/SignUpLoginPage";
import GameCreationPage from "./pages/GameCreationPage";
import UpdateGamePage from "./pages/UpdateGamePage";
import ProfilePage from "./pages/ProfilePage";
import GameChat from "./pages/GameChat"; // Import the new GameChat page
import { useAuth } from "./contexts/AuthContext";

const App: React.FC = () => {
  const { user } = useAuth();

  return (
    <Router>
      <Routes>
        <Route
          path="/signup"
          element={!user ? <SignUpLoginPage /> : <Navigate to="/" replace />}
        />
        <Route
          path="/"
          element={user ? <HomePage /> : <Navigate to="/signup" replace />}
        />
        <Route
          path="/create-game"
          element={
            user ? <GameCreationPage /> : <Navigate to="/signup" replace />
          }
        />
        <Route
          path="/update-game/:id"
          element={
            user ? <UpdateGamePage /> : <Navigate to="/signup" replace />
          }
        />
        <Route
          path="/profile"
          element={user ? <ProfilePage /> : <Navigate to="/signup" replace />}
        />
        <Route
          path="/chat/:gameId" // Add the route for the GameChat page
          element={user ? <GameChat /> : <Navigate to="/signup" replace />}
        />
        {/* Add a catch-all route for unmatched paths */}
        <Route
          path="*"
          element={<Navigate to={user ? "/" : "/signup"} replace />}
        />
      </Routes>
    </Router>
  );
};

export default App;
