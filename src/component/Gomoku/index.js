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
  const [showHighlight, setShowHighlight] = useState(true);
  const [showAdjacent, setShowAdjacent] = useState(true);
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

  const [getBestMove] = useAi(aiPlayer, humanPlayer, board, adjacentCells, gameTurn, setBCell);


  useEffect(() => {
    if (currentPlayer === aiPlayer) {
      const start = window.performance.now();
      const bestMove = getBestMove();
      const end = window.performance.now();
      setTimer(end - start);
      if (bestMove)
        putMark(bestMove);
      // console.log('AI turn');
      // if (gameTurn === 0) {
      //   const y = Math.round(BOARD_SIZE / 2) - 1;
      //   const x = Math.round(BOARD_SIZE / 2) - 1;
      //   putMark({ y, x });

      // }
      // else {
      //   const start = window.performance.now();
      //   AiMove();
      //   const end = window.performance.now();
      //   setTimer(end - start);
      // }
    }
  }, [aiPlayer, currentPlayer]);

  // console.log('bCell', bCell);
  // console.log('tCell', tCell);
  // console.log('adjacentCells', adjacentCells);

  // let MAX = 1000;
  // let MIN = -1000;

  // // Returns optimal value for
  // // current player (Initially called
  // // for root and maximizer)
  // function minimax(depth, nodeIndex, maximizingPlayer, values, alpha, beta) {
  //   // Terminating condition. i.e
  //   // leaf node is reached
  //   if (depth == 3)
  //     return values[nodeIndex];

  //   if (maximizingPlayer) {
  //     let best = MIN;

  //     // Recur for left and
  //     // right children
  //     for (let i = 0; i < 2; i++) {
  //       let val = minimax(depth + 1, nodeIndex * 2 + i,
  //         false, values, alpha, beta);
  //       best = Math.max(best, val);
  //       alpha = Math.max(alpha, best);

  //       // Alpha Beta Pruning
  //       if (beta <= alpha)
  //         break;
  //     }
  //     return best;
  //   }
  //   else {
  //     let best = MAX;

  //     // Recur for left and
  //     // right children
  //     for (let i = 0; i < 2; i++) {

  //       let val = minimax(depth + 1, nodeIndex * 2 + i,
  //         true, values, alpha, beta);
  //       best = Math.min(best, val);
  //       beta = Math.min(beta, best);

  //       // Alpha Beta Pruning
  //       if (beta <= alpha)
  //         break;
  //     }
  //     return best;
  //   }
  // }

  const AiMove = () => {
    // const newAdjacentCells = generateAdjacentFromLastOccupiedCell(board.board, adjacentCells, moveRecord);
    // setAdjacentCells(newAdjacentCells);
    // const node = evaluteCells(board.board, currentPlayer, adjacentCells);
    // const list = generateBTcell(node);
    // if (showHighlight) {
    //   setBCell(list);
    // }
    // console.log(`node`, node);
    // console.log(`list`, list);
    // const boardCopy = _.cloneDeep(board);
    // const best = minimax(boardCopy, 0, true);
  }


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
    const newAdjacentCells = generateAdjacentFromAllOccupiedCell(newBoard.board, newRecord);

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
      const newBoard = _.cloneDeep(board);
      newBoard.board[y][x] = currentPlayer;
      newBoard.available = board.available - 1;
      setBoard(newBoard);
      setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
      setGameTurn((prev) => prev + 1);
      const currentMove = {
        y: y,
        x: x,
        owner: currentPlayer,
      }
      const newAdjacentCells = generateAdjacentFromLastOccupiedCell(board.board, adjacentCells, { y, x });
      setAdjacentCells(newAdjacentCells);
      setMoveRecord((prev) => [...prev, currentMove]);
      checkScore({ board: board.board, currentPlayer, curY: y, curX: x });
      if (checkWin({ board: board.board, currentPlayer, curY: y, curX: x })) setGameStatus(currentPlayer);
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
    if (selectedCell) return '#333399';
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