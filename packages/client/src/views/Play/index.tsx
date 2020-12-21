import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
import useNavigation from "../../hooks/useNavigation";
import { GameState } from "../../../../server/src/types";

interface ParamTypes {
  roomCode: string;
  username: string;
}
const Play: React.FC = () => {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [ready, setReady] = useState(false);
  const { roomCode, username } = useParams<ParamTypes>();
  const { goToLanding } = useNavigation();

  const { current: socket } = useRef(
    io("http://localhost:5001", {
      autoConnect: false,
    })
  );

  useEffect(() => {
    socket.open();
    socket.emit("join-room-player", { roomCode, username });

    socket.on("game-state-update", (newGameState: GameState) => {
      console.log(newGameState);
      setGameState(newGameState);
    });

    socket.on("room-unavailable", () => {
      goToLanding();
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomCode, socket]);

  const updateRdy = () => {
    socket.emit("player-ready", !ready);
    setReady(!ready);
  };

  if (gameState?.currentState === "WAITING") {
    return (
      <div>
        <div>Hey, {username}</div>
        <div>You are a player!</div>
        <button onClick={() => updateRdy()}>
          {!ready ? "Ready" : "Not ready"}
        </button>
      </div>
    );
  }

  if (gameState?.currentState === "STARTED") {
    return <div>Game is about to start!</div>;
  }

  if (gameState?.currentState === "QUESTION" && gameState.currentQuestion) {
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
        Correct answer was:{" "}
        {gameState.currentQuestion?.answers[gameState.currentQuestion.answer]}
      </div>
    );
  }

  if (gameState?.currentState === "SCORE") {
    return <div>SCORES</div>;
  }

  if (gameState?.currentState === "ENDED") {
    return <div>Game ended!</div>;
  }

  return <div>Loading</div>;
};

export default Play;
