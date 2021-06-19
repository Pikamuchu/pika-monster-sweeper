import {
  createConfig,
  createScreen,
  createAudio,
  createScoreCounter,
  createTimeCounter,
  createHeader
} from './game/GameElementsHelpers';
import { createGameState } from './game/GameStateHelpers';
import { createMineSweeper } from './game/GameSweeperHelpers';
import { createGameEvents } from './game/GameEventsHelpers';
import { getElementById } from './game/GameUtils';

/*
export default function sweeperGame(monster, sweeperSuccessCallback) {
  const screen = createScreen();
  const audio = createAudio();

  const ball = createBall(screen);
  const target = createTarget(monster, screen);

  const state = createGameState(ball, target, screen, audio);
  const actions = createGameActions(ball, target, screen, state, sweeperSuccessCallback);

  createGameEvents(screen, state, actions);

  state.startGame();
}
*/

export default function sweeperGame(monster, sweeperSuccessCallback) {
  const config = createConfig();

  const screen = createScreen();
  const audio = createAudio();

  const ScoreCounter = createScoreCounter(screen);

  const TimeCounter = createTimeCounter(screen);

  const MineSweeper = createMineSweeper(screen, config, ScoreCounter, TimeCounter);

  /************* minesweeper.js ****************/
  window.oncontextmenu = function () {
    return false;
  };

  window.onload = MineSweeper.create('gameboard');
}
