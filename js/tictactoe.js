let tiles = document.querySelectorAll(".box");
const player_x = "X";
const player_o = "O";
let turn = player_x;

let boardState = Array(tiles.length);
boardState.fill(null);


const strike = document.getElementById("strike");
const gameOverArea = document.getElementById("game-over-area");
const gameOverText = document.getElementById("game-over-text");
const playAgain = document.getElementById("restart");
const boardHistory = document.querySelector(".board-history");

playAgain.addEventListener("click", startNewGame);
tiles.forEach((box) => box.addEventListener("click", tileClick));

function hoverText() {
  //remove all hover text
  tiles.forEach((box) => {
    box.classList.remove("x-hover");
    box.classList.remove("o-hover");
  });

  const hoverClass = `${turn.toLowerCase()}-hover`;

  tiles.forEach((box) => {
    if (box.innerText == "") {
      box.classList.add(hoverClass);
    }
  });
}

hoverText();

function tileClick(event) {
  if (gameOverArea.classList.contains("visible")) {
    return;
  }

  const box = event.target;
  const tileNumber = box.dataset.index;
  if (box.innerText != "") {
    return;
  }

  if (turn === player_x) {
    box.innerText = player_x;
    boardState[tileNumber] = player_x;
    document.querySelector(".player-turn").innerText = "Player O";
    turn = player_o;
  } else {
    box.innerText = player_o;
    boardState[tileNumber] = player_o;
    document.querySelector(".player-turn").innerText = "Player X";
    turn = player_x;
  }

  historyCounter();
  addHistory();
  hoverText();
  checkWinner();
}

//Board state save
function addHistory() {
  const boardHistory = JSON.parse(JSON.stringify(boardState)); //Had to use this for pushing an array on an array; This is example of deep clone
  boardHistorySolid.push(boardHistory);
  console.log(boardHistorySolid);
}

let boardHistorySolid = [];

//History Counter
let historyCount = -1;

function historyCounter() {
  historyCount++;
}

//Boardstate backtracking
function record() {
  for (i = 1; i <= boardHistorySolid.length; i++) {
    const addBoardStateNumbers = document.createElement("button");
    addBoardStateNumbers.classList.add("board-state-numbers");
    addBoardStateNumbers.innerHTML = i;
    boardHistory.appendChild(addBoardStateNumbers);
  }
  return addBoardStateNumbers;
}

const buttonLeft = document.querySelector(".left");
const buttonRight = document.querySelector(".right");

buttonLeft.addEventListener('click', toLeft);
buttonRight.addEventListener('click', toRight);


function toLeft() {
  if (historyCount > 0){
    console.log(`History before: ${historyCount}`);
    historyCount -= 1;
    const currentView = boardHistorySolid[historyCount];
    console.log(`History after: ${historyCount}`);
    for (i = 0; i <= currentView.length; i++) {
      tiles[i].innerHTML = currentView[i] || "";
    }
    highlight();
  } else {
    return;
  }
}

function toRight() {
  if (historyCount < boardHistorySolid.length - 1) {
    console.log(`History before: ${historyCount}`);
    historyCount += 1;
    const currentView = boardHistorySolid[historyCount];
    console.log(`History after: ${historyCount}`);
    for (i = 0; i <= currentView.length; i++) {
      tiles[i].innerHTML = currentView[i] || "";
    }
  }
  highlight();
}



function checkWinner() {
  //Check for a winner
  for (const winningCombination of winningCombinations) {
    const { combi, strikeClass } = winningCombination;
    const tileValue1 = boardState[combi[0]];
    const tileValue2 = boardState[combi[1]];
    const tileValue3 = boardState[combi[2]];

    if (
      tileValue1 != null &&
      tileValue1 === tileValue2 &&
      tileValue1 === tileValue3
    ) {
      strike.classList.add(strikeClass);
      gameOverScreen(tileValue1);
      return;
    }
  }

  //Check for a draw
  const allTileFilledIn = boardState.every((box) => box !== null);
  if (allTileFilledIn) {
    gameOverScreen(null);
  }
}

function gameOverScreen(winnerText) {
  let text = "Draw!";
  if (winnerText != null) {
    text = `Winner is ${winnerText}!`;
  }
  gameOverArea.className = "visible";
  gameOverText.innerText = text;
  record();
}

function startNewGame() {
  strike.className = "strike";
  gameOverArea.className = "hidden";
  boardState.fill(null);
  tiles.forEach((box) => (box.innerText = ""));
  turn = player_x;
  historyCount = -1;
  boardHistorySolid = [];
  hoverText();
  removeNumbers();
}

function removeNumbers() {
  while (boardHistory.hasChildNodes()) {
    boardHistory.removeChild(boardHistory.firstChild);
  }
}

const winningCombinations = [
  //rows
  { combi: [0, 1, 2], strikeClass: "strike-row-1" },
  { combi: [3, 4, 5], strikeClass: "strike-row-2" },
  { combi: [6, 7, 8], strikeClass: "strike-row-3" },
  //columns
  { combi: [0, 3, 6], strikeClass: "strike-column-1" },
  { combi: [1, 4, 7], strikeClass: "strike-column-2" },
  { combi: [2, 5, 8], strikeClass: "strike-column-3" },
  //diagonals
  { combi: [0, 4, 8], strikeClass: "strike-diagonal-1" },
  { combi: [2, 4, 6], strikeClass: "strike-diagonal-2" },
];


// Add-ons (Remove if hindrance)

// Number becomes clickable
const numberClick = document.querySelectorAll(".board-state-numbers");

numberClick.addEventListener('click', numClick);

function numClick() {
  const text = numberClick.innerText; 
  console.log(text);
};

//Number highlights
function highlight() {
  addBoardStateNumbers.classList.remove("show");
  const show = historyCount + 1;
  addBoardStateNumbers[show].classList.add("show");
}