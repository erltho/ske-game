// Declare global constants

// Obstacle
const OBSTACLE_WIDTH = 10; // Default 10
const OBSTACLE_MIN_GAP = 50; // Default 50
const OBSTACLE_MIN_DISTANCE = 140; // Default 140
const OBSTACLE_DISTANCE_VARIETY_FACTOR = 30; // Default 30

// Game-pieces
function Component(width, height, color, x, y, type) {
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

  // Draw different components
  this.update = function (myGameArea) {
    const ctx = myGameArea.context;
    if (this.type === "text") {
      ctx.font = this.width + " " + this.height;
      ctx.fillStyle = color;
      ctx.fillText(this.text, this.x, this.y);
    }
    // Images and background
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

    }

    // Draws rectangles
    else {
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

export default Component;
