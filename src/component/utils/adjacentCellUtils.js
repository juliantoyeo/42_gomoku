import _ from 'lodash';
import { getCoordinateId } from './boardUtils';

// For recalculate adjacent cell after and undo, all move record will be re-scanned
export const generateAdjacentFromAllOccupiedCell = (curr_board, move_record) => {
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
  return new_adjacent_cells;
}

export const generateAdjacentFromLastOccupiedCell = (curr_board, adjacent_cells, move_record) => {
  let new_adjacent_cells = [];
  const lastMove = _.last(move_record);
  if (lastMove) {
    const { y, x } = lastMove;
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
  return new_adjacent_cells;
}