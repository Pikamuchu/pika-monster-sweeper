/* eslint-disable react/no-unused-prop-types */
/* eslint-disable no-plusplus */
import PropTypes from 'prop-types';
import Head from 'next/head';
import { useState, useEffect } from 'react';
import { Button, Container, Row } from 'react-bootstrap';
import { withTranslation } from '../../src/i18n';
import { getMonsters } from '../../src/models/monsterModel';
import MonsterList from '../../src/components/monster/MonsterList';
import MonsterListLoad from '../../src/components/monster/MonsterListLoad';
import useMonster from '../../src/hooks/useMonster';

const MONSTER_PAGE_SIZE = 20;

const MonsterListPage = ({ initialData, t }) => {
  const initialPageIndex = initialData.query?.pageIndex || 1;
  const initialQuery = initialData.query || {};
  const searchTerm = initialQuery.q || initialQuery.searchTerm || '';
  const [pageIndex, setPageIndex] = useState(initialPageIndex);
  const { data: monsters } = useMonster(initialQuery, initialData.monsters);

  console.log('initialData');
  console.log(initialData);

  const monsterListLoaded = [];
  for (let i = initialPageIndex + 1; i < pageIndex + 1; i++) {
    monsterListLoaded.push(<MonsterListLoad key={i} index={i} query={initialQuery} />);
  }

  useEffect(() => {
    console.log('useEffect');
    console.log(initialData);
    setPageIndex(1);
  }, [initialQuery]);

  const showLoadMoreButton = monsters?.length >= MONSTER_PAGE_SIZE;
  return (
    <>
      <Head>
        <title>{`Monsweeper - ${t('monster-list-title')}`}</title>
      </Head>
      <Container className="monster-list-page-container">
        <h3>{`${t('monster-list-title')} ${searchTerm ? ' - ' + searchTerm : ''}`}</h3>
        <MonsterList monsters={monsters} showNotFound={false} />
        {monsterListLoaded}
        {showLoadMoreButton ? (
          <Row className="justify-content-center">
            <Button onClick={() => setPageIndex(pageIndex + 1)}>{t('load-more')}</Button>
          </Row>
        ) : (
          ''
        )}
      </Container>
    </>
  );
};

MonsterListPage.propTypes = {
  initialData: PropTypes.shape({
    query: PropTypes.shape({
      pageIndex: PropTypes.number
    }),
    monsters: PropTypes.arrayOf(PropTypes.object)
  }).isRequired,
  t: PropTypes.func.isRequired,
  i18nNamespaces: PropTypes.arrayOf(PropTypes.string)
};

MonsterListPage.defaultProps = {
  i18nNamespaces: ['common', 'monster']
};

export const getServerSideProps = async ({ query }) => {
  const monsters = await getMonsters(query);
  return {
    props: {
      initialData: {
        query,
        monsters
      }
    }
  };
};

export default withTranslation('monster')(MonsterListPage);
