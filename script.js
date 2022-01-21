const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
//další části hada
class SnakePart {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

let speed = 7;
//herní pole
let tileCount = 20;
let tileSize = canvas.width / tileCount - 2;
//basic pozice hlavy + další části
let hlavaX = 10;
let hlavaY = 10;
const snakeBlocks = [];
let tailLength = 2;
//basic pozice jablka
let appleX = 5;
let appleY = 5;
//vstup z kláves
let keysXVelocity = 0;
let keysYVelocity = 0;
//pohyb hada
let xVelocity = 0;
let yVelocity = 0;
//celkové skóre
let score = 0;


//loop hry
function drawGame() {
  xVelocity = keysXVelocity;
  yVelocity = keysYVelocity;
//konec hry
  changeSnakePosition();
  let result = isGameOver();
  if (result) {
    return;
  }

  clearScreen();

  checkAppleCollision();
  drawApple();
  drawSnake();

  drawScore();
  //zvyšování obtížnosti
  if (score > 6) {
    speed = 9;
  }
  if (score > 10) {
    speed = 11;
  }

  setTimeout(drawGame, 1000 / speed);
}

function isGameOver() {
  let gameOver = false;
  //aby hra neskončila hned
  if (yVelocity === 0 && xVelocity === 0) {
    return false;
  }

  //kolize stěn
  if (hlavaX < 0) {
    gameOver = true;
  } else if (hlavaX === tileCount) {
    gameOver = true;
  } else if (hlavaY < 0) {
    gameOver = true;
  } else if (hlavaY === tileCount) {
    gameOver = true;
  }
  //srážka s ocasem
  for (let i = 0; i < snakeBlocks.length; i++) {
    let part = snakeBlocks[i];
    if (part.x === hlavaX && part.y === hlavaY) {
      gameOver = true;
      break;
    }
  }
  //oznámení konce hry
  if (gameOver) {
    ctx.fillStyle = "white";
    ctx.font = "50px Verdana";

    ctx.fillText("Game Over!", canvas.width / 6.5, canvas.height / 2);
  }

  return gameOver;
}
//výpis skóre
function drawScore() {
  ctx.fillStyle = "white";
  ctx.font = "10px Verdana";
  ctx.fillText("Score " + score, canvas.width - 398, 10);
}
//reset
function clearScreen() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}
//přidání další části hada
function drawSnake() {
  ctx.fillStyle = "white";
  for (let i = 0; i < snakeBlocks.length; i++) {
    let part = snakeBlocks[i];
    ctx.fillRect(part.x * tileCount, part.y * tileCount, tileSize, tileSize);
  }
  //pohyb dalších částí hada
  snakeBlocks.push(new SnakePart(hlavaX, hlavaY));
  while (snakeBlocks.length > tailLength) {
    snakeBlocks.shift();
  }

  ctx.fillStyle = "grey";
  ctx.fillRect(hlavaX * tileCount, hlavaY * tileCount, tileSize, tileSize);
}
//pohyb hada
function changeSnakePosition() {
  hlavaX = hlavaX + xVelocity;
  hlavaY = hlavaY + yVelocity;
}

function drawApple() {
  ctx.fillStyle = "red";
  ctx.fillRect(appleX * tileCount, appleY * tileCount, tileSize, tileSize);
}
//kolize, snězení jablka a zaroveň i jeho nové vykreslení
function checkAppleCollision() {
  if (appleX === hlavaX && appleY == hlavaY) {
    appleX = Math.floor(Math.random() * tileCount);
    appleY = Math.floor(Math.random() * tileCount);
    tailLength++;
    score++;
  }
}

document.body.addEventListener("keydown", keyDown);
//vstupy na pohyb hada, šipky
function keyDown(event) {
  if (event.keyCode == 38) {
    if (keysYVelocity == 1) return;
    keysYVelocity = -1;
    keysXVelocity = 0;
  }

  if (event.keyCode == 40) {
    if (keysYVelocity == -1) return;
    keysYVelocity = 1;
    keysXVelocity = 0;
  }

  if (event.keyCode == 37) {
    if (keysXVelocity == 1) return;
    keysYVelocity = 0;
    keysXVelocity = -1;
  }

  if (event.keyCode == 39) {
    if (keysXVelocity == -1) return;
    keysYVelocity = 0;
    keysXVelocity = 1;
  }
}
//vyvolání hry
drawGame();
