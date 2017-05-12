// set up of global variables
// and modifiers
var xVel = 0;
var gameOver = false;
var eggIndex = 2;
var score = 0;
var scoreElement;
const WIDTH = .8 * window.innerWidth;
const HEIGHT = WIDTH * .8
var spawnRate = .005;
var velocityModifer = .7;
var eggSound;
var eggSpeed = 2.5;

/*
The basket object
*/
var basket = {
  xPos: 0,
  yPos: 0,
  basketWidth: WIDTH / 8,
  basketHeight: WIDTH / 10,
  innerWidth: WIDTH / 6,
  innerHeight: WIDTH / 8
};

/*
function that generates a new Egg object
*/
function Egg(xPos, yPos) {
  this.xPos = xPos;
  this.yPos = yPos;
}

var previousPosition = 300;

var eggs = {
  "1" : new Egg(300, 0)
  // an empty object where the eggs will live
}

function preload() {
  eggSound = loadSound('egg_drop.m4a');
}

// built in p5.js setup function
function setup() {
  cnv = createCanvas(WIDTH, HEIGHT);
  background(45,45,45);
  basket.xPos = WIDTH / 2;
  basket.yPos = HEIGHT / 1.15;
  scoreElement = document.getElementById("scoreNumber");
  console.log(scoreElement)
  scoreElement.innerHTML = score;
  eggSound.setVolume(1);
}

// built in p5.js draw function
// runs every game tick
function draw() {

  if (!gameOver) {
    background(45,45,45);
    fill(255,255,255)
    renderBasket();
    fill(140, 0, 255);
    drawEggs();

    if (Math.random() > (1 - spawnRate)) {
      var theProp = eggIndex.toString();
      const min = Math.max(previousPosition - 150, 0);
      const max = Math.min(previousPosition + 150, WIDTH);
      var newPosition = Math.random() * (max - min) + min;
      eggs[theProp] = new Egg(newPosition, 0);
      previousPosition = newPosition
      eggIndex += 1;
      console.log(eggIndex);
    }

  } else {
    background(45,45,45);
    textSize(72);
    fill(255, 59, 0)
    text("GAME OVER", WIDTH / 8, HEIGHT / 2);
  }

}

// renders all remaining eggs
// updates score if egg is caught
// ends game if egg hits ground
function drawEggs() {
  for(key in eggs) {
    var egg = eggs[key]
    if (Math.abs(basket.xPos - egg.xPos) < 75 && egg.yPos > .95 * basket.yPos) {
      delete eggs[key];
      eggSound.play();
      score += 10;
      spawnRate += .001;
      eggSpeed += .1;
      velocityModifer += .005;
      scoreElement.innerHTML = score;
    } else if (egg.yPos < HEIGHT) {
        egg.yPos += eggSpeed;
    } else {
      delete eggs[key]
      gameOver = true;
    }

    arc(egg.xPos, egg.yPos, WIDTH / 24, WIDTH / 24, 0, 2 * PI);
  }
}

/*
Phsyics calculation for rendering the basket
in the correct location
*/
function renderBasket() {

  if (keyIsDown(LEFT_ARROW)) {
    if (xVel > -12) {
      xVel -= velocityModifer;
    }
  } else if (keyIsDown(RIGHT_ARROW)) {
    if (xVel < 12) {
      xVel += velocityModifer;
    }
  } else {
    xVel += (0 - (.075 * xVel));
  }

  if ((basket.xPos > (basket.basketWidth / 2)) && (basket.xPos < (WIDTH - (basket.basketWidth / 2)))) {
      basket.xPos += xVel;
      //console.log(xVel);
  } else {

    //console.log(xVel);
    xVel = -1 * xVel;
    basket.xPos += 2 * xVel;
  }

  arc(basket.xPos, basket.yPos, basket.basketWidth, basket.basketHeight, 0, PI, PI);
}
