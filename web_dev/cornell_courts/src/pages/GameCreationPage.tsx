import React, { useState } from "react";

const GameCreationPage: React.FC = () => {
  const [sport, setSport] = useState("");
  const [location, setLocation] = useState("");
  const [time, setTime] = useState("");

  const handleCreateGame = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Sport:", sport, "Location:", location, "Time:", time);
  };

  return (
    <div>
      <h1>Create a Game</h1>
      <form onSubmit={handleCreateGame}>
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
        <button type="submit">Create Game</button>
      </form>
    </div>
  );
};

export default GameCreationPage;
