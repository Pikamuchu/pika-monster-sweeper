import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

import { withTranslation } from '../../i18n';
import useSweeper, { postSweeper, routeSweeper } from '../../hooks/useSweeper';
import sweeperGame from './SweeperGame';

const SweeperGame = ({ monster, t }) => {
  const { data: sweepers, mutate, revalidate } = useSweeper();

  useEffect(() => {
    sweeperGame(monster, () => {
      sweepers.push(monster.id);
      postSweeper(sweepers, mutate, revalidate);
      setTimeout(() => {
        routeSweeper({});
      }, 2000);
    });
  }, [monster]);

  return (
    <section className="wrapper">
      <div className="title">
        <h1>
          <span className="collidable bouncing">{`Catch ${monster?.name}!`}</span>
        </h1>
      </div>
      <div className="touch-layer" />
      <div id="particle-container" className="particle-container" />
      <div id="attack-container" className="attack-container" />
      <div className="screen gradient-background">
        <div id="gameboard"></div>
      </div>
      <div className="sweeper-screen gradient-background hidden">
        <div className="sweeper-status hidden">
          <h1>{`You caught ${monster?.name}!`}</h1>
        </div>
        <div className="poof-container hidden">
          <div className="poof" />
        </div>
        <div id="sweeper-confetti" className="sweeper-confetti" />
        <div id="sweeper-ball" className="sweeper-ball" />
        <div className="sweeper-ball-button-container hidden">
          <div className="sweeper-ball-button" />
        </div>
      </div>
      {monster?.gameConfig?.audio ? <audio id="game-music" src={monster.gameConfig.audio} muted /> : ''}
    </section>
  );
};

SweeperGame.propTypes = {
  t: PropTypes.func.isRequired
};

export default withTranslation('sweeper')(SweeperGame);
