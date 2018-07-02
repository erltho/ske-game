// Declare global constants
// Canvas
const CANVAS_WIDTH = 800; // Default 800
const CANVAS_HEIGHT = 600; // Default 600
const FRAME_SPEED_IN_MS = 15; // Default 15

// Obstacle
const OBSTACLE_WIDTH = 10; // Default 10
const OBSTACLE_MIN_HEIGHT = 10; // Default 10
const OBSTACLE_MAX_HEIGHT = 450; // Default 450
const OBSTACLE_MIN_GAP = 50; // Default 50
const OBSTACLE_MAX_GAP = 150; // Default 150
const OBSTACLE_MIN_DISTANCE = 140; // Default 140
const OBSTACLE_DISTANCE_VARIETY_FACTOR = 30; // Default 30

// Player
const PLAYER_MOVEMENT_AREA = 140; // Default 140
const PLAYER_SPEED = 2; // Default 2
const PLAYER_START_X = 10; // Default 10
const PLAYER_START_Y = 120; // Default 120
const PLAYER_WIDTH = 30; // Default 30
const PLAYER_HEIGHT = 30; // Default 30

// Opponent
const OPPONENT_HEIGHT = 30; // Default 30
const OPPONENT_WIDTH = 30; // Default 30
const OPPONENT_DIST_FROM_R_EDGE = 250; // Default 250
const OPPONENT_START_Y = 250; // Default 250
const MONEY_DROP_INTERVAL = 200; // Default 200
const MONEY_HEIGHT = 10; // Default 10
const MONEY_WIDTH = 10; // Default 10

// Declare global variables
let myMoney = [];
let myObstacles = [];
let myBackground;
let myPlayerPiece;
let myOpponentPiece;
let myScore;
let score;
let myOpponentDesiredPosition;

function startGame() {
  let prng = new MersenneTwister(1337);
  myOpponentDesiredPosition = CANVAS_WIDTH - OPPONENT_WIDTH - OPPONENT_DIST_FROM_R_EDGE;
  score = 0;
  myMoney = [];
  myObstacles = [];
  myBackground = new component(CANVAS_WIDTH, CANVAS_HEIGHT, "assets/img/background/glacial_mountains_lightened.png", 0, 0, "background");
  myScore = new component("30px", "Consolas", "black", 280, 40, "text");
  myOpponentPiece = new component(OPPONENT_WIDTH, OPPONENT_HEIGHT, "red", CANVAS_WIDTH - OPPONENT_WIDTH - OPPONENT_DIST_FROM_R_EDGE, OPPONENT_START_Y, "opponent");
  myPlayerPiece = new component(PLAYER_WIDTH, PLAYER_HEIGHT, "assets/img/player/smiley.gif", PLAYER_START_X, PLAYER_START_Y, "image");
  myOpponentDesiredPosition = CANVAS_WIDTH - OPPONENT_WIDTH - OPPONENT_DIST_FROM_R_EDGE;
  myGameArea.start(prng);
}

console.log("Game started!");

// Restart game
function restart() {
  myGameArea.stop();
  myGameArea.clear();
  startGame();
}

// Give each frame access to prng
function updateGameAreaWithRng(prng) {
  return function () {
    updateGameArea(prng)
  }

}

// Decides when a new obstacle is drawn
function objectInterval() {
  return (myGameArea.frameNo / OBSTACLE_MIN_DISTANCE) % 1 === 0;
}

// Decides when oponent drops money
function moneyInterval() {
  return (myGameArea.frameNo / MONEY_DROP_INTERVAL) % 1 === 0;
}

// Canvas
let myGameArea = {
  canvas: document.createElement("canvas"),
  start: function (prng) {
    this.canvas.width = CANVAS_WIDTH;
    this.canvas.height = CANVAS_HEIGHT;
    this.context = this.canvas.getContext("2d");
    document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    this.frameNo = 0;
    this.interval = setInterval(updateGameAreaWithRng(prng), FRAME_SPEED_IN_MS);
    window.addEventListener('keydown', function (e) {
      myGameArea.keys = (myGameArea.keys || []);
      myGameArea.keys[e.keyCode] = (e.type === "keydown");
    });
    window.addEventListener('keyup', function (e) {
      myGameArea.keys[e.keyCode] = (e.type === "keydown");
    })
  },
  clear: function () {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  },
  stop: function () {
    clearInterval(this.interval);
  }
};

// Game-pieces
function component(width, height, color, x, y, type) {
  this.type = type;
  if (type === "image" || type === "background") {
    this.image = new Image();
    this.image.src = color;
  }
  this.width = width;
  this.height = height;
  this.speedX = 0;
  this.speedY = 0;
  this.x = x;
  this.y = y;
  this.update = function () {
    ctx = myGameArea.context;
    if (this.type === "text") {
      ctx.font = this.width + " " + this.height;
      ctx.fillStyle = color;
      ctx.fillText(this.text, this.x, this.y);
    }
    // Draws images and background
    else if (type === "image" || type === "background") {
      ctx.drawImage(this.image,
        this.x,
        this.y,
        this.width, this.height);

      // Background needs to be drawn twice for loop to work
      if (type === "background") {
        ctx.drawImage(this.image,
          this.x + this.width, this.y, this.width, this.height);
      }
    } else {
      ctx.fillStyle = color;
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
  };

  // Moves components depending on their speed
  this.newPos = function () {
    this.x += this.speedX;
    this.y += this.speedY;

    // Redraws the background when it has looped through
    if (this.type === "background") {
      if (this.x === -(this.width)) {
        this.x = 0;
      }
    }
  };

  // Component interaction
  this.interactWith = function (otherobj) {
    let myLeft = this.x;
    let myRight = this.x + (this.width);
    let myTop = this.y;
    let myBottom = this.y + (this.height);
    if (type === "opponent") {
      myRight = this.x + OBSTACLE_MIN_DISTANCE - OBSTACLE_WIDTH - OBSTACLE_DISTANCE_VARIETY_FACTOR;
      myBottom = this.y + (this.height) + (OBSTACLE_MIN_GAP / 10);
      myTop = this.y - (OBSTACLE_MIN_GAP / 10);
    }
    let otherLeft = otherobj.x;
    let otherRight = otherobj.x + (otherobj.width);
    let otherTop = otherobj.y;
    let otherBottom = otherobj.y + (otherobj.height);
    let interact = true;
    if ((myBottom < otherTop) || (myTop > otherBottom) || (myRight < otherLeft) || (myLeft > otherRight)) {
      interact = false;
    }
    return interact;
  };
}

// This code executes each frame
function updateGameArea(prng) {
  let aboutToCrashWith = null;

  // Avoids opponent collision with obstacles
  this.avoidContact = function (obstacle) {
    if (obstacle.y === 0) {
      myOpponentPiece.speedY = 2;
      myOpponentPiece.speedX = -1;
    } else {
      myOpponentPiece.speedY = -2;
      myOpponentPiece.speedX = -1;
    }
  };
  // Returns opponent to desired position when path is clear
  this.returnToDesiredPosition = function () {
    myOpponentPiece.speedY = 0;
    if (myOpponentPiece.x < myOpponentDesiredPosition)
      myOpponentPiece.speedX = 1;
    else myOpponentPiece.speedX = 0;
  };

  // Object avoidance
  for (i = 0; i < myObstacles.length; i += 1) {

    // Collision between player and obstacle
    if (myPlayerPiece.interactWith(myObstacles[i])) {
      console.log("GAME OVER!");
      myGameArea.stop();
      return;
    }
    // Deletes obstacles not visible on canvas
    if (myObstacles[i].x <= -OBSTACLE_MIN_DISTANCE){
      myObstacles.splice(i,1);
    }

    // Opponent object avoidence
    if (myOpponentPiece.interactWith(myObstacles[i])) {
      aboutToCrashWith = myObstacles[i];
      break;
    }
  }
  // Money collection
  for (i = 0; i < myMoney.length; i += 1) {
    // Collision between player and money
    if (myPlayerPiece.interactWith(myMoney[i])) {
      score += 100;
      myMoney.splice(i,1);
      myOpponentDesiredPosition -= 10;
      break;
    }
  }

  // Controlls how the opponent moves
  if (aboutToCrashWith == null) this.returnToDesiredPosition();
  else this.avoidContact(aboutToCrashWith);


  // Next frame
  myGameArea.clear();
  myGameArea.frameNo += 1;

  // Background
  myBackground.speedX = -1;
  myBackground.newPos();
  myBackground.update();

  // Spawns obstacles
  if (myGameArea.frameNo === 1 || objectInterval()) {
    let x = myGameArea.canvas.width + (Math.floor(OBSTACLE_DISTANCE_VARIETY_FACTOR * (prng.random() + 1)));
    let height = Math.floor(prng.random() * (OBSTACLE_MAX_HEIGHT - OBSTACLE_MIN_HEIGHT + 1) + OBSTACLE_MIN_HEIGHT);
    let gap = Math.floor(prng.random() * (OBSTACLE_MAX_GAP - OBSTACLE_MIN_GAP + 1) + OBSTACLE_MIN_GAP);
    myObstacles.push(new component(OBSTACLE_WIDTH, height, "green", x, 0));
    myObstacles.push(new component(OBSTACLE_WIDTH, x - height - gap, "green", x, height + gap));
  }
  // Moves obstacles
  for (i = 0; i < myObstacles.length; i += 1) {
    myObstacles[i].x += -1;
    myObstacles[i].update();
  }

  // Player
  myPlayerPiece.speedX = 0;
  myPlayerPiece.speedY = 0;
  if (myGameArea.keys && myGameArea.keys[37] && myPlayerPiece.x >= PLAYER_SPEED) {
    myPlayerPiece.speedX = -PLAYER_SPEED;
  }
  if (myGameArea.keys && myGameArea.keys[39] && myPlayerPiece.x <= PLAYER_MOVEMENT_AREA) {
    myPlayerPiece.speedX = PLAYER_SPEED;
  }
  if (myGameArea.keys && myGameArea.keys[38] && myPlayerPiece.y >= PLAYER_SPEED) {
    myPlayerPiece.speedY = -PLAYER_SPEED;
  }
  if (myGameArea.keys && myGameArea.keys[40] && myPlayerPiece.y <= (myGameArea.canvas.height - myPlayerPiece.height - PLAYER_SPEED)) {
    myPlayerPiece.speedY = PLAYER_SPEED;
  }
  myPlayerPiece.newPos();
  myPlayerPiece.update();


  // Draw money
  for (i = 0; i < myMoney.length; i += 1) {
    myMoney[i].x += -1;
    myMoney[i].update();
  }

  // Opponent
  myOpponentPiece.newPos();
  myOpponentPiece.update();

  // Spawn money
  if (moneyInterval()) {
    myMoney.push(new component(MONEY_WIDTH, MONEY_HEIGHT, "blue", myOpponentPiece.x, myOpponentPiece.y + (myOpponentPiece.height / 2) - (MONEY_HEIGHT / 2)));
  }


  // Score
  myScore.text = "SCORE: " + score;
  myScore.update();
}



