/*
  Code modified from:
  http://www.lostdecadegames.com/how-to-make-a-simple-html5-canvas-game/
  using graphics purchased from vectorstock.com
*/

/* Initialization.
Here, we create and add our "canvas" to the page.
We also load all of our images. 
*/


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

/** 
 * Setting up our characters.
 * 
 * Note that heroX represents the X position of our hero.
 * heroY represents the Y position.
 * We'll need these values to know where to "draw" the hero.
 * 
 * The same applies to the monster.
 */

let heroX = canvas.width / 2;
let heroY = canvas.height / 2;

let monsterX = 100;
let monsterY = 100;

let speedPotionX = 100;
let speedPotionY = 100;

/** 
 * Keyboard Listeners
 * You can safely ignore this part, for now. 
 * 
 * This is just to let JavaScript know when the user has pressed a key.
*/
let keysDown = {};
function setupKeyboardListeners() {
  // Check for keys pressed where key represents the keycode captured
  // For now, do not worry too much about what's happening here. 
  addEventListener("keydown", function (key) {
    keysDown[key.keyCode] = true;
  }, false);

  addEventListener("keyup", function (key) {
    delete keysDown[key.keyCode];
  }, false);
}


function control() {
  if (38 in keysDown) {
    heroY -= 5;
  }
  if (40 in keysDown) {
    heroY += 5;
  }
  if (37 in keysDown) {
    heroX -= 5;
  }
  if (39 in keysDown) {
    heroX += 5;
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
  if (
    heroX <= (monsterX + 32)
    && monsterX <= (heroX + 32)
    && heroY <= (monsterY + 32)
    && monsterY <= (heroY + 32)
  ) {
    point++
    document.getElementById(`point`).innerHTML = "point:" + point

    monsterX = Math.floor(Math.random() * canvas.width)
    monsterY = Math.floor(Math.random() * canvas.height)
    speedPotionX = Math.floor(Math.random() * canvas.width)
    speedPotionY = Math.floor(Math.random() * canvas.height)

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
  console.log("red", elapsedTime)

  if (bgReady) {
    ctx.drawImage(bgImage, 0, 0);
  }
  if (heroReady) {
    ctx.drawImage(heroImage, heroX, heroY);
  }
  if (monsterReady) {
    ctx.drawImage(monsterImage, monsterX, monsterY);
  }
  if (speedPotionReady && elapsedTime >= 5) {
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