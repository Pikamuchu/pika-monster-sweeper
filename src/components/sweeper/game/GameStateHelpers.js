export function createGameState(MineSweeper, screen, audio) {
  let gameRunning = 0;
  const isGameRunning = () => !!gameRunning;
  const isGameVisible = true; // = () => !!MineSweeper.getElement();

  let gameEvents = [];
  const addGameEvent = (eventFunction) => {
    if (typeof eventFunction === 'function') {
      gameEvents.push(eventFunction);
    }
  };
  const startGameEvents = () => {
    gameEvents.forEach((eventFunction) => eventFunction());
  };

  const startGame = () => {
    resetState();
    if (audio.music && audio.music.paused) {
      audio.music.muted = false;
      audio.music.loop = true;
      audio.music.play();
    }
    startGameEvents();
  };

  const pauseGame = () => {
    gameRunning = 0;
    if (MineSweeper) {
      //MineSweeper.pause();
    }
    if (audio.music) {
      audio.music.pause();
    }
  };

  const resumeGame = () => {
    gameRunning = 1;
    if (MineSweeper) {
      //MineSweeper.play();
    }
    if (audio.music) {
      audio.music.play();
    }
    startGameEvents();
  };

  const resetState = () => {
    gameRunning = 1;
    //MineSweeper.reset();
  };

  return {
    isGameRunning,
    isGameVisible,
    addGameEvent,
    startGame,
    resumeGame,
    pauseGame,
    resetState
  };
}
