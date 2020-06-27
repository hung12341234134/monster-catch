// Duy Hung's game 
let canvas;
let ctx;

canvas = document.createElement("canvas");
ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 480;
document.body.appendChild(canvas);

let bgReady, heroReady, monsterReady, speedPotionReady;
let bgImage, heroImage, monsterImage, speedPotionImage;

let startTime = Date.now();
const SECONDS_PER_ROUND = 30;
let elapsedTime = 0;
let point = 0
let shouldShowSpeedPotion=true

function loadImages() {
  bgImage = new Image();
  bgImage.onload = function () {
    bgReady = true;
  };
  bgImage.src = "images/background.png";

  heroImage = new Image();
  heroImage.onload = function () {
    heroReady = true;
  };
  heroImage.src = "images/hero.png";

  monsterImage = new Image();
  monsterImage.onload = function () {
    monsterReady = true;
  };
  monsterImage.src = "images/monster.png";

  speedPotionImage = new Image();
  speedPotionImage.onload = function () {
    speedPotionReady = true;
  };
  speedPotionImage.src = "images/speedpotion.png";
}
function randomX(){
 return Math.floor(Math.random() * canvas.width)
}
function randomY(){
 return Math.floor(Math.random() * canvas.height)
}

let heroX = canvas.width / 2;
let heroY = canvas.height / 2;
let heroSpeed = 5

let monsterX = randomX();
let monsterY = randomY()

let speedPotionX =  randomX();
let speedPotionY = randomY()

let keysDown = {};
function setupKeyboardListeners() {

  addEventListener("keydown", function (key) {
    keysDown[key.keyCode] = true;
  }, false);

  addEventListener("keyup", function (key) {
    delete keysDown[key.keyCode];
  }, false);
}

function control() {
  if (38 in keysDown) {
    heroY -= heroSpeed;
  }
  if (40 in keysDown) {
    heroY += heroSpeed;
  }
  if (37 in keysDown) {
    heroX -= heroSpeed;
  }
  if (39 in keysDown) {
    heroX += heroSpeed;
  }
}

function wrapAround() {
  if (heroX <= 0) {
    heroX = 490
  }
  if (heroX >= 500) {
    heroX = 1
  }
  if (heroY <= 0) {
    heroY = 469
  }
  if (heroY >= 470) {
    heroY = 1
  }
}

function pointSystem() {
  const heroCaughtSpeedPotion =
    heroX <= (speedPotionX + 32)
    && speedPotionX <= (heroX + 32)
    && heroY <= (speedPotionY + 32)
    && speedPotionY <= (heroY + 32)
  if (heroCaughtSpeedPotion) {
    shouldShowSpeedPotion=false
    heroSpeed = 10
    setTimeout(function(){
      speedPotionX = randomX()
      speedPotionY =randomY()
      shouldShowSpeedPotion=true
      heroSpeed = 5
    },10000)
    
  }

  const heroCaughtMonster =
    heroX <= (monsterX + 32)
    && monsterX <= (heroX + 32)
    && heroY <= (monsterY + 32)
    && monsterY <= (heroY + 32)
  if (heroCaughtMonster) {
    point++
    document.getElementById(`point`).innerHTML = "point:" + point

    monsterX = randomX()
    monsterY =randomY()

  }
}

let update = function () {
  elapsedTime = Math.floor((Date.now() - startTime) / 1000);
  if (elapsedTime > 30) return
  control()
  wrapAround()
  pointSystem()
};

/**
 * This function, render, runs as often as possible.
 */
var render = function () {

  if (bgReady) {
    ctx.drawImage(bgImage, 0, 0);
  }
  if (heroReady) {
    ctx.drawImage(heroImage, heroX, heroY);
  }
  if (monsterReady) {
    ctx.drawImage(monsterImage, monsterX, monsterY);
  }
  if (speedPotionReady && elapsedTime >= 5 && shouldShowSpeedPotion) {
    ctx.drawImage(speedPotionImage, speedPotionX, speedPotionY)
  }
  ctx.fillText(`Seconds Remaining: ${SECONDS_PER_ROUND - elapsedTime}`, 20, 100);
};

var main = function () {
  update();
  render();
  requestAnimationFrame(main);
};

var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

loadImages();
setupKeyboardListeners();
main();