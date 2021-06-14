import { createScreen, createAudio, createBall, createTarget } from './game/GameElementsHelpers';
import { createGameState } from './game/GameStateHelpers';
import { createGameActions } from './game/GameActionsHelpers';
import { createGameEvents } from './game/GameEventsHelpers';

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
