import { CONNECT_N, dir_array } from './boardUtils';
import { getCoordinate } from './getCoordinate';

export const checkPotentialCapture = (board, curr_player, cell, curr_dir) => {
  const { y, x } = cell;
  const enemy = curr_player === 'X' ? 'O' : 'X';
  let isCapturable = false;

  for (let dir of dir_array) {
    if (curr_dir === dir) continue;
    // console.log('checking dir', dir);
    const next_1 = getCoordinate(y, x, 1, dir, true, false);
    const next_2 = getCoordinate(y, x, 2, dir, true, false);
    const prev_1 = getCoordinate(y, x, 1, dir, false, false);
    const prev_2 = getCoordinate(y, x, 2, dir, false, false);

    if (board[prev_1.y]?.[prev_1.x] === '' && board[next_1.y]?.[next_1.x] === curr_player && board[next_2.y]?.[next_2.x] === enemy) {
      isCapturable = true;
      break;
    }
    else if (board[prev_1.y]?.[prev_1.x] === curr_player && board[prev_2.y]?.[prev_2.x] === '' && board[next_1.y]?.[next_1.x] === enemy) {
      isCapturable = true;
      break;
    }
    else if (board[prev_1.y]?.[prev_1.x] === enemy && board[next_1.y]?.[next_1.x] === curr_player && board[next_2.y]?.[next_2.x] === '') {
      isCapturable = true;
      break;
    }
    else if (board[prev_1.y]?.[prev_1.x] === curr_player && board[prev_2.y]?.[prev_2.x] === enemy && board[next_1.y]?.[next_1.x] === '') {
      isCapturable = true;
      break;
    }
  }
  return isCapturable;
}

const checkWinningRow = (board, curr_player, curr_capture, dir, y, x) => {
  let win = false;
  let counter = 1;
  let next = { y, x };
  let connected_cells = [{ y, x }];

  for (let i = 1; i < CONNECT_N + 1; i++) {
    next = getCoordinate(y, x, i, dir, true, false);
    if (board[next.y]?.[next.x] === curr_player) {
      connected_cells.push(next);
      counter++;
    }
    else
      break;
  }
  for (let i = 1; i < CONNECT_N + 1; i++) {
    next = getCoordinate(y, x, i, dir, false, false);
    if (board[next.y]?.[next.x] === curr_player) {
      connected_cells.push(next);
      counter++;
    }
    else
      break;
  }
  if (counter >= CONNECT_N) {
    win = true;
    // console.log('curr_capture[curr_player]', curr_capture[curr_player]);
    if (curr_capture[curr_player] === 8) {
      // console.log('win on dir', dir);
      for (let cell of connected_cells) {
        if (checkPotentialCapture(board, curr_player, cell, dir)) {
          win = false;
          // console.log('cell', cell, 'is captureable, thus win is ', win);
          break;
        }
      }
    }
  }
  return win;
}

export const checkWin = (curr_board, curr_player, curr_capture, y, x) => {
  if (curr_board.available === 0)
    return ('tie');
  else if (curr_capture['O'] === 10)
    return ('X');
  else if (curr_capture['X'] === 10)
    return ('O');
  else {
    for (let dir of dir_array) {
      if (checkWinningRow(curr_board.board, curr_player, curr_capture, dir, y, x)) {
        return curr_player;
      }
    }
  }
  return null;
}