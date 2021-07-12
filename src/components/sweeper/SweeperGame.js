/* eslint-disable react/no-unused-prop-types */
/* eslint-disable no-plusplus */
import PropTypes from 'prop-types';
import React, { useState, useContext } from 'react';
import { withTranslation } from '../../i18n';

import Game from './game/Game';
import { GameProvider } from './context/GameContext';
import { useGlobal } from '../../context/GlobalContext';

const SweeperGame = ({ t }) => {
  const { state, actions } = useGlobal();
  return (
    <GameProvider>
      <Game />
    </GameProvider>
  );
};

SweeperGame.propTypes = {
  t: PropTypes.func.isRequired,
  i18nNamespaces: PropTypes.arrayOf(PropTypes.string),
};

SweeperGame.defaultProps = {
  i18nNamespaces: ['common', 'monster', 'sweeper'],
};

export default withTranslation('sweeper')(SweeperGame);
