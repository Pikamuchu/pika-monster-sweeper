import React, { createContext, useReducer } from 'react';
import GlobalReducer from './GlobalReducer';

const initialState = {
  gameParams: {
    width: 10,
    height: 10,
    mines: 10,
    isSfx: true,
    animation: true,
    theme: false,
  },
};

export const GlobalContext = createContext(initialState);

export const GlobalProvider = ({ children }) => {
  const [state, dispatch] = useReducer(GlobalReducer, initialState);
  const actions = {
    setGameParams: (params) => {
      dispatch({
        type: 'SET_GAME_PARAMS',
        payload: params,
      });
    },
    toggleSound: () => {
      dispatch({
        type: 'TOGGLE_SOUND',
      });
    },
    toggleTheme: () => {
      dispatch({
        type: 'TOGGLE_THEME',
      });
    },
    toggleAnimation: () => {
      dispatch({
        type: 'TOGGLE_ANIMATION',
      });
    }
  };
  return <GlobalContext.Provider value={{ state, dispatch, actions }}>{children}</GlobalContext.Provider>;
};

export const useGlobal = () => {
  const context = React.useContext(GlobalContext);
  if (!context) {
    throw new Error('You need to wrap GlobalProvider.');
  }
  return context;
};
