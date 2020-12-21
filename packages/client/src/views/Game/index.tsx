import React, { useEffect, useRef, useState } from "react";
import {
  GameState,
  PlayerData,
  ResponseCreateRoom,
  ResponsePlayers,
} from "../../../../server/src/types";
import io from "socket.io-client";

const initialGameState: GameState = {
  players: [],
  currentState: "WAITING",
  answer: null,
  answering: null,
  answers: [],
  currentQuestion: null,
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

  const renderPlayers = (players: PlayerData[]) => {
    return players.map((p, i) => (
      <div key={i}>
        {p.username} Ready: {p.ready.toString()}
      </div>
    ));
  };

  if (gameState.currentState === "WAITING") {
    return (
      <div>
        <span>Join the room using following code!</span>
        <div>{roomCode}</div>
        {renderPlayers(gameState.players)}
      </div>
    );
  }

  if (gameState.currentState === "STARTED") {
    return <div>Game started!</div>;
  }

  if (
    gameState.currentState === "QUESTION" &&
    gameState.currentQuestion?.question
  ) {
    return (
      <>
        <div>{gameState?.currentQuestion?.question}</div>
        {gameState.currentQuestion.answers.map((a, i) => (
          <div key={i}>{a}</div>
        ))}
      </>
    );
  }

  if (gameState?.currentState === "ANSWER") {
    return (
      <div>
        {gameState.currentQuestion?.answers[gameState.currentQuestion.answer]}
      </div>
    );
  }

  if (gameState.currentState === "SCORE") {
    return <div>SCORES</div>;
  }

  if (gameState.currentState === "ENDED") {
    return <div>Game ended!</div>;
  }

  return <div>Loading</div>;
};

export default Game;
