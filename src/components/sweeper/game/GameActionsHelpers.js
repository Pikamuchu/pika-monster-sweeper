import { Resources } from './GameResourcesHelpers';
import { findCollidableElement, elementColisionTransform, isBouncingElement } from './GameCollisionsHelpers';
import {
  getElementById,
  getFirstElement,
  getRandomNumber,
  clearContainerElement,
  hideElement,
  activeElement,
  clearElementTransforms,
  setElementImage,
  getTranslationBetweenElements
} from './GameUtils';
import {
  emitBallColisionParticles,
  restoreBallEffect,
  removeElementAnimation,
  throwEffect1,
  throwEffect2,
  throwAttackEffect,
  moveElementAsideEffect,
  emitParticlesToElementEffect,
  fadeElementEffect,
  dropElementEffect,
  shakeEffect,
  rainConfettiEffect,
  poofEffect
} from './GameEffectsHelpers';

export const createGameActions = (MineSweeper, screen, state, sweeperSuccessCallback) => {
  return {};
};
