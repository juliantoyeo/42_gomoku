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
import { useInterval } from './useInterval';
import { checkWin } from '../utils/checkWin';
import {
  generateAdjacentFromAllOccupiedCell,
  generateAdjacentFromLastOccupiedCell,
} from '../utils/adjacentCellUtils';
import { evaluteCells } from '../utils/evaluateUtils';
// import { evaluateBoard } from '../utils/old_logic/evaluteBoard';
import { generateBTcell } from '../utils/cellUtils';
import {
  checkCapture,
  checkIfCaptureMove,
  checkIllegalMoveCapture,
} from '../utils/captureUtils';
import { checkMoveDoubleThree } from '../utils/doubleThreeUtils';

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
  PlayerNameContainer,
  TimerDiv,
  FlexBox,
  CountDownDiv,
  Container,
} from './style';
import Board from '../board';
import Menu from '../menu';
import styled from 'styled-components';

const TempGap = styled.div`
  margin-top: 100px;
`;

const Gomoku = ({ gameMode, theme, backToLobby }) => {
  const [gameStatus, setGameStatus] = useState(null);
  const [countDown, setCountDown] = useState(0);
  const [errorMessage, setErrorMessage] = useState(null);
  const [gameTurn, setGameTurn] = useState(0);
  const [timer, setTimer] = useState(0);
  const [captureCount, setCaptureCount] = useState({ X: 0, O: 0 });
  const [toggleShowAdjacentCells, setToggleShowAdjacentCells] = useState(false);
  const [toggleCapture, setToggleCapture] = useState(false);
  const [humanBestMove, setHumanBestMove] = useState(null);
  const [currentPlayer, setCurrentPlayer] = useState('X');
  const [player1, setPlayer1] = useState('X');
  const [player2, setPlayer2] = useState('O');
  const [moveRecord, setMoveRecord] = useState([]);
  const [adjacentCells, setAdjacentCells] = useState([]);
  const [board, setBoard] = useState({
    board: createBoard(),
    available: BOARD_SIZE * BOARD_SIZE,
  });

  const [getBestMovePlayer1] = useAi(
    player1,
    player2,
    board,
    adjacentCells,
    captureCount,
    gameTurn,
  );

  const [getBestMovePlayer2] = useAi(
    player2,
    player1,
    board,
    adjacentCells,
    captureCount,
    gameTurn,
  );

  useEffect(() => {
    if (gameStatus === null && countDown === -1) {
      if (currentPlayer === player1) {
        /**
         * Use setTimeout() for making a pause between human player and AI
         * otherwise AI plays very quick and the sound when putting the stone
         * get's desynchronized
         * WARNING!
         * This doesn't interfere with the AI timing becuase the time
         * is set inside the setTimeout();
         */
        setTimeout(() => {
          const start = window.performance.now();
          const bestMove = getBestMovePlayer1();
          const end = window.performance.now();
          setTimer(end - start);
          if (bestMove) {
            if (gameMode === 'solo') putMark(bestMove);
            else setHumanBestMove(bestMove);
          }
        }, 500);
      } else if (gameMode === 'multi' && currentPlayer === player2) {
        const start = window.performance.now();
        const bestMove = getBestMovePlayer2();
        const end = window.performance.now();
        setTimer(end - start);
        if (bestMove) {
          setHumanBestMove(bestMove);
        }
      }
    }
  }, [countDown, currentPlayer]);

  useInterval(() => {
    if (countDown !== -1) {
      setCountDown((prev) => prev - 1);
    }
  }, 1000);

  const undo = () => {
    if (moveRecord.length === 0) return;
    let undoCount = gameMode === 'solo' ? 2 : 0;
    let newRecord = _.cloneDeep(moveRecord);
    let newBoard = _.cloneDeep(board);
    let lastMove = null;
    for (let i = 0; i < undoCount; i++) {
      console.log('undo');
      lastMove = _.last(newRecord);
      newBoard.board[lastMove.y][lastMove.x] = '';
      newBoard.available = board.available + 1;
      for (let capturedCell of lastMove.capturedCell) {
        const capturedPlayer = lastMove.owner === 'X' ? 'O' : 'X';
        newBoard.board[capturedCell.y][capturedCell.x] = capturedPlayer;
        newBoard.available--;
      }
      newRecord.pop();
    }
    const newAdjacentCells = generateAdjacentFromAllOccupiedCell(
      newBoard.board,
      currentPlayer,
      newRecord
    );
    setAdjacentCells(newAdjacentCells);
    setMoveRecord(newRecord);
    setGameTurn((prev) => prev - undoCount);
    setCurrentPlayer(lastMove.owner);
    setGameStatus(null);
    setBoard(newBoard);
  };

  const newGame = () => {
    setBoard({
      board: createBoard(),
      available: BOARD_SIZE * BOARD_SIZE,
    });
    setCurrentPlayer('X');
    setTimer(0);
    setCaptureCount({ X: 0, O: 0 });
    setGameTurn(0);
    setAdjacentCells([]);
    setMoveRecord([]);
    setGameStatus(null);
    setCountDown(0);
  };

  const putMark = ({ y, x }) => {
    if (gameStatus) return 'game over';
    let gameResult = null;
    if (board.board[y][x] === '') {
      let newBoard = _.cloneDeep(board);
      let newAdjacentCells = _.cloneDeep(adjacentCells);
      const nextPlayer = currentPlayer === 'X' ? 'O' : 'X';
      setErrorMessage('');
      if (checkIllegalMoveCapture(newBoard.board, currentPlayer, { y, x })) {
        setErrorMessage('Illegal move into capture area');
        return 'Illegal move into capture area';
      } else if (!checkIfCaptureMove(newBoard.board, currentPlayer, { y, x })) {
        if (checkMoveDoubleThree(newBoard.board, currentPlayer, { y, x })) {
          setErrorMessage('Illegal move that will result in double three');
          return 'Illegal move that will result in double three';
        }
      }
      newBoard.board[y][x] = currentPlayer;
      newBoard.available = board.available - 1;
      const result = checkCapture(newBoard, currentPlayer, captureCount, {
        y,
        x,
      });
      newBoard = result.board;
      setBoard(newBoard);
      setCaptureCount(result.captured);
      setCurrentPlayer(nextPlayer);
      setGameTurn((prev) => prev + 1);
      const currentMove = {
        y: y,
        x: x,
        owner: currentPlayer,
      };
      newAdjacentCells = generateAdjacentFromLastOccupiedCell(
        newBoard.board,
        nextPlayer,
        [...newAdjacentCells, ...result.newAdjacentCells],
        { y, x }
      );
      setAdjacentCells(newAdjacentCells);
      setMoveRecord((prev) => [
        ...prev,
        {
          ...currentMove,
          capturedCell: result.capturedCell,
        },
      ]);
      gameResult = checkWin(newBoard, currentPlayer, result.captured, y, x);
      if (gameResult) setGameStatus(gameResult);
    }
    return 'ok';
  };

  const boardCallback = (y, x) => {
    return putMark({ y, x });
  };

  const menuNewGameCallback = (playAs) => {
    newGame(playAs);
  };

  const handleToggleShowAdjacentCellsCb = () => {
    setToggleShowAdjacentCells(!toggleShowAdjacentCells);
  };

  const handleToggleCaptureCb = () => {
    setToggleCapture(!toggleCapture);
  };

  return (
    <>
      <FlexBox>
        <Board
          currentPlayer={currentPlayer}
          board={board}
          cb={boardCallback}
          adjacentCells={adjacentCells}
          toggleShowAdjacentCells={toggleShowAdjacentCells}
          toggleCapture={toggleCapture}
          theme={theme}
          humanBestMove={humanBestMove}
          captureCount={captureCount}
          gameStatus={gameStatus}
        />
        <Menu
          player2={player2}
          backToLobby={backToLobby}
          timer={timer}
          gameTurn={gameTurn}
          gameMode={gameMode}
          captureCount={captureCount}
          gameStatus={gameStatus}
          undo={undo}
          newGameCb={menuNewGameCallback}
          toggleAdjacentCellsCb={handleToggleShowAdjacentCellsCb}
          toggleShowAdjacentCells={toggleShowAdjacentCells}
          toggleCaptureCb={handleToggleCaptureCb}
          toggleCapture={toggleCapture}
        />
      </FlexBox>
      {countDown !== -1 && (
        <CountDownDiv>
          {countDown === 0 ? 'Start !' : `${countDown}`}
        </CountDownDiv>
      )}
    </>
  );
};

export default Gomoku;
