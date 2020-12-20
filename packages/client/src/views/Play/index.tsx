import React, { useEffect, useRef, useState } from "react";
import PlayerView from "./Player";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
import useNavigation from "../../hooks/useNavigation";
import { Player } from "../../types";

interface ParamTypes {
  roomCode: string;
  username: string;
}
const Play: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [playerState, setPlayerState] = useState<Player | null>(null);
  const { roomCode, username } = useParams<ParamTypes>();
  const { goToLanding } = useNavigation();

  const { current: socket } = useRef(
    io("http://localhost:5001", {
      autoConnect: false,
    })
  );

  useEffect(() => {
    socket.open();
    socket.emit("join-room-player", { roomCode, username });

    socket.on("room-unavailable", () => {
      goToLanding();
    });

    socket.on("connected", (playerState: Player) => {
      setLoading(false);
      setPlayerState(playerState);
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomCode, socket]);

  if (loading) {
    return <div>Loading</div>;
  }

  if (playerState) {
    return <PlayerView socket={socket} username={playerState.username} />;
  }

  return (
    <div>
      <div>{roomCode}</div>
      <div>{username}</div>
    </div>
  );
};

export default Play;
