import _ from 'lodash';
import { patterns } from './boardUtils';
import { getNextCoordinate } from './evaluateUtils';


const getBlock = (curr_board, curr_player, cell, dir) => {
  const { y, x } = cell;
  let next = { y, x };
  let start = { y, x };
  let block = [curr_player];

  for (let i = 1; i < 4; i++) {
    next = getNextCoordinate(y, x, i, dir, true);
    if (typeof curr_board[next.y]?.[next.x] !== 'undefined') {
      block = [...block, curr_board[next.y][next.x]]
    }
    else break;
  }
  for (let i = 1; i < 4; i++) {
    next = getNextCoordinate(y, x, i, dir, false);
    if (typeof curr_board[next.y]?.[next.x] !== 'undefined') {
      block = [curr_board[next.y][next.x], ...block];
      start = next;
    }
    else break;
  }
  return block;
}

export const checkIllegalMoveDoubleThree = (curr_board, curr_player, cell) => {
  // const node = evaluteCells(curr_board, curr_player, cells_to_eval, curr_capture, 2);
  // console.log('node', node);
  const horizontalBlock = getBlock(curr_board, curr_player, cell, 'h');
  const verticalBlock = getBlock(curr_board, curr_player, cell, 'v');
  const diagonalBlock_1 = getBlock(curr_board, curr_player, cell, 'd_1');
  const diagonalBlock_2 = getBlock(curr_board, curr_player, cell, 'd_2');
  console.log('horizontalBlock', horizontalBlock);
  console.log('verticalBlock', verticalBlock);
  console.log('diagonalBlock_1', diagonalBlock_1);
  console.log('diagonalBlock_2', diagonalBlock_2);
  
  
  // // horizontal
  // if (curr_board[y]?.[x - 1] === '') {
  //   if (curr_board[y]?.[x + 1] === curr_player) {
  //     if (curr_board[y]?.[x + 2] === curr_player && curr_board[y]?.[x + 3] === '')
  //       d_open_3_count = d_open_3_count + 1;
  //     else if (curr_board[y]?.[x + 2] === '' && curr_board[y]?.[x + 3] === curr_player && curr_board[y]?.[x + 4] === '')
  //       broken_3_count = broken_3_count + 1;
  //   }
  //   else if (curr_board[y]?.[x + 1] === '' && curr_board[y]?.[x + 2] === curr_player && curr_board[y]?.[x + 3] === curr_player && curr_board[y]?.[x + 4] === '')
  //     broken_3_count = broken_3_count + 1;
  // }

  // else if (curr_board[y]?.[x + 1] === '' && curr_board[y]?.[x - 1] === curr_player) {
  //   if (curr_board[y]?.[x - 2] === curr_player && curr_board[y]?.[x - 3] === '') d_open_3_count = d_open_3_count + 1;
  //   else if (curr_board[y]?.[x - 2] === '' && curr_board[y]?.[x - 3] === curr_player && curr_board[y]?.[x - 4] === '') broken_3_count = broken_3_count + 1;
  // }
  // else if (curr_board[y]?.[x + 1] === curr_player && curr_board[y]?.[x - 1] === curr_player && curr_board[y]?.[x + 2] === '' && curr_board[y]?.[x - 2] === '')
  //   d_open_3_count = d_open_3_count + 1;
  // // vertical
  // if (curr_board[y - 1]?.[x] === '' && curr_board[y + 1]?.[x] === curr_player && curr_board[y + 2]?.[x] === curr_player && curr_board[y + 3]?.[x] === '')
  //   d_open_3_count = d_open_3_count + 1;
  // else if (curr_board[y + 1]?.[x] === '' && curr_board[y - 1]?.[x] === curr_player && curr_board[y - 2]?.[x] === curr_player && curr_board[y - 3]?.[x] === '')
  //   d_open_3_count = d_open_3_count + 1;
  // else if (curr_board[y + 1]?.[x] === curr_player && curr_board[y - 1]?.[x] === curr_player && curr_board[y + 2]?.[x] === '' && curr_board[y - 2]?.[x] === '')
  //   d_open_3_count = d_open_3_count + 1;
  // // d_1
  // if (curr_board[y - 1]?.[x - 1] === '' && curr_board[y + 1]?.[x + 1] === curr_player && curr_board[y + 2]?.[x + 2] === curr_player && curr_board[y + 3]?.[x + 3] === '')
  //   d_open_3_count = d_open_3_count + 1;
  // else if (curr_board[y + 1]?.[x + 1] === '' && curr_board[y - 1]?.[x - 1] === curr_player && curr_board[y - 2]?.[x - 2] === curr_player && curr_board[y - 3]?.[x - 3] === '')
  //   d_open_3_count = d_open_3_count + 1;
  // else if (curr_board[y + 1]?.[x + 1] === curr_player && curr_board[y - 1]?.[x - 1] === curr_player && curr_board[y + 2]?.[x + 2] === '' && curr_board[y - 2]?.[x - 2] === '')
  //   d_open_3_count = d_open_3_count + 1;
  // // d_2
  // if (curr_board[y - 1]?.[x + 1] === '' && curr_board[y + 1]?.[x - 1] === curr_player && curr_board[y + 2]?.[x - 2] === curr_player && curr_board[y + 3]?.[x - 3] === '')
  //   d_open_3_count = d_open_3_count + 1;
  // else if (curr_board[y + 1]?.[x - 1] === '' && curr_board[y - 1]?.[x + 1] === curr_player && curr_board[y - 2]?.[x + 2] === curr_player && curr_board[y - 3]?.[x + 3] === '')
  //   d_open_3_count = d_open_3_count + 1;
  // else if (curr_board[y + 1]?.[x - 1] === curr_player && curr_board[y - 1]?.[x + 1] === curr_player && curr_board[y + 2]?.[x - 2] === '' && curr_board[y - 2]?.[x + 2] === '')
  //   d_open_3_count = d_open_3_count + 1;

  // console.log('d_open_3_count', d_open_3_count);
  // console.log('broken_3_count', broken_3_count);
  // if (d_open_3_count >= 2) return true;
  return false;
};