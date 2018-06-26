let myGamePiece;
let myObstacles = [];
const playerSpeed = 2;

function startGame() {
  myObstacles = []; // it is very important to do this before starting the game
  myGameArea.start();
  myGamePiece = new component(30, 30, "red", 10, 120);
}

function restart() {
  myGameArea.stop();
  myGameArea.clear();
  startGame();
}

// Canvas
let myGameArea = {
  canvas: document.createElement("canvas"),
  start: function () {
    this.canvas.width = 800;
    this.canvas.height = 600;
    this.context = this.canvas.getContext("2d");
    document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    this.frameNo = 0;
    this.interval = setInterval(updateGameArea, 15);
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
function component(width, height, color, x, y) {
  this.width = width;
  this.height = height;
  this.speedX = 0;
  this.speedY = 0;
  this.x = x;
  this.y = y;
  this.update = function () {
    ctx = myGameArea.context;
    ctx.fillStyle = color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  };
  this.newPos = function () {
    this.x += this.speedX;
    this.y += this.speedY;
  };
  this.crashWith = function (otherobj) {
    let myleft = this.x;
    let myright = this.x + (this.width);
    let mytop = this.y;
    let mybottom = this.y + (this.height);
    let otherleft = otherobj.x;
    let otherright = otherobj.x + (otherobj.width);
    let othertop = otherobj.y;
    let otherbottom = otherobj.y + (otherobj.height);
    let crash = true;
    if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
      crash = false;
    }
    return crash;
  }
}

// Draw
function updateGameArea() {
  let x, y;
  for (i = 0; i < myObstacles.length; i += 1) {
    if (myGamePiece.crashWith(myObstacles[i])) {
      myGameArea.stop();
      return;
    }
  }

  myGameArea.clear();
  myGameArea.frameNo += 1;

  // create obstacles
  if (myGameArea.frameNo === 1 || everyinterval(150)) {
    x = myGameArea.canvas.width;
    minHeight = 20;
    maxHeight = 200;
    height = Math.floor(Math.random() * (maxHeight - minHeight + 1) + minHeight);
    minGap = 50;
    maxGap = 200;
    gap = Math.floor(Math.random() * (maxGap - minGap + 1) + minGap);
    myObstacles.push(new component(10, height, "green", x, 0));
    myObstacles.push(new component(10, x - height - gap, "green", x, height + gap));
  }
  for (i = 0; i < myObstacles.length; i += 1) {
    myObstacles[i].x += -1;
    myObstacles[i].update();
  }

  myGamePiece.speedX = 0;
  myGamePiece.speedY = 0;
  if (myGameArea.keys && myGameArea.keys[37] && myGamePiece.x >= playerSpeed) {
    myGamePiece.speedX = -playerSpeed;
  }
  if (myGameArea.keys && myGameArea.keys[39] && myGamePiece.x <= 100) {
    myGamePiece.speedX = playerSpeed;
  }
  if (myGameArea.keys && myGameArea.keys[38] && myGamePiece.y >= playerSpeed) {
    myGamePiece.speedY = -playerSpeed;
  }
  if (myGameArea.keys && myGameArea.keys[40] && myGamePiece.y <= (myGameArea.canvas.height - myGamePiece.height - playerSpeed)) {
    myGamePiece.speedY = playerSpeed;
  }
  myGamePiece.newPos();
  myGamePiece.update();
}

function everyinterval(n) {
  return (myGameArea.frameNo / n) % 1 === 0;

}
