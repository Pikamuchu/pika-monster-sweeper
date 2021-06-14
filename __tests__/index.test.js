/* eslint-disable global-require */
/* global describe, it, expect */
import { shallow } from 'enzyme';

import Layout from '../src/components/layout/Layout';
import HomePage from '../pages/index';
import MonsterListPage from '../pages/monster/index';
import MonsterDetailsPage from '../pages/monster/[id]';
import SweeperListPage from '../pages/sweeper/index';
import SweeperPage from '../pages/sweeper/[id]';
import AboutPage from '../pages/about/index';

describe('Monsweeper Test', () => {

  const monstersData = require('./data/monstersData.json');

  it('Load Home page', () => {
    const initialData = {
      randomMonsters: monstersData,
    };
    const homePage = shallow(
      <Layout>
        <HomePage initialData={initialData} />
      </Layout>
    );
    expect(homePage).toBeDefined();
  });

  it('Load Monster List page', () => {
    const initialData = {
      query: {},
      monsters: monstersData
    };
    const monsterListPage = shallow(
      <Layout>
        <MonsterListPage initialData={initialData} />
      </Layout>
    );
    expect(monsterListPage).toBeDefined();
  });

  it('Load Monster Details page', () => {
    const initialData = {
      query: {},
      monster: monstersData[0],
    };
    const monsterDetailsPage = shallow(
      <Layout>
        <MonsterDetailsPage initialData={initialData} />
      </Layout>
    );
    expect(monsterDetailsPage).toBeDefined();
  });

  it('Load Sweeper List page', () => {
    const sweeperListPage = shallow(
      <Layout>
        <SweeperListPage />
      </Layout>
    );
    expect(sweeperListPage).toBeDefined();
  });

  it('Load Sweeper page', () => {
    const initialData = {
      query: {},
      monster: monstersData[0],
    };
    const sweeperPage = shallow(
      <Layout>
        <SweeperPage initialData={initialData} />
      </Layout>
    );
    expect(sweeperPage).toBeDefined();
  });

  it('Load About page', () => {
    const aboutPage = shallow(
      <Layout>
        <AboutPage />
      </Layout>
    );
    expect(aboutPage).toBeDefined();
  });
});
