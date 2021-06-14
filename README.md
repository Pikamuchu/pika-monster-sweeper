# Monster Sweeper

[![Build Status](https://travis-ci.org/pikamachu/pika-monster-sweeper.svg?branch=master)](https://travis-ci.org/pikamachu/pika-monster-sweeper)
[![Codacy Badge](https://app.codacy.com/project/badge/Grade/4c9d6e8bd4ca4064b09326eb48ab416a)](https://www.codacy.com/gh/pikamachu/pika-monster-sweeper/dashboard?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=pikamachu/pika-monster-sweeper&amp;utm_campaign=Badge_Grade)
[![codecov](https://codecov.io/gh/pikamachu/pika-monster-sweeper/branch/master/graph/badge.svg)](https://codecov.io/gh/pikamachu/pika-monster-sweeper)

## Introduction

Monsweeper is a multiplayer minesweeper web game with monsters.

You can browse the running example in [Monsweeper on Vercel](https://monsweeper.vercel.app/)

You can preview source code using [codesandbox](https://codesandbox.io/s/github/pikamachu/pika-monster-sweeper/tree/master)

### Sweeper features

* Explore monsters.
* Search monsters by name.
* See monsters info in the details page.
* Catch your favorite monsters with the sweeper game.

### Technical features

* Progressive Web Application.
* SSR hybrid rendering.
* Serverless.
* Multilanguage.
* Google Analytics integration.
* PokeApi integration.

## Developing

### Built with

* [Next.js](https://nextjs.org/)
* [React Hooks](https://es.reactjs.org/docs/hooks-intro.html)
* [React Bootstrap](https://react-bootstrap.github.io/)
* [React Autosuggest](https://react-autosuggest.js.org/)
* [Bootswatch](https://bootswatch.com/)
* [animejs](https://animejs.com/)
* [i18next](https://www.i18next.com/)
* [PokeAPI](https://pokeapi.co/)
* [SWR](https://swr.vercel.app/)
* [Hammer.js](https://hammerjs.github.io/)

### Folder structure

* root: Contains the README.md, the main configuration to execute the project such as package.json or any other configuration files.
* pages: Contains the source code for application main pages and API endpoints definitions (Next.js constraint).
* public: Contains the application static resources.
* src: Contains the application source code.
* __tests__: Contains the application tests.

### Installing / Getting started

Clone the source code repository

```bash
  git clone git@github.com:pikamachu/pika-monster-sweeper.git
```

Install node modules dependencies

```bash
  yarn install
```

Start application in development mode

```bash
$ yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result. 

The pages auto-updates as you edit the source files.

### Run tests

Run tests with

```bash
$ yarn test
```

### Pika commands

You can also use these pika bash command

```
Usage: pika [command]

where [command] is one of:
   install -> install application dependencies.
   build -> compile application.
   start -> run application in development mode.
   test -> execute application tests.
   format -> auto format project code using prettier.
   docker build -> create application docker image.
   docker start -> run application docker image.
```
