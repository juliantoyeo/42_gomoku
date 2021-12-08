import { useState, useEffect } from 'react';
import styled from 'styled-components';
import boardBackground from '../../assets/images/wood-pattern.png';
import './menu.scss';
import playerAIsvg from '../../assets/icons/chip-ai.svg';
import playerHumansvg from '../../assets/icons/human-player.svg';
import timersvg from '../../assets/icons/stopwatch.svg';
import scoresvg from '../../assets/icons/score.svg';
import gameTurnsvg from '../../assets/icons/game-turn.svg';
import trophypng from '../../assets/images/trophy.png';
import loserpng from '../../assets/images/loser.png';

const Container = styled.div`
  width: 500px;
  height: 840px;
  background-color: #f1b06c;
  background-image: url(${boardBackground});
  border-left: 1px solid #fff;
  left: 0;
`;

const FlexContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  // this -20px is necessary bcz of the arrow head and the centering with flex
  margin-left: -20px;
`;

const FlexItem = styled.div`
  margin: 1em;
  text-align: center;
`;

const Button = styled.div`
  width: 400px;
  display: table-cell;
  vertical-align: middle;
  color: #fff;
  // height: 60px;

  // border: 1px solid #000;
`;

const FlexBox = styled.div`
  display: flex;
  margin-top: 1em;
  margin-left: 20px;
  align-content: space-between;
`;

const ItemHeader = styled.div`
  width: 210px;
`;
const IconWrapper = styled.div`
  width: 40px;
  height: 60px;
  margin: auto;
  padding: 1em;
  span {
    display: block;
    margin-top: 0.5em;
    text-align: center;
    color: #fff;
    font-family: 'Chakra Petch', sans-serif;
  }
`;

const PlayerSpan = styled.span`
  display: inline-block;
  width: 25px;
  height: 25px;
  border: 1px solid #fff;
  border-radius: 50%;
  font-weight: bold;
  font-size: 1.2em;
  margin-left: 0.5em;
`;

const WinnerImgWrapper = styled.div`
  width: 40px;
  height: 60px;
  margin: auto;
`;

export default function Menu(props) {
  const [isGameOver, setIsGameOver] = useState(false);
  const [winner, setWinner] = useState('');
  const [AITimeUsage, setAITimeUsage] = useState(0);

  useEffect(() => {
    (() => {
      const seconds = (props.timer / 1000).toFixed(3);
      setAITimeUsage(seconds);
    })();
  }, [props.timer]);

  useEffect(() => {
    (() => {
      if (props.gameStatus) {
        if (props.gameStatus !== 'tie') {
          if (props.gameStatus === 'X' && props.player2 === 'X') {
            setWinner('human');
          } else if (props.gameStatus === 'O' && props.player2 === 'O') {
            setWinner('human');
          } else {
            setWinner('AI');
          }
          setIsGameOver(true);
        }
      }
    })();
  }, [props.gameStatus]);

  const newGameCallBack = () => {
    setIsGameOver(false);
    setWinner('');
    Array.from(
      document.querySelectorAll('.highlightAdjacentStone, .captureCellHighlight, .higlightHumanBestMove')
    ).forEach((el) => el.parentNode.removeChild(el));
    props.newGameCb();
  };

  const handleToggleAdjacentCb = () => {
    if (!props.toggleCapture) {
      props.toggleAdjacentCellsCb();
    }
  };

  const handleToggleCaptureCb = () => {
    if (!props.toggleShowAdjacentCells) {
      props.toggleCaptureCb();
    }
  };

  return (
    <>
      <Container>
        <FlexContainer>
          <FlexBox>
            <ItemHeader className="half-ellipse quarter-ellipse-left">
              <div className="player-name-x">
                <img
                  src={playerAIsvg}
                  alt="player-ai"
                  width={64}
                  height={64}
                  title="AI player"
                />
              </div>
              <IconWrapper>
                <img src={scoresvg} alt="score" title="AI capture score" />
                <span>
                  {props.player2 === 'O'
                    ? props.captureCount.O
                    : props.captureCount.X}
                </span>
              </IconWrapper>
              <IconWrapper>
                <img src={timersvg} alt="time" title="AI time usage" />
                <span
                  style={{
                    color: AITimeUsage > 0.5 ? '#ff0000' : '#fff',
                  }}
                >
                  {AITimeUsage}
                </span>
              </IconWrapper>
              {isGameOver &&
                (winner === 'AI' ? (
                  <WinnerImgWrapper>
                    <img src={trophypng} width={52} height={52} />
                  </WinnerImgWrapper>
                ) : (
                  <WinnerImgWrapper>
                    <img src={loserpng} width={52} height={52} />
                  </WinnerImgWrapper>
                ))}
            </ItemHeader>
            <ItemHeader className="half-ellipse quarter-ellipse-right">
              <div className="player-name-o">
                <img
                  src={playerHumansvg}
                  alt="human-player"
                  width={62}
                  height={64}
                  title="Human player"
                />
              </div>
              <IconWrapper>
                <img src={scoresvg} alt="score" title="Human capture score" />
                <span>
                  {props.player2 === 'O'
                    ? props.captureCount.X
                    : props.captureCount.O}
                </span>
              </IconWrapper>
              <IconWrapper>
                <img src={gameTurnsvg} alt="game-turn" title="Game turns" />
                <span>{props.gameTurn}</span>
              </IconWrapper>
              {isGameOver &&
                (winner === 'human' ? (
                  <WinnerImgWrapper>
                    <img src={trophypng} width={52} height={52} />
                  </WinnerImgWrapper>
                ) : (
                  <WinnerImgWrapper>
                    <img src={loserpng} width={52} height={52} />
                  </WinnerImgWrapper>
                ))}
            </ItemHeader>
          </FlexBox>
          {props.gameMode === 'solo' &&
            <FlexItem>
              <Button
                className="arrow-pointer"
                onClick={props.undo}
              >
                Cheat - undo last move
              </Button>
            </FlexItem>
          }

          <FlexItem>
            <Button
              className="arrow-pointer"
              onClick={handleToggleCaptureCb}
              style={
                props.toggleCapture
                  ? { background: '#357e70', color: '#f1b06c' }
                  : {}
              }
            >
              Cheat - show capture move
            </Button>
          </FlexItem>
          <FlexItem>
            <Button
              className="arrow-pointer"
              onClick={handleToggleAdjacentCb}
              style={
                props.toggleShowAdjacentCells
                  ? { background: '#357e70', color: '#f1b06c' }
                  : {}
              }
            >
              Highlight Adjacent Cells
            </Button>
          </FlexItem>
          <FlexItem>
            <Button
              className="arrow-pointer"
              onClick={() => newGameCallBack()}
            >
              Restart Game
            </Button>
          </FlexItem>
          <FlexItem>
            <Button
              className="arrow-pointer"
              onClick={props.backToLobby}
            >
              Back to Lobby
            </Button>
          </FlexItem>
        </FlexContainer>
      </Container>
    </>
  );
}
