import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
import useNavigation from "../../hooks/useNavigation";
import { GameState } from "../../types";
import { config } from "../../config";
import styled from "styled-components";
import AnswerButton from "./AnswerButton";
import { getEmojiBasedOnScore } from "../../services/getEmojiBasedOnScore";

interface ParamTypes {
  roomCode: string;
  username: string;
}

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
      <AnswerButton
        key={i}
        colorIndex={i as 0 | 1 | 2 | 3}
        sendAnswer={sendAnswer}
        answer={a}
      />
    ));
  };

  const sendAnswer = (answer: string) => {
    setAnswer(answer);
    socket.emit("player-answer", answer);
  };

  if (gameState?.currentState === "WAITING") {
    return (
      <Wrapper>
        <Title>Hey, {username}</Title>
        <ReadyButton onClick={() => updateRdy()}>
          {!ready ? "Ready" : "Not ready"}
        </ReadyButton>
      </Wrapper>
    );
  }

  if (gameState?.currentState === "STARTED") {
    return (
      <Wrapper>
        <Title>Game is about to start!</Title>
      </Wrapper>
    );
  }

  if (gameState?.currentState === "QUESTION" && gameState.currentQuestion) {
    return (
      <Wrapper>
        <Question>{!answer && gameState?.currentQuestion?.question}</Question>
        {!answer ? (
          renderAnswers(gameState.currentQuestion.answers)
        ) : (
          <Title>Wait</Title>
        )}
      </Wrapper>
    );
  }

  if (gameState?.currentState === "ANSWER") {
    return (
      <Wrapper>
        <Title>Correct answer</Title>
        <Answer>
          {gameState.currentQuestion?.answers[gameState.currentQuestion.answer]}
          {gameState.answers.find((p) => p.username === username)?.answer ===
          gameState.currentQuestion?.answers[
            gameState.currentQuestion.answer
          ] ? (
            <Emoji>🥳</Emoji>
          ) : (
            <Emoji>😭</Emoji>
          )}
        </Answer>
      </Wrapper>
    );
  }

  if (gameState?.currentState === "SCORE") {
    return (
      <Wrapper>
        <Title>SCORE</Title>
        <Score>
          {gameState.scores.find((p) => p.username === username)?.score}
        </Score>
        <Emoji>
          {getEmojiBasedOnScore(
            gameState.scores.find((p) => p.username === username)?.score
          )}
        </Emoji>
      </Wrapper>
    );
  }

  if (gameState?.currentState === "ENDED") {
    socket.disconnect();
    goToLanding();
  }

  return <Wrapper>Loading</Wrapper>;
};

export default Play;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-items: center;
  min-height: 100%;
  margin-top: 5rem;
`;

const ReadyButton = styled.button`
  padding: 0.5rem;
  border: none;
  margin-top: 4rem;
  width: 10rem;
  height: 3rem;
  cursor: pointer;
  color: white;
  font-size: 1.1rem;
  border-radius: 5px;
  font-family: inherit;
  font-weight: 50;
  background: #f7971e; /* fallback for old browsers */
  background: -webkit-linear-gradient(
    to left,
    #ffd200,
    #f7971e
  ); /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(
    to left,
    #ffd200,
    #f7971e
  ); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
`;

const Question = styled.h3`
  margin: 1rem;
  text-align: center;
`;

const Title = styled.h2`
  text-align: center;
`;

const Answer = styled.h2`
  text-align: center;

  div {
    margin: 2rem;
  }
`;

const Emoji = styled.div`
  font-size: 5rem;
`;

const Score = styled.h1`
  text-align: center;
`;
