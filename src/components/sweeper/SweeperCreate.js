/* eslint-disable react/no-unused-prop-types */
/* eslint-disable no-plusplus */
import PropTypes from 'prop-types';
import React, { useState, useContext } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useGlobal } from '../../context/GlobalContext';

import { Router, withTranslation } from '../../i18n';

const SweeperCreate = ({ t }) => {
  const [difficulty, setDifficulty] = useState('Beginner');
  const [mines, setMines] = useState(10);
  const [width, setWidth] = useState(10);
  const [height, setHeight] = useState(10);
  const { state, actions } = useGlobal();

  const createSelectItems = (min, max) => {
    const items = [];
    for (let i = min; i <= max; i++) {
      items.push(
        <option key={i} value={i}>
          {i}
        </option>
      );
    }
    return items;
  };

  const changeDifficulty = (e) => {
    setDifficulty(e.target.value);

    switch (e.target.value) {
      case 'Novice':
        setHeight(12);
        setWidth(12);
        setMines(22);
        break;

      case 'Intermediate':
        setHeight(12);
        setWidth(18);
        setMines(44);
        break;

      case 'Advanced':
        setHeight(15);
        setWidth(18);
        setMines(70);
        break;

      case 'Expert':
        setHeight(17);
        setWidth(30);
        setMines(155);
        break;

      case 'Master':
        setHeight(17);
        setWidth(40);
        setMines(275);
        break;

      case 'Beginner':
      default:
        setHeight(10);
        setWidth(10);
        setMines(10);
        break;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    actions.setGameParams({ height, width, mines });
    Router.push('/sweeper/play');
  };

  return (
    <>
      <div className="flex form-container">
        <Form onSubmit={handleSubmit} className="flex form">
          <Form.Group controlId="difficulty" className="input-row">
            <Form.Label className="label-style">Difficulty:</Form.Label>
            <Form.Control className="input-style" as="select" onChange={changeDifficulty}>
              <option>Beginner</option>
              <option>Novice</option>
              <option>Intermediate</option>
              <option>Advanced</option>
              <option>Expert</option>
              <option>Master</option>
              <option>Custom</option>
            </Form.Control>
          </Form.Group>

          <Form.Group controlId="height" className="input-row">
            <Form.Label className="label-style">Height:</Form.Label>
            <Form.Control
              className="input-style"
              as="select"
              disabled={!(difficulty === 'Custom')}
              value={height}
              onChange={(e) => setHeight(Number(e.target.value))}
            >
              {createSelectItems(5, 20)}
            </Form.Control>
          </Form.Group>

          <Form.Group controlId="width" className="input-row">
            <Form.Label className="label-style">Width:</Form.Label>
            <Form.Control
              className="input-style"
              as="select"
              value={width}
              disabled={!(difficulty === 'Custom')}
              onChange={(e) => setWidth(Number(e.target.value))}
            >
              {createSelectItems(5, 40)}
            </Form.Control>
          </Form.Group>

          <Form.Group controlId="mines" className="input-row">
            <Form.Label className="label-style">Mines:</Form.Label>
            <Form.Control
              className="input-style"
              as="select"
              value={mines}
              disabled={!(difficulty === 'Custom')}
              onChange={(e) => setMines(Number(e.target.value))}
            >
              {createSelectItems(10, width * height * 0.6)}
            </Form.Control>
          </Form.Group>

          <Button type="submit" className="button-style">
            Create Board
          </Button>
        </Form>
      </div>
    </>
  );
};

SweeperCreate.propTypes = {
  t: PropTypes.func.isRequired,
  i18nNamespaces: PropTypes.arrayOf(PropTypes.string),
};

SweeperCreate.defaultProps = {
  i18nNamespaces: ['common', 'monster', 'sweeper'],
};

export default withTranslation('sweeper')(SweeperCreate);
