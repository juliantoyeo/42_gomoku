import _ from 'lodash';

// export const getCellFromNode = (node, index) => {
//   let new_cell = null;
//   if (node.dir === 'h') {
//     new_cell = {
//       y: node.start.y,
//       x: node.start.x + index,
//     }
//   }
//   else if (node.dir === 'v') {
//     new_cell = {
//       y: node.start.y + index,
//       x: node.start.x,
//     }
//   }
//   else if (node.dir === 'd_1') {
//     new_cell = {
//       y: node.start.y + index,
//       x: node.start.x - index,
//     }
//   }
//   else if (node.dir === 'd_2') {
//     new_cell = {
//       y: node.start.y + index,
//       x: node.start.x + index,
//     }
//   }
//   return new_cell;
// }

export const getCellFromNode = (node, index) => {
  let new_cell = null;
  if (node.dir === 'h') {
    new_cell = {
      y: node.start.y,
      x: node.start.x + index,
    }
  }
  else if (node.dir === 'v') {
    new_cell = {
      y: node.start.y + index,
      x: node.start.x,
    }
  }
  else if (node.dir === 'd_1') {
    new_cell = {
      y: node.start.y + index,
      x: node.start.x + index,
    }
  }
  else if (node.dir === 'd_2') {
    new_cell = {
      y: node.start.y - index,
      x: node.start.x + index,
    }
  }
  return new_cell;
}

const generateCell = (nodes) => {
  let newList = [];
  _.map(nodes, (node) => {
    for (let i = 0; i < node.pattern.length; i++) {
      if (node.pattern[i] === 0) {
        let new_cell = getCellFromNode(node, i);
        if (new_cell) newList.push(new_cell);
      }
    }
  })
  return newList;
}

export const generateBTcell = (node) => {
  const bList = generateCell(node.b_node);
  const tList = generateCell(node.t_node);
  return ({ bList, tList });
}