import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import boardBackground from '../../assets/images/wood-pattern.png';
import './board.scss';
import { BOARD_SIZE } from '../utils/boardUtils';

const Container = styled.div`
  width: 800px;
  height: 800px;
  padding: calc(800px / 40);

  background-color: #f1b06c;
  background-image: url(${boardBackground});
`;

const BoardContainer = styled.div`
  width: 100%;
  height: 100%;
  display: grid;

  grid-template-columns: repeat(40, calc(800px / 40));
  grid-template-rows: repeat(40, calc(800px / 40));

  border-right: 1px solid grey;
  border-bottom: 1px solid grey;

  background-size: calc(800px / 20) calc(800px / 20);
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
  const [humanStoneColor, setHumanStoneColor] = useState('');
  const [aiStoneColor, setAiStoneColor] = useState('');
  const [boardCopy, setBoardCopy] = useState(
    Array.from({ length: BOARD_SIZE }, () =>
      Array.from({ length: BOARD_SIZE }, () => '')
    )
  );

  const { humanPlayer, board, cb } = props;

  useEffect(() => {
    console.log('ComponentDidMount()');
    console.log(`${humanPlayer} -- ${board.board}`);
  }, [])

  const outter = [
    2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38,
  ];

  const ids = [
    2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38,
  ];


  useEffect(() => {
    // console.log(`The human player is -->> ${props.humanPlayer}`);
    setCurrentPlayer(humanPlayer);
    const c = props.humanPlayer === 'O' ? 'whiteStoneHover' : 'blackStoneHover';
    const humanColor =
      props.humanPlayer === 'O' ? 'whiteStoneHover' : 'blackStoneHover';
    /**
     * The AI stone color will always be black or white
     * The human player should be more options (bonus)
     */
    const aiColor =
      humanColor === 'blackStoneHover' ? 'whiteStoneHover' : 'blackStoneHover';
    setHoverClassName(c);
    setAiStoneColor(aiColor);
  }, [props.humanPlayer]);

  useEffect(() => {
    console.log(`bitch := ${props.board}`);
    (() => {
      if (props.board) {
        const { board } = props.board;
        console.log(`dog := ${board}`)
        const xColor = props.humanPlayer === 'X' ? 'whiteStone' : 'blackStone';
        const oColor = props.humanPlayer === 'O' ? 'whiteStone' : 'blackStone';
        for (let row = 0; row < BOARD_SIZE; row++) {
          for (let col = 0; col < BOARD_SIZE; col++) {
            if (board[row][col] === 'O' && boardCopy[row][col] === '') {
              placeStone(col + 2, row + 2, oColor);
              setBoardCopy(board);
            }
            if (board[row][col] === 'X' && boardCopy[row][col] === '') {
              placeStone(col + 2, row + 2, xColor);
              setBoardCopy(board);
            }
            /**
             * CAPTURE
             * This condition will check for the captured stones
             * to remove them from the borad.
             */
            if (board[row][col] === '' && boardCopy[row][col] !== '') {
              const element = document.getElementById(`${row + 2}${col + 2}`);
              element.parentNode.removeChild(element);
              setBoardCopy(board);
            }
          }
        }
      }
    })();
  }, [props.board]);

  function placeStone(column, row, mark) {
    const board = document.querySelector('#board');
    if (board) {
      const stone = document.createElement('div');
      stone.style.gridColumnStart = (column - 1) * 2;
      stone.style.gridColumnEnd = (column - 1) * 2 + 2;
      stone.style.gridRowStart = (row - 1) * 2;
      stone.style.gridRowEnd = (row - 1) * 2 + 2;
      stone.classList.add('stone');
      stone.classList.add(mark);
      stone.setAttribute('id', `${row}${column}`);
      board.appendChild(stone);
    }
  }

  function handleClick(indexOutter, indexInner) {
    // console.log(
    //   `indexOutter := ${indexOutter} indexInner := ${indexInner} hoverClassName`
    // );

    // placeStone(indexInner + 2, indexOutter + 2, stoneColor);
    cb(indexOutter, indexInner);
  }

  return !currentPlayer ? (
    <p>loading...</p>
  ) : (
    <>
      <Container>
        <BoardContainer id="board">
          <Mark
            style={{
              gridColumnStart: 8,
              gridColumnEnd: 10,
              gridRowStart: 8,
              gridRowEnd: 10,
            }}
          />

          <Mark
            style={{
              gridColumnStart: 8,
              gridColumnEnd: 10,
              gridRowStart: 20,
              gridRowEnd: 22,
            }}
          />

          <Mark
            style={{
              gridColumnStart: 8,
              gridColumnEnd: 10,
              gridRowStart: 32,
              gridRowEnd: 34,
            }}
          />
          <Mark
            style={{
              gridColumnStart: 20,
              gridColumnEnd: 22,
              gridRowStart: 8,
              gridRowEnd: 10,
            }}
          />
          <Mark
            style={{
              gridColumnStart: 20,
              gridColumnEnd: 22,
              gridRowStart: 20,
              gridRowEnd: 22,
            }}
          />
          <Mark
            style={{
              gridColumnStart: 20,
              gridColumnEnd: 22,
              gridRowStart: 32,
              gridRowEnd: 34,
            }}
          />
          <Mark
            style={{
              gridColumnStart: 32,
              gridColumnEnd: 34,
              gridRowStart: 8,
              gridRowEnd: 10,
            }}
          />
          <Mark
            style={{
              gridColumnStart: 32,
              gridColumnEnd: 34,
              gridRowStart: 20,
              gridRowEnd: 22,
            }}
          />
          <Mark
            style={{
              gridColumnStart: 32,
              gridColumnEnd: 34,
              gridRowStart: 32,
              gridRowEnd: 34,
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
