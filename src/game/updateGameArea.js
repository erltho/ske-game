import Component from './component';

// Declare global constants

// Obstacle
const OBSTACLE_WIDTH = 10; // Default 10
const OBSTACLE_MIN_HEIGHT = 10; // Default 10
const OBSTACLE_MAX_HEIGHT = 450; // Default 450
const OBSTACLE_MIN_GAP = 50; // Default 50
const OBSTACLE_MAX_GAP = 150; // Default 150
const OBSTACLE_MIN_DISTANCE = 140; // Default 140
const OBSTACLE_DISTANCE_VARIETY_FACTOR = 30; // Default 30

// Player Movement
const PLAYER_MOVEMENT_AREA = 140; // Default 140
const PLAYER_SPEED = 2; // Default 2

// Money
const MONEY_DROP_INTERVAL = 200; // Default 200
const MONEY_HEIGHT = 10; // Default 10
const MONEY_WIDTH = 10; // Default 10

// This code executes each frame
function updateGameArea(myGameArea, gameElements, prng) {

  let {
    myOpponentDesiredPosition,
    score,
    myMoney,
    myObstacles,
    myBackground,
    myScore,
    myOpponentPiece,
    myPlayerPiece
  } = gameElements;

  let aboutToCrashWith = null;

  // Avoids opponent collision with obstacles
  const avoidContact = function (obstacle) {
    if (obstacle.y === 0) {
      myOpponentPiece.speedY = 2;
      myOpponentPiece.speedX = -1;
    } else {
      myOpponentPiece.speedY = -2;
      myOpponentPiece.speedX = -1;
    }
  };
  // Returns opponent to desired position when path is clear
  const returnToDesiredPosition = function () {
    myOpponentPiece.speedY = 0;
    if (myOpponentPiece.x < myOpponentDesiredPosition)
      myOpponentPiece.speedX = 1;
    else myOpponentPiece.speedX = 0;
  };

  // Object avoidance
  for (let i = 0; i < myObstacles.length; i += 1) {

    // Collision between player and obstacle
    if (myPlayerPiece.interactWith(myObstacles[i])) {
      console.log("GAME OVER!");
      myGameArea.stop();
      return;
    }
    // Deletes obstacles not visible on canvas
    if (myObstacles[i].x <= -OBSTACLE_MIN_DISTANCE) {
      myObstacles.splice(i, 1);
    }

    // Opponent object avoidence
    if (myOpponentPiece.interactWith(myObstacles[i])) {
      aboutToCrashWith = myObstacles[i];
      break;
    }
  }
  // Money collection
  for (let i = 0; i < myMoney.length; i += 1) {
    // Collision between player and money
    if (myPlayerPiece.interactWith(myMoney[i])) {
      score.update(123214);
      myMoney.splice(i, 1);
      myOpponentDesiredPosition -= 10;
      break;
    }
  }

  // Controlls how the opponent moves
  if (aboutToCrashWith == null) returnToDesiredPosition();
  else avoidContact(aboutToCrashWith);

  // Next frame
  myGameArea.clear();
  myGameArea.frameNo += 1;

  // Background
  myBackground.speedX = -1;
  myBackground.newPos();
  myBackground.update(myGameArea);

  // Spawns obstacles
  if (myGameArea.frameNo === 1 || objectInterval(myGameArea)) {
    let x = myGameArea.canvas.width + (Math.floor(OBSTACLE_DISTANCE_VARIETY_FACTOR * (prng.random() + 1)));
    let height = Math.floor(prng.random() * (OBSTACLE_MAX_HEIGHT - OBSTACLE_MIN_HEIGHT + 1) + OBSTACLE_MIN_HEIGHT);
    let gap = Math.floor(prng.random() * (OBSTACLE_MAX_GAP - OBSTACLE_MIN_GAP + 1) + OBSTACLE_MIN_GAP);
    myObstacles.push(new Component(OBSTACLE_WIDTH, height, "green", x, 0));
    myObstacles.push(new Component(OBSTACLE_WIDTH, x - height - gap, "green", x, height + gap));
  }
  // Moves obstacles
  for (let i = 0; i < myObstacles.length; i += 1) {
    myObstacles[i].x += -1;
    myObstacles[i].update(myGameArea);
  }


  // Player
  // Gamepad integration
  if (myGameArea.gamepadConnected === true) {
    // Gamepad støtte om den er koblet til
    let gamepad = navigator.getGamepads()[0];
    let axis1 = gamepad.axes[0];
    let axis2 = gamepad.axes[1];
    myGameArea.keys["ArrowLeft"] = axis1 === -1;
    myGameArea.keys["ArrowRight"] = axis1 === 1;
    myGameArea.keys["ArrowUp"] = axis2 === -1;
    myGameArea.keys["ArrowDown"] = axis2 === 1;
  }
  // Movement
  myPlayerPiece.speedX = 0;
  myPlayerPiece.speedY = 0;
  if (myGameArea.keys["ArrowLeft"] && myPlayerPiece.x >= PLAYER_SPEED) {
    myPlayerPiece.speedX = -PLAYER_SPEED;
  }
  if (myGameArea.keys["ArrowRight"] && myPlayerPiece.x <= PLAYER_MOVEMENT_AREA) {
    myPlayerPiece.speedX = PLAYER_SPEED;
  }
  if (myGameArea.keys["ArrowUp"] && myPlayerPiece.y >= PLAYER_SPEED) {
    myPlayerPiece.speedY = -PLAYER_SPEED;
  }
  if (myGameArea.keys["ArrowDown"] && myPlayerPiece.y <= (myGameArea.canvas.height - myPlayerPiece.height - PLAYER_SPEED)) {
    myPlayerPiece.speedY = PLAYER_SPEED;
  }
  myPlayerPiece.newPos();
  myPlayerPiece.update(myGameArea);


  // Draw money
  for (let i = 0; i < myMoney.length; i += 1) {
    myMoney[i].x += -1;
    myMoney[i].update(myGameArea);
  }

  // Opponent
  myOpponentPiece.newPos();
  myOpponentPiece.update(myGameArea);

  // Spawn money
  if (moneyInterval(myGameArea)) {
    myMoney.push(new Component(MONEY_WIDTH, MONEY_HEIGHT, "blue", myOpponentPiece.x, myOpponentPiece.y + (myOpponentPiece.height / 2) - (MONEY_HEIGHT / 2)));
  }

  // Score
  myScore.text = "SCORE: " + score.get();
  myScore.update(myGameArea);
}


// Decides when a new obstacle is drawn
function objectInterval(myGameArea) {
  return (myGameArea.frameNo / OBSTACLE_MIN_DISTANCE) % 1 === 0;
}

// Decides when oponent drops money
function moneyInterval(myGameArea) {
  return (myGameArea.frameNo / MONEY_DROP_INTERVAL) % 1 === 0;
}


// Give each frame access to prng
function updateGameAreaWithRng(myGameArea, gameElements, prng, gameType) {
  console.log(gameType);
  if (gameType === 2) {
    return function () {
      updateGameArea(myGameArea, gameElements, prng)
    }
  } else if (gameType === 1) {
    return function () {
      gameOne(myGameArea, gameElements)
    }
  }
}


// GameOne
function gameOne(myGameArea, gameElements) {


  let {
    gameOneGubbeSprite,
    gameOneBackground,
    gameOneTextBubble,
    gameOneButtonText,
    gameOneScoreBackground,
    gameOneScoreText,
    gameOneHourglass,
    gameOneCountDownTimer,
    gameOneFace,
    gameOneEasterEgg,
    score
  } = gameElements;

  let countDownTimer = Math.abs((myGameArea.countDownTimer - myGameArea.frameNo * 0.015).toFixed(2));

  myGameArea.clear();


  // Gamepad integration
  if (myGameArea.gamepadConnected === true) {
    // Gamepad støtte om den er koblet til
    let gamepad = navigator.getGamepads()[0];
    let button1 = gamepad.buttons[0];
    myGameArea.keys["ArrowUp"] = button1.value === 1;
  }

  gameOneCountDownTimer.growthW = 0;
  gameOneHourglass.growthH = 0;
  gameOneHourglass.growthW = 0;
  gameOneHourglass.speedX = 0;
  gameOneHourglass.speedY = 0;


  if (myGameArea.keys["ArrowUp"] && myGameArea.readyToFire === true) {
    score.update(123214);
    gameOneGubbeSprite.frame = Math.floor(Math.random() * 2.99);
    myGameArea.clickCounter += 1;
    myGameArea.readyToFire = false;
    myGameArea.firstClick = false;
    console.log(myGameArea.clickCounter);
  }

  if (!myGameArea.keys["ArrowUp"]) {
    myGameArea.readyToFire = true;
  }

  if (myGameArea.frameNo % 10 === 0 && myGameArea.firstClick === false) {
    gameOneHourglass.speedX = -0.7;
    gameOneHourglass.speedY = -0.7;
    gameOneHourglass.growthH = 1;
    gameOneHourglass.growthW = 1;
    gameOneCountDownTimer.growthW = 1;
  }

  if (countDownTimer <= 3.00) {
    gameOneCountDownTimer.color = "red";
  }


  // textboble
  if (countDownTimer > 0) {
    switch (myGameArea.clickCounter) {
      case 0:
        gameOneButtonText.text = "Trykk på knappen for å starte spillet";
        break;
      case 1:
        gameOneButtonText.text = "Fortsett å trykke!";
        break;
      case 25:
        gameOneButtonText.text = "Smerte er midlertidig, ære varer evig";
        break;
      case 50:
        gameOneButtonText.text = "Sinnet bestemmer hva som er mulig";
        break;
      case 75:
        gameOneButtonText.text = "Dette kan bli rekord!";
        break;
      case 100:
        gameOneButtonText.text = "Jukser du?";
        break;
      case 125:
        gameOneButtonText.text = "MAXIMUM POWER";
        gameOneEasterEgg.speedY = 1;
        break;
    }
  } else {
    gameOneGubbeSprite.frame = 3;
    gameOneButtonText.text = "Du klarte " + myGameArea.clickCounter + " trykk på 10 sekunder";
  }


  if (gameOneEasterEgg.y > 600){
    gameOneEasterEgg.speedY = 0;
  }



  gameOneEasterEgg.newPos();

  gameOneBackground.update(myGameArea);
  gameOneEasterEgg.update(myGameArea);
  gameOneGubbeSprite.update(myGameArea);
  gameOneTextBubble.update(myGameArea);
  gameOneButtonText.update(myGameArea);
  gameOneScoreBackground.update(myGameArea);
  gameOneScoreText.text = score.get() + ",- Kr";
  gameOneScoreText.update(myGameArea);


  if (myGameArea.frameNo % 15 === 0) {
    if (gameOneGubbeSprite.frame < 3) {
      gameOneGubbeSprite.frame += 1;
    }
  }


  if (myGameArea.firstClick === false) {
    myGameArea.frameNo += 1;
    if (countDownTimer <= 0) {
      localStorage.setItem("buttonMashScore", score.get()) ;
      myGameArea.stop();
    } else {
      gameOneCountDownTimer.newPos();
      gameOneCountDownTimer.text = countDownTimer + "";
      gameOneCountDownTimer.update(myGameArea);

      gameOneHourglass.newPos();
      gameOneHourglass.update(myGameArea);

      if (myGameArea.clickCounter >= 25) {
        gameOneFace.update(myGameArea);
      }
    }
  } else {
    gameOneCountDownTimer.text = (10).toFixed(2) + "";
    gameOneCountDownTimer.update(myGameArea);
    gameOneHourglass.update(myGameArea);
  }


}


export {
  updateGameArea,
  updateGameAreaWithRng
};
