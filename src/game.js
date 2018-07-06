import MersenneTwister from 'mersenne-twister'
import mountains from './assets/img/background/glacial_mountains_lightened.png'
import smiley from './assets/img/player/smiley.gif'
import {updateGameAreaWithRng} from './game/updateGameArea'
import Component from './game/component';

// Canvas
const CANVAS_WIDTH = 800; // Default 800
const CANVAS_HEIGHT = 600; // Default 600
const FRAME_SPEED_IN_MS = 15; // Default 15


// Player
const PLAYER_START_X = 10; // Default 10
const PLAYER_START_Y = 120; // Default 120
const PLAYER_WIDTH = 30; // Default 30
const PLAYER_HEIGHT = 30; // Default 30
const PLAYER_MOVEMENT_AREA = 140; // Default 140

// Opponent
const OPPONENT_HEIGHT = 30; // Default 30
const OPPONENT_WIDTH = 30; // Default 30
const OPPONENT_DIST_FROM_R_EDGE = 250; // Default 250
const OPPONENT_START_Y = 250; // Default 250

function Score() {
  this.score = 0;
  this.update = (s) => this.score += s;
  this.get = () => this.score;
}

function createDefaultGameElements() {
  return {
    myOpponentDesiredPosition: CANVAS_WIDTH - OPPONENT_WIDTH - OPPONENT_DIST_FROM_R_EDGE,
    score: new Score(),
    myMoney: [],
    myObstacles: [],
    myBackground: new Component(CANVAS_WIDTH, CANVAS_HEIGHT, mountains, 0, 0, "background"),
    myScore: new Component("30px", "Consolas", "black", 280, 40, "text"),
    myOpponentPiece: new Component(OPPONENT_WIDTH, OPPONENT_HEIGHT, "red", CANVAS_WIDTH - OPPONENT_WIDTH - OPPONENT_DIST_FROM_R_EDGE, OPPONENT_START_Y, "opponent"),
    myPlayerPiece: new Component(PLAYER_WIDTH, PLAYER_HEIGHT, smiley, PLAYER_START_X, PLAYER_START_Y, "image")
  }
}

function startGame() {
  let prng = new MersenneTwister(1337);
  myGameArea.start(createDefaultGameElements(), prng);
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
let myGameArea = {
  canvas: document.createElement("canvas"),
  start: function (gameElements, prng) {
    this.canvas.width = CANVAS_WIDTH;
    this.canvas.height = CANVAS_HEIGHT;
    this.context = this.canvas.getContext("2d");
    const gameElement = document.getElementById("game");
    gameElement.insertBefore(this.canvas, gameElement.childNodes[0]);
    gameElement.tabIndex = 1;
    this.frameNo = 0;
    this.interval = setInterval(updateGameAreaWithRng(this, gameElements, prng), FRAME_SPEED_IN_MS);
    this.keys = (this.keys || []);
    this.gamepadConnected = (this.gamepadConnected || false);
    window.addEventListener('keydown', (e) => {
      if (e.key === "ArrowUp" || e.key === "ArrowDown" || e.key === "ArrowLeft" || e.key === "ArrowRight") {
        e.preventDefault();
      }
      this.keys[e.key] = (e.type === "keydown");
    });
    window.addEventListener('gamepadconnected', (e) => {

      this.gamepadConnected = e.gamepad.connected;

      console.log(e.gamepad.connected);
      console.log(e);
      window.connectedEvent = e;
    });

    window.addEventListener('keyup', (e) => {

      this.keys[e.key] = (e.type === "keydown");
      //e.preventDefault();
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
