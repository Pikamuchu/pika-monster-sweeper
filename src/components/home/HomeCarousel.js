/* eslint-disable react/no-unused-prop-types */
/* eslint-disable react/forbid-prop-types */
import PropTypes from 'prop-types';

import { withTranslation } from '../../i18n';
import MonsterCarousel from '../../components/monster/MonsterCarousel';
import useMonster from '../../hooks/useMonster';

const HomeCarousel = ({ t }) => {
  const { data: randomMonsters } = useMonster({ listType: 'random' });
  return (
    <>
      <h2>{t('monsters-you-may-like')}</h2>
      <MonsterCarousel monsters={randomMonsters} />
    </>
  );
};

HomeCarousel.propTypes = {
  t: PropTypes.func.isRequired,
  i18nNamespaces: PropTypes.arrayOf(PropTypes.string)
};

HomeCarousel.defaultProps = {
  i18nNamespaces: ['common', 'home', 'monster']
};

export default withTranslation('home')(HomeCarousel);
