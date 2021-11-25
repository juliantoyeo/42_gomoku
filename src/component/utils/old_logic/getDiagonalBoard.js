import { BOARD_SIZE, DIAGONAL_ROW_SIZE } from '../boardUtils';

export const getDiagonalBoard = (curr_board) => {
  const d_1 = Array.from(Array(DIAGONAL_ROW_SIZE), () => []);
  const d_2 = Array.from(Array(DIAGONAL_ROW_SIZE), () => []);

  for (let y = 0; y < BOARD_SIZE; y++) {
    for (let x = 0; x < BOARD_SIZE; x++) {
      d_1[y + x].push({
        cell: curr_board[y][x],
        pos: { y, x }
      });
    }
  }

  for (let y = 0; y < BOARD_SIZE; y++) {
    for (let x = 0; x < BOARD_SIZE; x++) {
      d_2[(BOARD_SIZE - 1) - x + y].push({
        cell: curr_board[y][x],
        pos: { y, x }
      });
    }
  }

  return ({ d_1, d_2 })
}