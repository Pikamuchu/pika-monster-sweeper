import PropTypes from 'prop-types';
import { Carousel, Row } from 'react-bootstrap';
import { withTranslation } from '../../i18n';
import MonsterTile from './MonsterTile';

const MonsterCarousel = ({ t, monsters }) => {
  return (
    <Carousel>
      {monsters ? (
        monsters.map((monster) => (
          <Carousel.Item key={monster.id} className="col-sm-6 col-md-4 col-lg-3">
            <Row className="monsters-container justify-content-around">
              <MonsterTile key={monster.id} monster={monster} size="large" />
            </Row>
          </Carousel.Item>
        ))
      ) : (
        <Carousel.Item />
      )}
    </Carousel>
  );
};

MonsterCarousel.propTypes = {
  monsters: PropTypes.arrayOf(PropTypes.object)
};

MonsterCarousel.defaultProps = {
  monsters: null
};

export default withTranslation('monster')(MonsterCarousel);
