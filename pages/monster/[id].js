/* eslint-disable react/forbid-prop-types */
import PropTypes from 'prop-types';
import Head from 'next/head';
import { Container } from 'react-bootstrap';

import { withTranslation } from '../../src/i18n';
import { getMonsterDetails } from '../../src/models/monsterModel';
import MonsterDetails from '../../src/components/monster/MonsterDetails';
import useMonster from '../../src/hooks/useMonster';

const MonsterDetailsPage = ({ initialData, t }) => {
  const { data: monster } = useMonster({ id: initialData?.query?.id }, initialData?.monster);
  return (
    <>
      <Head>
        <title>{`Monsweeper - ${t('monster-details-title')} - ${monster?.id}`}</title>
      </Head>
      <Container className="monster-details-page-container">
        <MonsterDetails monster={monster} />
      </Container>
    </>
  );
};

MonsterDetailsPage.propTypes = {
  initialData: PropTypes.shape({
    monster: PropTypes.object,
    query: PropTypes.object
  }).isRequired,
  i18nNamespaces: PropTypes.arrayOf(PropTypes.string),
  t: PropTypes.func.isRequired
};

MonsterDetailsPage.defaultProps = {
  i18nNamespaces: ['common', 'monster']
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

export default withTranslation('monster')(MonsterDetailsPage);
