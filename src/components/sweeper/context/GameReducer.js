const GameReducer = (state, action) => {
  switch (action.type) {
    case 'SET_GAME_PARAMS':
      return {
        ...state,
        gameParams: {
          ...state.gameParams,
          ...action.payload,
        },
      };

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

export default GameReducer;
