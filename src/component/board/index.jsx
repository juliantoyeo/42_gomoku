import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import boardBackground from '../../assets/images/wood-pattern.png';
import './board.css';

const Container = styled.div`
  width: 720px;
  height: 720px;
  padding: calc(720px / 40);
  background-color: #f1b06c;
  background-image: url(${boardBackground});
`;

const BoardContainer = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: repeat(36, calc(720px / 36));
  grid-template-rows: repeat(36, calc(720px / 36));
  border-right: 1px solid grey;
  border-bottom: 1px solid grey;
  background-size: calc(720px / 18) calc(720px / 18);
  background-image: linear-gradient(to right, grey 1px, transparent 1px),
    linear-gradient(to bottom, grey 1px, transparent 1px);
`;
const Mark = styled.div`
  width: calc(100% / 4);
  height: calc(100% / 4);
  border-radius: 50%;
  background-color: grey;
  align-self: center;
  justify-self: center;
  z-index: 1;
`;

export default function Board(props) {
  const [currentPlayer, setCurrentPlayer] = useState('O');
  const [hoverClassName, setHoverClassName] = useState('');

  const outter = [
    2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34,
  ];

  const ids = [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34];
  useEffect(() => {
    if (currentPlayer.length) {
      placeStone(10, 10, 'black');
      placeStone(11, 10, 'white');
      placeStone(11, 11, 'black');
      placeStone(10, 11, 'white');
      placeStone(12, 12, 'white');

      placeStone(17, 3, 'black');
      placeStone(3, 4, 'white');
      placeStone(4, 4, 'black');
    }
  }, []);

  useEffect(() => {
    console.log(`The human player is -->> ${props.humanPlayer}`);
    const c = props.humanPlayer === 'O' ? 'hoverMeWhite' : 'hoverMeBlack';
    setHoverClassName(c);
    setCurrentPlayer(props.humanPlayer);
  }, [props.humanPlayer]);

  function placeStone(column, row, mark) {
    const board = document.querySelector('#board');
    const stone = document.createElement('div');
    stone.style.gridColumnStart = (column - 1) * 2;
    stone.style.gridColumnEnd = (column - 1) * 2 + 2;
    stone.style.gridRowStart = (row - 1) * 2;
    stone.style.gridRowEnd = (row - 1) * 2 + 2;
    stone.classList.add('stone');
    stone.classList.add(mark);
    board.appendChild(stone);
  }

  function handleClick(indexOutter, indexInner) {
    // console.log(
    //   `indexOutter := ${indexOutter} indexInner := ${indexInner} hoverClassName := ${hoverClassName}`
    // );
    const stoneColor = hoverClassName === 'hoverMeWhite' ? 'white' : 'black';
    placeStone(indexInner + 2, indexOutter + 2, stoneColor);
  }

  return !currentPlayer.length ? (
    <p>loading...</p>
  ) : (
    <>
      <Container>
        <BoardContainer id="board">
          <Mark
            style={{
              gridColumnStart: 6,
              gridColumnEnd: 8,
              gridRowStart: 6,
              gridRowEnd: 8,
            }}
          />

          <Mark
            style={{
              gridColumnStart: 6,
              gridColumnEnd: 8,
              gridRowStart: 18,
              gridRowEnd: 20,
            }}
          />

          <Mark
            style={{
              gridColumnStart: 6,
              gridColumnEnd: 8,
              gridRowStart: 30,
              gridRowEnd: 32,
            }}
          />
          <Mark
            style={{
              gridColumnStart: 18,
              gridColumnEnd: 20,
              gridRowStart: 6,
              gridRowEnd: 8,
            }}
          />
          <Mark
            style={{
              gridColumnStart: 18,
              gridColumnEnd: 20,
              gridRowStart: 18,
              gridRowEnd: 20,
            }}
          />
          <Mark
            style={{
              gridColumnStart: 18,
              gridColumnEnd: 20,
              gridRowStart: 30,
              gridRowEnd: 32,
            }}
          />
          <Mark
            style={{
              gridColumnStart: 30,
              gridColumnEnd: 32,
              gridRowStart: 6,
              gridRowEnd: 8,
            }}
          />
          <Mark
            style={{
              gridColumnStart: 30,
              gridColumnEnd: 32,
              gridRowStart: 18,
              gridRowEnd: 20,
            }}
          />
          <Mark
            style={{
              gridColumnStart: 30,
              gridColumnEnd: 32,
              gridRowStart: 30,
              gridRowEnd: 32,
            }}
          />
          {outter.map((outterId, indexOutter) => {
            return ids.map((id, indexInner) => (
              <div
                key={`cell-${outterId}${outterId + id}`}
                id={`cell-${outterId}${outterId + id}`}
                className={hoverClassName}
                onClick={() => handleClick(indexOutter, indexInner)}
                style={{
                  gridColumnStart: id,
                  gridColumnEnd: id + 2,
                  gridRowStart: outterId,
                  gridRowEnd: outterId + 2,
                }}
              />
            ));
          })}
        </BoardContainer>
      </Container>
    </>
  );
}
