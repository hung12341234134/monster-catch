// Duy Hung's game 
let canvas;
let ctx;

canvas = document.createElement("canvas");
ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 480;
document.body.appendChild(canvas);

let bgReady, heroReady, monsterReady, speedPotionReady, doublePointsPotionReady;
let bgImage, heroImage, monsterImage, speedPotionImage, doublePointsPotionImage;

let startTime = Date.now();
const SECONDS_PER_ROUND = 30;
let elapsedTime = 0;
let point = 0
let shouldShowSpeedPotion = true
let shouldShowDoublePoints = true

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

  doublePointsPotionImage = new Image();
  doublePointsPotionImage.onload = function () {
    doublePointsPotionReady = true;
  };
  doublePointsPotionImage.src = "images/doublepoints.png";
}


function randomlyPlace(axis) {
  // Solution 1:
  //return axis == 'y' ? Math.floor(Math.random() * canvas.height):  Math.floor(Math.random() * canvas.width)

  //Solution 2:
  // if(axis=='y'){
  //   return Math.floor(Math.random() * canvas.height)
  // }
  // else{
  //   return Math.floor(Math.random() * canvas.width)
  // }

  // Solution 3:
  let amount
  if (axis == 'y') {
    amount = Math.floor(Math.random() * canvas.height)
  } else {
    amount = Math.floor(Math.random() * canvas.width)
  }
  return amount
}

let heroX = canvas.width / 2;
let heroY = canvas.height / 2;
let heroSpeed = 5

let monsterX = randomlyPlace('x');
let monsterY = randomlyPlace('y')
console.log(monsterX, monsterY)

let speedPotionX = randomlyPlace("x");
let speedPotionY = randomlyPlace("y")

let doublePointsX = randomlyPlace("x");
let doublePointsY = randomlyPlace("y")

let monsterCapturePoints = 1

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
    shouldShowSpeedPotion = false
    heroSpeed = 10
    speedPotionX = randomlyPlace("x")
    speedPotionY = randomlyPlace("y")
    setTimeout(function () {
      shouldShowSpeedPotion = true
      heroSpeed = 5
    }, 5000)
  }
  const heroCaughtDoublePointsPotion =
    heroX <= (doublePointsX + 32)
    && doublePointsX <= (heroX + 32)
    && heroY <= (doublePointsY + 32)
    && doublePointsY <= (heroY + 32)
  if (heroCaughtDoublePointsPotion) {
    shouldShowDoublePoints = false
    monsterCapturePoints = 2
    doublePointsX = randomlyPlace("x")
    doublePointsY = randomlyPlace("y")
    setTimeout(function () {
      shouldShowDoublePoints = true
      monsterCapturePoints = 1
    }, 10000)
  }

  const heroCaughtMonster =
    heroX <= (monsterX + 32)
    && monsterX <= (heroX + 32)
    && heroY <= (monsterY + 32)
    && monsterY <= (heroY + 32)
  if (heroCaughtMonster) {
    point = point + monsterCapturePoints
    document.getElementById(`point`).innerHTML = "point:" + point
    monsterX = randomlyPlace("x")
    monsterY = randomlyPlace("y")
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

  if (doublePointsPotionReady && elapsedTime >= 1 && shouldShowDoublePoints) {
    ctx.drawImage(doublePointsPotionImage, doublePointsX, doublePointsY)
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