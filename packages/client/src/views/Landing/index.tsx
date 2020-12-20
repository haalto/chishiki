import React, { useState } from "react";

import useNavigation from "../../hooks/useNavigation";

const Landing: React.FC = () => {
  const [roomCode, setRoomCode] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const { goToCreateNewGame, goToJoinGame } = useNavigation();

  return (
    <div>
      <div>
        <label>room code</label>
        <input value={roomCode} onChange={(e) => setRoomCode(e.target.value)} />
        <label>username</label>
        <input value={username} onChange={(e) => setUsername(e.target.value)} />
        <button onClick={() => goToJoinGame(roomCode, username)}>Join</button>
      </div>
      <button onClick={() => goToCreateNewGame()}>Create game room</button>
    </div>
  );
};

export default Landing;
