import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { withTranslation } from '../../i18n';
import useSweeper, { routeSweeper } from '../../hooks/useSweeper';

const MonsterSweeperButton = ({ t, monster, size }) => {
  const [active, setActive] = useState(false);
  const { data: sweepers } = useSweeper();

  const openSweeperPage = (event) => {
    routeSweeper(monster);
  };

  useEffect(() => {
    setActive(sweepers && sweepers.includes(monster.id));
  }, [sweepers]);

  return (
    <button
      type="button"
      title={t('sweeper-monster')}
      className={`monster-sweeper-button ${active ? 'active' : ''} ${size}`}
      onClick={openSweeperPage}
    />
  );
};

MonsterSweeperButton.propTypes = {
  monster: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    slug: PropTypes.string,
  }).isRequired,
  size: PropTypes.string,
};

MonsterSweeperButton.defaultProps = {
  size: '',
};

export default withTranslation('monster')(MonsterSweeperButton);
