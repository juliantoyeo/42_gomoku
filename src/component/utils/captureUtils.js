import _ from 'lodash';
import { getCoordinateId } from './boardUtils';

export const checkCapture = (curr_board, curr_player, captured, cell, isAi) => {
  const { y, x } = cell;
  const enemy = curr_player === 'X' ? 'O' : 'X';
  const newUnoccuppiedAdjacentCells = [];
  const newCaptured = _.cloneDeep(captured);
  const capturedCell = [];
  if (curr_board.board[y]?.[x + 1] === enemy && curr_board.board[y]?.[x + 2] === enemy && curr_board.board[y]?.[x + 3] === curr_player) {
    curr_board.board[y][x + 1] = '';
    curr_board.board[y][x + 2] = '';
    curr_board.available = curr_board.available + 2;
    newCaptured[enemy] = newCaptured[enemy] + 2;
    if (!isAi) capturedCell.push({ y: y, x: x + 1 }, { y: y, x: x + 2 });
    newUnoccuppiedAdjacentCells.push({ id: getCoordinateId(y, x + 2), y: y, x: x + 2 });
  }
  if (curr_board.board[y]?.[x - 1] === enemy && curr_board.board[y]?.[x - 2] === enemy && curr_board.board[y]?.[x - 3] === curr_player) {
    curr_board.board[y][x - 1] = '';
    curr_board.board[y][x - 2] = '';
    curr_board.available = curr_board.available + 2;
    newCaptured[enemy] = newCaptured[enemy] + 2;
    if (!isAi) capturedCell.push({ y: y, x: x - 1 }, { y: y, x: x - 2 });
    newUnoccuppiedAdjacentCells.push({ id: getCoordinateId(y, x - 2), y: y, x: x - 2 });
  }
  if (curr_board.board[y + 1]?.[x] === enemy && curr_board.board[y + 2]?.[x] === enemy && curr_board.board[y + 3]?.[x] === curr_player) {
    curr_board.board[y + 1][x] = '';
    curr_board.board[y + 2][x] = '';
    curr_board.available = curr_board.available + 2;
    newCaptured[enemy] = newCaptured[enemy] + 2;
    if (!isAi) capturedCell.push({ y: y + 1, x: x }, { y: y + 2, x: x });
    newUnoccuppiedAdjacentCells.push({ id: getCoordinateId(y + 2, x), y: y + 2, x: x });
  }
  if (curr_board.board[y - 1]?.[x] === enemy && curr_board.board[y - 2]?.[x] === enemy && curr_board.board[y - 3]?.[x] === curr_player) {
    curr_board.board[y - 1][x] = '';
    curr_board.board[y - 2][x] = '';
    curr_board.available = curr_board.available + 2;
    newCaptured[enemy] = newCaptured[enemy] + 2;
    if (!isAi) capturedCell.push({ y: y - 1, x: x }, { y: y - 2, x: x });
    newUnoccuppiedAdjacentCells.push({ id: getCoordinateId(y - 2, x), y: y - 2, x: x });
  }
  if (curr_board.board[y + 1]?.[x + 1] === enemy && curr_board.board[y + 2]?.[x + 2] === enemy && curr_board.board[y + 3]?.[x + 3] === curr_player) {
    curr_board.board[y + 1][x + 1] = '';
    curr_board.board[y + 2][x + 2] = '';
    curr_board.available = curr_board.available + 2;
    newCaptured[enemy] = newCaptured[enemy] + 2;
    if (!isAi) capturedCell.push({ y: y + 1, x: x + 1 }, { y: y + 2, x: x + 2 });
    newUnoccuppiedAdjacentCells.push({ id: getCoordinateId(y + 2, x + 2), y: y + 2, x: x + 2 });
  }
  if (curr_board.board[y - 1]?.[x - 1] === enemy && curr_board.board[y - 2]?.[x - 2] === enemy && curr_board.board[y - 3]?.[x - 3] === curr_player) {
    curr_board.board[y - 1][x - 1] = '';
    curr_board.board[y - 2][x - 2] = '';
    curr_board.available = curr_board.available + 2;
    newCaptured[enemy] = newCaptured[enemy] + 2;
    if (!isAi) capturedCell.push({ y: y - 1, x: x - 1 }, { y: y - 2, x: x - 2 });
    newUnoccuppiedAdjacentCells.push({ id: getCoordinateId(y - 2, x - 2), y: y - 2, x: x - 2 });
  }
  if (curr_board.board[y + 1]?.[x - 1] === enemy && curr_board.board[y + 2]?.[x - 2] === enemy && curr_board.board[y + 3]?.[x - 3] === curr_player) {
    curr_board.board[y + 1][x - 1] = '';
    curr_board.board[y + 2][x - 2] = '';
    curr_board.available = curr_board.available + 2;
    newCaptured[enemy] = newCaptured[enemy] + 2;
    if (!isAi) capturedCell.push({ y: y + 1, x: x - 1 }, { y: y + 2, x: x - 2 });
    newUnoccuppiedAdjacentCells.push({ id: getCoordinateId(y + 2, x - 2), y: y + 2, x: x - 2 });
  }
  if (curr_board.board[y - 1]?.[x + 1] === enemy && curr_board.board[y - 2]?.[x + 2] === enemy && curr_board.board[y - 3]?.[x + 3] === curr_player) {
    curr_board.board[y - 1][x + 1] = '';
    curr_board.board[y - 2][x + 2] = '';
    curr_board.available = curr_board.available + 2;
    newCaptured[enemy] = newCaptured[enemy] + 2;
    if (!isAi) capturedCell.push({ y: y - 1, x: x + 1 }, { y: y - 2, x: x + 2 });
    newUnoccuppiedAdjacentCells.push({ id: getCoordinateId(y - 2, x + 2), y: y - 2, x: x + 2 });
  }
  return ({
    board: curr_board,
    captured: newCaptured,
    capturedCell,
    newAdjacentCells: newUnoccuppiedAdjacentCells
  });
}

export const checkIllegalMoveCapture = (curr_board, curr_player, cell) => {
  const { y, x } = cell;
  const enemy = curr_player === 'X' ? 'O' : 'X';
  if (curr_board[y]?.[x + 1] === enemy && curr_board[y]?.[x - 1] === curr_player && curr_board[y]?.[x - 2] === enemy) {
    return true;
  }
  else if (curr_board[y]?.[x - 1] === enemy && curr_board[y]?.[x + 1] === curr_player && curr_board[y]?.[x + 2] === enemy) {
    return true;
  }
  else if (curr_board[y + 1]?.[x] === enemy && curr_board[y - 1]?.[x] === curr_player && curr_board[y - 2]?.[x] === enemy) {
    return true;
  }
  else if (curr_board[y - 1]?.[x] === enemy && curr_board[y + 1]?.[x] === curr_player && curr_board[y + 2]?.[x] === enemy) {
    return true;
  }
  else if (curr_board[y + 1]?.[x + 1] === enemy && curr_board[y - 1]?.[x - 1] === curr_player && curr_board[y - 2]?.[x - 2] === enemy) {
    return true;
  }
  else if (curr_board[y - 1]?.[x - 1] === enemy && curr_board[y + 1]?.[x + 1] === curr_player && curr_board[y + 2]?.[x + 2] === enemy) {
    return true;
  }
  else if (curr_board[y + 1]?.[x - 1] === enemy && curr_board[y - 1]?.[x + 1] === curr_player && curr_board[y - 2]?.[x + 2] === enemy) {
    return true;
  }
  else if (curr_board[y - 1]?.[x + 1] === enemy && curr_board[y + 1]?.[x - 1] === curr_player && curr_board[y + 2]?.[x - 2] === enemy) {
    return true;
  }
  return false;
}

export const checkIfCaptureMove = (curr_board, curr_player, cell) => {
  const { y, x } = cell;
  const enemy = curr_player === 'X' ? 'O' : 'X';
  if (curr_board[y]?.[x + 1] === enemy && curr_board[y]?.[x + 2] === enemy && curr_board[y]?.[x + 3] === curr_player) {
    return true;
  }
  else if (curr_board[y]?.[x - 1] === enemy && curr_board[y]?.[x - 2] === enemy && curr_board[y]?.[x - 3] === curr_player) {
    return true;
  }
  else if (curr_board[y + 1]?.[x] === enemy && curr_board[y + 2]?.[x] === enemy && curr_board[y + 3]?.[x] === curr_player) {
    return true;
  }
  else if (curr_board[y - 1]?.[x] === enemy && curr_board[y - 2]?.[x] === enemy && curr_board[y - 3]?.[x] === curr_player) {
    return true;
  }
  else if (curr_board[y + 1]?.[x + 1] === enemy && curr_board[y + 2]?.[x + 2] === enemy && curr_board[y + 3]?.[x + 3] === curr_player) {
    return true;
  }
  else if (curr_board[y - 1]?.[x - 1] === enemy && curr_board[y - 2]?.[x - 2] === enemy && curr_board[y - 3]?.[x - 3] === curr_player) {
    return true;
  }
  else if (curr_board[y + 1]?.[x - 1] === enemy && curr_board[y + 2]?.[x - 2] === enemy && curr_board[y + 3]?.[x - 3] === curr_player) {
    return true;
  }
  else if (curr_board[y - 1]?.[x + 1] === enemy && curr_board[y - 2]?.[x + 2] === enemy && curr_board[y - 3]?.[x + 3] === curr_player) {
    return true;
  }
  return false;
}