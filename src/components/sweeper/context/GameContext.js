import React, { useReducer, createContext } from 'react';

import { generateMineField } from '../utils/gameUtils';

const initialState = {
  minefield: generateMineField(),
  flags: 0,
  isGameOver: false,
  isGameWon: false,
};

initialState.mines = initialState.minefield.filter((mine) => mine.bomb === true).length;

const gameReducer = (state, action) => {
  switch (action.type) {
    case 'SET_MINEFIELD':
      return { ...state, minefield: action.payload };
    case 'SET_MINES':
      return { ...state, mines: action.payload };
    case 'SET_GAME_OVER':
      return { ...state, isGameOver: action.payload };
    case 'SET_GAME_WON':
      return { ...state, isGameWon: action.payload };
    case 'SET_FLAGS':
      return { ...state, flags: action.payload };
    default:
      return state;
  }
};

export const GameContext = createContext();

export const GameProvider = (props) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  return <GameContext.Provider value={{ state, dispatch }}>{props.children}</GameContext.Provider>;
};
