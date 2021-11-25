import styled from "styled-components";
import { BOARD_SIZE, CELL_SIZE } from '../utils/boardUtils';

export const MainContainer = styled.div`
  background-color: black;
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  -webkit-user-select: none; /* Safari */        
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* IE10+/Edge */
  user-select: none; /* Standard */
  box-sizing: border-box;
`;

export const MainDisplayContainer = styled.div`
  /* background-color: red; */
  flex-direction: row;
  justify-content: center;
  align-items: center;
  display: flex;
  width: 100vw;
  height: 90vh;
`;

export const BoardContainer = styled.div`
  margin: 0 auto;
  display: grid;
  grid-template-rows: repeat(${BOARD_SIZE}, calc(${CELL_SIZE}vw));
  grid-template-columns: repeat(${BOARD_SIZE}, 1fr);
  grid-gap: 1px;
  width: 70%;
  max-width: ${CELL_SIZE * BOARD_SIZE}vw;
	background: 'black';
`;

export const RightContainer = styled.div`
  /* background-color: red; */
  height: 90vh;
  padding: 10px 20px;
`;

export const Cell = styled.div`
  width: auto;
  /* border: 1px solid white; */
  border-radius: 3px;
  cursor: pointer;
  color: #222222;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.5rem;
  /* font-weight: 600; */
  position: relative;
  /* background-color: ${props => props.hightLight ? props.hightLight : '#A07A4A'}; */
  /* border: 1px solid; */
  background-color: ${props => props.adjacent ? props.adjacent : props.hightLight ? props.hightLight : '#A07A4A'};
  :hover {
    background-color: rgba(160,122,74,0.7);
  }
`;

export const CellNumber = styled.div`
  color: white;
  position: absolute;
  top: 0;
  left: 0;
  padding: 1px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0.6rem;
`;

export const GameStatus = styled.div`
  border: 1px solid white;
  margin-top: 10px;
  width: 80%;
  height: 60px;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  color: white;
  font-size: 0.9rem;
  padding: 0px 20px;
  text-align: center;
`;

export const StyledButton = styled(GameStatus)`
  cursor: pointer;
  background-color: ${props => props.active ? '#339933' : 'black'};
  :hover {
    border-color: #33FF33;
  }
`;

export const PlayerTurnContainer = styled(GameStatus)`
  flex-direction: row;
  align-items: center;
`;

export const PlayerNameContainer = styled(GameStatus)`
  margin-top: 0px;
  background-color: ${props => props.active ? '#339933' : 'black'};
`;