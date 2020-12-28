import { config } from "../../config";
import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import useNavigation from "../../hooks/useNavigation";
import {
  GameState,
  PlayerData,
  PlayerScore,
  ResponseCreateRoom,
  ResponsePlayers,
} from "../../types";
import { toast } from "react-toastify";
import styled from "styled-components";
import Answer from "./Answer";
import TimerBar from "./TimerBar";
import useSound from "use-sound";
import themeMusic from "./sounds/theme.mp3";
import scoresMusic from "./sounds/scores.wav";
import { getEmojiBasedOnScore } from "../../services/getEmojiBasedOnScore";

const initialGameState: GameState = {
  players: [],
  currentState: "WAITING",
  currentQuestion: null,
  answers: [],
  scores: [],
};

const Game: React.FC = () => {
  const [roomCode, setRoomCode] = useState<string>("");
  const [gameState, setGameState] = useState<GameState>(initialGameState);
  const [playTheme, themeData] = useSound(themeMusic);
  const [playScores] = useSound(scoresMusic);
  const { goToLanding } = useNavigation();
  console.log(process.env);
  console.log(config.SERVER_URI);
  console.log(process.env.REACT_APP_SERVER_URI);
  const { current: socket } = useRef(
    io(`http://${config.SERVER_URI}`, {
      autoConnect: false,
    })
  );

  useEffect(() => {
    if (
      !themeData.isPlaying &&
      gameState.currentState !== "FINAL_SCORES" &&
      gameState.currentState !== "ENDED"
    ) {
      playTheme();
    }

    if (themeData.isPlaying && gameState.currentState === "FINAL_SCORES") {
      themeData.stop();
    }

    if (!themeData.isPlaying && gameState.currentState === "FINAL_SCORES") {
      playScores();
    }
  }, [gameState.currentState, playScores, playTheme, themeData]);

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
      setGameState(() => gameState);
    });

    socket.on("error", (error: any) => {
      toast(error);
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    console.log(gameState);
  }, [gameState]);

  const renderPlayers = (players: PlayerData[]) => {
    return players.map((p, i) => (
      <Player key={i}>
        {p.username} {p.ready && "👌"}
      </Player>
    ));
  };

  const renderScores = (scores: PlayerScore[]) => {
    return scores
      .sort((a, b) => (a.score < b.score ? 1 : -1))
      .map((s) => (
        <Player>
          {s.username} {s.score} {getEmojiBasedOnScore(s.score)}
        </Player>
      ));
  };

  const renderFinalScores = (scores: PlayerScore[]) => {
    return scores
      .sort((a, b) => (a.score < b.score ? 1 : -1))
      .map((s, i) => {
        if (i === 0) {
          return (
            <Player>
              <h1>
                1. {s.username} {s.score} {"😎"}
              </h1>
            </Player>
          );
        } else {
          return (
            <Player>
              <h3>
                {s.username} {s.score} {getEmojiBasedOnScore(s.score)}
              </h3>
            </Player>
          );
        }
      });
  };

  if (gameState.currentState === "WAITING") {
    return (
      <Wrapper>
        <Title>Join the room using following code!</Title>
        <RoomCode>{roomCode}</RoomCode>
        {renderPlayers(gameState.players)}
      </Wrapper>
    );
  }

  if (gameState.currentState === "STARTED") {
    return (
      <Wrapper>
        <Title>Game is about to start!</Title>
      </Wrapper>
    );
  }

  if (
    gameState.currentState === "QUESTION" &&
    gameState.currentQuestion?.question
  ) {
    return (
      <Wrapper>
        <TimerBar duration={10} />
        <Question>{gameState?.currentQuestion?.question}</Question>
        <Questions>
          {gameState.currentQuestion.answers.map((a, i) => (
            <Answer key={i} answer={a} colorIndex={i} />
          ))}
        </Questions>
      </Wrapper>
    );
  }

  if (gameState?.currentState === "ANSWER") {
    return (
      <Wrapper>
        <Title>
          {gameState.currentQuestion?.answers[gameState.currentQuestion.answer]}
        </Title>
        <div>
          {gameState.answers.map((a) => (
            <PlayerAnswer>
              {a.username} {a.answer ? a.answer : "🥶"}{" "}
              {a.answer
                ? a.answer ===
                  gameState.currentQuestion?.answers[
                    gameState.currentQuestion.answer
                  ]
                  ? "👌"
                  : "💩"
                : ""}
            </PlayerAnswer>
          ))}
        </div>
      </Wrapper>
    );
  }

  if (gameState.currentState === "SCORE") {
    return (
      <Wrapper>
        <Title>SCORES</Title>
        <div>{renderScores(gameState.scores)}</div>
      </Wrapper>
    );
  }

  if (gameState.currentState === "FINAL_SCORES") {
    return (
      <Wrapper>
        <Title>WINNER IS</Title>
        <div>{renderFinalScores(gameState.scores)}</div>
      </Wrapper>
    );
  }

  if (gameState.currentState === "ENDED") {
    socket.disconnect();
    goToLanding();
  }

  return <div>Loading</div>;
};

export default Game;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-items: center;
  min-height: 100%;
  margin-top: 10rem;
`;

const RoomCode = styled.h1`
  font-size: 3rem;
`;

const Title = styled.h1``;

const Question = styled.h1`
  margin-top: 3rem;
`;

const Questions = styled.div`
  display: grid;
  grid-template-columns: 200px 200px;
  grid-row: auto auto;
  grid-column-gap: 5rem;
  grid-row-gap: 1rem;
`;

const Player = styled.h2``;

const PlayerAnswer = styled.h2``;
