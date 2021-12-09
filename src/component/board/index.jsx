import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import toast, { Toaster } from 'react-hot-toast';
import Sound from '../utils/sound';
import boardBackground from '../../assets/images/wood-pattern.png';
import placeStoneSoundOne from '../../assets/sounds/placeStone.wav';
import eletricShockSound from '../../assets/sounds/electricShock.wav';
import laserGameOver from '../../assets/sounds/laserGameOver.wav';
import explosionSound from '../../assets/sounds/explosion.wav';
import gameOverSound from '../../assets/sounds/gameOver.wav';
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
  // const [currentPlayer, setCurrentPlayer] = useState('O');
  const [hoverClassName, setHoverClassName] = useState('');
  const [adjacentCellsCopy, setAdjacentCellsCopy] = useState();
  const [captureCounter, setCaptureCounter] = useState({ X: 0, O: 0 });

  const [boardCopy, setBoardCopy] = useState(
    Array.from({ length: BOARD_SIZE }, () =>
      Array.from({ length: BOARD_SIZE }, () => '')
    )
  );

  const {
    currentPlayer,
    humanBestMove,
    cb,
    adjacentCells,
    toggleShowAdjacentCells,
    // toggleShowBestMove,
    toggleCapture,
    theme,
    captureCount,
    gameStatus,
  } = props;

  const outter = [
    2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38,
  ];

  const ids = [
    2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38,
  ];

  useEffect(() => {
    /**
     * Remove old one before placing the newest one
     */
    Array.from(document.querySelectorAll('.higlightHumanBestMove')).forEach(
      (el) => el.parentNode.removeChild(el)
    );
    if (humanBestMove)
      placeShallowStone(
        humanBestMove.x + 2,
        humanBestMove.y + 2,
        'higlightHumanBestMove'
      );
  }, [humanBestMove]);

  useEffect(() => {
    (() => {
      if (
        captureCount.X > captureCounter.X ||
        captureCount.O > captureCounter.O
      ) {
        const captureSound = new Sound(explosionSound);
        captureSound.play();
        setCaptureCounter({ ...captureCount });
      }
    })();
  }, [captureCount]);

  useEffect(() => {
    (() => {
      if (gameStatus) {
        const gameOver = new Sound(gameOverSound);
        gameOver.play();
        setCaptureCounter({ X: 0, O: 0 });
      }
    })();
  }, [gameStatus]);

  useEffect(() => {
    (() => {
      if (toggleShowAdjacentCells || toggleCapture) {
        if (!adjacentCellsCopy) {
          /**
           * The adjacentCellsCopy is undefined by default
           * once we define it, it will be one version behind the actual
           * adjacentCells, so we use it to find the removed (captured) stones
           * from the board.
           */
          setAdjacentCellsCopy(JSON.parse(JSON.stringify(adjacentCells)));
        } else {
          for (let i = 0; i < adjacentCellsCopy.length; i++) {
            const cell = adjacentCellsCopy[i];
            const includes = adjacentCells.find((a) => a.id === cell.id);
            if (!includes) {
              const el = document.querySelector(`adjacent-${cell.x}${cell.y}`);
              if (el) {
                el.parentNode.removeChild(el);
              }
            }
          }
          setAdjacentCellsCopy(JSON.parse(JSON.stringify(adjacentCells)));
        }
        adjacentCells.forEach((cell) => {
          if (cell.isCapture && toggleCapture) {
            /*
             * Remove old one before placing the newest one
             */
            Array.from(
              document.querySelectorAll('.captureCellHighlight')
            ).forEach((el) => el.parentNode.removeChild(el));
            placeShallowStone(cell.x + 2, cell.y + 2, 'captureCellHighlight');
          } else if (toggleShowAdjacentCells) {
            placeShallowStone(cell.x + 2, cell.y + 2, 'highlightAdjacentStone');
          }
        });
      }
      if (!toggleShowAdjacentCells) {
        Array.from(
          document.querySelectorAll('.highlightAdjacentStone')
        ).forEach((el) => el.parentNode.removeChild(el));
      }
      if (!toggleCapture) {
        Array.from(document.querySelectorAll('.captureCellHighlight')).forEach(
          (el) => el.parentNode.removeChild(el)
        );
      }
    })();
  }, [adjacentCells, toggleShowAdjacentCells, toggleCapture]);

  useEffect(() => {
    /**
     * Default theme is one
     */
    let c = currentPlayer === 'O' ? 'whiteStoneHover' : 'blackStoneHover';
    if (theme === 2) {
      c = currentPlayer === 'O' ? 'blueStoneHover' : 'redStoneHover';
    }
    setHoverClassName(c);
  }, [currentPlayer]);

  useEffect(() => {
    (() => {
      if (props.board) {
        const { board } = props.board;
        /**
         * Possible to pass the string color direct to placeStone() instead of using variable.
         * Probably will be using variable to handle player different colors
         */
        const xColor = theme === 1 ? 'blackStone' : 'redStone';
        const oColor = theme === 1 ? 'whiteStone' : 'blueStone';
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

  function placeShallowStone(column, row, mark) {
    const board = document.querySelector('#board');
    if (board) {
      const stone = document.createElement('div');
      stone.style.gridColumnStart = (column - 1) * 2;
      stone.style.gridColumnEnd = (column - 1) * 2 + 2;
      stone.style.gridRowStart = (row - 1) * 2;
      stone.style.gridRowEnd = (row - 1) * 2 + 2;
      stone.classList.add('stoneShallow');
      stone.classList.add(mark);
      stone.setAttribute('id', `adjacent-${row}${column}`);
      stone.innerHTML = `${row <= 9 ? '0' : ''}${row},${
        column <= 9 ? '0' : ''
      }${column}`;
      board.appendChild(stone);
    }
  }

  const notify = (msg) =>
    toast(msg, {
      style: {
        background: '#ff0000',
        color: '#fff',
      },
    });

  function handleClick(indexOutter, indexInner) {
    const ret = cb(indexOutter, indexInner);
    const placeStoneSound = new Sound(placeStoneSoundOne);
    const gameOver = new Sound(laserGameOver);
    const errorSound = new Sound(eletricShockSound);

    if (ret === 'ok') {
      placeStoneSound.play();
    } else {
      errorSound.play();
      notify(ret);
    }
  }

  return !currentPlayer ? (
    <p>loading...</p>
  ) : (
    <div>
      <Toaster />
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
    </div>
  );
}
