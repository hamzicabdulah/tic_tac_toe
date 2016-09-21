var app = angular.module('ticTacToe', []);
app.controller('ticTacToeCtrl', function ($scope) {

  'use strict';

  var difficulty = 'hard', indexOfFill, indexOfHor, indexOfBackslash, indexOfVer, indexOfSlash, gameOver = false, turnOver = false, playerChoice = 'X', computerChoice = 'O', turn = playerChoice, randomNum;
  $scope.mode = 'single', $scope.changesMade = false, $scope.playAgainId = '', $scope.winner = '', $scope.startGameId = '';

  var modesArray = document.getElementsByClassName('selectMode'), diffsArray = document.getElementsByClassName('selectDiff'), sidesArray = document.getElementsByClassName('selectSide');
  var decrOpacityDiv = document.getElementsByClassName('decrOpac')[0];

  //Open settings modal
  $scope.goToSettings = function () {
    $scope.startGameId = '';
    decrOpacityDiv.style.visibility = 'visible';
  }

  //Exit settings modal
  $scope.exitSettings = function () {
    $scope.startGameId = 'invisibleSett';
    $scope.changesMade = false;
    setTimeout(function () {
      $scope.$apply(function () {
        decrOpacityDiv.style.visibility = 'hidden';
      });
    }, 400);
  }

  //Create select buttons for settings modal
  function resetColor (arrayName) {
    for (var i = 0; i < arrayName.length; i++) {
      arrayName[i].style.backgroundColor = 'rgb(202,180,144)';
      arrayName[i].style.color = '#4d0026';
    }
  }

  $scope.selectMode = function (modeName) {
    resetColor(modesArray);
    document.getElementsByClassName(modeName)[0].style.backgroundColor = '#ac8b53';
    document.getElementsByClassName(modeName)[0].style.color = '#660033';
    $scope.mode = modeName;
    $scope.changesMade = true;
    if ($scope.mode === 'multi') {
      document.getElementsByClassName('resumeNewBtns')[0].style.marginTop = window.innerWidth <= 768 ? '12.1em' : '9.5em';
    } else {
      document.getElementsByClassName('resumeNewBtns')[0].style.marginTop = '2.5em';
    }
  };

  $scope.selectDiff = function (diffName) {
    resetColor(diffsArray);
    document.getElementsByClassName(diffName)[0].style.backgroundColor = '#ac8b53';
    document.getElementsByClassName(diffName)[0].style.color = '#660033';
    difficulty = diffName;
    $scope.changesMade = true;
  };

  $scope.selectSide = function (sideName) {
    resetColor(sidesArray);
    document.getElementsByClassName(sideName)[0].style.backgroundColor = '#ac8b53';
    document.getElementsByClassName(sideName)[0].style.color = '#660033';
    playerChoice = sideName.toUpperCase();
    computerChoice = sideName === 'x' ? 'O' : 'X';
    $scope.changesMade = true;
  };

  $scope.selectDiff('hard'), $scope.selectSide('x'), $scope.selectMode('single');

  //Create the table rows and areas
  var createArea = function (className) {
    this.class = 'area ' + className;
    this.value = ' ';
    this.horizontal = ' ';
    this.vertical = ' ';
    this.slash = ' ';
    this.backslash = ' ';
  };

  var areasClasses = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'], areasArray = [], areaValuesArray = [];
  function getAreasValues () {
    areaValuesArray = areasArray.map(function (area) {
      return area.value;
    });
  }

  for (var i = 0; i < areasClasses.length; i++) {
    areasArray[i] = new createArea(areasClasses[i]);
  }

  $scope.rows = [
    {
      class: 'first row',
      areas: [areasArray[0], areasArray[1], areasArray[2]]
    },
    {
      class: 'second row',
      areas: [areasArray[3], areasArray[4], areasArray[5]]
    },
    {
      class: 'third row',
      areas: [areasArray[6], areasArray[7], areasArray[8]]
    }
  ];

  //Create an array of objects — array of all the horizontal win combinations
  var horizontalCombo = function (index) {
    this.left = $scope.rows[index].areas[0];
    this.center = $scope.rows[index].areas[1];
    this.right = $scope.rows[index].areas[2];
  };

  var horizontal1 = new horizontalCombo(0), horizontal2 = new horizontalCombo(1), horizontal3 = new horizontalCombo(2), horWinCombos = [horizontal1, horizontal2, horizontal3];

  //Create an array of objects — array of all the vertical win combinations
  var verticalCombo = function (index) {
    this.upper = $scope.rows[0].areas[index];
    this.middle = $scope.rows[1].areas[index];
    this.lower = $scope.rows[2].areas[index];
  };

  var vertical1 = new verticalCombo(0), vertical2 = new verticalCombo(1), vertical3 = new verticalCombo(2), verWinCombos = [vertical1, vertical2, vertical3];

  //Create an array of other win combinations
  var backslashWinCombos = [$scope.rows[0].areas[0], $scope.rows[1].areas[1], $scope.rows[2].areas[2]], slashWinCombos = [$scope.rows[0].areas[2], $scope.rows[1].areas[1], $scope.rows[2].areas[0]], otherWinCombos = [backslashWinCombos, slashWinCombos];

  //If nos smarter moves, AI moves randomly
  function randomAIMove () {
    randomNum = Math.floor(Math.random() * 9);
    if (areasArray[randomNum].value === ' ') {
      areasArray[randomNum].value = computerChoice;
      areasArray[randomNum].class += ' area-filled';
      turn = playerChoice;
    } else {
      randomAIMove();
    }
  }

  //Check if AI can win or stop the player's win
  function AIMove (row, area) {
    row[area].value = computerChoice;
    row[area].class += ' area-filled';
    turn = playerChoice;
    twoMovesDone = true;
  }

  function winStopWinMove (value) {

    horWinCombos.forEach(function (combo) {
      if (turn === computerChoice && combo.right.value === ' ' && combo.left.value === value && combo.left.value === combo.center.value) AIMove(combo, 'right');
      if (turn === computerChoice && combo.center.value === ' ' && combo.left.value === value && combo.left.value === combo.right.value) AIMove(combo, 'center');
      if (turn === computerChoice && combo.left.value === ' ' && combo.right.value === value && combo.right.value === combo.center.value) AIMove(combo, 'left');
    });

    if (turn === computerChoice) {
      verWinCombos.forEach(function (combo) {
        if (turn === computerChoice && combo.lower.value === ' ' && combo.upper.value === value && combo.upper.value === combo.middle.value) AIMove(combo, 'lower');
        if (turn === computerChoice && combo.middle.value === ' ' && combo.upper.value === value && combo.upper.value === combo.lower.value) AIMove(combo, 'middle');
        if (turn === computerChoice && combo.upper.value === ' ' && combo.lower.value === value && combo.lower.value === combo.middle.value) AIMove(combo, 'upper');
      });
    }

    if (turn === computerChoice) {
      otherWinCombos.forEach(function (combo) {
        if (turn === computerChoice && combo[0].value === ' ' && combo[2].value === value && combo[2].value === combo[1].value) AIMove(combo, 0);
        if (turn === computerChoice && combo[1].value === ' ' && combo[2].value === value && combo[2].value === combo[0].value) AIMove(combo, 1);
        if (turn === computerChoice && combo[2].value === ' ' && combo[0].value === value && combo[0].value === combo[1].value) AIMove(combo, 2);
      });
    }

    if (turn === computerChoice && areasArray[4].value === ' ') {
      areasArray[4].value = computerChoice;
      areasArray[4].class += ' area-filled';
      turn = playerChoice;
      twoMovesDone = true;
    }
  }

  var cornerAreas = [areasArray[0], areasArray[2], areasArray[6], areasArray[8]], sideAreas = [areasArray[1], areasArray[3], areasArray[5], areasArray[7]];
  var twoMovesDone = false, oneMoveDone = false;

  function randomCornerChoice () {
    randomNum = Math.floor(Math.random() * 4);
    if (cornerAreas[randomNum].value === ' ') {
      cornerAreas[randomNum].value = computerChoice;
      cornerAreas[randomNum].class += ' area-filled';
      turn = playerChoice;
      oneMoveDone = true;
    } else {
      randomCornerChoice();
    }
  }

  //Check to see all possible losing scenarios and prevent them
  function checkChanceToLose () {

    if (turn === computerChoice) {
      getAreasValues();
      cornerAreas.forEach(function (corner) {
        if (turn === computerChoice && corner.value === playerChoice && areaValuesArray.indexOf(computerChoice) < 0) {
          areasArray[4].value = computerChoice;
          areasArray[4].class += ' area-filled';
          turn = playerChoice;
        }
      });
      areaValuesArray = [];
    }

    if (turn === computerChoice) {
      if (!twoMovesDone && areasArray[0].value === playerChoice && areasArray[0].value === areasArray[8].value && areasArray[4].value === computerChoice || !twoMovesDone && areasArray[2].value === playerChoice && areasArray[2].value === areasArray[6].value && areasArray[4].value === computerChoice) {
        randomNum = Math.floor(Math.random() * 4);
        AIMove(sideAreas, randomNum);
      }
    }

    if (turn === computerChoice) {
      var objectVariants = {
        0: [areasArray[2].value, areasArray[3].value],
        2: [areasArray[0].value, areasArray[5].value],
        6: [areasArray[8].value, areasArray[3].value],
        8: [areasArray[6].value, areasArray[5].value]
      };
      for (var key in objectVariants) {
        if (turn === computerChoice && !twoMovesDone && objectVariants[key][0] === playerChoice && objectVariants[key][1] === playerChoice && areasArray[4].value === computerChoice) {
          AIMove(areasArray, key);
        }
      }
    }

    if (turn === computerChoice) {
      getAreasValues();
      if (areasArray[4].value === playerChoice && areaValuesArray.indexOf(computerChoice) < 0 && !oneMoveDone) {
        randomCornerChoice();
      }
      areaValuesArray = [];
    }

    if (turn === computerChoice) {
      if (!twoMovesDone && areasArray[0].value !== ' ' && areasArray[8].value !== ' ' && areasArray[4].value === playerChoice || !twoMovesDone && areasArray[2].value !== ' ' && areasArray[6].value !== ' ' && areasArray[4].value === playerChoice) {
        randomCornerChoice();
        twoMovesDone = true;
      }
    }

    if (turn === computerChoice) {
      getAreasValues();
      if (areaValuesArray.indexOf(computerChoice) < 0) {
        if (sideAreas[0].value === playerChoice || sideAreas[1].value === playerChoice) {
          AIMove(cornerAreas, 0);
          twoMovesDone = false;
          oneMoveDone = true;
        } else if (sideAreas[2].value === playerChoice || sideAreas[3].value === playerChoice) {
          AIMove(cornerAreas, 3);
          twoMovesDone = false;
          oneMoveDone = true;
        }
      }
      areaValuesArray = [];
    }

  }

  //Computer moves depending on difficulty and player moves
  function AIPlay () {
    if (!gameOver && turn === computerChoice) {
      if (difficulty === 'easy') {
        randomAIMove();
      } else if (difficulty === 'medium') {
        winStopWinMove(computerChoice);
        if (turn === computerChoice) winStopWinMove(playerChoice);
        if (turn === computerChoice) randomAIMove();
      } else if (difficulty === 'hard') {
        checkChanceToLose();
        if (turn === computerChoice) winStopWinMove(computerChoice);
        if (turn === computerChoice) winStopWinMove(playerChoice);
        if (turn === computerChoice) randomAIMove();
      }

      checkWin();
      checkDraw();
      turn = playerChoice;
    }
  }

  //Fill the area only if the game is not over and the area has not been filled in earlier in the current game
  $scope.fill = function (className) {
    if (!gameOver && !turnOver) {
      if ($scope.mode === 'multi') {
        $scope.rows.forEach(function (row) {
          row.areas.forEach(function (area) {
            if (area.class.indexOf(className) >= 0 && area.value === ' ') {
              if (turn === playerChoice) {
                area.value = playerChoice;
                turn = computerChoice;
              } else {
                area.value = computerChoice;
                turn = playerChoice;
              }
              area.class += ' area-filled';
            }
          });
        });
        checkWin();
        checkDraw();
      } else {
        $scope.rows.forEach(function (row) {
          row.areas.forEach(function (area) {
            if (area.class.indexOf(className) >= 0 && area.value === ' ') {
              area.value = playerChoice;
              area.class += ' area-filled';
              turn = computerChoice;
            }
          });
        });
        checkWin();
        checkDraw();
        turnOver = true;
        setTimeout(function () {
          $scope.$apply(function () {
            AIPlay();
            turnOver = false;
          });
        }, 700);
      }
    }
  };

  //Check if any of the win combinations are true (end the game and ask to play again if it is)
  function checkWin () {

    function whoWon (areaValue) {
      $scope.winner = areaValue + ' wins the game!';
    }

    function gameOverFunc (areaValue) {
      whoWon(areaValue);
      setTimeout(function () {
        $scope.$apply(function () {
          $scope.playAgainId = 'playAgainVisible';
          decrOpacityDiv.style.visibility = 'visible';
        });
      }, 700);
    }

    horWinCombos.forEach(function (combo) {
      if (combo.left.value !== ' ' && combo.left.value === combo.center.value && combo.center.value === combo.right.value) {
        gameOver = true;
        setTimeout(function () {
          $scope.$apply(function () {
            for (var key in combo) {
              combo[key].horizontal = "—";
              combo[key].class += " area-hor-won";
            }
            gameOverFunc(combo.left.value);
          });
        }, 500);
      }
    });

    verWinCombos.forEach(function (combo) {
      if (combo.upper.value !== ' ' && combo.upper.value === combo.middle.value && combo.middle.value === combo.lower.value) {
        gameOver = true;
        setTimeout(function () {
          $scope.$apply(function () {
            for (var key in combo) {
              combo[key].vertical = "|";
              combo[key].class += " area-ver-won";
            }
            gameOverFunc(combo.upper.value);
          });
        }, 500);
      }
    });

    if (backslashWinCombos[0].value !== ' ' && backslashWinCombos[0].value === backslashWinCombos[1].value && backslashWinCombos[1].value === backslashWinCombos[2].value) {
      gameOver = true;
      setTimeout(function () {
        $scope.$apply(function () {
          for (var i = 0; i <= 2; i++) {
            backslashWinCombos[i].backslash = '|';
            backslashWinCombos[i].class += ' area-backslash-won';
          }
          gameOverFunc(backslashWinCombos[0].value);
        });
      }, 500);
    } else if (slashWinCombos[0].value !== ' ' && slashWinCombos[0].value === slashWinCombos[1].value && slashWinCombos[1].value === slashWinCombos[2].value) {
        gameOver = true;
        setTimeout(function () {
          $scope.$apply(function () {
            for (var i = 0; i <= 2; i++) {
              slashWinCombos[i].slash = '|';
              slashWinCombos[i].class += ' area-slash-won';
            }
            gameOverFunc(slashWinCombos[0].value);
          });
        }, 500);
    }

  }

  //Check if the game's a draw (end the game and ask to play again if it is)
  function checkDraw () {
    getAreasValues();

    if (areaValuesArray.indexOf(' ') < 0 && !gameOver) {
      $scope.winner = "It's a draw!";
      gameOver = true;
      setTimeout(function () {
        $scope.$apply(function () {
          $scope.playAgainId = 'playAgainVisible';
          decrOpacityDiv.style.visibility = 'visible';
        });
      }, 500);
    }

    areaValuesArray = [];
  }

  //Reset the game, reset all variables to initials values
  $scope.reset = function () {
    $scope.rows.forEach(function (row) {
      row.areas.forEach(function (area) {
        area.value = ' ';
        if (area.class.indexOf(' area-filled') > 0) {
          indexOfFill = area.class.indexOf(' area-filled');
          area.class = area.class.slice(0, indexOfFill);
        }
        area.horizontal = ' ', area.vertical = ' ', area.backslash = ' ', area.slash = ' ';
        if (area.class.indexOf(' area-hor-won') > 0) {
          indexOfHor = area.class.indexOf(' area-hor-won');
          area.class = area.class.slice(0, indexOfHor);
        } else if (area.class.indexOf(' area-ver-won') > 0) {
          indexOfVer = area.class.indexOf(' area-ver-won');
          area.class = area.class.slice(0, indexOfVer);
        } else if (area.class.indexOf(' area-backslash-won') > 0) {
          indexOfBackslash = area.class.indexOf(' area-backslash-won');
          area.class = area.class.slice(0, indexOfBackslash);
        } else if (area.class.indexOf(' area-slash-won') > 0) {
          indexOfSlash = area.class.indexOf(' area-slash-won');
          area.class = area.class.slice(0, indexOfSlash);
        }
      });
      turn = playerChoice, twoMovesDone = false, oneMoveDone = false;
    });

    gameOver = false, turnOver = false;
    $scope.exitSettings();
    $scope.playAgainId = '';
  };

  $scope.restart = function () {
    if (!gameOver && !turnOver) $scope.reset();
  };

});
