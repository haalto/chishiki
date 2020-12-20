export type ResponseCreateRoom = {
  roomCode: string;
};

export type ResponsePlayers = {
  players: Player[];
};

export type Player = {
  roomCode: string;
  username: string;
  isHost: boolean;
  ready: boolean;
};

export type GameState = {
  players: Player[];
  gameStarted: boolean;
};
