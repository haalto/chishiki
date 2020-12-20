import { Socket } from "socket.io";

export type GameState = {
  gameStarted: boolean;
  players: PlayerData[];
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
}
