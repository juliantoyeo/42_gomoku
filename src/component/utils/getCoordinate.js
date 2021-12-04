import { getCoordinateId } from './boardUtils';

export const getCoordinate = (y, x, index, dir, isForward) => {
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