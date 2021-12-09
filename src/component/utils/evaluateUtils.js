import _ from 'lodash';
import {
  CONNECT_N,
  SCORE,
  PRIORITY,
  TAKE_BEST_N,
  patterns,
  patterns_index,
  getCoordinateId,
  dir_array
} from './boardUtils';

import { getCoordinate } from './getCoordinate';

import { checkPotentialCapture } from './/checkWin';

const getNodeFromPattern = (item, offset, pattern, key, curr_player, dir, adj_cells, curr_capture) => {
  let owner = '';
  let enemy = '';
  let i = 0;
  let potential_capture_index = 0;

  // if (key !== 'capture' || dir !== 'v') return null;
  // console.log('checking item.block', item.block, 'offset', offset, 'pattern', pattern);
  while (i < pattern.length) {
    const cell = item.block[offset + i];
    // console.log('cell ', cell, ` vs pattern ${i} `, pattern[i]);
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
      // console.log('breaking');
      break;
    }
    i++;
  }

  // console.log(`final i ${i}`, 'for pattern', pattern);

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

      // console.log('start_y', start_y, 'start_x', start_x, 'potential_capture_cell', potential_capture_cell, 'capture_cell_id', capture_cell_id, 'selected_adj_cell', selected_adj_cell);
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
  // console.log('evaluate blocks', blocks);

  for (let item of blocks) {
    if (item.isEmptyBlock) continue;
    for (let i = 0; i < item.block.length - 1; i++) {
      let new_node = null;
      // console.log(`evaluate ${i} item`, item);
      for (let key in patterns) {
        if (new_node) break;
        // console.log(`evaluate key`, key);
        for (let pattern of patterns[key]) {
          if (new_node) break;
          new_node = getNodeFromPattern(item, i, pattern, key, curr_player, item.dir, adj_cells, curr_capture);
        }
      }
      if (new_node) {
        if (best_node === null || best_node.priority > new_node.priority)
          best_node = new_node;
      }
      // if (new_node) {
      //   n_array.push(new_node);
      // }
    }
  }
  if (best_node) {
    n_array.push(best_node);
  }
  // console.log('best_node', best_node);
  // console.log('n_array', n_array);
  return n_array;
}

// const calculateDistance

const getBlock = (curr_board, adj_cells, dir) => {
  const allBlock = [];
  const overlapped_cells = [];

  for (let cell of adj_cells) {
    if (_.find(overlapped_cells, (o_cell) => o_cell.id === cell.id)) continue; // skip overlapped cells as it is already scanned and included in the block
    if (cell.isIllegal) continue;
    const { y, x } = cell;
    let next = { y, x };
    let start = { y, x };
    let f_offset = 0;
    let b_offset = 0;
    // if (y === 14) {
    //   console.log('cell', cell);
    // }
    // let backward = true;
    // let forward = true;
    // let consecutive_empty = curr_board[y][x] === '' ? 1 : 0;
    let isEmptyBlock = true;
    let selectedCell = null;
    // let firstCell = null;
    let block = [curr_board[y][x]];

    for (let i = 1; i < CONNECT_N + f_offset; i++) { // scan 4 cell forward to get all the cell content
      // if (forward) {
      next = getCoordinate(y, x, i, dir, true, true);
      const overlapped_cell = _.find(adj_cells, (cell) => cell.id === next.id);
      // if (y === 14) {
      //   console.log('overlapped_cell', overlapped_cell);
      // }

      if (overlapped_cell) {
        if (overlapped_cell.isIllegal) break;
        overlapped_cells.push(overlapped_cell);
        f_offset = i;
      }
      selectedCell = curr_board[next.y]?.[next.x];
      if (typeof selectedCell !== 'undefined') {
        if (selectedCell !== '') {
          // if (!firstCell) firstCell = next;
          // consecutive_empty = 0;
          isEmptyBlock = false;
        }
        // else {
        //   consecutive_empty++;
        // }
        // if (consecutive_empty === 3) break;
        block = [...block, selectedCell];
      }
      else break;


      // }
    }
    // consecutive_empty = curr_board[y][x] === '' ? 1 : 0;
    for (let i = 1; i < CONNECT_N + b_offset; i++) { // scan 4 cell backward to get all the cell content
      // if (backward) {
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
          // firstCell = next;
          // consecutive_empty = 0;
          isEmptyBlock = false;
        }
        // else {
        //   consecutive_empty++;
        // }
        // if (consecutive_empty === 3) break;
        block = [selectedCell, ...block];
        start = next;
      }
      else break;

      // }
    }
    // if (firstCell) {
    //   let n_to_trim = 0;
    //   const prev_start = { y: start.y, x: start.x };
    //   const prev_2 = getCoordinate(firstCell.y, firstCell.x, 2, dir, false, false);
    //   if (typeof curr_board[prev_2.y]?.[prev_2.x]  !== 'undefined') {
    //     start = prev_2;
    //   }
    //   else {
    //     const prev_1 = getCoordinate(firstCell.y, firstCell.x, 1, dir, false, false);
    //     if (typeof curr_board[prev_1.y]?.[prev_1.x]  !== 'undefined') start = prev_1;
    //     else start = firstCell;
    //   }
    //   console.log('firstCell', firstCell, 'prev_2', prev_2, 'start', start);
    // }
    // console.log(`dir ${dir} scanned y: ${y}, x: ${x} `, block);
    allBlock.push({
      start: { y: start.y, x: start.x },
      dir,
      block,
      isEmptyBlock
    });
  }
  // console.log(`dir ${dir} allBlock`, allBlock);
  return allBlock;
}

const findConnectedCells = (node) => {
  // console.log('node', node);
  const start = node.start;
  const connected_cells = [start];
  for (let i = 1; i < node.pattern.length; i++) {
    if (node.pattern[i] === 0) continue;
    connected_cells.push(getCoordinate(start.y, start.x, i, node.dir, true, false));
  }
  // console.log('connected_cells', connected_cells);
  return connected_cells;
}

const getPotentialCaptureNode = (board, curr_player, cell, curr_dir) => {
  const { y, x } = cell;
  const enemy = curr_player === 'X' ? 'O' : 'X';
  let isCapturable = false;
  let pattern;
  let start = { y, x };
  let dir_found = '';

  // console.log('im here', curr_player);
  for (let dir of dir_array) {
    if (curr_dir === dir) continue;
    // console.log('checking dir', dir);
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
  // return isCapturable;
  else return null;
}

export const evaluteCells = (curr_board, curr_player, adj_cells, curr_capture, take_best) => {
  // let b_node = [];
  // let t_node = [];
  const horizontalBlock = getBlock(curr_board, adj_cells, 'h');
  const verticalBlock = getBlock(curr_board, adj_cells, 'v');
  const diagonalBlock_1 = getBlock(curr_board, adj_cells, 'd_1');
  const diagonalBlock_2 = getBlock(curr_board, adj_cells, 'd_2');
  // console.log('horizontalBlock', horizontalBlock);
  // console.log('verticalBlock', verticalBlock);
  // console.log('diagonalBlock_1', diagonalBlock_1);
  // console.log('diagonalBlock_2', diagonalBlock_2);
  const h_node = evaluate(horizontalBlock, curr_player, adj_cells, curr_capture);
  const v_node = evaluate(verticalBlock, curr_player, adj_cells, curr_capture);
  const d_node_1 = evaluate(diagonalBlock_1, curr_player, adj_cells, curr_capture);
  const d_node_2 = evaluate(diagonalBlock_2, curr_player, adj_cells, curr_capture);
  // console.log('h_node', h_node);
  // console.log('v_node', v_node);
  // console.log('d_node_1', d_node_1);
  // console.log('d_node_2', d_node_2);
  // b_node = _.take(
  //   _.orderBy(
  //     _.filter([...d_node_1, ...d_node_2, ...h_node, ...v_node], (node) => node.owner === curr_player),
  //     _.filter([...h_node], (node) => node.owner === curr_player),
  //     ['score'],
  //     ['desc']
  //   ), take_best
  // );
  // t_node = _.take(
  //   _.orderBy(
  //     _.filter([...d_node_1, ...d_node_2, ...h_node, ...v_node], (node) => node.owner !== curr_player),
  //     _.filter([...h_node], (node) => node.owner !== curr_player),
  //     ['score'],
  //     ['asc']
  //   ), take_best
  // );
  // console.log(`b_node`, b_node);
  // console.log(`t_node`, t_node);

  // let combinedNode = _.take(
  //   _.orderBy(
  //     _.map([...b_node, ...t_node], (node) => {
  //       node.priority = _.findIndex(patterns_index, (category) => category === node.category);
  //       return node;
  //     }),
  //     ['priority'],
  //     ['asc']
  //   ), take_best
  // );
  const combinedNode = [...d_node_1, ...d_node_2, ...h_node, ...v_node];
  // const combinedNode = [...h_node];

  const bestNode = _.take(
    _.orderBy(
      combinedNode,
      ['priority', 'score'],
      ['asc', 'desc']
    ), take_best
  );
  // const captureNode = _.find(combinedNode, (node) => node.category === 'capture' && node.owner === curr_player);
  if (bestNode[0].owner !== curr_player && bestNode[0].category !== 'capture') {
    const connected_cells = findConnectedCells(bestNode[0]);
    let potentialCaptureNode = null;
    for (let cell of connected_cells) {
      potentialCaptureNode = getPotentialCaptureNode(curr_board, curr_player, cell, bestNode[0].dir);
      if (potentialCaptureNode) {
        // console.log('potentialCaptureNode', potentialCaptureNode);
        bestNode[0] = potentialCaptureNode;
        break;
      }
      // if (getPotentialCaptureNode(curr_board, curr_player, cell, bestNode[0].dir)) {
      //   potentialCapture = true;
      //   break;
      // }
    }
    // if (potentialCaptureNode) bestNode[0] = potentialCaptureNode;
    // const captureNode = _.find(combinedNode, (node) => node.category === 'capture' && node.owner === curr_player);
    // console.log('bestNode', bestNode);
    // console.log('curr_player', curr_player, 'possible captureNode', captureNode);
  }

  // console.log('captureNode', captureNode);
  // console.log('combinedNode', combinedNode);
  // console.log('curr_player', curr_player, 'bestNode', bestNode);

  // console.log('========');
  return (bestNode);
}