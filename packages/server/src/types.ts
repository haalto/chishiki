import { Socket } from "socket.io";

export type CurrentState =
  | "WAITING"
  | "STARTED"
  | "QUESTION"
  | "ANSWER"
  | "SCORE"
  | "ENDED";
export type GameState = {
  currentState: CurrentState;
  answers: PlayerAnswer[];
  players: PlayerData[];
  currentQuestion: Question | null;
  scores: PlayerScore[];
};

export type PlayerScore = {
  username: string;
  score: number;
};

export type JoiningPlayerData = {
  roomCode: string;
  username: string;
};

export interface SocketWithProps extends Socket {
  playerData: PlayerData;
  roomCode: string;
  type: "GAME" | "PLAYER";
}

export interface PlayerData {
  username: string;
  ready: boolean;
  score: number;
  answer: string | null;
}

export type Question = {
  id: number;
  question: string;
  answers: string[];
  answer: number;
  category: string;
  difficulty: number;
};

export type ResponseCreateRoom = {
  roomCode: string;
};

export type ResponsePlayers = {
  players: PlayerData[];
};

export type PlayerAnswer = {
  answer: string | null;
  username: string;
};
