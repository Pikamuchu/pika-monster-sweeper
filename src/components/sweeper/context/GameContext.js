import React, { useReducer, createContext } from 'react';
import GameReducer from './GameReducer';

import { generateMineField } from '../utils/gameUtils';

const DEFAULT_WIDTH = 8;
const DEFAULT_MINES = 8;

const initialState = {
  width: DEFAULT_WIDTH,
  mines: DEFAULT_MINES,
  minefield: generateMineField(DEFAULT_WIDTH, DEFAULT_MINES),
  flags: 0,
  isGameOver: false,
  isGameWon: false,
};

// FIXME: Remove from here
initialState.mines = initialState.minefield.filter((mine) => mine.bomb === true).length;

export const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const [state, dispatch] = useReducer(GameReducer, initialState);
  const actions = {
    setGameParams: (params) => {
      dispatch({
        type: 'SET_GAME_PARAMS',
        payload: params,
      });
    },
  };
  return <GameContext.Provider value={{ state, dispatch, actions }}>{children}</GameContext.Provider>;
};
