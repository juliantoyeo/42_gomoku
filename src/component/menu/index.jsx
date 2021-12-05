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

export default function Menu() {
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
              {/* <hr /> */}
              <IconWrapper>
                <img src={scoresvg} alt="score" title="AI capture score" />
                <span>8</span>
              </IconWrapper>
              <IconWrapper>
                <img src={timersvg} alt="time" title="AI time usage" />
                {/* Replace 0 > 1 by aiTimeUsage > 5 seconds */}
                <span style={{ color: 0 > 1 ? '#ff0000' : '#fff' }}>0420</span>
              </IconWrapper>
              <WinnerImgWrapper>
                <img src={trophypng} width={52} height={52} />
              </WinnerImgWrapper>
            </ItemHeader>
            <ItemHeader className="half-ellipse quarter-ellipse-right">
              <div className="player-name-o">
                <img
                  src={playerHumansvg}
                  alt="player-human"
                  width={62}
                  height={64}
                  title="Human player"
                />
              </div>
              {/* <hr /> */}
              <IconWrapper>
                <img src={scoresvg} alt="score" title="Human capture score" />
                <span>8</span>
              </IconWrapper>
              <IconWrapper>
                <img src={gameTurnsvg} alt="game-turn" title="Game turns" />
                <span>21</span>
              </IconWrapper>
              <WinnerImgWrapper>
                <img src={loserpng} width={52} height={52} />
              </WinnerImgWrapper>
            </ItemHeader>
          </FlexBox>
          <FlexItem>
            <Button className="arrow-pointer">Placeholder</Button>
          </FlexItem>
          <FlexItem>
            <Button className="arrow-pointer">Highlight Best Move</Button>
          </FlexItem>
          <FlexItem>
            <Button className="arrow-pointer">
              Highlight Adjacent Cells{' '}
              {/* <PlayerSpan style={{ fontSize: '1.2em' }}>&#9860;</PlayerSpan> */}
            </Button>
          </FlexItem>
          <FlexItem>
            <Button className="arrow-pointer">
              New Game PLAY as <PlayerSpan>X</PlayerSpan>
            </Button>
          </FlexItem>
          <FlexItem>
            <Button className="arrow-pointer">
              New Game PLAY as <PlayerSpan>O</PlayerSpan>
            </Button>
          </FlexItem>
        </FlexContainer>
      </Container>
    </>
  );
}
