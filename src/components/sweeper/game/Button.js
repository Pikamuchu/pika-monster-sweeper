import React, { useContext } from 'react';

import { GameContext } from '../context/GameContext';

import { generateMineField } from '../utils/gameUtils';

const Button = () => {
  const { state, dispatch } = useContext(GameContext);
  const { isGameWon, isGameOver } = state;

  const resetGame = () => {
    const minefield = generateMineField();
    const mines = minefield.filter((mine) => mine.bomb === true).length;

    dispatch({ type: 'SET_MINEFIELD', payload: minefield });
    dispatch({ type: 'SET_MINES', payload: mines });
    dispatch({ type: 'SET_FLAGS', payload: 0 });

    if (isGameOver) {
      dispatch({ type: 'SET_GAME_OVER', payload: false });
    } else {
      dispatch({ type: 'SET_GAME_WON', payload: false });
    }
  };

  return <>{(isGameOver || isGameWon) && <button onClick={resetGame}>{isGameOver ? 'Try' : 'Play'}Again</button>}</>;
};

export default Button;
