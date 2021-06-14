/* eslint-disable no-nested-ternary */
import PropTypes from 'prop-types';
import { Col, Row } from 'react-bootstrap';
import { withTranslation } from '../../i18n';
import MonsterTile from './MonsterTile';
import NotFound from '../layout/NotFound';

const MonsterList = ({ monsters, showNotFound, t }) => {
  const notFoundMessage = showNotFound ? <NotFound message={t('monster-not-found')} /> : '';
  return (
    <Row className="monsters-container justify-content-around">
      {monsters && monsters.length
        ? monsters.map((monster) => <MonsterItem monster={monster} key={monster.id} t={t} />)
        : notFoundMessage}
    </Row>
  );
};

const MonsterItem = ({ monster, t }) => {
  return (
    <>
      {monster?.id ? (
        <Col key={monster.id} lg={3} md={4} sm={6} xs={6}>
          <MonsterTile key={monster.id} monster={monster} />
        </Col>
      ) : (
        ''
      )}
    </>
  );
};

MonsterList.propTypes = {
  monsters: PropTypes.arrayOf(PropTypes.object),
  showNotFound: PropTypes.bool,
  t: PropTypes.func.isRequired
};

MonsterList.defaultProps = {
  monsters: null,
  showNotFound: true
};

export default withTranslation('monster')(MonsterList);
