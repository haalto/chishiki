import React, { useEffect, useRef, useState } from "react";
import {
  GameState,
  ResponsePlayers,
  ResponseCreateRoom,
  Player,
} from "../../types";
import io from "socket.io-client";

const initialGameState = {
  players: [],
  gameStarted: false,
};

const Game: React.FC = () => {
  const [roomCode, setRoomCode] = useState<string>("");
  const [gameState, setGameState] = useState<GameState>(initialGameState);

  const { current: socket } = useRef(
    io("http://localhost:5001", {
      autoConnect: false,
    })
  );

  useEffect(() => {
    socket.open();
    socket.emit("init-new-room");

    socket.on("room-created", (res: ResponseCreateRoom) => {
      socket.emit("join-room-game", res.roomCode);
      setRoomCode(res.roomCode);
    });

    socket.on("player-joined", (res: ResponsePlayers) => {
      setGameState({ ...gameState, players: res.players });
    });

    socket.on("game-state-update", (gameState: GameState) => {
      console.log(gameState);
      setGameState(gameState);
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket]);

  useEffect(() => {
    console.log(gameState);
  }, [gameState]);

  const renderPlayers = (players: Player[]) => {
    return players.map((p, i) => (
      <div key={i}>
        {p.isHost ? <b>{p.username}</b> : p.username} Ready:{" "}
        {p.ready.toString()}
      </div>
    ));
  };

  if (gameState.gameStarted) {
    return (
      <div>
        Game started!<div>{renderPlayers(gameState.players)}</div>
      </div>
    );
  }

  return (
    <div>
      <span>Join the room using following code!</span>
      <div>{roomCode}</div>
      {renderPlayers(gameState.players)}
    </div>
  );
};

export default Game;
