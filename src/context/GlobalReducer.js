const GlobalReducer = (state, action) => {
  switch (action.type) {
    case 'TOGGLE_SOUND':
      return {
        ...state,
        sound: !state.sound
      };

    case 'TOGGLE_THEME':
      return {
        ...state,
        theme: !state.theme
      };

    case 'TOGGLE_ANIMATION':
      return {
        ...state,
        animation: !state.animation
      };

    default:
      return state;
  }
};

export default GlobalReducer;
