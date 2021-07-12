import React, { useContext } from 'react';
import classNames from 'classnames';

import { GameContext } from '../context/GameContext';

import {
  revealNeighbors,
  allBombsFlagged,
  unrevealedCountEqualsBombCount,
  revealAll,
  updateMinefield,
} from '../utils/gameUtils';

const Mine = ({ mine }) => {
  const { state, dispatch } = useContext(GameContext);
  const shouldShowBomb = () => (state.isGameOver || mine.revealed || state.isGameWon) && mine.bomb;
  const shouldShowFlag = () => (!state.isGameOver || !state.isGameWon) && mine.flagged;
  const shouldShowNeighbors = () => (state.isGameOver || mine.revealed) && mine.neighbors;

  const isGameWon = () => {
    return allBombsFlagged(state.minefield) || unrevealedCountEqualsBombCount(state.minefield);
  };

  const handleGameWon = () => {
    const revealed = revealAll(state.minefield);
    const minefield = updateMinefield(state.minefield, revealed);

    dispatch({ type: 'SET_GAME_WON', payload: true });
    dispatch({ type: 'SET_MINEFIELD', payload: minefield });
  };

  const handleClick = () => {
    if (mine.bomb) {
      dispatch({ type: 'SET_GAME_OVER', payload: true });
    } else if (!mine.neighbors) {
      mine.revealed = true;
      const revealedNeighbors = revealNeighbors(state.minefield, mine);
      const minefield = updateMinefield(state.minefield, revealedNeighbors);
      dispatch({ type: 'SET_MINEFIELD', payload: minefield });
    } else if (mine.neighbors) {
      mine.revealed = true;
      const minefield = updateMinefield(state.minefield, [mine]);
      dispatch({ type: 'SET_MINEFIELD', payload: minefield });
    }

    if (isGameWon()) {
      handleGameWon();
    }
  };

  const toggleFlagged = (e) => {
    // don't show context menu
    e.preventDefault();

    if (mine.revealed) {
      return;
    }

    //shouldn't be able to create more flags than bombs when incrementing
    if (!mine.flagged && state.flags === state.mines) {
      return;
    }

    if (mine.flagged) {
      dispatch({ type: 'SET_FLAGS', payload: state.flags - 1 });
    } else {
      dispatch({ type: 'SET_FLAGS', payload: state.flags + 1 });
    }

    mine.flagged = !mine.flagged;

    if (isGameWon()) {
      handleGameWon();
    }
    return false;
  };

  const mineClasses = classNames({
    mine: true,
    'mine-revealed': mine.revealed || state.isGameOver,
  });

  return (
    <div className={mineClasses} onClick={handleClick} onContextMenu={(e) => toggleFlagged(e)}>
      {shouldShowBomb() ? '💣' : shouldShowFlag() ? '🚩' : shouldShowNeighbors() ? `${mine.neighbors}` : ''}
    </div>
  );
};

export default Mine;
