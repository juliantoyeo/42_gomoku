import React, { useState, useEffect } from 'react';
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
  printBoard,
} from '../utils/boardUtils';

import { checkWin } from '../utils/checkWin';
import { checkScore } from '../utils/checkScore';
import { generateAdjacentFromAllOccupiedCell, generateAdjacentFromLastOccupiedCell } from '../utils/adjacentCellUtils';
import { evaluteCells } from '../utils/evaluateUtils';
import { generateBTcell } from '../utils/cellUtils';
import { evaluateBoard } from '../utils/old_logic/evaluteBoard';

export const useAi = (aiPlayer, humanPlayer, board, adjacentCells, gameTurn, setBCell) => {
  // const [lastMove, setLastMove] = useState([]);
  // const [moveRecord, setMoveRecord] = useState([]); // For all occupied cell
  // const [adjacentCells, setAdjacentCells] = useState([]);
  // const [tmpAdjacentCells, setTmpAdjacentCells] = useState([]);

  // const putMark = ({ y, x }) => {
  //   // console.log(y, x);
  //   if (board.board[y][x] === '') {
  //     const newBoard = _.cloneDeep(board);
  //     newBoard.board[y][x] = currentPlayer;
  //     newBoard.available = board.available - 1;
  //     setBoard(newBoard);
  //     setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
  //     setGameTurn((prev) => prev + 1);
  //     const currentMove = {
  //       y: y,
  //       x: x,
  //       owner: currentPlayer,
  //     }
  //     const newAdjacentCells = generateAdjacentFromLastOccupiedCell(board.board, adjacentCells, { y, x });
  //     setAdjacentCells(newAdjacentCells);
  //     setMoveRecord((prev) => [...prev, currentMove]);
  //     checkScore({ board: board.board, currentPlayer, curY: y, curX: x });
  //     if (checkWin({ board: board.board, currentPlayer, curY: y, curX: x })) setGameStatus(currentPlayer);
  //     else if (newBoard.available === 0) setGameStatus('tie');
  //   }
  // };

  const minimax = (board, adj_cells, curr_player, depth, isMaximize, last_move, alpha, beta) => {
    let score = 0;
    let curr_adj = _.cloneDeep(adj_cells);
    let best_move = { y: 0, x: 0 }
    const boardCopy = _.cloneDeep(board);
    if (depth === 5) {
      // console.log(`depth`, depth, `curr_player`, curr_player, `isMaximize`, isMaximize, `last_move`, last_move);
      // printBoard(boardCopy.board, curr_adj, []);
      const node = evaluateBoard(boardCopy.board, aiPlayer);
      // console.log('last node', node);
      return node[0].score;
    }
    if (last_move) {
      curr_adj = generateAdjacentFromLastOccupiedCell(boardCopy.board, adj_cells, last_move);
    }
    const node = evaluteCells(boardCopy.board, curr_player, curr_adj);
    const list = generateBTcell(node);
    if (depth === 0) setBCell(list);
    // console.log(`depth`, depth, `curr_player`, curr_player, `isMaximize`, isMaximize, `last_move`, last_move);
    // console.log(`boardCopy.available`, boardCopy.available);
    // console.log(`curr_adj`, curr_adj);
    // console.log(`node`, node);
    // console.log(`list`, list);
    // console.log(boardCopy.board);
    // printBoard(boardCopy.board, curr_adj, []);
    if (isMaximize) {
      let best = MIN;
      for (let i = 0; i < list.length; i++) {
      // _.map(list, (cell) => {
        const cell = list[i];
        boardCopy.board[cell.y][cell.x] = curr_player;
        boardCopy.available = boardCopy.available - 1;
        let val = minimax(boardCopy, curr_adj, humanPlayer, depth + 1, false, cell, alpha, beta);
        best = Math.max(best, val);
        if (best === val) best_move = cell;
        boardCopy.board[cell.y][cell.x] = '';
        boardCopy.available = boardCopy.available + 1;
        alpha = Math.max(alpha, best);

        // Alpha Beta Pruning
        if (beta <= alpha)
          break;
        // console.log('best max', best, 'depth ', depth);
      // })
      }
      if (depth === 0) return best_move;
      return best;
    }
    else {
      let best = MAX;

      for (let i = 0; i < list.length; i++) {
      // _.map(list, (cell) => {
        const cell = list[i];
        boardCopy.board[cell.y][cell.x] = curr_player;
        boardCopy.available = boardCopy.available - 1;
        let val = minimax(boardCopy, curr_adj, aiPlayer, depth + 1, true, cell, alpha, beta);
        best = Math.min(best, val);
        if (best === val) best_move = cell;
        boardCopy.board[cell.y][cell.x] = '';
        boardCopy.available = boardCopy.available + 1;
        beta = Math.min(beta, best);

        // Alpha Beta Pruning
        if (beta <= alpha)
          break;
        // console.log('best min', best, 'depth ', depth);
      // })
      }
      if (depth === 0) return best_move;
      return best;
    }
  }

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
    const boardCopy = _.cloneDeep(board);
    const adj_cells_copy = _.cloneDeep(adjacentCells);
    const best_move = minimax(boardCopy, adj_cells_copy, aiPlayer, 0, true, null, MIN, MAX);
    // console.log('best_move', best_move);
    return best_move;
  }

  const getBestMove = () => {
    console.log('AI turn test');
    if (gameTurn === 0) {
      const y = Math.round(BOARD_SIZE / 2) - 1;
      const x = Math.round(BOARD_SIZE / 2) - 1;
      return ({ y, x });
    }
    else {
      // const tmpAdjacentCells = _.cloneDeep(adjacentCells);
      // setTmpAdjacentCells(_.cloneDeep(adjacentCells));
      return AiMove();
    }
  }

  return [getBestMove];
}