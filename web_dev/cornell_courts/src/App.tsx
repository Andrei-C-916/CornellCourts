import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SignUpLoginPage from "./pages/SignUpLoginPage";
import GameCreationPage from "./pages/GameCreationPage";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignUpLoginPage />} />
        <Route path="/create-game" element={<GameCreationPage />} />
      </Routes>
    </Router>
  );
};

export default App;
