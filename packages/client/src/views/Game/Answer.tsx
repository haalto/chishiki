import styled from "styled-components";
import { getColor } from "../../services/getColor";

interface StyleProps {
  colorIndex: 0 | 1 | 2 | 3;
}

const Answer = styled.div<StyleProps>`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.5rem;
  border: none;
  margin: 1rem;
  width: 15rem;
  height: 5rem;
  background-color: ${(props) => getColor(props.colorIndex)};
  font-size: 1.3rem;
  border-radius: 5px;
  font-family: inherit;
  font-weight: 50;
`;

interface AnswerButtonProps {
  answer: string;
  colorIndex: number;
}

const AnswerButton: React.FC<AnswerButtonProps> = ({ colorIndex, answer }) => {
  return <Answer colorIndex={colorIndex as 0 | 1 | 2 | 3}>{answer}</Answer>;
};

export default AnswerButton;
