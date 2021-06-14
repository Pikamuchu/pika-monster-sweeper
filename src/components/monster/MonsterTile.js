import PropTypes from 'prop-types';
import { Col, Image, Row } from 'react-bootstrap';
import { Link, withTranslation } from '../../i18n';
import MonsterTypes from './MonsterTypes';
import MonsterSweeperButton from './MonsterSweeperButton';

const MonsterTile = ({ monster, size, t }) => {
  return (
    <Col className="monster-card p-3">
      <Row className="monster-image justify-content-center">
        <Link href={`/monster/${monster.id}`}>
          <Image src={monster.image} label={monster.slug} alt={monster.slug} thumbnail />
        </Link>
        <MonsterSweeperButton monster={monster} size={size} />
      </Row>
      <Row className="justify-content-center flex-nowrap">
        <h5>{`${monster.code} - ${monster.name}`}</h5>
      </Row>
      <Row className="justify-content-center">
        <MonsterTypes types={monster.types} />
      </Row>
    </Col>
  );
};

MonsterTile.propTypes = {
  monster: PropTypes.shape({
    code: PropTypes.string,
    id: PropTypes.string,
    image: PropTypes.string,
    name: PropTypes.string,
    slug: PropTypes.string,
    types: PropTypes.arrayOf(PropTypes.object),
  }).isRequired,
  size: PropTypes.string,
};

MonsterTile.defaultProps = {
  size: '',
};

export default withTranslation('monster')(MonsterTile);
