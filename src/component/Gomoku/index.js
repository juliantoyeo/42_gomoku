import React, { useEffect, useState } from 'react';
import _ from 'lodash';

import {
  BOARD_SIZE,
  DIAGONAL_ROW_SIZE,
  CONNECT_N,
  SCORE,
  TAKE_BEST_N,
  patterns,
  createBoard,
} from '../utils/boardUtils';
import { checkWin } from '../utils/checkWin';
import { checkScore } from '../utils/checkScore';
import { evaluateBoard } from '../utils/evaluteBoard';
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
  const [gameTurn, setGameTurn] = useState(1);
  const [timer, setTimer] = useState(0);
  const [showHighlight, setShowHighlight] = useState(true);
  const [currentPlayer, setCurrentPlayer] = useState('X');
  const [humanPlayer, setHumanPlayer] = useState('O');
  const [aiPlayer, setAiPlayer] = useState('X');
  const [bCell, setBCell] = useState([]);
  const [tCell, setTCell] = useState([]);
  const [moveRecord, setMoveRecord] = useState([]); // For undo
  const [board, setBoard] = useState({
    board: createBoard(),
    available: BOARD_SIZE * BOARD_SIZE,
  });
  

  useEffect(() => {
    if (currentPlayer === aiPlayer) {
      console.log('AI turn');
      if (gameTurn === 1) {
        putMark({ y: Math.round(BOARD_SIZE / 2) - 1, x: Math.round(BOARD_SIZE / 2) - 1 });
      }
      else {
        const start = window.performance.now();
        AiMove();
        const end = window.performance.now();
        setTimer(end - start);
      }
    }
  }, [aiPlayer, currentPlayer]);

  // useEffect(() => {

  // }, [currentPlayer, board.board]);

  const AiMove = () => {
    const list = getBestMove();
    // const boardCopy = _.cloneDeep(board.board);
    // console.log('list', list);
    // _.map(list.tList, (node) => {
    //   try to put
    //   boardCopy[node.y][node.x] = aiPlayer;
    //   console.log('boardCopy', boardCopy);
    //   console.log(`trying y : ${node.y}, x : ${node.x}`);
    //   boardCopy[node.y][node.x] = '';
    // });
  }

  const getBestMove = () => {
    const node = evaluateBoard(board.board, currentPlayer);
    const list = generateBTcell(node);
    if (showHighlight) {
      setBCell(list.bList);
      setTCell(list.tList);
    }
    return (list);
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
    setGameTurn(1);
    setBCell([]);
    setTCell([]);
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
    if (selectedBcell && selectedTcell) return '#333399';
    else if (selectedBcell) return '#339933';
    else if (selectedTcell) return '#993333';
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
                return (
                  <Cell key={x} onClick={() => putMark({ y, x })} hightLight={hightLight}>
                    {/* <CellNumber>{`(y: ${y}, x: ${x})`}</CellNumber> */}
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
          <StyledButton onClick={() => setShowHighlight(!showHighlight)} active={showHighlight}>
            <div>Highlight best and threat cell on player turn</div>
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