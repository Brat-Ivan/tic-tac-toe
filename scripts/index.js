const startMenu = document.querySelector('.main__start-menu');
const newGameMenu = document.querySelector('.main__new-game-menu');
const firstTurnMenu = document.querySelector('.main__first-turn-menu');

const loadGameBtn = document.querySelector('#load-game-button');
const newGameBtn = document.querySelector('#new-game-button');

const backBtn = document.querySelector('#back-button');
const onePlayerBtn = document.querySelector('#one-player-button');
const twoPlayersBtn = document.querySelector('#two-players-button');
const gameModeBtn = document.querySelector('#game-mode-button');
const okBtn = document.querySelector('#ok-button');
const pickFirstTurnBtnX = document.querySelector('#first-turn-button-x');
const pickFirstTurnBtnO = document.querySelector('#first-turn-button-o');

let gameSettings = (localStorage.getItem('game settings')) ? JSON.parse(localStorage.getItem('game settings')) : {};
let bot;

if (!Object.keys(gameSettings).length) {
  loadGameBtn.classList.add('main__load-game-button--disabled');
  loadGameBtn.disabled = true;
}

loadGameBtn.addEventListener('click', () => window.location.href = './game.html');

newGameBtn.addEventListener('click', () => {
  startMenu.classList.remove('main__start-menu--visible');
  newGameMenu.classList.add('main__new-game-menu--visible');
  backBtn.classList.add('main__back-button--visible');
});

backBtn.addEventListener('click', () => {
  if (newGameMenu.classList.contains('main__new-game-menu--visible')) {
    backBtn.classList.remove('main__back-button--visible');
    newGameMenu.classList.remove('main__new-game-menu--visible');
    startMenu.classList.add('main__start-menu--visible');
  } else {
    firstTurnMenu.classList.remove('main__first-turn-menu--visible');
    newGameMenu.classList.add('main__new-game-menu--visible');
  }
});

function selectNumberOfPlayers() {
  if (this.id === 'one-player-button') {
    onePlayerBtn.classList.add('main__one-player-button--selected');
    twoPlayersBtn.classList.remove('main__two-players-button--selected');
    bot = true;
  } else {
    twoPlayersBtn.classList.add('main__two-players-button--selected');
    onePlayerBtn.classList.remove('main__one-player-button--selected');
    bot = false;
  }
  
  okBtn.classList.remove('main__ok-button--disabled');
  okBtn.disabled = false;
}

gameModeBtn.addEventListener('click', () => {
  gameModeBtn.textContent = (gameModeBtn.textContent === 'Normal') ? 'Fast' : 'Normal';
});

okBtn.addEventListener('click', () => {
  newGameMenu.classList.remove('main__new-game-menu--visible');
  firstTurnMenu.classList.add('main__first-turn-menu--visible');
  menu = 'First turn';
});

onePlayerBtn.addEventListener('click', selectNumberOfPlayers);
twoPlayersBtn.addEventListener('click', selectNumberOfPlayers);

function pickFirstTurn() {
  let firstTurn;

  if (this.id === 'first-turn-button-x') {
    firstTurn = 'X';
  } else {
    firstTurn = 'O';
  }

  gameSettings = {
    bot: bot,
    gameMode: gameModeBtn.textContent,
    firstTurn: firstTurn,
  };

  localStorage.setItem('game settings', JSON.stringify(gameSettings));
  window.location.href = './game.html';
}

pickFirstTurnBtnX.addEventListener('click', pickFirstTurn);
pickFirstTurnBtnO.addEventListener('click', pickFirstTurn);
