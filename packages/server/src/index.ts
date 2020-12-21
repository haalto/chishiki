import express from "express";
import ioserver from "socket.io";
import { createServer } from "http";
import { generateRoomCode } from "./utils/helpers";
import { JoiningPlayerData, SocketWithProps } from "./types";
import { GameRoom } from "./classes/GameRoom";
import fetch from "node-fetch";

const app = express();
const server = createServer(app);
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
const io: Server = ioserver(server, {
  cors: {
    origin: "*",
  },
});
const PORT = 5001;
server.listen(PORT, () => console.log(`Server is running on port: ${PORT}.`));

const rooms: GameRoom[] = [];

io.on("connection", (socket: SocketWithProps) => {
  socket.on("init-new-room", () => {
    const roomCode = generateRoomCode();
    const newRoom = new GameRoom(roomCode);
    rooms.push(newRoom);
    socket.emit("room-created", { roomCode: roomCode });
  });

  socket.on("join-room-game", (roomCode: string) => {
    socket.roomCode = roomCode;
    socket.type = "GAME";
    socket.join(roomCode);
  });

  socket.on("join-room-player", (player: JoiningPlayerData) => {
    console.log(`${player.username} joining room: ${player.roomCode}`);

    const room = rooms.find((r) => r.roomCode === player.roomCode);

    if (!room) {
      socket.emit("room-unavailable");
    }

    const existingSocket = room?.sockets.find(
      (s) => s.playerData.username === player.username
    );

    if (existingSocket) {
      room?.sockets.splice(
        room.sockets.findIndex(
          (s) => s.playerData.username === player.username
        ),
        1
      );
      existingSocket.leave(existingSocket.roomCode);
    }

    socket.type = "PLAYER";
    socket.playerData = {
      username: player.username,
      ready: false,
      score: 0,
      answer: null,
    };
    socket.roomCode = player.roomCode;

    room?.sockets.push(socket);
    room?.gameState.players.push(socket.playerData);

    socket.join(player.roomCode);
    io.to(player.roomCode).emit("player-joined", {
      players: room?.sockets.map((s) => s.playerData),
    });
    socket.emit("connected", socket.playerData);
    io.to(socket.roomCode).emit("game-state-update", room?.gameState);
  });

  socket.on("player-ready", async (rdy: boolean) => {
    socket.playerData.ready = rdy;
    const room = getRoomByCode(socket.roomCode);
    io.to(socket.roomCode).emit("game-state-update", room?.getGameState());

    const allPlayersRdy = room?.getGameState().players.every((p) => p.ready);

    if (room && allPlayersRdy === true) {
      console.log(`Game started on room: ${socket.roomCode}`);
      room.setState("STARTED");

      io.to(socket.roomCode).emit("game-state-update", room.getGameState());
      await wait(2000);

      const rounds = 2;
      let round = 0;

      //Main game loop
      while (round < rounds) {
        const response = await fetch("http://localhost:4000/questions");
        const question = await response.json();
        room.gameState.currentQuestion = question[0];
        room.setState("QUESTION");
        io.to(socket.roomCode).emit("game-state-update", room.getGameState());
        await wait(10000);

        room.setState("ANSWER");
        io.to(socket.roomCode).emit("game-state-update", room.getGameState());
        await wait(5000);

        room.setState("SCORE");
        console.log(room.gameState.scores);
        io.to(socket.roomCode).emit("game-state-update", room.getGameState());
        await wait(5000);

        round++;
      }
      room.gameState.currentState = "ENDED";
      io.to(socket.roomCode).emit("game-state-update", room.getGameState());
    }
  });

  socket.on("player-answer", (answer) => {
    const room = getRoomByCode(socket.roomCode);

    if (!room) {
      return;
    }

    socket.playerData.answer = answer;
    console.log(socket.playerData.answer);
  });

  socket.on("disconnect", () => {
    if (socket.type === "GAME") {
      console.log(`Game room ${socket.roomCode} disconnected`);
    }

    if (socket.type === "PLAYER") {
      console.log(
        `Player ${socket.playerData.username} was disconnected from room ${socket.roomCode}`
      );
    }
  });
});

function getRoomByCode(roomCode: string) {
  return rooms.find((r) => r.roomCode === roomCode);
}

function wait(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
