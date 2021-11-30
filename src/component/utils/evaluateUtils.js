import _ from 'lodash';
import {
  CONNECT_N,
  SCORE,
  TAKE_BEST_N,
  patterns,
  patterns_index,
  getCoordinateId
} from './boardUtils';

const getNodeFromPattern = (item, offset, pattern, key, curr_player, dir, curr_capture) => {
  let owner = '';
  let enemy = '';
  let i = 0;

  // if (key !== 'capture' || dir !== 'v') return null;
  // console.log('checking item.block', item.block, 'offset', offset, 'pattern', pattern);
  while (i < pattern.length) {
    const cell = item.block[offset + i];
    // console.log('cell ', cell, ` vs pattern ${i} `, pattern[i]);
    if (owner === '' && cell !== '') {
      if (key === 'capture') {
        if (cell === 'X') {
          owner = i === 0 ? 'X' : 'O';
          enemy = i === 0 ? 'O' : 'X';
        }
        else if (cell === 'O') {
          owner = i === 0 ? 'O' : 'X';
          enemy = i === 0 ? 'X' : 'O';
        }
      }
      else {
        if (cell === 'X') owner = 'X';
        else if (cell === 'O') owner = 'O';
      }
    }

    if (!(pattern[i] === 0 && cell === '') &&
      !(owner !== '' && pattern[i] === 1 && cell === owner) &&
      !(owner !== '' && pattern[i] === 2 && cell === enemy)
    ) {
      // console.log('breaking');
      break;
    }
    i++;
  }

  // console.log(`final i ${i}`, 'for pattern', pattern);

  if (i === pattern.length) {
    let start_y = item.start.y;
    let start_x = item.start.x;
    let score = SCORE[key];

    if (dir === 'h') {
      start_x = start_x + offset;
    }
    else if (dir === 'v') {
      start_y = start_y + offset;
    }
    else if (dir === 'd_1') {
      start_y = start_y + offset;
      start_x = start_x + offset;
    }
    else if (dir === 'd_2') {
      start_y = start_y - offset;
      start_x = start_x + offset;
    }

    if (key === 'capture') {
      score = curr_capture[enemy] * 2 + score;
    }
    if (owner !== curr_player) {
      score = score * -1;
    }

    return ({
      start: { y: start_y, x: start_x },
      pattern: pattern,
      owner: owner,
      category: key,
      dir: dir,
      score: score
    });
  }

  return null;
}

const evaluate = (blocks, curr_player, curr_capture) => {
  const n_array = [];
  // console.log('evaluate blocks', blocks);
  _.map(blocks, (item) => {
    for (let i = 0; i < item.block.length; i++) {
      let new_node = null;
      // console.log(`evaluate ${i} item`, item);
      _.map(patterns, (category, key) => {
        if (new_node) return;
        _.map(category, (pattern) => {
          if (new_node) return;
          new_node = getNodeFromPattern(item, i, pattern, key, curr_player, item.dir, curr_capture);
        })
      })
      if (new_node) {
        n_array.push(new_node);
      }
    }
  })
  // console.log('n_array', n_array);
  return n_array;
}

const getNextCoordinate = (y, x, index, dir, isForward) => {
  let next = { y: y, x: x };

  if (dir === 'h') {
    if (isForward) next = { y: y, x: x + index };
    else next = { y: y, x: x - index };
  }
  else if (dir === 'v') {
    if (isForward) next = { y: y + index, x: x };
    else next = { y: y - index, x: x };
  }
  else if (dir === 'd_1') {
    if (isForward) next = { y: y + index, x: x + index };
    else next = { y: y - index, x: x - index };
  }
  else if (dir === 'd_2') {
    if (isForward) next = { y: y - index, x: x + index };
    else next = { y: y + index, x: x - index };
  }
  return ({
    id: getCoordinateId(next.y, next.x),
    y: next.y,
    x: next.x
  })
}

const getBlock = (curr_board, cells_to_eval, dir) => {
  const allBlock = [];
  const overlapped_cells = [];

  _.map(cells_to_eval, (cell) => {
    if (_.find(overlapped_cells, (o_cell) => o_cell.id === cell.id)) return; // skip overlapped cells as it is already scanned and included in the block
    if (cell.isIllegal) return;
    const { y, x } = cell;
    let next = { y, x };
    let start = { y, x };
    let f_offset = 0;
    let b_offset = 0;
    // let backward = true;
    // let forward = true;
    let block = [curr_board[y][x]];

    for (let i = 1; i < CONNECT_N + f_offset; i++) { // scan 4 cell forward to get all the cell content
      // if (forward) {
      next = getNextCoordinate(y, x, i, dir, true);
      const overlapped_cell = _.find(cells_to_eval, (cell) => cell.id === next.id);

      if (overlapped_cell) {
        if (overlapped_cell.isIllegal) break;
        overlapped_cells.push(overlapped_cell);
        f_offset = i;
      }
      if (typeof curr_board[next.y]?.[next.x] !== 'undefined') {
        block = [...block, curr_board[next.y][next.x]]
      }
      else break;
      // }
    }
    for (let i = 1; i < CONNECT_N + b_offset; i++) { // scan 4 cell backward to get all the cell content
      // if (backward) {
      next = getNextCoordinate(y, x, i, dir, false);
      const overlapped_cell = _.find(cells_to_eval, (cell) => cell.id === next.id);

      if (overlapped_cell) {
        if (overlapped_cell.isIllegal) break;
        overlapped_cells.push(overlapped_cell);
        b_offset = i;
      }
      if (typeof curr_board[next.y]?.[next.x] !== 'undefined') {
        block = [curr_board[next.y][next.x], ...block];
        start = next;
      }
      else break;
      // }
    }

    // console.log(`dir ${dir} scanned y: ${y}, x: ${x} `, block);
    allBlock.push({
      start: { y: start.y, x: start.x },
      dir,
      block
    });
  })
  // console.log(`dir ${dir} allBlock`, allBlock);
  return allBlock;
}



export const evaluteCells = (curr_board, curr_player, cells_to_eval, curr_capture, gameTurn) => {
  let b_node = [];
  let t_node = [];
  const horizontalBlock = getBlock(curr_board.board, cells_to_eval, 'h');
  const verticalBlock = getBlock(curr_board.board, cells_to_eval, 'v');
  const diagonalBlock_1 = getBlock(curr_board.board, cells_to_eval, 'd_1');
  const diagonalBlock_2 = getBlock(curr_board.board, cells_to_eval, 'd_2');
  // console.log('horizontalBlock', horizontalBlock);
  // console.log('verticalBlock', verticalBlock);
  // console.log('diagonalBlock_1', diagonalBlock_1);
  // console.log('diagonalBlock_2', diagonalBlock_2);
  const h_node = evaluate(horizontalBlock, curr_player, curr_capture);
  const v_node = evaluate(verticalBlock, curr_player, curr_capture);
  const d_node_1 = evaluate(diagonalBlock_1, curr_player, curr_capture);
  const d_node_2 = evaluate(diagonalBlock_2, curr_player, curr_capture);
  // console.log('h_node', h_node);
  // console.log('v_node', v_node);
  // console.log('d_node_1', d_node_1);
  // console.log('d_node_2', d_node_2);
  b_node = _.take(
    _.orderBy(
      _.filter([...d_node_1, ...d_node_2, ...h_node, ...v_node], (node) => node.owner === curr_player),
      ['score'],
      ['desc']
    ), gameTurn < 4 ? 2 : TAKE_BEST_N
  );
  t_node = _.take(
    _.orderBy(
      _.filter([...d_node_1, ...d_node_2, ...h_node, ...v_node], (node) => node.owner !== curr_player),
      ['score'],
      ['asc']
    ), gameTurn < 4 ? 2 : TAKE_BEST_N
  );
  // console.log(`b_node`, b_node);
  // console.log(`t_node`, t_node);

  let combinedNode = _.take(
    _.orderBy(
      _.map([...b_node, ...t_node], (node) => {
        node.priority = _.findIndex(patterns_index, (category) => category === node.category);
        return node
      }),
      ['priority'],
      ['asc']
    ), gameTurn < 4 ? 2 : TAKE_BEST_N
  );
  // console.log('combinedNode', combinedNode);
  // return ({ b_node, t_node });
  return (combinedNode);
}