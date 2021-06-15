/* eslint-disable react/no-unused-prop-types */
/* eslint-disable no-plusplus */
import PropTypes from 'prop-types';
import { useState } from 'react';
import { Button, Row } from 'react-bootstrap';
import { withTranslation } from '../../i18n';
import MonsterList from '../monster/MonsterList';
import useMonster from '../../hooks/useMonster';
import useSweeper from '../../hooks/useSweeper';
import { arrayPage } from '../../libs/utils';

const SWEEPER_PAGE_SIZE = 20;

const SweeperList = ({ t }) => {
  const initialPageIndex = 1;
  const [pageIndex, setPageIndex] = useState(initialPageIndex);
  const { data: ids } = useSweeper();
  const { data: monsters } = useMonster({ ids });

  let showMoreButton = monsters?.length;
  const moreMonsterList = [];
  for (let i = initialPageIndex + 1; i < pageIndex; i++) {
    const moreMonsters = arrayPage(monsters, SWEEPER_PAGE_SIZE, i);
    showMoreButton = moreMonsters?.length;
    moreMonsterList.push(<MonsterList monsters={moreMonsters} showNotFound={false} />);
  }

  return (
    <>
      <MonsterList monsters={arrayPage(monsters, SWEEPER_PAGE_SIZE, initialPageIndex)} showNotFound={false} />
      {moreMonsterList}
      {showMoreButton ? (
        <Row className="justify-content-center invisible">
          <Button onClick={() => setPageIndex(pageIndex + 1)}>{t('load-more')}</Button>
        </Row>
      ) : (
        ''
      )}
    </>
  );
};

SweeperList.propTypes = {
  t: PropTypes.func.isRequired
};

export default withTranslation('sweeper')(SweeperList);
