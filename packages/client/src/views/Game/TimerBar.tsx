import styled from "styled-components";

interface Props {
  duration: number;
}

interface StyleProps {
  duration: string;
}

const Bar = styled.div<StyleProps>`
  ${(props) => props.duration}
  margin: 1rem;
  overflow: hidden;

  div {
    height: 20px;
    width: 40rem;
    animation: ${(props) => props.duration};
    transform-origin: left center;
    animation: roundtime calc(var(--duration) * 1s) linear forwards;
    background: #f7971e; /* fallback for old browsers */
    background: -webkit-linear-gradient(
      to left,
      #ffd200,
      #f7971e
    ); /* Chrome 10-25, Safari 5.1-6 */
    background: linear-gradient(to left, #ffd200, #f7971e);
  }

  @keyframes roundtime {
    to {
      transform: scaleX(0);
    }
  }
`;

const TimerBar: React.FC<Props> = ({ duration }) => {
  return (
    <Bar
      duration={`animation: roundtime calc(${duration} * 1s) linear forwards;`}
    >
      <div></div>
    </Bar>
  );
};
export default TimerBar;
