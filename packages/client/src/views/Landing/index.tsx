import React, { useState } from "react";

import useNavigation from "../../hooks/useNavigation";
import styled from "styled-components";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-items: center;
  min-height: 100%;
  margin-top: 3rem;
`;

const Button = styled.button`
  padding: 0.5rem;
  border: none;
  margin: 0.2rem;
  cursor: pointer;
  color: white;
  font-size: 1.1rem;
  border-radius: 5px;
  font-family: inherit;
  font-weight: 50;
`;

const ButtonJoin = styled(Button)`
  width: 8rem;
  height: 3rem;
  margin-top: 4rem;
  background: #f7971e; /* fallback for old browsers */
  background: -webkit-linear-gradient(
    to left,
    #ffd200,
    #f7971e
  ); /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(
    to left,
    #ffd200,
    #f7971e
  ); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
`;

const ButtonCreate = styled(Button)`
  margin-top: 13rem;
  background: none;
  border: none;
  color: lightgrey;
  :hover {
    border-bottom: 2px solid transparent;
    outline: none;
    border-image-slice: 1;
    border-image-source: linear-gradient(to left, #ffd200, #f7971e);
  }
`;
const Input = styled.input`
  width: 10rem;
  margin-top: 2rem;
  margin-bottom: 0.3rem;
  font-family: inherit;
  font-size: 1.5rem;
  background: none;
  border-top: none;
  border-left: none;
  border-right: none;
  border-bottom: 1px solid lightgrey;
  box-shadow: none;
  text-align: center;

  ::placeholder {
    /* Chrome, Firefox, Opera, Safari 10.1+ */
    color: lightgrey;
    opacity: 1; /* Firefox */
  }

  :focus {
    border-bottom: 2px solid transparent;
    outline: none;
    border-image-slice: 1;
    border-image-source: linear-gradient(to left, #ffd200, #f7971e);
  }
`;

const Landing: React.FC = () => {
  const [roomCode, setRoomCode] = useState<string>("");
  const [username, setUsername] = useState<string>("");

  const { goToCreateNewGame, goToJoinGame } = useNavigation();

  const handleRoomCode = (value: string) => {
    if (value.length < 4) {
      setRoomCode(value.toUpperCase());
    }
  };

  const handleUsername = (value: string) => {
    if (value.length < 15) {
      setUsername(value.toUpperCase());
    }
  };

  return (
    <Wrapper>
      <Input
        placeholder={"ROOM CODE"}
        value={roomCode}
        onChange={(e) => handleRoomCode(e.target.value)}
      />

      <Input
        placeholder={"USER NAME"}
        value={username}
        onChange={(e) => handleUsername(e.target.value)}
      />
      <ButtonJoin onClick={() => goToJoinGame(roomCode, username)}>
        Join
      </ButtonJoin>
      <ButtonCreate onClick={() => goToCreateNewGame()}>
        Create game room
      </ButtonCreate>
    </Wrapper>
  );
};

export default Landing;
