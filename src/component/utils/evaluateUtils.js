/* eslint-disable no-loop-func */
import _ from 'lodash';
import {
  CONNECT_N,
  SCORE,
  PRIORITY,
  patterns,
  getCoordinateId,
  dir_array
} from './boardUtils';

import { getCoordinate } from './getCoordinate';

const getNodeFromPattern = (item, offset, pattern, key, curr_player, dir, adj_cells, curr_capture) => {
  let owner = '';
  let enemy = '';
  let i = 0;
  let potential_capture_index = 0;

  while (i < pattern.length) {
    const cell = item.block[offset + i];

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
    let start_y = item.start.y;
    let start_x = item.start.x;
    let score = SCORE[key];
    let priority = PRIORITY[key];

    if (dir === 'h') {
      start_x = start_x + offset;
    }
    else if (dir === 'v') {
      start_y = start_y + offset;
    }
    else if (dir === 'd_1') {
      start_y = start_y + offset;
      start_x = start_x + offset;
    }
    else if (dir === 'd_2') {
      start_y = start_y - offset;
      start_x = start_x + offset;
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
          x: start_x + potential_capture_index
        };
      }
      else if (dir === 'd_2') {
        potential_capture_cell = {
          y: start_y - potential_capture_index,
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

const evaluate = (blocks, curr_player, adj_cells, curr_capture) => {
  const n_array = [];
  let best_node = null;

  for (let item of blocks) {
    if (item.isEmptyBlock) continue;
    for (let i = 0; i < item.block.length - 1; i++) {
      let new_node = null;

      for (let key in patterns) {
        if (new_node) break;
        for (let pattern of patterns[key]) {
          if (new_node) break;
          new_node = getNodeFromPattern(item, i, pattern, key, curr_player, item.dir, adj_cells, curr_capture);
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

const getBlock = (curr_board, adj_cells, dir) => {
  const allBlock = [];
  const overlapped_cells = [];

  for (let cell of adj_cells) {
    if (_.find(overlapped_cells, (o_cell) => o_cell.id === cell.id)) continue;
    if (cell.isIllegal) continue;
    const { y, x } = cell;
    let next = { y, x };
    let start = { y, x };
    let f_offset = 0;
    let b_offset = 0;
    let isEmptyBlock = true;
    let selectedCell = null;
    let block = [curr_board[y][x]];

    for (let i = 1; i < CONNECT_N + f_offset; i++) {
      next = getCoordinate(y, x, i, dir, true, true);
      const overlapped_cell = _.find(adj_cells, (cell) => cell.id === next.id);

      if (overlapped_cell) {
        if (overlapped_cell.isIllegal) break;
        overlapped_cells.push(overlapped_cell);
        f_offset = i;
      }
      selectedCell = curr_board[next.y]?.[next.x];
      if (typeof selectedCell !== 'undefined') {
        if (selectedCell !== '') {
          isEmptyBlock = false;
        }
        block = [...block, selectedCell];
      }
      else break;
    }
    for (let i = 1; i < CONNECT_N + b_offset; i++) {
      next = getCoordinate(y, x, i, dir, false, true);
      const overlapped_cell = _.find(adj_cells, (cell) => cell.id === next.id);

      if (overlapped_cell) {
        if (overlapped_cell.isIllegal) break;
        overlapped_cells.push(overlapped_cell);
        b_offset = i;
      }
      selectedCell = curr_board[next.y]?.[next.x];
      if (typeof selectedCell !== 'undefined') {
        if (selectedCell !== '') {
          isEmptyBlock = false;
        }
        block = [selectedCell, ...block];
        start = next;
      }
      else break;
    }

    allBlock.push({
      start: { y: start.y, x: start.x },
      dir,
      block,
      isEmptyBlock
    });
  }
  return allBlock;
}

const findConnectedCells = (node) => {
  const start = node.start;
  const connected_cells = [start];

  for (let i = 1; i < node.pattern.length; i++) {
    if (node.pattern[i] === 0) continue;
    connected_cells.push(getCoordinate(start.y, start.x, i, node.dir, true, false));
  }
  return connected_cells;
}

const getPotentialCaptureNode = (board, curr_player, cell, curr_dir) => {
  const { y, x } = cell;
  const enemy = curr_player === 'X' ? 'O' : 'X';
  let isCapturable = false;
  let pattern;
  let start = { y, x };
  let dir_found = '';

  for (let dir of dir_array) {
    if (curr_dir === dir) continue;
    dir_found = dir;
    const next_1 = getCoordinate(y, x, 1, dir, true, false);
    const next_2 = getCoordinate(y, x, 2, dir, true, false);
    const prev_1 = getCoordinate(y, x, 1, dir, false, false);
    const prev_2 = getCoordinate(y, x, 2, dir, false, false);

    if (board[prev_1.y]?.[prev_1.x] === '' && board[next_1.y]?.[next_1.x] === enemy && board[next_2.y]?.[next_2.x] === curr_player) {
      pattern = patterns['capture'][1];
      start = prev_1;
      isCapturable = true;
      break;
    }
    else if (board[prev_1.y]?.[prev_1.x] === enemy && board[prev_2.y]?.[prev_2.x] === '' && board[next_1.y]?.[next_1.x] === curr_player) {
      pattern = patterns['capture'][1];
      start = prev_2;
      isCapturable = true;
      break;
    }
    else if (board[prev_1.y]?.[prev_1.x] === curr_player && board[next_1.y]?.[next_1.x] === enemy && board[next_2.y]?.[next_2.x] === '') {
      pattern = patterns['capture'][0];
      start = prev_1;
      isCapturable = true;
      break;
    }
    else if (board[prev_1.y]?.[prev_1.x] === enemy && board[prev_2.y]?.[prev_2.x] === curr_player && board[next_1.y]?.[next_1.x] === '') {
      pattern = patterns['capture'][0];
      start = prev_2;
      isCapturable = true;
      break;
    }
  }
  if (isCapturable) {
    return ({
      start,
      pattern: pattern,
      owner: curr_player,
      category: 'capture',
      priority: 6,
      dir: dir_found,
      score: 55,
    });
  }
  else return null;
}

export const evaluteCells = (curr_board, curr_player, adj_cells, curr_capture, take_best) => {
  const horizontalBlock = getBlock(curr_board, adj_cells, 'h');
  const verticalBlock = getBlock(curr_board, adj_cells, 'v');
  const diagonalBlock_1 = getBlock(curr_board, adj_cells, 'd_1');
  const diagonalBlock_2 = getBlock(curr_board, adj_cells, 'd_2');
  const h_node = evaluate(horizontalBlock, curr_player, adj_cells, curr_capture);
  const v_node = evaluate(verticalBlock, curr_player, adj_cells, curr_capture);
  const d_node_1 = evaluate(diagonalBlock_1, curr_player, adj_cells, curr_capture);
  const d_node_2 = evaluate(diagonalBlock_2, curr_player, adj_cells, curr_capture);
  const combinedNode = [...d_node_1, ...d_node_2, ...h_node, ...v_node];
  const bestNode = _.take(
    _.orderBy(
      combinedNode,
      ['priority', 'score'],
      ['asc', 'desc']
    ), take_best
  );

  if (bestNode[0].owner !== curr_player && bestNode[0].category !== 'capture') {
    const connected_cells = findConnectedCells(bestNode[0]);
    let potentialCaptureNode = null;
    for (let cell of connected_cells) {
      potentialCaptureNode = getPotentialCaptureNode(curr_board, curr_player, cell, bestNode[0].dir);
      if (potentialCaptureNode) {
        bestNode[0] = potentialCaptureNode;
        break;
      }
    }
  }
  return (bestNode);
}