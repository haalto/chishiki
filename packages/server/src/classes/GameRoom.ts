import { GameState, SocketWithProps } from "../types";

export class GameRoom {
  roomCode: string;
  gameState: GameState;
  sockets: SocketWithProps[];

  constructor(roomCode: string) {
    this.roomCode = roomCode;
    this.gameState = { gameStarted: false, players: [] };
    this.sockets = [];
  }

  getGameState(): GameState {
    const players = this.sockets.map((s) => s.playerData);
    return { ...this.gameState, players };
  }
}
