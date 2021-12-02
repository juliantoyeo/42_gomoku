import styled from 'styled-components';
import boardBackground from '../../assets/images/wood-pattern.png';
import './menu.scss';

const Container = styled.div`
  width: 500px;
  height: 800px;
  margin-top: 100px;
  background-color: #f1b06c;
  background-image: url(${boardBackground});
`;

const FlexContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  align-content: center;
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

export default function Menu() {
  return (
    <>
      <Container>
        <FlexContainer>
          <FlexItem>
            <Button className="arrow-pointer">MENU</Button>
          </FlexItem>
          <FlexItem>
            <Button className="arrow-pointer">MENU</Button>
          </FlexItem>
          <FlexItem>
            <Button className="arrow-pointer">MENU</Button>
          </FlexItem>
          <FlexItem>
            <Button className="arrow-pointer">MENU</Button>
          </FlexItem>
          <FlexItem>
            <Button className="arrow-pointer">MENU</Button>
          </FlexItem>
        </FlexContainer>
      </Container>
    </>
  );
}
