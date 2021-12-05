import _ from 'lodash';
import {
  BOARD_SIZE,
  DIAGONAL_ROW_SIZE,
  TAKE_BEST_N,
  PRIORITY,
  SCORE,
  patterns,
  patterns_index,
  getCoordinateId
} from './boardUtils';

import { getDiagonalBoard } from './getDiagonalBoard';

const getNodeFromPattern = (y, x, pattern, key, curr_board, curr_player, dir, adj_cells, curr_capture) => {
  let owner = '';
  let enemy = '';
  let i = 0;
  let potential_capture_index = 0;

  while (i < pattern.length) {
    const cell = dir === 'd_1' || dir === 'd_2' ?
      curr_board[y][x + i]?.cell : curr_board[y][x + i];

    if (owner === '' && cell !== '') {
      if (key === 'capture') {
        if (cell === 'X') {
          owner = i === 0 ? 'X' : 'O';
          enemy = i === 0 ? 'O' : 'X';
        }
        else if (cell === 'O') {
          owner = i === 0 ? 'O' : 'X';
          enemy = i === 0 ? 'X' : 'O';
        }
      }
      else {
        if (cell === 'X') owner = 'X';
        else if (cell === 'O') owner = 'O';
      }
    }

    if (key === 'capture' && cell === '') {
      potential_capture_index = i;
    }

    if (!(pattern[i] === 0 && cell === '') &&
      !(owner !== '' && pattern[i] === 1 && cell === owner) &&
      !(owner !== '' && pattern[i] === 2 && cell === enemy)
    ) {
      break;
    }
    i++;
  }

  if (i === pattern.length) {
    let start_y = y;
    let start_x = x;
    let score = SCORE[key];
    let priority = PRIORITY[key];

    if (dir === 'd_1' || dir === 'd_2') {
      start_y = curr_board[y][x].pos.y;
      start_x = curr_board[y][x].pos.x;
    }
    else if (dir === 'v') {
      start_y = x;
      start_x = y;
    }

    if (key === 'capture') {
      let potential_capture_cell = null;
      if (dir === 'h') {
        potential_capture_cell = {
          y: start_y,
          x: start_x + potential_capture_index
        };
      }
      else if (dir === 'v') {
        potential_capture_cell = {
          y: start_y + potential_capture_index,
          x: start_x
        };
      }
      else if (dir === 'd_1') {
        potential_capture_cell = {
          y: start_y + potential_capture_index,
          x: start_x - potential_capture_index
        };
      }
      else if (dir === 'd_2') {
        potential_capture_cell = {
          y: start_y + potential_capture_index,
          x: start_x + potential_capture_index
        };
      }
      score = curr_capture[enemy] * 2 + score;
      const capture_cell_id = getCoordinateId(potential_capture_cell.y, potential_capture_cell.x);
      const selected_adj_cell = _.find(adj_cells, (cell) => cell.id === capture_cell_id);
      if (selected_adj_cell?.isDoubleThree) {
        score = SCORE['double_3'];
        priority = PRIORITY['double_3'];
      }

      // console.log('eval_board dir', dir, 'start_y', start_y, 'start_x', start_x, 
      // 'potential_capture_cell', potential_capture_cell, 'potential_capture_index', potential_capture_index, 'selected_adj_cell', selected_adj_cell, 'score', score, 'priority', priority);
    }
    if (owner !== curr_player) {
      score = score * -1;
    }

    return ({
      start: { y: start_y, x: start_x },
      pattern: pattern,
      owner: owner,
      category: key,
      priority: priority,
      dir: dir,
      score: score
    });
  }

  return null;
}

const evaluate = (curr_board, curr_player, adj_cells, curr_capture, dir) => {
  let best_node = null;
  const n_array = [];
  const row_size = dir === 'd_1' || dir === 'd_2' ? DIAGONAL_ROW_SIZE : BOARD_SIZE;

  for (let y = 0; y < row_size; y++) {
    const col_size = dir === 'd_1' || dir === 'd_2' ? curr_board[y].length : BOARD_SIZE;

    for (let x = 0; x < col_size; x++) {
      let new_node = null;

      for (let key in patterns) {
        if (new_node) break;
        for (let pattern of patterns[key]) {
          if (new_node) break;
          new_node = getNodeFromPattern(y, x, pattern, key, curr_board, curr_player, dir, adj_cells, curr_capture);
        }
      }

      if (new_node) {
        if (best_node === null || best_node.priority > new_node.priority)
          best_node = new_node;
      }
    }
  }
  if (best_node) {
    n_array.push(best_node);
  }

  return n_array;
}

export const evaluateBoard = (currentBoard, currentPlayer, adj_cells, curr_capture, take_best) => {
  // let b_node = [];
  // let t_node = [];
  const v_board = _.zip(...currentBoard);
  const d_board = getDiagonalBoard(currentBoard);
  const h_node = evaluate(currentBoard, currentPlayer, adj_cells, curr_capture, 'h');
  const v_node = evaluate(v_board, currentPlayer, adj_cells, curr_capture, 'v');
  const d_node_1 = evaluate(d_board.d_1, currentPlayer, adj_cells, curr_capture, 'd_1');
  const d_node_2 = evaluate(d_board.d_2, currentPlayer, adj_cells, curr_capture, 'd_2');
  // b_node = _.take(
  //   _.orderBy(
  //     _.filter([...h_node, ...v_node, ...d_node_1, ...d_node_2], (node) => node.owner === currentPlayer),
  //     ['score'],
  //     ['desc']
  //   ), TAKE_BEST_N
  // );
  // t_node = _.take(
  //   _.orderBy(
  //     _.filter([...h_node, ...v_node, ...d_node_1, ...d_node_2], (node) => node.owner !== currentPlayer),
  //     ['score'],
  //     ['asc']
  //   ), TAKE_BEST_N
  // );

  // let combinedNode = _.take(
  //   _.orderBy(
  //     _.map([...b_node, ...t_node], (node) => {
  //       node.priority = _.findIndex(patterns_index, (category) => category === node.category);
  //       return node
  //     }),
  //     ['priority'],
  //     ['asc']
  //   ), TAKE_BEST_N
  // );
  const combinedNode = _.take(
    _.orderBy(
      [...d_node_1, ...d_node_2, ...h_node, ...v_node],
      ['priority', 'score'],
      ['asc', 'desc']
    ), take_best
  );
  // console.log(`b_node`, b_node);
  // console.log(`t_node`, t_node);
  return (combinedNode);
}