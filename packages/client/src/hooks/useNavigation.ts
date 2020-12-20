import { useHistory } from "react-router-dom";

function useNavigation() {
  const history = useHistory();

  const goToCreateNewGame = () => {
    history.push("/game");
  };
  const goToJoinGame = (roomCode: string, username: string) => {
    console.log(roomCode, username);
    history.push(`/play/${roomCode}/${username}`);
  };

  const goToLanding = () => {
    history.push("/");
  };

  return { goToJoinGame, goToCreateNewGame, goToLanding };
}

export default useNavigation;
