import styled from "styled-components";
import { getColor } from "../../services/getColor";

interface StyleProps {
  colorIndex: 0 | 1 | 2 | 3;
}

const Answer = styled.button<StyleProps>`
  padding: 0.5rem;
  border: none;
  margin-top: 2rem;
  min-width: 10rem;
  min-height: 3rem;
  cursor: pointer;
  background-color: ${(props) => getColor(props.colorIndex)};
  font-size: 0.9rem;
  border-radius: 5px;
  font-family: inherit;
  font-weight: 50;
`;

interface AnswerButtonProps {
  answer: string;
  sendAnswer: (answer: string) => void;
  colorIndex: number;
}

const AnswerButton: React.FC<AnswerButtonProps> = ({
  colorIndex,
  answer,
  sendAnswer,
}) => {
  return (
    <Answer
      colorIndex={colorIndex as 0 | 1 | 2 | 3}
      onClick={() => sendAnswer(answer)}
    >
      {answer}
    </Answer>
  );
};

export default AnswerButton;
