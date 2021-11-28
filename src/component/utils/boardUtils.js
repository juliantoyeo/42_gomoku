import _ from 'lodash';

// NOTE
// To traverse horizontal pattern
// [y][x + i] where i < col_size
// To traverse vertical pattern
// [y + i][x] where i < row_size
// To traverse diagonal_1 pattern
// [y + i][x - i] where i < diagonal_row.length
// To traverse diagonal_2 pattern
// [y + i][x + i] where i < diagonal_row.length


// Board setting
export const BOARD_SIZE = 19;
export const DIAGONAL_ROW_SIZE = BOARD_SIZE + BOARD_SIZE - 1;
export const CELL_SIZE = 3;
export const CONNECT_N = 5;

// AI setting
export const TAKE_BEST_N = 1;
export const DEPTH = 10;
export const MAX = 1000;
export const MIN = -1000;

export const demoBoard = [
  ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
  ['', 'X', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
  ['', 'X', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
  ['', 'X', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
]

export const patterns_index = ['win', 'double_open4', 'open4', 'double_open3', 'broken3', 'covered3', 'open2', 'convered2', 'open1', 'close1']

export const patterns = {
  [patterns_index[0]]: [
    [1, 1, 1, 1, 1]
  ],
  [patterns_index[1]]: [
    [0, 1, 1, 1, 1, 0]
  ],
  [patterns_index[2]]: [
    [1, 1, 1, 1, 0],
    [1, 1, 1, 0, 1],
    [1, 1, 0, 1, 1],
    [1, 0, 1, 1, 1],
    [0, 1, 1, 1, 1]
  ],
  [patterns_index[3]]: [
    [0, 1, 1, 1, 0]
  ],
  [patterns_index[4]]: [
    [0, 1, 0, 1, 1, 0],
    [0, 1, 1, 0, 1, 0],
    [0, 1, 0, 0, 1, 1, 0],
    [0, 1, 1, 0, 0, 1, 0]
  ],
  [patterns_index[5]]: [
    [1, 1, 1, 0, 0],
    [0, 0, 1, 1, 1],
    [1, 0, 1, 1, 0],
    [0, 1, 1, 0, 1],
    [1, 0, 0, 1, 1],
    [1, 1, 0, 0, 1],
    [1, 1, 0, 1, 0],
    [0, 1, 0, 1, 1],
    [1, 0, 1, 0, 1]
  ],
  [patterns_index[6]]: [
    [0, 1, 1, 0, 0],
    [0, 0, 1, 1, 0],
    [0, 1, 0, 1, 0],
    [0, 1, 0, 0, 1, 0]
  ],
  [patterns_index[7]]: [
    [1, 1, 0, 0, 0],
    [0, 0, 0, 1, 1],
    [1, 0, 1, 0, 0],
    [0, 0, 1, 0, 1],
    [1, 0, 0, 1, 0],
    [0, 1, 0, 0, 1]
  ],
  // [patterns_index[8]]: [
  //   [0, 0, 1, 0, 0],
  // ],
  [patterns_index[9]]: [
    [1, 0],
    [0, 1]
  ]
}

export const SCORE = {
  [patterns_index[0]]: 100,
  [patterns_index[1]]: 90,
  [patterns_index[2]]: 80,
  [patterns_index[3]]: 70,
  [patterns_index[4]]: 60,
  [patterns_index[5]]: 50,
  [patterns_index[6]]: 40,
  [patterns_index[7]]: 30,
  [patterns_index[8]]: 20,
  [patterns_index[9]]: 10
}

export const getCoordinateId = (y, x) => {
  const xArray = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's'];
  return `${y}${xArray[x]}`;
}

export const createBoard = () => {
  return (
    Array.from(new Array(BOARD_SIZE), () =>
      new Array(BOARD_SIZE).fill('')
    )
  );
  // return demoBoard;
}

const getCell = (board, adj_cells, list, { y, x }) => {
  const selectedCell = _.find(
    adj_cells,
    (cell) => cell.y === y && cell.x === x
  );
  const selectedBcell = _.find(list, (cell) => cell.y === y && cell.x === x);
  if (selectedBcell) return '\u001b[36mB\u001b[37m';
  else if (selectedCell) return '\u001b[31ma\u001b[37m';
  if (board[y][x] === '') return '_';
  return board[y][x];
};

export const printBoard = (board, adj_cells, list) => {
  let string = '\ta,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s\n';
  _.map(board, (row, y) => {
    let rowString = `${y}\t`;
    _.map(row, (col, x) => {
      rowString = `${rowString}${getCell(board, adj_cells, list, { y, x })},`
    })
    rowString = `${rowString}`
    string = `${string}${rowString}\n`
  })
  console.log(string);
}