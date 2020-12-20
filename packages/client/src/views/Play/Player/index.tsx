import React, { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { GameState } from "../../../types";

interface PlayerProps {
  socket: typeof Socket;
  username: string;
}

const Player: React.FC<PlayerProps> = ({ socket, username }) => {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    socket.on("game-state-update", (newGameState: GameState) => {
      setGameState(newGameState);
    });
  }, [socket]);

  const updateRdy = () => {
    socket.emit("player-ready", !ready);
    setReady(!ready);
  };

  if (gameState?.gameStarted) {
    return <div>Listen host!</div>;
  }

  return (
    <div>
      <div>Hey, {username}</div>
      <div>You are a player!</div>
      <button onClick={() => updateRdy()}>
        {!ready ? "Ready" : "Not ready"}
      </button>
    </div>
  );
};

export default Player;
