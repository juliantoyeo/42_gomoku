import _ from 'lodash';
import { getCoordinateId } from './boardUtils';
import { checkIllegalMoveCapture, checkIfCaptureMove } from './captureUtils';
import { checkIllegalMoveDoubleThree } from './doubleThreeUtils';

const removeIllegalMove = (curr_board, curr_player, adj_cells) => {
  for (let i = 0; i < adj_cells.length; i++) {
    adj_cells[i].isIllegal = false;
    if (checkIllegalMoveCapture(curr_board, curr_player, adj_cells[i])) {
      adj_cells[i].isIllegal = true;
    }
    else {
      if (checkIfCaptureMove(curr_board, curr_player, adj_cells[i])) {
        adj_cells[i].isCapture = true;
      }
      else if (checkIllegalMoveDoubleThree(curr_board, curr_player, adj_cells[i])) {
        adj_cells[i].isIllegal = true;
      }
    }
  }
  return (adj_cells);
}

// For recalculate adjacent cell after and undo, all move record will be re-scanned
export const generateAdjacentFromAllOccupiedCell = (curr_board, curr_player, move_record) => {
  let new_adjacent_cells = [];
  _.map(move_record, (move) => {
    const { y, x } = move;
    if (curr_board[y - 1]?.[x - 1] === '') new_adjacent_cells.push({ id: getCoordinateId(y - 1, x - 1), y: y - 1, x: x - 1 });
    if (curr_board[y - 1]?.[x] === '') new_adjacent_cells.push({ id: getCoordinateId(y - 1, x), y: y - 1, x: x });
    if (curr_board[y - 1]?.[x + 1] === '') new_adjacent_cells.push({ id: getCoordinateId(y - 1, x + 1), y: y - 1, x: x + 1 });
    if (curr_board[y]?.[x - 1] === '') new_adjacent_cells.push({ id: getCoordinateId(y, x - 1), y: y, x: x - 1 });
    if (curr_board[y]?.[x + 1] === '') new_adjacent_cells.push({ id: getCoordinateId(y, x + 1), y: y, x: x + 1 });
    if (curr_board[y + 1]?.[x - 1] === '') new_adjacent_cells.push({ id: getCoordinateId(y + 1, x - 1), y: y + 1, x: x - 1 });
    if (curr_board[y + 1]?.[x] === '') new_adjacent_cells.push({ id: getCoordinateId(y + 1, x), y: y + 1, x: x });
    if (curr_board[y + 1]?.[x + 1] === '') new_adjacent_cells.push({ id: getCoordinateId(y + 1, x + 1), y: y + 1, x: x + 1 });
  })
  new_adjacent_cells = _.uniqBy(new_adjacent_cells, 'id');
  new_adjacent_cells = removeIllegalMove(curr_board, curr_player, new_adjacent_cells);
  return new_adjacent_cells;
}

export const generateAdjacentFromLastOccupiedCell = (curr_board, curr_player, adjacent_cells, last_move) => {
  let new_adjacent_cells = [];
  if (last_move) {
    const { y, x } = last_move;
    new_adjacent_cells = _.filter(adjacent_cells, (cell) => (cell.y !== y || cell.x !== x));
    if (curr_board[y - 1]?.[x - 1] === '') new_adjacent_cells.push({ id: getCoordinateId(y - 1, x - 1), y: y - 1, x: x - 1 });
    if (curr_board[y - 1]?.[x] === '') new_adjacent_cells.push({ id: getCoordinateId(y - 1, x), y: y - 1, x: x });
    if (curr_board[y - 1]?.[x + 1] === '') new_adjacent_cells.push({ id: getCoordinateId(y - 1, x + 1), y: y - 1, x: x + 1 });
    if (curr_board[y]?.[x - 1] === '') new_adjacent_cells.push({ id: getCoordinateId(y, x - 1), y: y, x: x - 1 });
    if (curr_board[y]?.[x + 1] === '') new_adjacent_cells.push({ id: getCoordinateId(y, x + 1), y: y, x: x + 1 });
    if (curr_board[y + 1]?.[x - 1] === '') new_adjacent_cells.push({ id: getCoordinateId(y + 1, x - 1), y: y + 1, x: x - 1 });
    if (curr_board[y + 1]?.[x] === '') new_adjacent_cells.push({ id: getCoordinateId(y + 1, x), y: y + 1, x: x });
    if (curr_board[y + 1]?.[x + 1] === '') new_adjacent_cells.push({ id: getCoordinateId(y + 1, x + 1), y: y + 1, x: x + 1 });
  }
  new_adjacent_cells = _.uniqBy(new_adjacent_cells, 'id');
  new_adjacent_cells = removeIllegalMove(curr_board, curr_player, new_adjacent_cells);
  return new_adjacent_cells;
}