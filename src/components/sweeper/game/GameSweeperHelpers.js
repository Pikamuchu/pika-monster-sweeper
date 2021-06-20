import { Resources } from './GameResourcesHelpers';
import { findCollidableElement, elementColisionTransform, isBouncingElement } from './GameCollisionsHelpers';
import {
  getElementById,
  getFirstElement,
  getRandomNumber,
  clearContainerElement,
  hideElement,
  activeElement,
  clearElementTransforms,
  setElementImage,
  getTranslationBetweenElements
} from './GameUtils';
import {
  emitBallColisionParticles,
  restoreBallEffect,
  removeElementAnimation,
  throwEffect1,
  throwEffect2,
  throwAttackEffect,
  moveElementAsideEffect,
  emitParticlesToElementEffect,
  fadeElementEffect,
  dropElementEffect,
  shakeEffect,
  rainConfettiEffect,
  poofEffect
} from './GameEffectsHelpers';

const MAX_BOUNCINGS = 2;

var homeFolder = 'https://raw.githubusercontent.com/strahlistvan/minesweeper/devjs/';

export const createHeader = (config, screen, ScoreCounter, TimeCounter, MineSweeper) => {
  var thead = document.createElement('thead');

  var row = document.createElement('tr');
  row.style.backgroundColor = 'lightgrey';
  row.style.height = '50px';

  var thScore = document.createElement('th');
  thScore.id = 'scoreboard';
  thScore.colSpan = Math.floor(config.msColumns / 3);
  var mineDiv = ScoreCounter.getScoreDivElement(MineSweeper.remainingMines);
  thScore.appendChild(mineDiv);

  var thSun = document.createElement('th');
  thSun.id = 'sunhead';
  thSun.colSpan = Math.floor(config.msColumns - 2 * Math.floor(config.msColumns / 3));

  var smileyDiv = document.createElement('div');
  if (MineSweeper.isPlayerDied) {
    smileyDiv.style.backgroundImage =
      "url('https://raw.githubusercontent.com/strahlistvan/minesweeper/devjs/Images/sad.png')";
    TimeCounter.stopClock();
  } else if (MineSweeper.isPlayerWin) {
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
    MineSweeper.create(screen.targetDiv.id);
  };

  thSun.appendChild(smileyDiv);

  var thTime = document.createElement('th');
  thTime.id = 'timeboard';
  thTime.colSpan = Math.floor(config.msColumns / 3);

  thTime.appendChild(TimeCounter.getTimerDivElement());

  row.appendChild(thScore);
  row.appendChild(thSun);
  row.appendChild(thTime);

  thead.appendChild(row);

  return thead;
};

export const createSweeperField = (rowIndex, columnIndex, hasMinePar, TimeCounter, MineSweeper) => {
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

export const createMineSweeper = (screen, config, ScoreCounter, TimeCounter) => {
  var MineSweeper = {
    remainingMines: config.mineCount,
    isPlayerWin: false,
    isPlayerDied: false,
    isGameRunning: false,
    grid: [],

    generateGrid: function (rows, columns) {
      MineSweeper.grid = new Array(rows);
      for (var i = 0; i < rows; ++i) {
        MineSweeper.grid[i] = new Array(columns);
        for (var j = 0; j < columns; ++j) {
          MineSweeper.grid[i][j] = createSweeperField(i, j, false, TimeCounter, MineSweeper);
          MineSweeper.grid[i][j].hasMine = false;
        }
      }
      //MineSweeper.placeMines();
    },

    //generating mines into random places
    placeMines: function () {
      var rows = MineSweeper.grid.length;
      var columns = MineSweeper.grid[0].length;

      //clear all mines
      for (var i = 0; i < rows; ++i) {
        for (var j = 0; j < columns; ++j) {
          MineSweeper.grid[i][j].hasMine = false;
        }
      }

      var index = config.mineCount;
      while (index != 0) {
        var rand = Math.floor(Math.round(Math.random() * (rows * columns)));
        var rowIndex = Math.floor(rand / rows) - 1;
        var colIndex = (rand % rows) - 1;

        rowIndex = rowIndex < 0 ? 0 : rowIndex;
        colIndex = colIndex < 0 ? 0 : colIndex;

        //			console.log("row: "+rowIndex + " column: " + colIndex);

        if (!MineSweeper.grid[colIndex][rowIndex].hasMine) {
          MineSweeper.grid[colIndex][rowIndex].hasMine = true;
          //	console.log('('+colIndex+', '+rowIndex+') has Mine');
          --index;
        }
      }
      //		console.log(MineSweeper.grid);
    },

    clearField: function (selectedRow, selectedCol) {
      if (
        selectedRow < 0 ||
        selectedRow >= MineSweeper.grid.length ||
        selectedCol < 0 ||
        selectedCol >= MineSweeper.grid[0].length
      )
        return;

      if (!MineSweeper.grid[selectedRow][selectedCol].isMineField()) return;

      var findPlace = false;

      for (var i = 0; i < MineSweeper.grid.length && !findPlace; ++i) {
        for (var j = 0; j < MineSweeper.grid[i].length && !findPlace; ++j) {
          if (i != selectedRow && j != selectedCol && !MineSweeper.grid[i][j].hasMine) {
            MineSweeper.grid[i][j].hasMine = true;
            findPlace = true;
          }
        }
      }

      if (findPlace) MineSweeper.grid[selectedRow][selectedCol].hasMine = false;
    },

    errorMessage: function (errorText) {
      alert(errorText);
      console.log(errorText);
    },

    create: function (parentId) {
      MineSweeper.isPlayerDied = false;
      MineSweeper.isPlayerWin = false;
      MineSweeper.isGameRunning = false;
      MineSweeper.remainingMines = config.mineCount;

      MineSweeper.generateGrid(config.msRows, config.msColumns);

      screen.targetDiv = null;
      screen.targetDiv = document.getElementById(parentId);

      if (!screen.targetDiv)
        MineSweeper.errorMessage('Failed to create MineSweeper. Element not found with ID ' + parentId);

      screen.targetDiv.innerHTML = '';

      var table = document.createElement('table');
      var thead = createHeader(config, screen, ScoreCounter, TimeCounter, MineSweeper);
      table.appendChild(thead);
      screen.targetDiv.appendChild(table);

      var board = document.createElement('div');

      for (var i = 0; i < config.msRows; ++i) {
        for (var j = 0; j < config.msColumns; ++j) {
          var msField = createSweeperField(i, j, false, TimeCounter, MineSweeper);
          board.appendChild(msField);
        }

        //tbody.appendChild(row);
      }

      screen.targetDiv.appendChild(board);
    },

    repaintGrid: function (parentId) {
      screen.targetDiv = null;
      screen.targetDiv = document.getElementById(parentId);

      if (!screen.targetDiv)
        MineSweeper.errorMessage('Failed to create MineSweeper. Element not found with ID ' + parentId);

      screen.targetDiv.innerHTML = '';

      var table = document.createElement('table');

      var thead = MineSweeper.createHeader();
      table.appendChild(thead);

      var tbody = document.createElement('tbody');

      for (var i = 0; i < config.msRows; ++i) {
        var row = document.createElement('tr');
        for (var j = 0; j < config.msColumns; ++j) {
          var column = document.createElement('td');
          row.appendChild(column);

          if (MineSweeper.grid[i][j].flagged) {
            if (!MineSweeper.grid[i][j].hasMine && +!MineSweeper.isGameRunning)
              MineSweeper.grid[i][j].getButton().style.backgroundImage =
                "url('https://raw.githubusercontent.com/strahlistvan/minesweeper/devjs/Images/flagged_false.png')";
            else
              MineSweeper.grid[i][j].getButton().style.backgroundImage =
                "url('https://raw.githubusercontent.com/strahlistvan/minesweeper/devjs/Images/flagged.png')";
            MineSweeper.grid[i][j].getButton().style.backgroundSize = 'cover';
          } else if (MineSweeper.grid[i][j].opened) {
            if (MineSweeper.grid[i][j].hasMine) {
              MineSweeper.grid[i][j].getButton().style.backgroundImage =
                "url('https://raw.githubusercontent.com/strahlistvan/minesweeper/devjs/Images/bomb.png')";
              MineSweeper.grid[i][j].getButton().style.backgroundSize = 'cover';
            } else {
              MineSweeper.grid[i][j].getButton().style.backgroundImage =
                "url('https://raw.githubusercontent.com/strahlistvan/minesweeper/devjs/Images/" +
                MineSweeper.grid[i][j].getNeighbourMinesCount() +
                ".png')";
              MineSweeper.grid[i][j].getButton().style.backgroundSize = 'cover';
            }
          } else {
            MineSweeper.grid[i][j].getButton().style.backgroundImage = 'none';
          }

          //var msField = MineSweeper.grid[i][j];
          MineSweeper.grid[i][j].appendTo(column);
        }

        tbody.appendChild(row);
      }

      table.appendChild(tbody);
      screen.targetDiv.appendChild(table);
    },

    countNeigbourMines: function (i, j) {
      var count = 0;

      //If the position is not valid
      if (i < 0 || j < 0 || i >= MineSweeper.grid.length || j >= MineSweeper.grid[i].length) return 0;

      //Top neighbour
      if (i > 0 && MineSweeper.grid[i - 1][j].hasMine) {
        //			console.log(i+' row '+j+' column Top neighbour');
        ++count;
      }

      //Top right neighbour
      if (i > 0 && j < MineSweeper.grid[i - 1].length - 1 && MineSweeper.grid[i - 1][j + 1].hasMine) {
        //			console.log(i+' row '+j+' column Top Right neighbour');
        ++count;
      }

      //Right neighbour
      if (j < MineSweeper.grid[i].length - 1 && MineSweeper.grid[i][j + 1].hasMine) {
        //			console.log(i+' row '+j+' column Right neighbour');
        ++count;
      }

      //Bottom right neighbour
      if (
        i < MineSweeper.grid.length - 1 &&
        j < MineSweeper.grid[i + 1].length - 1 &&
        MineSweeper.grid[i + 1][j + 1].hasMine
      ) {
        //				console.log(i+' row '+j+' column Bottom Right neighbour');
        ++count;
      }

      //Bottom neighbour
      if (i < MineSweeper.grid.length - 1 && MineSweeper.grid[i + 1][j].hasMine) {
        //				console.log(i+' row '+j+' column Bottom neighbour');
        ++count;
      }

      //Bottom left neighbour
      if (i < MineSweeper.grid.length - 1 && j > 0 && MineSweeper.grid[i + 1][j - 1].hasMine) {
        //			console.log(i+' row '+j+' column Bottom Left neighbour');
        ++count;
      }

      //Left neighbour
      if (j > 0 && MineSweeper.grid[i][j - 1].hasMine) {
        //			console.log(i+' row '+j+' column Left neighbour');
        ++count;
      }

      //Top left neighbour
      if (i > 0 && j > 0 && MineSweeper.grid[i - 1][j - 1].hasMine) {
        //			console.log(i+' row '+j+' column Top Left neighbour');
        ++count;
      }

      return count;
    },

    isMineField: function (i, j) {
      //If the position is not valid
      if (i < 0 || j < 0 || i >= MineSweeper.grid.length || j >= MineSweeper.grid[i].length) return 0;

      return MineSweeper.grid[i][j].hasMine;
    },

    countOpenedFileds: function () {
      var count = 0;
      for (var i = 0; i < MineSweeper.grid.length; ++i) {
        for (var j = 0; j < MineSweeper.grid[i].length; ++j) {
          if (MineSweeper.grid[i][j].isOpened()) ++count;
        }
      }
      console.log('opened fields = ' + count);
      return count;
    },

    openField: function (row, col) {
      var neighbourCount = MineSweeper.countNeigbourMines(row, col);

      //msField.opened = true;
      MineSweeper.grid[row][col].opened = true;

      MineSweeper.grid[row][col].getButton().style.backgroundImage =
        "url('https://raw.githubusercontent.com/strahlistvan/minesweeper/devjs/Images/" + neighbourCount + ".png')";
      MineSweeper.grid[row][col].getButton().style.backgroundSize = 'cover';

      //if it's not empty, we don't need to flood fill
      if (neighbourCount > 0) return;

      var queue = [];
      queue.push({ x: row, y: col });

      while (queue.length > 0) {
        var nextFieldCoord = queue.pop();

        var x = nextFieldCoord.x;
        var y = nextFieldCoord.y;

        //left neighbour
        if (x > 0 && !MineSweeper.grid[x - 1][y].opened) {
          MineSweeper.grid[x - 1][y].opened = true;
          neighbourCount = MineSweeper.countNeigbourMines(x - 1, y);

          if (MineSweeper.countNeigbourMines(x - 1, y) === 0) queue.push({ x: x - 1, y: y });
        }
        //right neighbour
        if (x < MineSweeper.grid.length - 1 && !MineSweeper.grid[x + 1][y].opened) {
          MineSweeper.grid[x + 1][y].opened = true;
          neighbourCount = MineSweeper.countNeigbourMines(x + 1, y);

          if (MineSweeper.countNeigbourMines(x + 1, y) === 0) queue.push({ x: x + 1, y: y });
        }
        //top neighbour
        if (y > 0 && !MineSweeper.grid[x][y - 1].opened) {
          MineSweeper.grid[x][y - 1].opened = true;
          neighbourCount = MineSweeper.countNeigbourMines(x, y - 1);

          if (MineSweeper.countNeigbourMines(x, y - 1) === 0) queue.push({ x: x, y: y - 1 });
        }
        //bottom neighbour
        if (y < MineSweeper.grid[x].length - 1 && !MineSweeper.grid[x][y + 1].opened) {
          MineSweeper.grid[x][y + 1].opened = true;
          neighbourCount = MineSweeper.countNeigbourMines(x, y + 1);

          if (MineSweeper.countNeigbourMines(x, y + 1) === 0) queue.push({ x: x, y: y + 1 });
        }
        //top left neighbour
        if (x > 0 && y > 0 && !MineSweeper.grid[x - 1][y - 1].opened) {
          MineSweeper.grid[x - 1][y - 1].opened = true;
          neighbourCount = MineSweeper.countNeigbourMines(x - 1, y - 1);

          if (MineSweeper.countNeigbourMines(x - 1, y - 1) === 0) queue.push({ x: x - 1, y: y - 1 });
        }
        //top right neighbour
        if (x < MineSweeper.grid.length - 1 && y > 0 && !MineSweeper.grid[x + 1][y - 1].opened) {
          MineSweeper.grid[x + 1][y - 1].opened = true;
          neighbourCount = MineSweeper.countNeigbourMines(x + 1, y - 1);

          if (MineSweeper.countNeigbourMines(x + 1, y - 1) === 0) queue.push({ x: x + 1, y: y - 1 });
        }
        //bottom left neighbour
        if (x > 0 && y < MineSweeper.grid[x].length - 1 && !MineSweeper.grid[x - 1][y + 1].opened) {
          MineSweeper.grid[x - 1][y + 1].opened = true;
          neighbourCount = MineSweeper.countNeigbourMines(x - 1, y + 1);

          if (MineSweeper.countNeigbourMines(x - 1, y + 1) === 0) queue.push({ x: x - 1, y: y + 1 });
        }
        //bottom right neighbour
        if (
          x < MineSweeper.grid.length - 1 &&
          y < MineSweeper.grid[x].length - 1 &&
          !MineSweeper.grid[x + 1][y + 1].opened
        ) {
          MineSweeper.grid[x + 1][y + 1].opened = true;
          neighbourCount = MineSweeper.countNeigbourMines(x + 1, y + 1);

          if (MineSweeper.countNeigbourMines(x + 1, y + 1) === 0) queue.push({ x: x + 1, y: y + 1 });
        }

        //	console.log(JSON.stringify(queue));
      }
    },

    openAllFields: function () {
      for (var i = 0; i < MineSweeper.grid.length; ++i) {
        for (var j = 0; j < MineSweeper.grid[i].length; ++j) {
          MineSweeper.grid[i][j].opened = true;
          //	console.log("("+i+", "+j+").is_opened="+MineSweeper.grid[i][j].isOpened());
        }
      }
    },

    getTargetDiv: function () {
      return screen.targetDiv.id;
    },

    hasOpenableField: function () {
      for (var i = 0; i < MineSweeper.grid.length; ++i) {
        for (var j = 0; j < MineSweeper.grid[i].length; ++j) {
          if (!MineSweeper.grid[i][j].opened && !MineSweeper.grid[i][j].hasMine) {
            console.log('(' + i + ',' + j + ')' + 'is openable');
            return true;
          }
        }
      }
      console.log('No more openable field...');
      return false;
    }
  };

  return MineSweeper;
};
