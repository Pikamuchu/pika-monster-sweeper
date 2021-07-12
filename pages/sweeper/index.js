/* eslint-disable react/no-unused-prop-types */
/* eslint-disable no-plusplus */
import PropTypes from 'prop-types';
import Head from 'next/head';

import React, { useState, useContext } from 'react';
import { Container } from 'react-bootstrap';

import SweeperCreate from '../../src/components/sweeper/SweeperCreate';
import SweeperList from '../../src/components/sweeper/SweeperList';

import { withTranslation } from '../../src/i18n';

const SweeperLandingPage = ({ t }) => {

  return (
    <>
      <Head>
        <title>{`Monsweeper - ${t('sweeper-list-title')}`}</title>
      </Head>
      <Container className="page-container">
        <h3>{t('sweeper-list-title')}</h3>
        <SweeperCreate />
        <SweeperList />
      </Container>
    </>
  );
};

SweeperLandingPage.propTypes = {
  t: PropTypes.func.isRequired,
  i18nNamespaces: PropTypes.arrayOf(PropTypes.string),
};

SweeperLandingPage.defaultProps = {
  i18nNamespaces: ['common', 'monster', 'sweeper'],
};

export default withTranslation('sweeper')(SweeperLandingPage);
