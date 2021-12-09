import _ from 'lodash';
import { getCoordinateId } from './boardUtils';

export const getCellFromNode = (node, index) => {
  const new_pos = { y: node.start.y, x: node.start.x };
  let new_cell = null;

  if (node.dir === 'h') {
    new_pos.y = node.start.y;
    new_pos.x = node.start.x + index;
  }
  else if (node.dir === 'v') {
    new_pos.y = node.start.y + index;
    new_pos.x = node.start.x;
  }
  else if (node.dir === 'd_1') {
    new_pos.y = node.start.y + index;
    new_pos.x = node.start.x + index;
  }
  else if (node.dir === 'd_2') {
    new_pos.y = node.start.y - index;
    new_pos.x = node.start.x + index;
  }
  new_cell = {
    id: getCoordinateId(new_pos.y, new_pos.x),
    y: new_pos.y,
    x: new_pos.x,
  }
  return new_cell;
}

const generateCell = (nodes) => {
  let newList = [];

  for (let node of nodes) {
    for (let i = 0; i < node.pattern.length; i++) {
      if (node.pattern[i] === 0) {
        let new_cell = getCellFromNode(node, i);
        if (new_cell) {
          if (node.category === 'capture')
            newList.push({ ...new_cell, isCapturingCell: true });
          else
            newList.push(new_cell);
        }
      }
    }
  }

  return _.uniqBy(newList, 'id');
}

export const generatePotentialList = (node) => {
  const list = generateCell(node);

  return (list);
}