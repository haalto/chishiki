import { CurrentState, GameState, PlayerData, SocketWithProps } from "../types";

export class GameRoom {
  roomCode: string;
  gameState: GameState;
  sockets: SocketWithProps[];

  constructor(roomCode: string) {
    this.roomCode = roomCode;
    this.gameState = {
      currentState: "WAITING",
      players: [],
      currentQuestion: null,
      answers: [],
      scores: [],
    };
    this.sockets = [];
  }

  public setState(newState: CurrentState): void {
    if (newState === "WAITING") {
      this.gameState.currentState = newState;
    }

    if (newState === "STARTED") {
      this.gameState.currentState = newState;
    }
    if (newState === "QUESTION") {
      this.gameState.currentState = newState;
    }
    if (newState === "ANSWER") {
      this.gameState.currentState = newState;
    }

    if (newState === "SCORE") {
      this.calculateScores();
      this.resetPlayerAnswers();
      this.gameState.currentState = newState;
    }

    if (newState === "ENDED") {
      this.gameState.currentState = newState;
    }
  }

  public getGameState(): GameState {
    this.refreshGameState();
    const players = this.sockets.map((s) => s.playerData);
    return { ...this.gameState, players };
  }

  private resetPlayerAnswers(): void {
    for (const player of this.getPlayers()) {
      player.answer = null;
    }
  }

  private calculateScores(): void {
    this.gameState.scores = [];
    const players = this.sockets.map((s) => s.playerData);

    for (const player of players) {
      if (player.answer) {
        const answerIndex = this?.gameState?.currentQuestion?.answers.indexOf(
          player.answer
        );

        console.log(answerIndex, this.gameState.currentQuestion?.answer);

        if (answerIndex === this.gameState.currentQuestion?.answer) {
          console.log("correct");
          player.score += 1;
        }

        this.gameState.scores.push({
          username: player.username,
          score: player.score,
        });
      }
    }
  }

  private refreshGameState(): void {
    const players = this.sockets.map((s) => s.playerData);
    this.gameState.answers = players.map((p) => ({
      answer: p.answer,
      username: p.username,
    }));
  }

  private getPlayers(): PlayerData[] {
    return this.sockets.map((s) => s.playerData);
  }
}
