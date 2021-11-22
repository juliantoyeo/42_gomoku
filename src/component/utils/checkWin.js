import { CONNECT_N } from './boardUtils';

const checkHorizontal = ({ board, currentPlayer, curY, curX }) => {
  let counter = 1;
  let dir_1 = true;
  let dir_2 = true;

  for (let i = 1; i < CONNECT_N + 1; i++) {
    dir_1 && board[curY - i]?.[curX] === currentPlayer ? counter++ : dir_1 = false;
    dir_2 && board[curY + i]?.[curX] === currentPlayer ? counter++ : dir_2 = false;
    if (!dir_1 && !dir_2) break;
  }
  return counter;
}

const checkVertical = ({ board, currentPlayer, curY, curX }) => {
  let counter = 1;
  let dir_1 = true;
  let dir_2 = true;

  for (let i = 1; i < CONNECT_N + 1; i++) {
    dir_1 && board[curY][curX - i] === currentPlayer ? counter++ : dir_1 = false;
    dir_2 && board[curY][curX + i] === currentPlayer ? counter++ : dir_2 = false;
    if (!dir_1 && !dir_2) break;
  }
  return counter;
}

const checkDiagonal_1 = ({ board, currentPlayer, curY, curX }) => {
  let counter = 1;
  let dir_1 = true;
  let dir_2 = true;

  for (let i = 1; i < CONNECT_N + 1; i++) {
    dir_1 && board[curY - i]?.[curX - i] === currentPlayer ? counter++ : dir_1 = false;
    dir_2 && board[curY + i]?.[curX + i] === currentPlayer ? counter++ : dir_2 = false;
    if (!dir_1 && !dir_2) break;
  }
  return counter;
}

const checkDiagonal_2 = ({ board, currentPlayer, curY, curX }) => {
  let counter = 1;
  let dir_1 = true;
  let dir_2 = true;

  for (let i = 1; i < CONNECT_N + 1; i++) {
    dir_1 && board[curY - i]?.[curX + i] === currentPlayer ? counter++ : dir_1 = false;
    dir_2 && board[curY + i]?.[curX - i] === currentPlayer ? counter++ : dir_2 = false;
    if (!dir_1 && !dir_2) break;
  }
  return counter;
}

export const checkWin = ({ board, currentPlayer, curY, curX }) => {
  if (checkHorizontal({ board, currentPlayer, curY, curX }) === CONNECT_N)
    return true;
  if (checkVertical({ board, currentPlayer, curY, curX }) === CONNECT_N)
    return true;
  if (checkDiagonal_1({ board, currentPlayer, curY, curX }) === CONNECT_N)
    return true;
  if (checkDiagonal_2({ board, currentPlayer, curY, curX }) === CONNECT_N)
    return true;
  return false;
}