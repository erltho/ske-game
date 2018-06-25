let myGamePiece;
let myObstacle;


function startGame() {
  myGameArea.start();
  myGamePiece = new component(30, 30, "red", 10, 120);
  myObstacle = new component(10, 200, "green", 300, 120);
}

// Canvas
let myGameArea = {
  canvas: document.createElement("canvas"),
  start: function () {
    this.canvas.width = 480;
    this.canvas.height = 270;
    this.context = this.canvas.getContext("2d");
    document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    this.interval = setInterval(updateGameArea, 15);
    window.addEventListener('keydown', function (e) {
      myGameArea.keys = (myGameArea.keys || []);
      myGameArea.keys[e.keyCode] = (e.type == "keydown");
    });
    window.addEventListener('keyup', function (e) {
      myGameArea.keys[e.keyCode] = (e.type == "keydown");
    })
  },
  clear: function () {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  },
  stop : function() {
    clearInterval(this.interval);
  }
};

// Game-piece
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

// Draws objects
function updateGameArea() {
  if (myGamePiece.crashWith(myObstacle)) { // Crash
    myGameArea.stop();
  } else {
    myGameArea.clear();
    myObstacle.x -= 1;
    myObstacle.update();
    myGamePiece.speedX = 0;
    myGamePiece.speedY = 0;
    if (myGameArea.keys && myGameArea.keys[37]) {
      myGamePiece.speedX = -2;
    }
    if (myGameArea.keys && myGameArea.keys[39]) {
      myGamePiece.speedX = 2;
    }
    if (myGameArea.keys && myGameArea.keys[38]) {
      myGamePiece.speedY = -2;
    }
    if (myGameArea.keys && myGameArea.keys[40]) {
      myGamePiece.speedY = 2;
    }
    myGamePiece.newPos();
    myGamePiece.update();
  }
}

