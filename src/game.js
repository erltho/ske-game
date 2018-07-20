import MersenneTwister from 'mersenne-twister'
import mountains from './assets/img/background/glacial_mountains_lightened.png'
import smiley from './assets/img/player/smiley.gif'
import gubbeSpriteSheet from './assets/img/2017/GubbeAnimSpriteSheet.png';
import hourglass from './assets/img/other/Hourglass.png';
import kunst from './assets/img/other/Kunst.png';
import face from './assets/img/other/Face.png';
import {updateGameAreaWithRng} from './game/updateGameArea'
import Component from './game/component';

// Canvas
const CANVAS_WIDTH = 1000; // Default 800
const CANVAS_HEIGHT = 600; // Default 600
const FRAME_SPEED_IN_MS = 15; // Default 15

// gubbeSprite
const GUBBE_SPRITE_HEIGHT = 333;
const GUBBE_SPRITE_WIDTH = 1836;

// gameOneTextBubble
const BUTTON_HEIGHT = 40;
const BUTTON_RADIUS = 25;
const BUTTON_DIST_FROM_Y_EDGE = 150;
const BUTTON_DIST_FROM_X_EDGE = 25;
const BUTTON_COLOR = "#f4f4f4";

// gameOneBackground
// '#CDB7BA'

// Player
const PLAYER_START_X = 10; // Default 10
const PLAYER_START_Y = 120; // Default 120
const PLAYER_WIDTH = 30; // Default 30
const PLAYER_HEIGHT = 30; // Default 30
const PLAYER_MOVEMENT_AREA = 140; // Default 140

// Opponent
const OPPONENT_HEIGHT = 30; // Default 30
const OPPONENT_WIDTH = 30; // Default 30
const OPPONENT_DIST_FROM_R_EDGE = 0; // Default 250
const OPPONENT_START_Y = 250; // Default 250

function Score() {
  this.score = 0;
  this.update = (s) => this.score += s;
  this.get = () => this.score;

}

function createDefaultGameElements() {
  return {
    // Game 1
    gameOneGubbeSprite: new Component(GUBBE_SPRITE_WIDTH, GUBBE_SPRITE_HEIGHT, gubbeSpriteSheet, 0, CANVAS_HEIGHT - GUBBE_SPRITE_HEIGHT, "sprite", {numberOfFrames: 4}),
    gameOneBackground: new Component(CANVAS_WIDTH, CANVAS_HEIGHT, '#CDB7BA', 0,0),
    gameOneTextBubble: new Component(CANVAS_WIDTH - (BUTTON_DIST_FROM_Y_EDGE * 2) - BUTTON_RADIUS, BUTTON_HEIGHT, BUTTON_COLOR, BUTTON_DIST_FROM_Y_EDGE, BUTTON_DIST_FROM_X_EDGE, "button", {radius: BUTTON_RADIUS}),
    gameOneButtonText: new Component(35, "Georgia", "black", CANVAS_WIDTH / 2 , 82, "text", {textAlign: "center"}),
    gameOneScoreBackground: new Component(CANVAS_WIDTH - (GUBBE_SPRITE_WIDTH / 4), 108, "#999999", GUBBE_SPRITE_WIDTH / 4, CANVAS_HEIGHT - 108, "rect", {transparency: 0.4}),
    gameOneScoreText: new Component(60, "Georgia", "#f4f4f4", (GUBBE_SPRITE_WIDTH / 4) + 20, CANVAS_HEIGHT - 30, "text", {textAlign: "left"}),
    gameOneCountDownTimer: new Component(30, "Georgia", "black", 650, 350, "text", {textAlign: "left"}),
    gameOneHourglass: new Component(80, 80, hourglass, 600, 300, "image"),
    gameOneFace: new Component(55, 55, face, 207, 310, "image"),
    gameOneEasterEgg: new Component(10, 30, kunst, 207, 420, "image"),



    // Game 3
    myOpponentDesiredPosition: CANVAS_WIDTH - OPPONENT_WIDTH - OPPONENT_DIST_FROM_R_EDGE,
    score: new Score(),
    myMoney: [],
    myObstacles: [],
    myBackground: new Component(CANVAS_WIDTH, CANVAS_HEIGHT, mountains, 0, 0, "background"),
    myScore: new Component("30", "Georgia", "black", 280, 40, "text", {textAlign: "left"}),
    myOpponentPiece: new Component(OPPONENT_WIDTH, OPPONENT_HEIGHT, "red", CANVAS_WIDTH - OPPONENT_WIDTH - OPPONENT_DIST_FROM_R_EDGE, OPPONENT_START_Y, "opponent"),
    myPlayerPiece: new Component(PLAYER_WIDTH, PLAYER_HEIGHT, smiley, PLAYER_START_X, PLAYER_START_Y, "image")
  }
}

function startGame() {
  // Replace ske-layout__body with canvas
  let element = document.getElementById("ske-layout__body");
  let firstGameStart = true;
  if (typeof(element) !== 'undefined' && element !== null)
  {
    element.parentNode.removeChild(element);
  }

  let canvas = document.getElementById("gameCanvas");
  if (typeof(canvas) !== 'undefined' && canvas !== null)
  {
    canvas.parentNode.removeChild(canvas);
    myGameArea.stop();
    myGameArea.clear();
    myGameArea.keys = [];
    firstGameStart = false;
    console.log("Canvas removed");
  }


  // start game
  let gameType = 2;
  let prng = new MersenneTwister(1337);
  myGameArea.start(createDefaultGameElements(), prng, gameType, firstGameStart);
}

console.log("Game started!");

// Restart game
function restart() {
  myGameArea.stop();
  myGameArea.clear();
  myGameArea.keys = [];
  startGame();
}

// Canvas

/*
if (e.key === "ArrowUp" || e.key === "ArrowDown" || e.key === "ArrowLeft" || e.key === "ArrowRight" || e.key === " ") {
  e.preventDefault();
}
this.keys[e.key] = (this.type === "keydown");
*/

let myGameArea = {
  canvas: document.createElement("canvas"),
  start: function (gameElements, prng, gameType, firstGameStart) {
    this.canvas.width = CANVAS_WIDTH;
    this.canvas.height = CANVAS_HEIGHT;
    this.canvas.id = "gameCanvas";
    this.context = this.canvas.getContext("2d");
    const gameElement = document.getElementById("game");
    gameElement.insertBefore(this.canvas, gameElement.childNodes[0]);
    gameElement.tabIndex = 1;
    this.frameNo = 0;
    this.firstClick = true;
    this.readyToFire = true;
    this.countDownTimer = 10;
    this.clickCounter = 0;
    this.interval = setInterval(updateGameAreaWithRng(this, gameElements, prng, gameType), FRAME_SPEED_IN_MS);
    this.keys = (this.keys || []);
    this.gamepadConnected = (this.gamepadConnected || false);
    console.log("myGameArea Started!");

    if (firstGameStart === true) {

      window.addEventListener('keydown', (e) => {
        if (e.key === "ArrowUp" || e.key === "ArrowDown" || e.key === "ArrowLeft" || e.key === "ArrowRight" || e.key === " ") {
          e.preventDefault();
        }
          this.keys[e.key] = (e.type === "keydown");
      });


      window.addEventListener('keyup', (e) => {
        this.keys[e.key] = (e.type === "keydown");
      });
    }
    window.addEventListener('gamepadconnected', (e) => {
      this.gamepadConnected = e.gamepad.connected;
      console.log(e.gamepad.connected);
      console.log(e);
      window.connectedEvent = e;
    });
  },
  clear: function () {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  },
  stop: function () {
    clearInterval(this.interval);
  }
};


export {
  startGame,
  restart
}
