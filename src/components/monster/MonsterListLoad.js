import PropTypes from 'prop-types';
import { Spinner, Row } from 'react-bootstrap';
import { withTranslation } from '../../i18n';
import MonsterList from './MonsterList';
import useMonster from '../../hooks/useMonster';

const MonsterListPage = ({ query, index, t }) => {
  const { data: monsters } = useMonster({ ...query, pageIndex: index });
  return monsters?.length ? (
    <MonsterList monsters={monsters} />
  ) : (
    <Row className="justify-content-center p-3">
      <Spinner animation="grow" />
    </Row>
  );
};

MonsterListPage.propTypes = {
  index: PropTypes.number.isRequired,
  t: PropTypes.func.isRequired,
};

export default withTranslation('monster')(MonsterListPage);
