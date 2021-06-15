/* eslint-disable react/no-unused-prop-types */
/* eslint-disable no-plusplus */
import PropTypes from 'prop-types';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { Container } from 'react-bootstrap';

import { withTranslation } from '../../src/i18n';

const SweeperList = dynamic(() => import('../../src/components/sweeper/SweeperList'), { ssr: false });

const SweeperListPage = ({ t }) => {
  return (
    <>
      <Head>
        <title>{`Monsweeper - ${t('sweeper-list-title')}`}</title>
      </Head>
      <Container className="monster-list-page-container">
        <h3>{t('sweeper-list-title')}</h3>
        <SweeperList />
      </Container>
    </>
  );
};

SweeperListPage.propTypes = {
  t: PropTypes.func.isRequired,
  i18nNamespaces: PropTypes.arrayOf(PropTypes.string)
};

SweeperListPage.defaultProps = {
  i18nNamespaces: ['common', 'monster', 'sweeper']
};

export default withTranslation('sweeper')(SweeperListPage);
