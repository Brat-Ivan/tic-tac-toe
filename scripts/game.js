import { COMBINATIONS } from "./constants.js";

const playingField = document.querySelector('.playing-field');
const cells = document.querySelectorAll('.playing-field__cell');
const time = document.querySelector('.main__timer-time');
const turnText = document.querySelector('.main__turn-text');
const menuBtn = document.querySelector('#menu-button');
const playAgainBtn = document.querySelector('#play-again-button');

const statWinsX = document.querySelector('#stat-wins-x');
const statDraws = document.querySelector('#stat-draws');
const statWinsO = document.querySelector('#stat-wins-o');
const statGames = document.querySelector('#stat-games');

const gameSettings = JSON.parse(localStorage.getItem('game settings'));
const bot = gameSettings.bot;
const initialSeconds = (gameSettings.gameMode === 'Normal') ? 5 : 3;
let firstTurn = gameSettings.firstTurn;

let winsX = (gameSettings?.winsX) ? gameSettings.winsX : 0;
let draws = (gameSettings?.draws) ? gameSettings.draws : 0;
let winsO = (gameSettings?.winsO) ? gameSettings.winsO : 0;
let games = (gameSettings?.games) ? gameSettings.games : 0;

statWinsX.textContent = winsX;
statDraws.textContent = draws;
statWinsO.textContent = winsO;
statGames.textContent = games;

function play(cells) {
  const cellsArr = new Array(9).fill('');

  let count = 0;
  let timer;
  let gameOver = false;

  const turn = games % 2;

  time.textContent = `0:0${initialSeconds}`;
  turnText.textContent = (turn === 0) ? 'Player 1’s Turn' : 'Player 2’s Turn';
  
  function updateStats(remainder) {
    if (
      firstTurn === 'X' && !remainder ||
      firstTurn === 'O' && remainder
    ) {
      statWinsO.textContent = ++winsO;
    } else {
      statWinsX.textContent = ++winsX;
    }

    statGames.textContent = ++games;
  }

  function startTimer() {
    let seconds = initialSeconds;
    timer = setInterval(() => {
      seconds--;
      time.textContent = `0:0${seconds}`;
  
      if (seconds === 0) {
        clearInterval(timer);
        gameOver = true;
        turnText.classList.add('main__turn-text--size--small');

        const remainder = count % 2;

        turnText.textContent = (remainder === turn) ? 'Player 1’s time is over' : 'Player 2’s time is over';
        updateStats(remainder);
        firstTurn = (firstTurn === 'X') ? 'O' : 'X';
        playAgainBtn.classList.add('main__play-again-button--visible');
      }
    }, 1000);
  }

  function makeBotMove() {
    let botMoveArr = [];

    cellsArr.forEach((cell, index) => {
      if (!cell) {
        botMoveArr.push(index);
      }
    });
    
    function getRandomNumber(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    const botMove = botMoveArr[getRandomNumber(0, botMoveArr.length - 1)];
    
    setTimeout(() => {
      playingField.addEventListener('click', makeMove);
      cells[botMove].click();
      playingField.addEventListener('click', makeMove);
    }, 500);
  }

  function makeMove(e) {
    if (
      e.target.classList.contains('playing-field__cell--sign--x') ||
      e.target.classList.contains('playing-field__cell--sign--o') ||
      e.target.classList.contains('playing-field')
    ) {
      return;
    }

    const parentNode = e.target.closest('.playing-field__cell');
    const remainder = count % 2;
    
    if (timer) {
      clearInterval(timer);
    }
    
    if (!gameOver) {
      const cellIndex = Array.from(cells).indexOf(e.target);

      turnText.textContent = (remainder === turn) ? 'Player 2’s Turn' : 'Player 1’s Turn';

      if (
        firstTurn === 'X' && !remainder ||
        firstTurn === 'O' && remainder
      ) {
        parentNode.classList.add('playing-field__cell--sign--x');
        cellsArr[cellIndex] = 'X';
      } else {
        parentNode.classList.add('playing-field__cell--sign--o');
        cellsArr[cellIndex] = 'O';
      }
      
      playingField.removeEventListener('click', makeMove);

      function isWin(arr) {
        COMBINATIONS.forEach(combArr => {
          if (
            count > 3 &&
            arr[combArr[0]] === arr[combArr[1]] &&
            arr[combArr[1]] === arr[combArr[2]] &&
            arr[combArr[0]]
          ) {
            cells[combArr[0]].classList.add('playing-field__cell--is-win');
            cells[combArr[1]].classList.add('playing-field__cell--is-win');
            cells[combArr[2]].classList.add('playing-field__cell--is-win');
            gameOver = true;
            turnText.textContent = (remainder === turn) ? 'Player 1 wins!' : 'Player 2 wins!';
            turnText.classList.add('main__turn-text--is-win');
            updateStats(!remainder);
          }
        });
      }

      isWin(cellsArr);
      count++;
      
      if (count === 9 && !gameOver) {
        gameOver = true;
        turnText.textContent = 'Draw!';
        statDraws.textContent = ++draws;
        statGames.textContent = ++games;
      }

      if (!gameOver) {
        time.textContent = `0:0${initialSeconds}`;
        startTimer();
      } else {
        firstTurn = (firstTurn === 'X') ? 'O' : 'X';
        playAgainBtn.classList.add('main__play-again-button--visible');
      }

      if (
        bot && !gameOver &&
        (
          !remainder && firstTurn === 'X' ||
          remainder && firstTurn === 'O'
        )
      ) {
        makeBotMove();
      } else {
        playingField.addEventListener('click', makeMove);
      }
    }
  }

  if (bot && !gameOver && count % 2 === 0 && firstTurn === 'O') {
    makeBotMove();
  } else {
    playingField.addEventListener('click', makeMove);
  }
}

play(cells);

function saveToLocalStorage() {
  gameSettings.firstTurn = firstTurn;
  gameSettings.winsX = winsX;
  gameSettings.draws = draws;
  gameSettings.winsO = winsO;
  gameSettings.games = games;

  localStorage.setItem('game settings', JSON.stringify(gameSettings));
}

menuBtn.addEventListener('click', () => {
  saveToLocalStorage();
  window.location.href = './index.html';
});

function playAgain() {
  cells.forEach(cell => {
    if (turnText.classList.contains('main__turn-text--is-win')) {
      turnText.classList.remove('main__turn-text--is-win');
    }

    if (turnText.classList.contains('main__turn-text--size--small')) {
      turnText.classList.remove('main__turn-text--size--small');
    }

    if (cell.classList.contains('playing-field__cell--sign--x')) {
      cell.classList.remove('playing-field__cell--sign--x');
    } else if (cell.classList.contains('playing-field__cell--sign--o')) {
      cell.classList.remove('playing-field__cell--sign--o');
    }
    
    if (cell.classList.contains('playing-field__cell--is-win')) {
      cell.classList.remove('playing-field__cell--is-win');
    }
  });

  playAgainBtn.classList.remove('main__play-again-button--visible');
  play(cells);
}

playAgainBtn.addEventListener('click', playAgain);

window.onbeforeunload = () => saveToLocalStorage();
