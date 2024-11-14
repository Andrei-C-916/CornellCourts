import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const HomePage: React.FC = () => {
  const [games, setGames] = useState<string>("");

  useEffect(() => {
    fetch("http://localhost:5000/api/games")
      .then((res) => res.text())
      .then((data) => setGames(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <h1>Home Page</h1>
      <nav>
        <Link to="/signup">Sign Up / Login</Link> |{" "}
        <Link to="/create-game">Create a Game</Link>
      </nav>
      <p>{games}</p>
    </div>
  );
};

export default HomePage;
