import { Resources } from './GameResourcesHelpers';
import { getElementById } from './GameUtils';

var counterInterval = null;
var homeFolder = 'https://raw.githubusercontent.com/strahlistvan/minesweeper/devjs/';

export const createConfig = () => {
  return {
    msRows: 10,
    msColumns: 10,
    mineCount: 20
  };
};

export const createScreen = () => {
  return {
    height: window.innerHeight,
    width: window.innerWidth,
    targetDiv: null
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
