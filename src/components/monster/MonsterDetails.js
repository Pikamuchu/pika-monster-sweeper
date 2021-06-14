import PropTypes from 'prop-types';
import { Col, Image, Row } from 'react-bootstrap';
import { Link, withTranslation } from '../../i18n';
import MonsterTypes from './MonsterTypes';
import MonsterSweeperButton from './MonsterSweeperButton';
import NotFound from '../layout/NotFound';

const MonsterDetails = ({ t, monster }) => {
  return (
    <>
      {monster?.id ? (
        <>
          <Row className="justify-content-center">
            <h2 className="pr-1">{`${monster.code} - ${monster.name}`}</h2>
          </Row>
          <Row className="justify-content-center pt-3 px-3">
            <p>{`${monster.description}`}</p>
          </Row>
          <Row className="pt-3 px-3">
            <Col sm={6} xs={12} className="pb-5 pr-3">
              <Row className="monster-image justify-content-center">
                <Link href={`/monster/${monster.id}`}>
                  <Image src={monster.image} label={monster.slug} alt={monster.slug} thumbnail fluid />
                </Link>
                <MonsterSweeperButton monster={monster} size="large mr-3" />
              </Row>
            </Col>
            <Col sm={6} xs={12} className="pl-5 pb-5">
              <MonsterData monster={monster} t={t} />
            </Col>
          </Row>
          <Row className="px-3">
            <Col sm={6} xs={12} className="pb-5 pl-5">
              <MonsterStats stats={monster.stats} t={t} />
            </Col>
            <Col sm={6} xs={12} className="pb-5 pl-5">
              <MonsterAbilities abilities={monster.abilities} t={t} />
            </Col>
          </Row>
        </>
      ) : (
        <NotFound message={t('monster-not-found')} />
      )}
    </>
  );
};

MonsterDetails.propTypes = {
  monster: PropTypes.shape({
    code: PropTypes.string,
    id: PropTypes.string,
    image: PropTypes.string,
    name: PropTypes.string,
    slug: PropTypes.string,
    description: PropTypes.string,
    types: PropTypes.arrayOf(PropTypes.object),
    abilities: PropTypes.arrayOf(PropTypes.object)
  }).isRequired
};

const MonsterData = ({ t, monster }) => {
  return (
    <>
      <Row className="justify-content-left">
        <h5>{t('monster-data')}</h5>
      </Row>
      <Row className="justify-content-left"></Row>
      <Row className="justify-content-left">
        <div className="monster-stats">
          <ul className="list-unstyled">
            <li>
              {`${t('type')}:`}
              <MonsterTypes types={monster.types} t={t} />
            </li>
            <li>{`${t('color')}: ${monster.color}`}</li>
            <li>{`${t('weight')}: ${monster.weight}`}</li>
            <li>{`${t('height')}: ${monster.height}`}</li>
            <li>{`${t('evolves-from')}: ${monster.evolvesFromId}`}</li>
          </ul>
        </div>
      </Row>
    </>
  );
};

const MonsterStats = ({ t, stats }) => {
  return (
    <>
      <Row className="justify-content-left">
        <h5>{t('monster-stats')}</h5>
      </Row>
      <Row className="justify-content-left">
        <div className="monster-stats">
          <ul className="list-unstyled">
            {stats?.map((stat) => (
              <li key={stat.name}>{`${stat.name}: ${stat.value}`}</li>
            ))}
          </ul>
        </div>
      </Row>
    </>
  );
};

const MonsterAbilities = ({ t, abilities }) => {
  return (
    <>
      <Row className="justify-content-left">
        <h5>{t('monster-abilities')}</h5>
      </Row>
      <Row className="justify-content-left">
        <div className="monster-abilities">
          <ul className="list-unstyled">
            {abilities?.map((ability) => (
              <li key={ability}>{ability}</li>
            ))}
          </ul>
        </div>
      </Row>
    </>
  );
};

export default withTranslation('monster')(MonsterDetails);
