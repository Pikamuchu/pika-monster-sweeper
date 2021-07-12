/* eslint-disable react/no-unused-prop-types */
/* eslint-disable react/forbid-prop-types */
import PropTypes from 'prop-types';
import Head from 'next/head';
import { Container } from 'react-bootstrap';

import { withTranslation } from '../../src/i18n';
import { getMonsterDetails } from '../../src/models/monsterModel';
import useMonster from '../../src/hooks/useMonster';

import SweeperGame from '../../src/components/sweeper/SweeperGame';

const SweeperPage = ({ initialData, t }) => {
  const { data: monster } = useMonster({ id: initialData?.query?.id }, initialData?.monster);
  return (
    <>
      <Head>
        <title>{`Monsweeper - ${t('sweeper-monster-title')} - ${monster?.id}`}</title>
      </Head>
      <Container className="sweeper-monster-page-container">
        <SweeperGame />
      </Container>
    </>
  );
};

SweeperPage.propTypes = {
  initialData: PropTypes.shape({
    monster: PropTypes.object,
    query: PropTypes.object
  }).isRequired,
  i18nNamespaces: PropTypes.arrayOf(PropTypes.string),
  t: PropTypes.func.isRequired
};

SweeperPage.defaultProps = {
  i18nNamespaces: ['common', 'monster', 'sweeper']
};

export const getServerSideProps = async ({ query }) => {
  const monster = await getMonsterDetails(query);
  return {
    props: {
      initialData: {
        query,
        monster
      }
    }
  };
};

export default withTranslation('sweeper')(SweeperPage);
