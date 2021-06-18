import {
  createScreen,
  createAudio,
  createScoreCounter,
  createTimeCounter,
  createSweeperField
} from './game/GameElementsHelpers';
import { createGameState } from './game/GameStateHelpers';
import { createGameActions } from './game/GameActionsHelpers';
import { createGameEvents } from './game/GameEventsHelpers';
import { getElementById } from './game/GameUtils';

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

export default function sweeperGame(monster, sweeperSuccessCallback) {
  var msRows = 10;
  var msColumns = 10;
  var mineCount = 20;
  var targetDiv = null;

  const screen = createScreen();
  const audio = createAudio();

  const ScoreCounter = createScoreCounter();

  /**** timecounter.js ******/
  const TimeCounter = createTimeCounter();

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
          this.grid[i][j] = createSweeperField(i, j, false);
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

          var msField = createSweeperField(i, j, false);
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
