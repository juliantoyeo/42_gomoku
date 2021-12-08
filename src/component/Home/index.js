import React, { useState } from 'react';
import Gomoku from '../Gomoku';

import {
  MainContainer,
  MenuContainer,
  MenuTitle,
  InputContainer,
  InputTitle,
  StartButton
} from './style';

const Home = () => {
  const [gameStart, setGameStart] = useState(false);
  const [form, setForm] = useState({ gameMode: 'solo', theme: 1 });

  const onFormChange = (event, type) => {
    const value = event;
    const newForm = {
      ...form,
      gameMode: type === 'gameMode' ? value : form.gameMode,
      theme: type === 'theme' ? value : form.theme
    };
    setForm(newForm);
  }

  const startGame = () => {
    setGameStart(true);
  }

  const backToLobby = () => {
    setGameStart(false);
  }

  return (
    <MainContainer>
      {!gameStart &&
        <MenuContainer>
          <MenuTitle>Welcome to GOMOKU</MenuTitle>
          <MenuTitle>By</MenuTitle>
          <MenuTitle>Jyeo - Esouza</MenuTitle>
          <InputContainer>
            <InputTitle>
              Game Mode
            </InputTitle>
            <div>
              <input
                type="radio"
                value={'Single Player'}
                checked={form.gameMode === 'solo'}
                onChange={() => onFormChange('solo', 'gameMode')}
              />
              {'Single Player'}
            </div>
            <div>
              <input
                type="radio"
                value={'2 Players'}
                checked={form.gameMode === 'multi'}
                onChange={() => onFormChange('multi', 'gameMode')}
              />
              {'2 Players'}
            </div>
          </InputContainer>
          <InputContainer>
            <InputTitle>
              Stone Color
            </InputTitle>
            <div>
              <input
                type="radio"
                value={'Black and White'}
                checked={form.theme === 1}
                onChange={() => onFormChange(1, 'theme')}
              />
              {'Black and White'}
            </div>
            <div>
              <input
                type="radio"
                value={'Blue and Red'}
                checked={form.theme === 2}
                onChange={() => onFormChange(2, 'theme')}
              />
              {'Blue and Red'}
            </div>
          </InputContainer>
          <StartButton onClick={startGame}>
            Start GO!
          </StartButton>
        </MenuContainer>
      }
      {gameStart &&
        <Gomoku
          gameMode={form.gameMode}
          theme={form.theme}
          backToLobby={backToLobby}
        />}
    </MainContainer>
  )
}

export default Home;