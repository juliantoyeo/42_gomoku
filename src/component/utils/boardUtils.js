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
  ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
]

export const createBoard = () => {
  return (
    Array.from(new Array(BOARD_SIZE), () =>
      new Array(BOARD_SIZE).fill('')
    )
  );
  // return demoBoard;
}

export const dir_array = ['h', 'v', 'd_1', 'd_2'];

export const patterns_index = [
  'win',
  'double_open4',
  'open4',
  'double_open3',
  'capture',
  'broken3_1',
  'broken3_2',
  'covered3',
  'open2',
  'convered2',
  'close1'
];

export const patterns = {
  'win': [
    [1, 1, 1, 1, 1]
  ],
  'double_open4': [
    [0, 1, 1, 1, 1, 0]
  ],
  'open4': [
    [1, 1, 1, 1, 0],
    [1, 1, 1, 0, 1],
    [1, 1, 0, 1, 1],
    [1, 0, 1, 1, 1],
    [0, 1, 1, 1, 1]
  ],
  'double_open3': [
    [0, 1, 1, 1, 0]
  ],
  'capture': [
    [1, 2, 2, 0],
    [0, 2, 2, 1],
  ],
  'broken3_1': [
    [0, 1, 0, 1, 1, 0],
    [0, 1, 1, 0, 1, 0]
  ],
  'broken3_2': [
    [0, 1, 0, 0, 1, 1, 0],
    [0, 1, 1, 0, 0, 1, 0]
  ],
  'covered3': [
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
  'open2': [
    [0, 1, 1, 0, 0],
    [0, 0, 1, 1, 0],
    [0, 1, 0, 1, 0],
    [0, 1, 0, 0, 1, 0]
  ],
  'convered2': [
    [1, 1, 0, 0, 0],
    [0, 0, 0, 1, 1],
    [1, 0, 1, 0, 0],
    [0, 0, 1, 0, 1],
    [1, 0, 0, 1, 0],
    [0, 1, 0, 0, 1]
  ],
  'close1': [
    [1, 0],
    [0, 1]
  ]
}

export const doubleThreePattern = [
  {
    category: 'double_open3',
    pattern: patterns.double_open3[0]
  },
  {
    category: 'broken3_1',
    pattern: patterns.broken3_1[0]
  },
  {
    category: 'broken3_1',
    pattern: patterns.broken3_1[1]
  },
]

export const SCORE = {
  'win': 100,
  'double_open4': 90,
  'open4': 80,
  'double_open3': 70,
  'broken3_1': 60,
  'capture': 55,
  'broken3_2': 50,
  'covered3': 40,
  'open2': 30,
  'convered2': 20,
  'close1': 10
}

export const PRIORITY = {
  'win': 0,
  'double_open4': 1,
  'open4': 2,
  'double_open3': 3,
  'broken3_1': 4,
  'capture': 5,
  'broken3_2': 6,
  'covered3': 7,
  'open2': 8,
  'convered2': 9,
  'close1': 10
}

export const getCoordinateId = (y, x) => {
  const xArray = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's'];
  return `${y}${xArray[x]}`;
}

const getCell = (board, adj_cells, list, { y, x }) => {
  const selectedCell = _.find(
    adj_cells,
    (cell) => cell.y === y && cell.x === x
  );
  const selectedBcell = _.find(list, (cell) => cell.y === y && cell.x === x);
  if (selectedCell?.isIllegal) return 'I';
  else if (selectedBcell?.isCapturingCell) return 'C';
  else if (selectedBcell) return '\u001b[36mB\u001b[37m';
  // else if (selectedCell) return '\u001b[31ma\u001b[37m';
  else if (board[y][x] === '') return '_';
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