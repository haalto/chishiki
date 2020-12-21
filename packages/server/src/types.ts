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
  players: PlayerData[];
  answering: PlayerData | null;
  answer: Answer | null;
  answers: [];
  currentQuestion: Question | null;
};

export type Answer = {
  answer: string;
  username: string;
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
  points: number;
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
