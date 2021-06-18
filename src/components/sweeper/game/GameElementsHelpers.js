import { Resources } from './GameResourcesHelpers';
import { getElementById, getFirstElement, getCenterCoords, clearContainerElement } from './GameUtils';
import { elementShrinkEffect, moveElementThroughPath, removeElementAnimation } from './GameEffectsHelpers';

const BALL_DEFAULT_SIZE = 60;
const BALL_INITIAL_POSITION = 120;
const TARGET_DEFAULT_SIZE = 140;

var counterInterval = null;
var homeFolder = 'https://raw.githubusercontent.com/strahlistvan/minesweeper/devjs/';

export const createScreen = () => {
  return {
    height: window.innerHeight,
    width: window.innerWidth
  };
};

export const createAudio = () => {
  return {
    music: getElementById('game-music')
  };
};

export const createScoreCounter = (screen) => {
  const scoreCounter = {
    targetDiv: null,
    currentScore: 0,
    getScoreDivElement: function (scoreParam) {
      var counterDiv = document.createElement('div');
      counterDiv.id = 'counter';

      var num1 = Math.floor((scoreParam % 1000) / 100);
      var num1Img = document.createElement('img');
      num1Img.src = homeFolder + 'Images/score/' + num1 + '.bmp';
      num1Img.style.width = '30px';
      num1Img.style.height = '30px';

      var num2 = Math.floor((scoreParam % 100) / 10);
      var num2Img = document.createElement('img');
      num2Img.src = homeFolder + 'Images/score/' + num2 + '.bmp';
      num2Img.style.width = '30px';
      num2Img.style.height = '30px';

      var num3 = scoreParam % 10;
      var num3Img = document.createElement('img');
      num3Img.src = homeFolder + '/Images/score/' + num3 + '.bmp';
      num3Img.style.width = '30px';
      num3Img.style.height = '30px';

      counterDiv.appendChild(num1Img);
      counterDiv.appendChild(num2Img);
      counterDiv.appendChild(num3Img);

      return counterDiv;
    }
  };
  return scoreCounter;
};

export const createTimeCounter = (screen) => {
  const timeCounter = {
    targetDiv: null,
    currentSeconds: 0,
    currentMinutes: 0,
    isCounting: false,

    /**  Returns a HTML DOM element which contains the current time in a div which ID is 'timer'. */
    getTimerDivElement: function () {
      timeCounter.isCounting = false;

      var counterDiv = document.createElement('div');
      counterDiv.id = 'timer';

      var min1 = Math.floor(timeCounter.currentMinutes / 10) % 100;
      var min1Img = document.createElement('img');
      min1Img.src = homeFolder + 'Images/score/' + min1 + '.bmp';
      min1Img.style.height = '30px';
      min1Img.id = 'min1Img';

      var min2 = timeCounter.currentMinutes % 10;
      var min2Img = document.createElement('img');
      min2Img.src = homeFolder + 'Images/score/' + min2 + '.bmp';
      min2Img.style.height = '30px';
      min2Img.id = 'min2Img';

      var dotsImg = document.createElement('img');
      dotsImg.src = homeFolder + 'Images/score/dots.bmp';
      dotsImg.style.height = '30px';

      var sec1 = Math.floor(timeCounter.currentSeconds / 10);
      var sec1Img = document.createElement('img');
      sec1Img.src = homeFolder + 'Images/score/' + sec1 + '.bmp';
      sec1Img.style.height = '30px';
      sec1Img.id = 'sec1Img';

      var sec2 = timeCounter.currentSeconds % 10;
      var sec2Img = document.createElement('img');
      sec2Img.src = homeFolder + 'Images/score/' + sec2 + '.bmp';
      sec2Img.style.height = '30px';
      sec2Img.id = 'sec2Img';

      counterDiv.appendChild(min1Img);
      counterDiv.appendChild(min2Img);
      counterDiv.appendChild(dotsImg);
      counterDiv.appendChild(sec1Img);
      counterDiv.appendChild(sec2Img);

      return counterDiv;
    },

    /** Starts an interval what is refershing the timer div element secondly. */
    startClock: function () {
      timeCounter.isCounting = true;
      counterInterval = setInterval(function () {
        //Refresh timer HTML element
        var timerElement = document.getElementById('timer').parentElement;
        timerElement.innerHTML = '';
        timerElement.appendChild(timeCounter.getTimerDivElement());

        timeCounter.currentSeconds = (timeCounter.currentSeconds + 1) % 60;
        timeCounter.currentMinutes =
          timeCounter.currentSeconds === 0 ? timeCounter.currentMinutes + 1 : timeCounter.currentMinutes;
      }, 1000);
    },

    /** Clear the timer interval, stops the clock*/
    stopClock: function () {
      timeCounter.isCounting = false;
      clearInterval(counterInterval);
    },

    /** Set the timer to 00:00 */
    resetClock: function () {
      timeCounter.currentMinutes = timeCounter.currentSeconds = 0;
    }
  };
  return timeCounter;
};

export const createSweeperField = (rowIndex, columnIndex, hasMinePar, screen, TimeCounter, MineSweeper) => {
  const sweeperField = {
    flagged: false,
    opened: false,
    hasMine: hasMinePar,

    msbtn: document.createElement('div'),

    appendTo: function (parentElement) {
      sweeperField.msbtn.style.width = '40px';
      sweeperField.msbtn.style.height = '40px';
      sweeperField.msbtn.style.backgroundColor = 'lightgrey';
      sweeperField.msbtn.class = 'self.msbtn';
      sweeperField.msbtn.onmousedown = function (evt) {
        if (MineSweeper.isPlayerDied) return;

        var isRight = false;
        var isLeft = false;

        if ('which' in evt) {
          isRight = evt.which == 3;
          isLeft = evt.which == 1;
        } else if ('button' in evt) {
          isRight = evt.button == 3;
          isLeft = evt.button == 1;
        }

        /** Handling click actions **/
        if (isRight && !MineSweeper.isGameRunning) {
          alert('Press left click in a field to start game');
          return;
        }

        if (sweeperField.flagged) {
          sweeperField.flagged = false;
          ++MineSweeper.remainingMines;
        } else if (isRight && !sweeperField.flagged && !sweeperField.opened) {
          --MineSweeper.remainingMines;
          sweeperField.flagged = true;
          MineSweeper.repaintGrid(MineSweeper.getTargetDiv());

          console.log('Mines left: ' + MineSweeper.remainingMines);
        } else if (isLeft) {
          if (!MineSweeper.isGameRunning) {
            var cycle = 0; //to avoid infinite loops
            do {
              MineSweeper.clearField(rowIndex, columnIndex);
              MineSweeper.placeMines();

              console.log('cycle = ' + cycle++);
            } while (
              (MineSweeper.isMineField(rowIndex, columnIndex) ||
                MineSweeper.countNeigbourMines(rowIndex, columnIndex) > 0) &&
              cycle < 10000
            );
            //Start clock ticking...
            TimeCounter.startClock();
            MineSweeper.isGameRunning = true;
          }

          if (!sweeperField.flagged) {
            if (MineSweeper.grid[rowIndex][columnIndex].hasMine) {
              //explode!

              var bangSound = new Audio(homeFolder + 'explosion.wav');
              bangSound.play();

              MineSweeper.grid[rowIndex][columnIndex].getButton().style.backgroundColor = 'red';
              //stop timer
              TimeCounter.stopClock();

              MineSweeper.isPlayerDied = true;
              MineSweeper.openAllFields();
              MineSweeper.isGameRunning = false;
            } //open field (no mine)
            else {
              MineSweeper.openField(sweeperField.getRowIndex(), sweeperField.getColumnIndex());
            }
          } //remove flag
          else {
            sweeperField.msbtn.style.backgroundImage = 'none';
            ++MineSweeper.remainingMines;
            sweeperField.flagged = false;

            console.log('Mines left: ' + MineSweeper.remainingMines);
          }
        }
        // you win!
        if (!MineSweeper.hasOpenableField() && MineSweeper.isGameRunning) {
          var winSound = new Audio(homeFolder + 'winner.wav');
          winSound.play();
          TimeCounter.stopClock();

          MineSweeper.remainingMines = 0;
          MineSweeper.isPlayerWin = true;
          MineSweeper.openAllFields();
          MineSweeper.isGameRunning = false;
        }
        MineSweeper.repaintGrid(MineSweeper.getTargetDiv());
      };

      parentElement.appendChild(sweeperField.msbtn);
    },

    getButton: function () {
      return sweeperField.msbtn;
    },

    isOpened: function () {
      return sweeperField.opened;
    },

    setOpened: function (isOpened) {
      sweeperField.opened = isOpened;
    },

    isFlagged: function () {
      return sweeperField.flagged;
    },

    setFlagged: function (isFlagged) {
      sweeperField.flagged = isFlagged;
    },

    getRowIndex: function () {
      return rowIndex;
    },

    getColumnIndex: function () {
      return columnIndex;
    },

    getNeighbourMinesCount: function () {
      return MineSweeper.countNeigbourMines(rowIndex, columnIndex);
    },

    isMineField: function () {
      return sweeperField.hasMine;
    }
  };
  return sweeperField;
};

export const createBall = (screen) => {
  const ball = {
    id: 'ball',
    size: BALL_DEFAULT_SIZE,
    x: 0,
    y: 0,
    inMotion: false,
    colision: false,
    bouncing: 0,
    getElement: () => {
      return getElementById(ball.id);
    },
    getCenterCoords: () => {
      return getCenterCoords(ball.id);
    },
    moveBall: (x, y) => {
      ball.x = x;
      ball.y = y;
      const ballElement = getElementById(ball.id);
      if (ballElement) {
        ballElement.style.top = `${ball.y}px`;
        ballElement.style.left = `${ball.x}px`;
      }
    },
    moveBallDelta: (deltaX, deltaY) => {
      const x = ball.x + deltaX;
      const y = ball.y + deltaY;
      ball.moveBall(x, y);
    },
    moveBallPointer: (centerX, centerY) => {
      const x = centerX - ball.size / 2;
      const y = centerY - ball.size / 2;
      ball.moveBall(x, y);
    },
    resetBall: () => {
      ball.moveBall(screen.width / 2 - ball.size / 2, screen.height - (ball.size + BALL_INITIAL_POSITION));
      const ballElement = getElementById(ball.id);
      if (ballElement) {
        ballElement.style.opacity = 1;
        ballElement.style.transform = '';
        ballElement.style.height = `${ball.size}px`;
        ballElement.style.width = `${ball.size}px`;
        ballElement.style.backgroundImage = `url('${Resources.pikaball}')`;
      }
      ball.inMotion = false;
      ball.colision = false;
      ball.bouncing = 0;
    },
    savePosition: () => {
      const ballElement = getElementById(ball.id);
      if (ballElement) {
        const ballRect = ballElement.getBoundingClientRect();
        ballElement.style.transform = '';
        ballElement.style.top = `${ballRect.top}px`;
        ballElement.style.left = `${ballRect.left}px`;
        ballElement.style.height = `${ballRect.width}px`;
        ballElement.style.width = `${ballRect.width}px`;
      }
    }
  };
  return ball;
};

export const createTarget = (monster, screen) => {
  const target = {
    id: 'target',
    size: TARGET_DEFAULT_SIZE,
    sweeperd: false,
    attacks: monster.gameConfig?.attacks,
    numAttacks: 0,
    level: 0,
    attackDelay: 10,
    attackBurst: 1,
    getMaxSuccessRate: () => {
      return (monster.gameConfig?.maxSuccesRate || 100) - target.level;
    },
    getElement: () => {
      return getElementById(target.id);
    },
    getCenterCoords: () => {
      return getCenterCoords(target.id);
    },
    getRadius: () => {
      return getElementById(target.id).getBoundingClientRect().width / 2;
    },
    getAttackType: () => {
      return target.attacks ? target.attacks[target.level]?.type : null;
    },
    getAttackImage: () => {
      return target.attacks ? target.attacks[target.level]?.images[0] : null;
    },
    resetTarget: () => {
      // Init target state
      target.sweeperd = false;
      target.numAttacks = 0;
      // Initialize target image
      const targetElement = target.getElement();
      if (targetElement) {
        targetElement.style.backgroundImage = `url('${monster.image}')`;
        if (monster.imageRatio > 1) {
          targetElement.style.height = `${target.size * monster.imageRatio}px`;
        }
        targetElement.style.opacity = 1;
      }
      // Adjust Ring
      const ring = getFirstElement('ring-fill');
      if (ring) {
        ring.style.height = '150px';
        ring.style.width = '150px';
        elementShrinkEffect(ring);
      }
      // Initialize motion
      removeElementAnimation(targetElement);
      target.motion = moveElementThroughPath(targetElement, '.motion-path path', screen);
      target.motion.play();
      // Remove attacks
      const attackContainer = getFirstElement('attack-container');
      if (attackContainer) {
        clearContainerElement(attackContainer);
      }
    }
  };
  // Initialize motion
  target.motion = moveElementThroughPath(target.getElement(), '.motion-path path', screen);
  return target;
};
