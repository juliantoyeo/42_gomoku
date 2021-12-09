import { dir_array, doubleThreePattern } from './boardUtils';
import { getCoordinate } from './getCoordinate';

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
        if (pattern[i] === 0 && current_cell === '') {
          i++;
        }
        else if (pattern[i] === 1 && current_cell === curr_player) {
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

        if (curr_board[next_1.y]?.[next_1.x] === curr_player && curr_board[next_2.y]?.[next_2.x] === '') {
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

  for (let dir of dir_array) {
    if (skip_dir !== dir) {
      result = findPattern(curr_board, curr_player, cell, dir, true);
      if (!result) {
        result = findPattern(curr_board, curr_player, cell, dir, false);
        if (!result) {
          result = manualCheck(curr_board, curr_player, cell, dir);
        }
      }
      if (result) {
        result.pattern_found === 'double_open3' ? d_open_3_count++ : broken_3_count++;
        result = { ...result, dir }
        break;
      }
    }
  }
  total = d_open_3_count + broken_3_count;
  if (result)
    return { total, ...result };
  else
    return null;
}

export const checkMoveDoubleThree = (curr_board, curr_player, cell) => {
  let result = null;
  let total = 0;

  result = findPatternInAllDirection(curr_board, curr_player, cell, null);
  if (result) {
    total = total + result.total;
    if (total === 1) {
      for (let partner_cell of result.partner_cells) {
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
  return false;
};