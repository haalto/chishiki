import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
import useNavigation from "../../hooks/useNavigation";
import { GameState } from "../../types";
import { config } from "../../config";

interface ParamTypes {
  roomCode: string;
  username: string;
}

interface AnswerButtonProps {
  answer: string;
  sendAnswer: (answer: string) => void;
}

const AnswerButton: React.FC<AnswerButtonProps> = ({ answer, sendAnswer }) => {
  return <button onClick={() => sendAnswer(answer)}>{answer}</button>;
};

const Play: React.FC = () => {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [answer, setAnswer] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const { roomCode, username } = useParams<ParamTypes>();
  const { goToLanding } = useNavigation();

  const { current: socket } = useRef(
    io(`http://${config.SERVER_URI}`, {
      autoConnect: false,
    })
  );

  useEffect(() => {
    socket.open();
    socket.emit("join-room-player", { roomCode, username });

    socket.on("game-state-update", (newGameState: GameState) => {
      console.log(newGameState);
      setGameState(newGameState);
      setAnswer(null);
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

  const renderAnswers = (answers: string[]) => {
    return answers.map((a, i) => (
      <AnswerButton key={i} sendAnswer={sendAnswer} answer={a} />
    ));
  };

  const sendAnswer = (answer: string) => {
    setAnswer(answer);
    socket.emit("player-answer", answer);
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
        <div>{!answer && gameState?.currentQuestion?.question}</div>
        <div>
          {!answer
            ? renderAnswers(gameState.currentQuestion.answers)
            : "Wait for others"}
        </div>
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
    socket.disconnect();
    goToLanding();
  }

  return <div>Loading</div>;
};

export default Play;
