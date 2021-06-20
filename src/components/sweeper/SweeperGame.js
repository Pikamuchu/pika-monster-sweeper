import {
  createConfig,
  createScreen,
  createAudio,
  createScoreCounter,
  createTimeCounter
} from './game/GameElementsHelpers';
import { createMineSweeper } from './game/GameSweeperHelpers';
import { createGameState } from './game/GameStateHelpers';
import { createGameEvents } from './game/GameEventsHelpers';
import { createGameActions } from './game/GameActionsHelpers';

import { getElementById } from './game/GameUtils';

export default function sweeperGame(monster, sweeperSuccessCallback) {
  const config = createConfig();

  const screen = createScreen();
  const audio = createAudio();

  const ScoreCounter = createScoreCounter(screen);

  const TimeCounter = createTimeCounter(screen);

  const MineSweeper = createMineSweeper(screen, config, ScoreCounter, TimeCounter);

  const state = createGameState(MineSweeper, screen, audio);

  const actions = createGameActions(MineSweeper, screen, state, sweeperSuccessCallback);

  createGameEvents(screen, state, actions);

  state.startGame();

  /************* minesweeper.js ****************/
  window.oncontextmenu = function () {
    return false;
  };

  window.onload = MineSweeper.create('gameboard');
}
