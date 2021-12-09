import React, { useState, useEffect } from 'react';
import _, { last } from 'lodash';

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
import { generateAdjacentFromLastOccupiedCell } from '../utils/adjacentCellUtils';
import { evaluteCells } from '../utils/evaluateUtils';
import { generatePotentialList } from '../utils/cellUtils';
import { evaluateBoard } from '../utils/evaluteBoard';
import { checkCapture } from '../utils/captureUtils';

export const useAi = (
  me, 
  enemy, 
  board,
  adjacentCells, 
  captureCount, 
  gameTurn
) => {

  const minimax = (board, adj_cells, curr_player, curr_capture, depth, isMaximize, last_move, alpha, beta) => {
    let best_move = { y: 0, x: 0 }
    let boardCopy = _.cloneDeep(board);
    let curr_adj = _.cloneDeep(adj_cells);
    let capture_copy = _.clone(curr_capture);
    let take_best = (gameTurn + depth < 3) && (me === 'X') ? 4 : TAKE_BEST_N;
    if (depth === 6 || checkWin(boardCopy, curr_player, capture_copy, last_move)) {
      const node = evaluateBoard(boardCopy.board, me, curr_adj, capture_copy, take_best);
      const last_node = node[0];
      // console.log(`depth`, depth, `curr_player`, curr_player, `isMaximize`, isMaximize, `last_move`, last_move);
      // printBoard(boardCopy.board, curr_adj, []);
      // console.log('capture_copy', capture_copy);
      // console.log('last_node', last_node);
      if (last_node.category === 'capture' && last_node.owner === enemy) {
        last_node.score = 20;
      }
      last_node.score = last_node.score + capture_copy[me] * -2;
      // console.log('last_node.score', last_node.score);
      return last_node.score;
    }
    if (last_move) {
      curr_adj = generateAdjacentFromLastOccupiedCell(boardCopy.board, curr_player, adj_cells, last_move);
    }
    // console.log('curr_adj', curr_adj);
    const node = evaluteCells(boardCopy.board, curr_player, curr_adj, capture_copy, take_best);
    const list = generatePotentialList(node);
    
    // console.log(`depth`, depth, `curr_player`, curr_player, `isMaximize`, isMaximize, `last_move`, last_move);
    // console.log(`boardCopy.available`, boardCopy.available);
    // console.log(`curr_adj`, curr_adj);
    // console.log(`node`, node);
    // console.log('capture_copy', capture_copy);
    // console.log(`list`, list);
    // console.log(boardCopy.board);
    // if (depth === 1)
    // printBoard(boardCopy.board, curr_adj, list);
    if (isMaximize) {
      let best = MIN;
      for (let i = 0; i < list.length; i++) {
        const cell = list[i];
        const prevBoard = _.cloneDeep(boardCopy);
        const prevAdj = _.cloneDeep(curr_adj);
        boardCopy.board[cell.y][cell.x] = curr_player;
        boardCopy.available = boardCopy.available - 1;
        if (cell.isCapturingCell) {
          const result = checkCapture(boardCopy, curr_player, capture_copy, cell);
          boardCopy = result.board;
          capture_copy = result.captured;
          curr_adj = [...curr_adj, ...result.newAdjacentCells];
        }
        let val = minimax(boardCopy, curr_adj, enemy, capture_copy, depth + 1, false, cell, alpha, beta);
        // best = Math.max(best, val);
        // if (best === val) best_move = cell;
        if (val > best) {
          best = val;
          best_move = cell;
        }
        
        boardCopy = prevBoard;
        curr_adj = [...prevAdj];
        alpha = Math.max(alpha, best);

        // Alpha Beta Pruning
        if (beta <= alpha) {
          break;
        }

        // console.log('best max', best, 'depth ', depth);
      }
      if (depth === 0) return best_move;
      return best;
    }
    else {
      let best = MAX;

      for (let i = 0; i < list.length; i++) {
        const cell = list[i];
        const prevBoard = _.cloneDeep(boardCopy);
        const prevAdj = _.cloneDeep(curr_adj);
        boardCopy.board[cell.y][cell.x] = curr_player;
        boardCopy.available = boardCopy.available - 1;
        if (cell.isCapturingCell) {
          const result = checkCapture(boardCopy, curr_player, capture_copy, cell);
          boardCopy = result.board;
          capture_copy = result.captured;
          curr_adj = [...curr_adj, ...result.newAdjacentCells];
        }
        let val = minimax(boardCopy, curr_adj, me, capture_copy, depth + 1, true, cell, alpha, beta);
        // best = Math.min(best, val);
        // if (best === val) best_move = cell;
        if (val < best) {
          best = val;
          best_move = cell;
        }
        boardCopy = prevBoard;
        curr_adj = [...prevAdj];
        beta = Math.min(beta, best);

        // Alpha Beta Pruning
        if (beta <= alpha) {
          break;
        }
          
        // console.log('best min', best, 'depth ', depth);
      }
      if (depth === 0) return best_move;
      return best;
    }
  }

  const AiMove = () => {
    const boardCopy = _.cloneDeep(board);
    const adj_cells_copy = _.cloneDeep(adjacentCells);
    const curr_capture = _.cloneDeep(captureCount);
    const best_move = minimax(boardCopy, adj_cells_copy, me, curr_capture, 0, true, null, MIN, MAX);
    // console.log('best_move', best_move);
    return best_move;
  }

  const getBestMove = () => {
    // console.log('AI turn test');
    if (gameTurn === 0) {
      const y = Math.round(BOARD_SIZE / 2) - 1;
      const x = Math.round(BOARD_SIZE / 2) - 1;
      return ({ y, x });
    }
    else {
      return AiMove();
    }
  }

  return [getBestMove];
}