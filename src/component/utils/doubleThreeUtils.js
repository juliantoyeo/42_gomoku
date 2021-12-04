import _ from 'lodash';
import { patterns, doubleThreePattern } from './boardUtils';
// import { getNextCoordinate } from './evaluateUtils';
import { getCoordinate } from './getCoordinate';

// _,_,_,0,1,1,1,0,_   if left = 0, check pattern[1] onward dir forward pattern[2] === x + 2 ?
// _,_,_,0,1,0,1,1,0
// _,_,_,0,1,1,0,1,0 

// _,0,1,1,1,0,_,_,_   if right = 0, check pattern[1] onward dir backward pattern[2] === x - 2 ?
// 0,1,0,1,1,0,_,_,_
// 0,1,1,0,1,0,_,_,_

// _,_,0,1,1,1,0,_,_  else x + 1 === x, x - 1 === x, x + 2 === 0, x - 2 === 0
// _,0,1,0,1,1,0,_,_ 
// _,_,0,1,1,0,1,0,_ 

const manualCheck = (curr_board, curr_player, cell, dir) => {
  const { y, x } = cell;
  let pattern_found = null;
  let partner_cells = [];

  const next_1 = getCoordinate(y, x, 1, dir, true, false);
  const next_2 = getCoordinate(y, x, 2, dir, true, false);
  const prev_1 = getCoordinate(y, x, 1, dir, false, false);
  const prev_2 = getCoordinate(y, x, 2, dir, false, false);

  if (curr_board[next_1.y]?.[next_1.x] === curr_player && curr_board[next_2.y]?.[next_2.x] === '' &&
    curr_board[prev_1.y]?.[prev_1.x] === curr_player && curr_board[prev_2.y]?.[prev_2.x] === '') {
    pattern_found = 'double_open3';
    // partner_cells.push({ y: next_1.y, x: next_1.x });
    partner_cells = [
      { y: prev_1.y, x: prev_1.x },
      cell,
      { y: next_1.y, x: next_1.x },
    ]
  }
  if (pattern_found)
    return { pattern_found, partner_cells };
  else
    return null;
}

const findPattern = (curr_board, curr_player, cell, dir, isForward) => {
  const { y, x } = cell;
  let current_cell = null;
  let next = { y, x };
  let pattern = null;
  let pattern_found = null;
  let pattern_index = 0;
  let partner_cells = null;


  next = getCoordinate(y, x, 1, dir, !isForward, false);
  if (curr_board[next.y]?.[next.x] === '') {
    for (let element of doubleThreePattern) {
      partner_cells = [cell];
      pattern = element.pattern;
      let i = 2;
      while (i < pattern.length) {
        next = getCoordinate(y, x, i - 1, dir, isForward, false);
        current_cell = curr_board[next.y]?.[next.x];
        // console.log('next', next, 'current_cell', current_cell);
        // if (!(pattern[i] === 0 && current_cell === '') && !(pattern[i] === 1 && current_cell === curr_player))
        //   break;
        // i++;
        // console.log('pattern_index', pattern_index, 'i', i);
        if (pattern[i] === 0 && current_cell === '') {
          i++;
        }
        else if (pattern[i] === 1 && current_cell === curr_player) {
          // console.log('i', i, 'next', next, 'current_cell', current_cell);
          partner_cells.push({ y: next.y, x: next.x });
          i++;
        }
        else {
          break;
        }
      }
      if (i === pattern.length) {
        pattern_found = element.category;
      }
      else if (pattern_index === 2 && i === 4) {
        const next_1 = getCoordinate(y, x, 2, dir, !isForward, false);
        const next_2 = getCoordinate(y, x, 3, dir, !isForward, false);
        // console.log('pattern_index', pattern_index);

        // _,_,0,1,1,1,0,_,_  else x + 1 === x, x - 1 === x, x + 2 === 0, x - 2 === 0
        // _,0,1,0,1,1,0,_,_ 
        // _,_,0,1,1,0,1,0,_ 
        if (curr_board[next_1.y]?.[next_1.x] === curr_player && curr_board[next_2.y]?.[next_2.x] === '') {
          // console.log(curr_board[next_1.y]?.[next_1.x], curr_board[next_2.y]?.[next_2.x]);
          pattern_found = 'broken3_1';
          partner_cells.push({ y: next_1.y, x: next_1.x });
        }
      }
      if (pattern_found) {
        break;
      }

      pattern_index++;
    }
  }
  if (pattern_found)
    return { pattern_found, partner_cells };
  else
    return null;
}

const findPatternInAllDirection = (curr_board, curr_player, cell, skip_dir) => {
  let result = null;
  let d_open_3_count = 0;
  let broken_3_count = 0;
  let total = 0;
  const dir_array = ['h', 'v', 'd_1', 'd_2'];

  for (let dir of dir_array) {
    if (skip_dir !== dir) {
      result = findPattern(curr_board, curr_player, cell, dir, true);
      // console.log('dir', dir, 'result 1', result);
      if (!result) {
        result = findPattern(curr_board, curr_player, cell, dir, false);
        // console.log('dir', dir, 'result 2', result);
        if (!result) {
          result = manualCheck(curr_board, curr_player, cell, dir);
          // console.log('dir', dir, 'result 3', result);
        }
      }
      if (result) {
        result.pattern_found === 'double_open3' ? d_open_3_count++ : broken_3_count++;
        // console.log('dir', dir, 'result', result);
        result = { ...result, dir }
        break;
      }
    }
    // console.log('dir', dir, 'd_open_3_count', d_open_3_count, 'broken_3_count', broken_3_count);
  }
  total = d_open_3_count + broken_3_count;
  // return total;
  // console.log('result', result);
  if (result)
    return { total, ...result };
  else
    return null;
}

export const checkIllegalMoveDoubleThree = (curr_board, curr_player, cell) => {
  let result = null;
  let total = 0;

  result = findPatternInAllDirection(curr_board, curr_player, cell, null);
  if (result) {
    total = total + result.total;
    // console.log('total', total);
    if (total === 1) {
      for (let partner_cell of result.partner_cells) {
        // console.log('partner_cell', partner_cell);
        // console.log('result', result);
        const result2 = findPatternInAllDirection(curr_board, curr_player, partner_cell, result.dir);
        if (result2) {
          total = total + result2.total;
          break;
        }
      }
    }
  }

  if (total >= 2) {
    return true;
  }
  // const node = evaluteCells(curr_board, curr_player, cells_to_eval, curr_capture, 2);
  // console.log('node', node);
  // const horizontalBlock = getBlock(curr_board, curr_player, cell, 'h');
  // const verticalBlock = getBlock(curr_board, curr_player, cell, 'v');
  // const diagonalBlock_1 = getBlock(curr_board, curr_player, cell, 'd_1');
  // const diagonalBlock_2 = getBlock(curr_board, curr_player, cell, 'd_2');
  // console.log('horizontalBlock', horizontalBlock);
  // console.log('verticalBlock', verticalBlock);
  // console.log('diagonalBlock_1', diagonalBlock_1);
  // console.log('diagonalBlock_2', diagonalBlock_2);


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