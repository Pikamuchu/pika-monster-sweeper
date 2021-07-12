import React, { useContext } from 'react';

import { GameContext } from '../context/GameContext';
import Mine from './Mine';

const Minefield = () => {
  const { state } = useContext(GameContext);

  return (
    <div className="mine-field">
      {state.minefield.map((mine, index) => (
        <Mine mine={mine} key={`{mine-${index}`} />
      ))}
    </div>
  );
};

export default Minefield;
