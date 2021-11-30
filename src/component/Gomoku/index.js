import React, { useEffect, useState } from 'react';
import _ from 'lodash';

import {
  BOARD_SIZE,
  DIAGONAL_ROW_SIZE,
  CONNECT_N,
  SCORE,
  TAKE_BEST_N,
  DEPTH,
  MAX,
  MIN,
  patterns,
  createBoard,
  getCoordinateId,
} from '../utils/boardUtils';
import { useAi } from './useAi';
import { checkWin } from '../utils/checkWin';
import { checkScore } from '../utils/checkScore';
import { generateAdjacentFromAllOccupiedCell, generateAdjacentFromLastOccupiedCell } from '../utils/adjacentCellUtils';
import { evaluteCells } from '../utils/evaluateUtils';
// import { evaluateBoard } from '../utils/old_logic/evaluteBoard';
import { generateBTcell } from '../utils/cellUtils';
import { checkCapture, checkIllegalMoveCapture } from '../utils/captureUtils';

import {
  MainContainer,
  MainDisplayContainer,
  BoardContainer,
  RightContainer,
  Cell,
  CellNumber,
  GameStatus,
  StyledButton,
  PlayerTurnContainer,
  PlayerNameContainer
} from './style';


const Gomoku = () => {
  const [gameStatus, setGameStatus] = useState(null);
  const [gameTurn, setGameTurn] = useState(0);
  const [timer, setTimer] = useState(0);
  const [captureCount, setCaptureCount] = useState({ X: 0, O: 0 });
  const [showHighlight, setShowHighlight] = useState(false);
  const [showAdjacent, setShowAdjacent] = useState(false);
  const [currentPlayer, setCurrentPlayer] = useState('X');
  const [humanPlayer, setHumanPlayer] = useState('O');
  const [aiPlayer, setAiPlayer] = useState('X');
  const [bCell, setBCell] = useState([]);
  const [tCell, setTCell] = useState([]);
  // const [occupiedCell, setOccupiedCell] = useState([]);
  const [moveRecord, setMoveRecord] = useState([]); // For all occupied cell
  const [adjacentCells, setAdjacentCells] = useState([]);
  const [board, setBoard] = useState({
    board: createBoard(),
    available: BOARD_SIZE * BOARD_SIZE,
  });

  const [getBestMove] = useAi(aiPlayer, humanPlayer, board, adjacentCells, captureCount, gameTurn, setBCell);


  useEffect(() => {
    if (currentPlayer === aiPlayer) {
      const start = window.performance.now();
      const bestMove = getBestMove();
      const end = window.performance.now();
      setTimer(end - start);
      if (bestMove)
        putMark(bestMove);
    }
  }, [aiPlayer, currentPlayer]);

  // console.log('bCell', bCell);
  // console.log('tCell', tCell);
  // console.log('adjacentCells', adjacentCells);


  const undo = () => {
    if (moveRecord.length === 0) return;
    const newRecord = _.cloneDeep(moveRecord);
    const lastMove = _.last(newRecord);
    const newBoard = _.cloneDeep(board);

    newBoard.board[lastMove.y][lastMove.x] = '';
    newBoard.available = board.available + 1;
    setBoard(newBoard);
    setCurrentPlayer(lastMove.owner);
    setGameTurn((prev) => prev - 1);
    newRecord.pop();
    setMoveRecord(newRecord);
    const newAdjacentCells = generateAdjacentFromAllOccupiedCell(newBoard.board, currentPlayer, newRecord);

    setAdjacentCells(newAdjacentCells);
  }

  const newGame = (selectedPlayer) => {
    setBoard({
      board: createBoard(),
      available: BOARD_SIZE * BOARD_SIZE,
    });
    setCurrentPlayer('X');
    if (selectedPlayer === 'X') {
      setHumanPlayer('X');
      setAiPlayer('O');
    }
    else {
      setHumanPlayer('O');
      setAiPlayer('X');
    }
    setCaptureCount({ x: 0, o: 0 });
    setGameTurn(0);
    setBCell([]);
    setTCell([]);
    // setAdjacentCells([]);
    setMoveRecord([]);
    setGameStatus(null);
  }



  const putMark = ({ y, x }) => {
    // console.log(y, x);
    if (board.board[y][x] === '') {
      let newBoard = _.cloneDeep(board);
      let newAdjacentCells = _.cloneDeep(adjacentCells);
      const nextPlayer = currentPlayer === 'X' ? 'O' : 'X';
      if (checkIllegalMoveCapture(newBoard.board, currentPlayer, { y, x })) {
        return;
      }
      newBoard.board[y][x] = currentPlayer;
      newBoard.available = board.available - 1;
      const result = checkCapture(newBoard, currentPlayer, captureCount, { y, x });
      newBoard = result.board;
      newAdjacentCells = [...newAdjacentCells, ...result.newAdjacentCells];
      setBoard(newBoard);
      setCaptureCount(result.captured);
      setCurrentPlayer(nextPlayer);
      setGameTurn((prev) => prev + 1);
      const currentMove = {
        y: y,
        x: x,
        owner: currentPlayer,
      }
      newAdjacentCells = generateAdjacentFromLastOccupiedCell(newBoard.board, nextPlayer, newAdjacentCells, { y, x });
      // console.log('newAdjacentCells', newAdjacentCells);
      setAdjacentCells(newAdjacentCells);
      setMoveRecord((prev) => [...prev, currentMove]);
      checkScore({ board: newBoard.board, currentPlayer, curY: y, curX: x });
      if (checkWin({ board: newBoard.board, currentPlayer, curY: y, curX: x })) setGameStatus(currentPlayer);
      else if (newBoard.available === 0) setGameStatus('tie');
    }
  };

  const getGameStatus = () => {
    if (gameStatus) {
      if (gameStatus === 'tie')
        return ('Game end, result : tie')
      if (gameStatus === 'X')
        return ('Game end, result : X wins')
      if (gameStatus === 'O')
        return ('Game end, result : O wins')
    }
  }

  const getHighlight = ({ y, x }) => {
    const selectedBcell = _.find(bCell, (cell) => cell.y === y && cell.x === x);
    const selectedTcell = _.find(tCell, (cell) => cell.y === y && cell.x === x);
    if (selectedBcell && selectedTcell) return '#555555';
    else if (selectedBcell) return '#339933';
    else if (selectedTcell) return '#993333';
    return null;
  }

  const getAdjacent = ({ y, x }) => {
    const selectedCell = _.find(adjacentCells, (cell) => cell.y === y && cell.x === x);
    if (selectedCell?.isIllegal) return '#993333';
    else if (selectedCell) return '#333399';
    return null;
  }

  return (
    <MainContainer>
      <MainDisplayContainer>
        <BoardContainer>
          {_.map(board.board, (row, y) => {
            return (
              _.map(row, (col, x) => {
                const hightLight = showHighlight ? getHighlight({ y, x }) : null;
                const adjacent = showAdjacent ? getAdjacent({ y, x }) : null;
                return (
                  <Cell key={x} onClick={() => putMark({ y, x })} hightLight={hightLight} adjacent={adjacent}>
                    <CellNumber>{`(${y}, ${x})`}</CellNumber>
                    {board.board[y][x]}
                  </Cell>
                );
              })
            );
          })}
        </BoardContainer>
        <RightContainer>
          <GameStatus>
            {getGameStatus()}
          </GameStatus>
          <GameStatus>
            <div>AI time usage</div>
            <div>{timer / 1000} sec</div>
          </GameStatus>
          <GameStatus>
            <div>Game turn</div>
            <div>Turn: {gameTurn}</div>
          </GameStatus>
          <GameStatus>
            <div>Capture count</div>
            <div>X: {captureCount.X}</div>
            <div>O: {captureCount.O}</div>
          </GameStatus>
          <StyledButton onClick={() => setShowHighlight(!showHighlight)} active={showHighlight}>
            <div>Highlight best and threat cell on player turn</div>
          </StyledButton>
          <StyledButton onClick={() => setShowAdjacent(!showAdjacent)} active={showAdjacent}>
            <div>Highlight adjacent cell</div>
          </StyledButton>
          <PlayerTurnContainer>
            <PlayerNameContainer active={currentPlayer === 'X'}>X</PlayerNameContainer>
            <PlayerNameContainer active={currentPlayer === 'O'}>O</PlayerNameContainer>
          </PlayerTurnContainer>
          <StyledButton onClick={undo} >
            <div>Undo last move</div>
            <div>Move saved : ( {moveRecord.length} )</div>
          </StyledButton>
          <StyledButton onClick={() => newGame('X')} >
            <div>New Game Play as X</div>
          </StyledButton>
          <StyledButton onClick={() => newGame('O')} >
            <div>New Game Play as O</div>
          </StyledButton>
        </RightContainer>
      </MainDisplayContainer>
    </MainContainer>
  )
}

export default Gomoku;