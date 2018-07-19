import spriteSheet from './assets/img/2017/GubbeAnimSpriteSheet.png';
import {updateGameAreaWithRng} from "./game/updateGameArea";

let myGamePiece;
let myObstacle;
const FRAME_SPEED_IN_MS = 1000;

var coinImage = new Image();
coinImage.src = spriteSheet;


function startButtonMash() {
  let element = document.getElementById("ske-layout__body");
  if (typeof(element) !== 'undefined' && element !== null) {
    element.parentNode.removeChild(element);
  }

  myGameArea.start();
  const canvas = document.getElementById("buttonMashArea");

  let coin = component({
    context: canvas.getContext("2d"),
    width: 1836,
    height: 333,
    image: coinImage,
    numberOfFrames: 4
  });

  coin.update();
  coin.render();
}


let myGameArea = {
  canvas: document.createElement('canvas'),
  start: function () {
    this.canvas.width = 1000;
    this.canvas.height = 600;
    this.canvas.id = 'buttonMashArea';
    this.context = this.canvas.getContext("2d");
    const gameElement = document.getElementById("game");
    gameElement.insertBefore (this.canvas, gameElement.childNodes[0])
    this.interval = setInterval(updateGameArea, FRAME_SPEED_IN_MS);
  },
  clear: function () {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  },
  stop: function () {
    clearInterval(this.interval);
  }
};

function updateGameArea () {
  console.log('update');
}



function component(options) {

  let that = {},
    frameIndex = 0,
    tickCount = 0,
    ticksPerFrame = options.ticksPerFrame || 0,
    numberOfFrames = options.numberOfFrames || 1;

  that.context = options.context;
  that.width = options.width;
  that.height = options.height;
  that.image = options.image;

  that.render = function () {

    // Draw the animation
    that.context.drawImage(
      that.image,
      frameIndex * that.width / numberOfFrames,
      0,
      that.width / numberOfFrames,
      that.height,
      0,
      0,
      that.width / numberOfFrames,
      that.height);
  };

    that.loop = options.loop;

    that.update = function () {

      tickCount += 1;

      if (tickCount > ticksPerFrame) {

        tickCount = 0;

        // If the current frame index is in range
        if (frameIndex < numberOfFrames - 1) {
          // Go to the next frame
          frameIndex += 1;
        } else if (that.loop) {
          frameIndex = 0;
        }
      }
    };

  return that;
}



export default startButtonMash;
