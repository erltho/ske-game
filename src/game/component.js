// Declare global constants

// Obstacle
const OBSTACLE_WIDTH = 10; // Default 10
const OBSTACLE_MIN_GAP = 50; // Default 50
const OBSTACLE_MIN_DISTANCE = 140; // Default 140
const OBSTACLE_DISTANCE_VARIETY_FACTOR = 30; // Default 30

// Game-pieces
function Component(width, height, color, x, y, type, options) {
  this.type = type;
  if (type === "image" || type === "background" || type === "sprite" || type === "opponent") {
    this.image = new Image();
    this.image.src = color;
  } else {
    this.color = color;
  }
  if (type === "sprite") {
    this.frame = 0;
  }
  this.width = width;
  this.height = height;
  this.speedX = 0;
  this.speedY = 0;
  this.growthW = 0;
  this.growthH =0;
  this.x = x;
  this.y = y;
  this.desiredPosition = 0;


  // Draw different components
  this.update = function (myGameArea) {
    const ctx = myGameArea.context;
    if (this.type === "text") {
      ctx.font = this.width + "px " + this.height;
      ctx.fillStyle = this.color;
      ctx.textAlign = options.textAlign;
      ctx.fillText(this.text, this.x, this.y);
    }
    // Images and background
    else if (type === "image" || type === "background" || type === "opponent") {
      ctx.drawImage(this.image,
        this.x,
        this.y,
        this.width, this.height);

      // Background needs to be drawn twice for loop to work
      if (type === "background") {
        ctx.drawImage(this.image,
          this.x + this.width, this.y, this.width, this.height);
      }

    } else if (type === "sprite") {
      this.numberOfFrames = options.numberOfFrames;

      ctx.drawImage(
        this.image,
        this.width * this.frame / this.numberOfFrames, // tallet mellom 0 - 3 bestemmer hvilken animasjon som skal vises
        0,
        this.width / this.numberOfFrames,
        this.height,
        this.x,
        this.y,
        this.width / this.numberOfFrames,
        this.height);
    } else if (type === "button"){
      this.radius = options.radius;

      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(this.x + this.width, this.y);
      ctx.arc(this.x + this.width + this.radius, this.y + this.radius, this.radius, 1.5*Math.PI , 0 * Math.PI, false);
      ctx.lineTo(this.x + this.width + (this.radius * 2),this.y + this.height + this.radius);
      ctx.arc(this.x + this.width + this.radius,this.y + this.height + this.radius, this.radius, 0*Math.PI, 0.5 *Math.PI,false);
      ctx.lineTo(this.x + 300 ,this.y + this.height + (this.radius * 2)); // utstikker til snakkeboble
      ctx.lineTo(this.x + 240 ,this.y + this.height + (this.radius * 2) + 50); // utstikker til snakkeboble
      ctx.lineTo(this.x + 275,this.y + this.height + (this.radius * 2)); // utstikker til snakkeboble
      ctx.lineTo(this.x ,this.y + this.height + (this.radius * 2));
      ctx.arc(this.x,this.y + this.height + this.radius, this.radius , 0.5*Math.PI, 1 *Math.PI,false);
      ctx.lineTo(this.x - this.radius, this.y + this.radius);
      ctx.arc(this.x ,this.y + this.radius, this.radius, 1*Math.PI, 1.5 *Math.PI,false);
      ctx.fillStyle = color;
      ctx.fill();
    }
    // Draws rectangles
    else {
      ctx.globalAlpha = 1;
      if (typeof options !== "undefined") {
         if (typeof options.transparency !== "undefined") {
           ctx.globalAlpha = options.transparency;
         }
      }
      ctx.fillStyle = this.color;
      ctx.fillRect(this.x, this.y, this.width, this.height);
      ctx.globalAlpha = 1;
    }
  };

  // Moves components depending on their speed
  this.newPos = function () {
    this.x += this.speedX;
    this.y += this.speedY;
    this.width += this.growthW;
    this.height += this.growthH;

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
    if (type === "sprite") {
      myRight = this.x + (this.width / options.numberOfFrames);
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
