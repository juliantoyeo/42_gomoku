import _ from 'lodash';
import {
  BOARD_SIZE,
  DIAGONAL_ROW_SIZE,
  TAKE_BEST_N,
  SCORE,
  patterns,
  patterns_index,
} from '../boardUtils';

import { getDiagonalBoard } from './getDiagonalBoard';

const getNodeFromPattern = (y, x, pattern, key, curr_board, curr_player, dir) => {
  let owner = '';
  let i = 0;

  while (i < pattern.length) {
    const cell = dir === 'd_1' || dir === 'd_2' ?
      curr_board[y][x + i]?.cell : curr_board[y][x + i];

    if (owner === '') {
      if (cell === 'X') owner = 'X';
      else if (cell === 'O') owner = 'O';
    }

    if (!(pattern[i] === 0 && cell === '') &&
      !(owner !== '' && pattern[i] === 1 && cell === owner)
    ) {
      break;
    }
    i++;
  }

  if (i === pattern.length) {
    let start_y = y;
    let start_x = x;

    if (dir === 'd_1' || dir === 'd_2') {
      start_y = curr_board[y][x].pos.y;
      start_x = curr_board[y][x].pos.x;
    }
    else if (dir === 'v') {
      start_y = x;
      start_x = y;
    }

    return ({
      start: { y: start_y, x: start_x },
      pattern: pattern,
      owner: owner,
      category: key,
      dir: dir,
      score: owner === curr_player ? SCORE[key] : SCORE[key] * -1
    });
  }

  return null;
}

const evaluate = (curr_board, curr_player, dir) => {
  const n_array = [];
  const row_size = dir === 'd_1' || dir === 'd_2' ? DIAGONAL_ROW_SIZE : BOARD_SIZE;

  for (let y = 0; y < row_size; y++) {
    const col_size = dir === 'd_1' || dir === 'd_2' ? curr_board[y].length : BOARD_SIZE;

    for (let x = 0; x < col_size; x++) {
      let new_node = null;

      // _.map(patterns, (category, key) => {
      //   if (new_node) return;
      //   _.map(category, (pattern) => {
      //     if (new_node) return;
      //     new_node = getNodeFromPattern(y, x, pattern, key, curr_board, curr_player, dir);
      //   })
      // })

      for (let key in patterns) {
        if (new_node) break;
        for (let pattern of patterns[key]) {
          if (new_node) break;
          new_node = getNodeFromPattern(y, x, pattern, key, curr_board, curr_player, dir);
        }
      }

      if (new_node) {
        n_array.push(new_node);
      }
    }
  }
  return n_array;
}

export const evaluateBoard = (currentBoard, currentPlayer) => {
  let b_node = [];
  let t_node = [];
  const v_board = _.zip(...currentBoard);
  const d_board = getDiagonalBoard(currentBoard);
  const h_node = evaluate(currentBoard, currentPlayer, 'h');
  const v_node = evaluate(v_board, currentPlayer, 'v');
  const d_node_1 = evaluate(d_board.d_1, currentPlayer, 'd_1');
  const d_node_2 = evaluate(d_board.d_2, currentPlayer, 'd_2');
  b_node = _.take(
    _.orderBy(
      _.filter([...h_node, ...v_node, ...d_node_1, ...d_node_2], (node) => node.owner === currentPlayer),
      ['score'],
      ['desc']
    ), TAKE_BEST_N
  );
  t_node = _.take(
    _.orderBy(
      _.filter([...h_node, ...v_node, ...d_node_1, ...d_node_2], (node) => node.owner !== currentPlayer),
      ['score'],
      ['asc']
    ), TAKE_BEST_N
  );

  let combinedNode = _.take(
    _.orderBy(
      _.map([...b_node, ...t_node], (node) => {
        node.priority = _.findIndex(patterns_index, (category) => category === node.category);
        return node
      }),
      ['priority'],
      ['asc']
    ), TAKE_BEST_N
  );
  // console.log(`b_node`, b_node);
  // console.log(`t_node`, t_node);
  return (combinedNode);
}