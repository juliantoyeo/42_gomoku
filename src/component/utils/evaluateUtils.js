import _ from 'lodash';
import {
  CONNECT_N,
  SCORE,
  TAKE_BEST_N,
  patterns,
  patterns_index,
  getCoordinateId
} from './boardUtils';

const getNodeFromPattern = (item, offset, pattern, key, curr_player, dir) => {
  let owner = '';
  let i = 0;

  // console.log('checking item.block', item.block, 'pattern', pattern);
  while (i < pattern.length) {
    const cell = item.block[offset + i];
    // console.log('cell ', cell, ` vs pattern ${i} `, pattern[i]);
    if (owner === '') {
      if (cell === 'X') owner = 'X';
      else if (cell === 'O') owner = 'O';
    }

    if (!(pattern[i] === 0 && cell === '') &&
      !(owner !== '' && pattern[i] === 1 && cell === owner)
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

    return ({
      start: { y: start_y, x: start_x },
      pattern: pattern,
      owner: owner,
      category: key,
      dir: dir,
      score: owner === curr_player ? SCORE[key] : SCORE[key] * -1
    });
  }

  return null;
}

const evaluate = (blocks, curr_player) => {
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
          new_node = getNodeFromPattern(item, i, pattern, key, curr_player, item.dir);
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

const getBlock = (curr_board, adjacent_cells, dir) => {
  const allBlock = [];
  const overlapped_cells = [];

  _.map(adjacent_cells, (cell) => {
    if (_.find(overlapped_cells, (o_cell) => o_cell.id === cell.id)) return; // skip overlapped cells as it is already scanned and included in the block
    const { y, x } = cell;
    let next = { y, x };
    let start = { y, x };
    let f_offset = 0;
    let b_offset = 0;
    let backward = true;
    let forward = true;
    let block = ['']; // the middle of the block, this is empty ofcourse

    for (let i = 1; i < CONNECT_N + f_offset; i++) { // scan 4 cell forward to get all the cell content
      if (forward) {
        next = getNextCoordinate(y, x, i, dir, true);
        const overlapped_cell = _.find(adjacent_cells, (cell) => cell.id === next.id);

        if (overlapped_cell) {
          overlapped_cells.push(overlapped_cell);
          f_offset = i;
        }
        if (typeof curr_board[next.y]?.[next.x] !== 'undefined') {
          block = [...block, curr_board[next.y][next.x]]
        }
        else forward = false;
      }
    }
    for (let i = 1; i < CONNECT_N + b_offset; i++) { // scan 4 cell backward to get all the cell content
      if (backward) {
        next = getNextCoordinate(y, x, i, dir, false);
        const overlapped_cell = _.find(adjacent_cells, (cell) => cell.id === next.id);

        if (overlapped_cell) {
          overlapped_cells.push(overlapped_cell);
          b_offset = i;
        }
        if (typeof curr_board[next.y]?.[next.x] !== 'undefined') {
          block = [curr_board[next.y][next.x], ...block];
          start = next;
        }
        else backward = false;
      }
    }

    // console.log(`scanned y: ${y}, x: ${x} `, block);
    allBlock.push({
      start: { y: start.y, x: start.x },
      dir,
      block
    });
  })
  // console.log(`dir ${dir} allBlock`, allBlock);
  return allBlock;
}

export const evaluteAdjacentCell = (curr_board, curr_player, adjacent_cells) => {
  let b_node = [];
  let t_node = [];
  const horizontalBlock = getBlock(curr_board, adjacent_cells, 'h');
  const verticalBlock = getBlock(curr_board, adjacent_cells, 'v');
  const diagonalBlock_1 = getBlock(curr_board, adjacent_cells, 'd_1');
  const diagonalBlock_2 = getBlock(curr_board, adjacent_cells, 'd_2');
  // console.log('horizontalBlock', horizontalBlock);
  // console.log('verticalBlock', verticalBlock);
  // console.log('diagonalBlock_1', diagonalBlock_1);
  // console.log('diagonalBlock_2', diagonalBlock_2);
  const h_node = evaluate(horizontalBlock, curr_player);
  const v_node = evaluate(verticalBlock, curr_player);
  const d_node_1 = evaluate(diagonalBlock_1, curr_player);
  const d_node_2 = evaluate(diagonalBlock_2, curr_player);
  b_node = _.take(
    _.orderBy(
      _.filter([...h_node, ...v_node, ...d_node_1, ...d_node_2], (node) => node.owner === curr_player),
      ['score'],
      ['desc']
    ), TAKE_BEST_N
  );
  t_node = _.take(
    _.orderBy(
      _.filter([...h_node, ...v_node, ...d_node_1, ...d_node_2], (node) => node.owner !== curr_player),
      ['score'],
      ['asc']
    ), TAKE_BEST_N
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
    ), TAKE_BEST_N
  );
  console.log('combinedNode', combinedNode);
  // return ({ b_node, t_node });
  return (combinedNode);
}