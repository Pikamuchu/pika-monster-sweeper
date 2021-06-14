import PropTypes from 'prop-types';
import { Badge } from 'react-bootstrap';
import { withTranslation } from '../../i18n';

const MonsterTypes = ({ t, types }) => {
  return (
    <div className="monster-abilities">
      {types?.map((type) => (
        <Badge key={type.id} className={`background-color-${type.id}`} pill>
          {type.name}
        </Badge>
      ))}
    </div>
  );
};

MonsterTypes.propTypes = {
  types: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default withTranslation('monster')(MonsterTypes);
