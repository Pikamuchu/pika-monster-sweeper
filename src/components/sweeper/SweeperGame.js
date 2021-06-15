import { createScreen, createAudio, createBall, createTarget } from './game/GameElementsHelpers';
import { createGameState } from './game/GameStateHelpers';
import { createGameActions } from './game/GameActionsHelpers';
import { createGameEvents } from './game/GameEventsHelpers';
import { getElementById } from './game/GameUtils';

export default function sweeperGame(monster, sweeperSuccessCallback) {
  /*******Some inital configurations *****/
  var msRows = 10;
  var msColumns = 10;
  var mineCount = 20;
  var targetDiv = null;
  var counterInterval = null;
  var homeFolder = 'https://raw.githubusercontent.com/strahlistvan/minesweeper/devjs/';

  /*********** ****************/

  var ScoreCounter = {
    targetDiv: null,
    currentScore: 0,
    self: this,

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
  /**** timecounter.js ******/
  var TimeCounter = {
    targetDiv: null,
    currentSeconds: 0,
    currentMinutes: 0,
    isCounting: false,

    /**  Returns a HTML DOM element which contains the current time in a div which ID is 'timer'. */
    getTimerDivElement: function () {
      this.isCounting = false;

      var counterDiv = document.createElement('div');
      counterDiv.id = 'timer';

      var min1 = Math.floor(this.currentMinutes / 10) % 100;
      var min1Img = document.createElement('img');
      min1Img.src = homeFolder + 'Images/score/' + min1 + '.bmp';
      min1Img.style.height = '30px';
      min1Img.id = 'min1Img';

      var min2 = this.currentMinutes % 10;
      var min2Img = document.createElement('img');
      min2Img.src = homeFolder + 'Images/score/' + min2 + '.bmp';
      min2Img.style.height = '30px';
      min2Img.id = 'min2Img';

      var dotsImg = document.createElement('img');
      dotsImg.src = homeFolder + 'Images/score/dots.bmp';
      dotsImg.style.height = '30px';

      var sec1 = Math.floor(this.currentSeconds / 10);
      var sec1Img = document.createElement('img');
      sec1Img.src = homeFolder + 'Images/score/' + sec1 + '.bmp';
      sec1Img.style.height = '30px';
      sec1Img.id = 'sec1Img';

      var sec2 = this.currentSeconds % 10;
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
      this.isCounting = true;
      var self = this;
      self.isCounting = true;
      counterInterval = setInterval(function () {
        //Refresh timer HTML element
        var timerElement = document.getElementById('timer').parentElement;
        timerElement.innerHTML = '';
        timerElement.appendChild(self.getTimerDivElement());

        self.currentSeconds = (self.currentSeconds + 1) % 60;
        self.currentMinutes = self.currentSeconds == 0 ? self.currentMinutes + 1 : self.currentMinutes;
      }, 1000);
    },

    /** Clear the timer interval, stops the clock*/
    stopClock: function () {
      this.isCounting = false;
      clearInterval(counterInterval);
    },

    /** Set the timer to 00:00 */
    resetClock: function () {
      this.currentMinutes = this.currentSeconds = 0;
    }
  };

  /********* minesweeperfield.js *********/
  function MineSweeperField(rowIndex, columnIndex, hasMinePar) {
    this.flagged = false;
    this.opened = false;
    this.hasMine = hasMinePar;

    var self = this;

    this.msbtn = document.createElement('div');

    this.appendTo = function (parentElement) {
      self.msbtn.style.width = '40px';
      self.msbtn.style.height = '40px';
      self.msbtn.style.backgroundColor = 'lightgrey';
      self.msbtn.class = 'self.msbtn';
      self.msbtn.onmousedown = function (evt) {
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

        if (self.flagged) {
          self.flagged = false;
          ++MineSweeper.remainingMines;
        } else if (isRight && !self.flagged && !self.opened) {
          --MineSweeper.remainingMines;
          self.flagged = true;
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

          if (!self.flagged) {
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
              MineSweeper.openField(self.getRowIndex(), self.getColumnIndex());
            }
          } //remove flag
          else {
            self.msbtn.style.backgroundImage = 'none';
            ++MineSweeper.remainingMines;
            self.flagged = false;

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

      parentElement.appendChild(self.msbtn);
    };

    this.getButton = function () {
      return self.msbtn;
    };

    this.isOpened = function () {
      return self.opened;
    };

    this.setOpened = function (isOpened) {
      self.opened = isOpened;
    };

    this.isFlagged = function () {
      return self.flagged;
    };

    this.setFlagged = function (isFlagged) {
      self.flagged = isFlagged;
    };

    this.getRowIndex = function () {
      return rowIndex;
    };

    this.getColumnIndex = function () {
      return columnIndex;
    };

    this.getNeighbourMinesCount = function () {
      return MineSweeper.countNeigbourMines(rowIndex, columnIndex);
    };

    this.isMineField = function () {
      return this.hasMine;
      return MineSweeper.isMineField(rowIndex, columnIndex);
    };
  }

  /************* minesweeper.js ****************/
  window.oncontextmenu = function () {
    return false;
  };

  var MineSweeper = {
    remainingMines: mineCount,
    isPlayerWin: false,
    isPlayerDied: false,
    isGameRunning: false,
    grid: [],

    generateGrid: function (rows, columns) {
      this.grid = new Array(rows);
      for (var i = 0; i < rows; ++i) {
        this.grid[i] = new Array(columns);
        for (var j = 0; j < columns; ++j) {
          this.grid[i][j] = new MineSweeperField(i, j, false);
          this.grid[i][j].hasMine = false;
        }
      }
      //this.placeMines();
    },

    //generating mines into random places
    placeMines: function () {
      var rows = MineSweeper.grid.length;
      var columns = MineSweeper.grid[0].length;

      //clear all mines
      for (var i = 0; i < rows; ++i) {
        for (var j = 0; j < columns; ++j) {
          this.grid[i][j].hasMine = false;
        }
      }

      var index = mineCount;
      while (index != 0) {
        var rand = Math.floor(Math.round(Math.random() * (rows * columns)));
        var rowIndex = Math.floor(rand / rows) - 1;
        var colIndex = (rand % rows) - 1;

        rowIndex = rowIndex < 0 ? 0 : rowIndex;
        colIndex = colIndex < 0 ? 0 : colIndex;

        //			console.log("row: "+rowIndex + " column: " + colIndex);

        if (!this.grid[colIndex][rowIndex].hasMine) {
          this.grid[colIndex][rowIndex].hasMine = true;
          //	console.log('('+colIndex+', '+rowIndex+') has Mine');
          --index;
        }
      }
      //		console.log(this.grid);
    },

    clearField: function (selectedRow, selectedCol) {
      if (selectedRow < 0 || selectedRow >= this.grid.length || selectedCol < 0 || selectedCol >= this.grid[0].length)
        return;

      if (!this.grid[selectedRow][selectedCol].isMineField()) return;

      var findPlace = false;

      for (var i = 0; i < this.grid.length && !findPlace; ++i) {
        for (var j = 0; j < this.grid[i].length && !findPlace; ++j) {
          if (i != selectedRow && j != selectedCol && !this.grid[i][j].hasMine) {
            this.grid[i][j].hasMine = true;
            findPlace = true;
          }
        }
      }

      if (findPlace) this.grid[selectedRow][selectedCol].hasMine = false;
    },

    errorMessage: function (errorText) {
      alert(errorText);
      console.log(errorText);
    },

    create: function (parentId) {
      this.isPlayerDied = false;
      this.isPlayerWin = false;
      this.isGameRunning = false;
      this.remainingMines = mineCount;

      this.generateGrid(msRows, msColumns);

      targetDiv = null;
      targetDiv = document.getElementById(parentId);

      if (!targetDiv) this.errorMessage('Failed to create MineSweeper. Element not found with ID ' + parentId);

      targetDiv.innerHTML = '';

      var table = document.createElement('table');

      var thead = this.createHeader();
      table.appendChild(thead);

      var tbody = document.createElement('tbody');

      for (var i = 0; i < msRows; ++i) {
        var row = document.createElement('tr');
        for (var j = 0; j < msColumns; ++j) {
          var column = document.createElement('td');
          row.appendChild(column);

          var msField = new MineSweeperField(i, j, false);
          msField.appendTo(column);
        }

        tbody.appendChild(row);
      }

      table.appendChild(tbody);
      targetDiv.appendChild(table);
    },

    repaintGrid: function (parentId) {
      targetDiv = null;
      targetDiv = document.getElementById(parentId);

      if (!targetDiv) this.errorMessage('Failed to create MineSweeper. Element not found with ID ' + parentId);

      targetDiv.innerHTML = '';

      var table = document.createElement('table');

      var thead = this.createHeader();
      table.appendChild(thead);

      var tbody = document.createElement('tbody');

      for (var i = 0; i < msRows; ++i) {
        var row = document.createElement('tr');
        for (var j = 0; j < msColumns; ++j) {
          var column = document.createElement('td');
          row.appendChild(column);

          if (this.grid[i][j].flagged) {
            if (!this.grid[i][j].hasMine && +!this.isGameRunning)
              this.grid[i][j].getButton().style.backgroundImage =
                "url('https://raw.githubusercontent.com/strahlistvan/minesweeper/devjs/Images/flagged_false.png')";
            else
              this.grid[i][j].getButton().style.backgroundImage =
                "url('https://raw.githubusercontent.com/strahlistvan/minesweeper/devjs/Images/flagged.png')";
            this.grid[i][j].getButton().style.backgroundSize = 'cover';
          } else if (this.grid[i][j].opened) {
            if (this.grid[i][j].hasMine) {
              this.grid[i][j].getButton().style.backgroundImage =
                "url('https://raw.githubusercontent.com/strahlistvan/minesweeper/devjs/Images/bomb.png')";
              this.grid[i][j].getButton().style.backgroundSize = 'cover';
            } else {
              this.grid[i][j].getButton().style.backgroundImage =
                "url('https://raw.githubusercontent.com/strahlistvan/minesweeper/devjs/Images/" +
                this.grid[i][j].getNeighbourMinesCount() +
                ".png')";
              this.grid[i][j].getButton().style.backgroundSize = 'cover';
            }
          } else {
            this.grid[i][j].getButton().style.backgroundImage = 'none';
          }

          //var msField = this.grid[i][j];
          this.grid[i][j].appendTo(column);
        }

        tbody.appendChild(row);
      }

      table.appendChild(tbody);
      targetDiv.appendChild(table);
    },

    countNeigbourMines: function (i, j) {
      var count = 0;

      //If the position is not valid
      if (i < 0 || j < 0 || i >= this.grid.length || j >= this.grid[i].length) return 0;

      //Top neighbour
      if (i > 0 && this.grid[i - 1][j].hasMine) {
        //			console.log(i+' row '+j+' column Top neighbour');
        ++count;
      }

      //Top right neighbour
      if (i > 0 && j < this.grid[i - 1].length - 1 && this.grid[i - 1][j + 1].hasMine) {
        //			console.log(i+' row '+j+' column Top Right neighbour');
        ++count;
      }

      //Right neighbour
      if (j < this.grid[i].length - 1 && this.grid[i][j + 1].hasMine) {
        //			console.log(i+' row '+j+' column Right neighbour');
        ++count;
      }

      //Bottom right neighbour
      if (i < this.grid.length - 1 && j < this.grid[i + 1].length - 1 && this.grid[i + 1][j + 1].hasMine) {
        //				console.log(i+' row '+j+' column Bottom Right neighbour');
        ++count;
      }

      //Bottom neighbour
      if (i < this.grid.length - 1 && this.grid[i + 1][j].hasMine) {
        //				console.log(i+' row '+j+' column Bottom neighbour');
        ++count;
      }

      //Bottom left neighbour
      if (i < this.grid.length - 1 && j > 0 && this.grid[i + 1][j - 1].hasMine) {
        //			console.log(i+' row '+j+' column Bottom Left neighbour');
        ++count;
      }

      //Left neighbour
      if (j > 0 && this.grid[i][j - 1].hasMine) {
        //			console.log(i+' row '+j+' column Left neighbour');
        ++count;
      }

      //Top left neighbour
      if (i > 0 && j > 0 && this.grid[i - 1][j - 1].hasMine) {
        //			console.log(i+' row '+j+' column Top Left neighbour');
        ++count;
      }

      return count;
    },

    isMineField: function (i, j) {
      //If the position is not valid
      if (i < 0 || j < 0 || i >= this.grid.length || j >= this.grid[i].length) return 0;

      return this.grid[i][j].hasMine;
    },

    countOpenedFileds: function () {
      var count = 0;
      for (var i = 0; i < this.grid.length; ++i) {
        for (var j = 0; j < this.grid[i].length; ++j) {
          if (this.grid[i][j].isOpened()) ++count;
        }
      }
      console.log('opened fields = ' + count);
      return count;
    },

    createHeader: function () {
      var thead = document.createElement('thead');

      var row = document.createElement('tr');
      row.style.backgroundColor = 'lightgrey';
      row.style.height = '50px';

      var thScore = document.createElement('th');
      thScore.id = 'scoreboard';
      thScore.colSpan = Math.floor(msColumns / 3);
      var mineDiv = ScoreCounter.getScoreDivElement(MineSweeper.remainingMines);
      thScore.appendChild(mineDiv);

      var thSun = document.createElement('th');
      thSun.id = 'sunhead';
      thSun.colSpan = Math.floor(msColumns - 2 * Math.floor(msColumns / 3));

      var smileyDiv = document.createElement('div');
      if (this.isPlayerDied) {
        smileyDiv.style.backgroundImage =
          "url('https://raw.githubusercontent.com/strahlistvan/minesweeper/devjs/Images/sad.png')";
        TimeCounter.stopClock();
      } else if (this.isPlayerWin) {
        smileyDiv.style.backgroundImage =
          "url('https://raw.githubusercontent.com/strahlistvan/minesweeper/devjs/Images/win.jpg')";
      } else {
        smileyDiv.style.backgroundImage =
          "url('https://raw.githubusercontent.com/strahlistvan/minesweeper/devjs/Images/smile.png')";
      }

      smileyDiv.style.backgroundSize = 'cover';
      smileyDiv.style.height = '50px';
      smileyDiv.style.width = '50px';
      smileyDiv.style.margin = '0 auto 0';

      smileyDiv.onclick = function () {
        TimeCounter.stopClock();
        TimeCounter.resetClock();
        MineSweeper.create(targetDiv.id);
      };

      thSun.appendChild(smileyDiv);

      var thTime = document.createElement('th');
      thTime.id = 'timeboard';
      thTime.colSpan = Math.floor(msColumns / 3);

      thTime.appendChild(TimeCounter.getTimerDivElement());

      row.appendChild(thScore);
      row.appendChild(thSun);
      row.appendChild(thTime);

      thead.appendChild(row);

      return thead;
    },

    openField: function (row, col) {
      var neighbourCount = MineSweeper.countNeigbourMines(row, col);

      //msField.opened = true;
      this.grid[row][col].opened = true;

      this.grid[row][col].getButton().style.backgroundImage =
        "url('https://raw.githubusercontent.com/strahlistvan/minesweeper/devjs/Images/" + neighbourCount + ".png')";
      this.grid[row][col].getButton().style.backgroundSize = 'cover';

      //if it's not empty, we don't need to flood fill
      if (neighbourCount > 0) return;

      var queue = [];
      queue.push({ x: row, y: col });

      while (queue.length > 0) {
        var nextFieldCoord = queue.pop();

        var x = nextFieldCoord.x;
        var y = nextFieldCoord.y;

        //left neighbour
        if (x > 0 && !this.grid[x - 1][y].opened) {
          this.grid[x - 1][y].opened = true;
          neighbourCount = MineSweeper.countNeigbourMines(x - 1, y);

          if (MineSweeper.countNeigbourMines(x - 1, y) === 0) queue.push({ x: x - 1, y: y });
        }
        //right neighbour
        if (x < this.grid.length - 1 && !this.grid[x + 1][y].opened) {
          this.grid[x + 1][y].opened = true;
          neighbourCount = MineSweeper.countNeigbourMines(x + 1, y);

          if (MineSweeper.countNeigbourMines(x + 1, y) === 0) queue.push({ x: x + 1, y: y });
        }
        //top neighbour
        if (y > 0 && !this.grid[x][y - 1].opened) {
          this.grid[x][y - 1].opened = true;
          neighbourCount = MineSweeper.countNeigbourMines(x, y - 1);

          if (MineSweeper.countNeigbourMines(x, y - 1) === 0) queue.push({ x: x, y: y - 1 });
        }
        //bottom neighbour
        if (y < this.grid[x].length - 1 && !this.grid[x][y + 1].opened) {
          this.grid[x][y + 1].opened = true;
          neighbourCount = MineSweeper.countNeigbourMines(x, y + 1);

          if (MineSweeper.countNeigbourMines(x, y + 1) === 0) queue.push({ x: x, y: y + 1 });
        }
        //top left neighbour
        if (x > 0 && y > 0 && !this.grid[x - 1][y - 1].opened) {
          this.grid[x - 1][y - 1].opened = true;
          neighbourCount = MineSweeper.countNeigbourMines(x - 1, y - 1);

          if (MineSweeper.countNeigbourMines(x - 1, y - 1) === 0) queue.push({ x: x - 1, y: y - 1 });
        }
        //top right neighbour
        if (x < this.grid.length - 1 && y > 0 && !this.grid[x + 1][y - 1].opened) {
          this.grid[x + 1][y - 1].opened = true;
          neighbourCount = MineSweeper.countNeigbourMines(x + 1, y - 1);

          if (MineSweeper.countNeigbourMines(x + 1, y - 1) === 0) queue.push({ x: x + 1, y: y - 1 });
        }
        //bottom left neighbour
        if (x > 0 && y < this.grid[x].length - 1 && !this.grid[x - 1][y + 1].opened) {
          this.grid[x - 1][y + 1].opened = true;
          neighbourCount = MineSweeper.countNeigbourMines(x - 1, y + 1);

          if (MineSweeper.countNeigbourMines(x - 1, y + 1) === 0) queue.push({ x: x - 1, y: y + 1 });
        }
        //bottom right neighbour
        if (x < this.grid.length - 1 && y < this.grid[x].length - 1 && !this.grid[x + 1][y + 1].opened) {
          this.grid[x + 1][y + 1].opened = true;
          neighbourCount = MineSweeper.countNeigbourMines(x + 1, y + 1);

          if (MineSweeper.countNeigbourMines(x + 1, y + 1) === 0) queue.push({ x: x + 1, y: y + 1 });
        }

        //	console.log(JSON.stringify(queue));
      }
    },

    openAllFields: function () {
      for (var i = 0; i < this.grid.length; ++i) {
        for (var j = 0; j < this.grid[i].length; ++j) {
          this.grid[i][j].opened = true;
          //	console.log("("+i+", "+j+").is_opened="+this.grid[i][j].isOpened());
        }
      }
    },

    getTargetDiv: function () {
      return targetDiv.id;
    },

    hasOpenableField: function () {
      for (var i = 0; i < this.grid.length; ++i) {
        for (var j = 0; j < this.grid[i].length; ++j) {
          if (!this.grid[i][j].opened && !this.grid[i][j].hasMine) {
            console.log('(' + i + ',' + j + ')' + 'is openable');
            return true;
          }
        }
      }
      console.log('No more openable field...');
      return false;
    }
  };

  window.onload = MineSweeper.create('gameboard');
}

/*
export default function sweeperGame(monster, sweeperSuccessCallback) {
  const screen = createScreen();
  const audio = createAudio();

  const ball = createBall(screen);
  const target = createTarget(monster, screen);

  const state = createGameState(ball, target, screen, audio);
  const actions = createGameActions(ball, target, screen, state, sweeperSuccessCallback);

  createGameEvents(screen, state, actions);

  state.startGame();
}
*/
