import Component from './component';

import coinOne from '../assets/img/game_three/Mynt_1_px.png';
import coinTwo from '../assets/img/game_three/Mynt_2_px.png';

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
const PLAYER_MOVEMENT_AREA = 460; // Default 140
const PLAYER_SPEED = 2; // Default 2

// Money
const MONEY_DROP_INTERVAL = 99; // Default 200
const MONEY_HEIGHT = 10; // Default 10
const MONEY_WIDTH = 10; // Default 10

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// GameThree
function updateGameArea(myGameArea, gameElements, prng) {

  let {
    myOpponentDesiredPosition,
    score,
    myMoney,
    myObstacles,
    myBackground,
    myOpponentPiece,
    myScoreBackground,
    myScoreText,
    myPlayerPiece
  } = gameElements;

  let aboutToCrashWith = null;

  if (myGameArea.frameNo === 0) {
    myGameArea.thiefScore = parseInt(localStorage.getItem("reactionGameScore"));
    myGameArea.dropScore = Math.ceil(myGameArea.thiefScore / 100);
  }


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
    if (myOpponentPiece.x < myOpponentPiece.desiredPosition)
      myOpponentPiece.speedX = 1;
    else myOpponentPiece.speedX = 0;
  };

  // Object avoidance
  for (let i = 0; i < myObstacles.length; i += 1) {

    // Collision between player and obstacle
    if (myPlayerPiece.interactWith(myObstacles[i])) {
      localStorage.setItem("sideScrollerScore", score.get());
      myGameArea.stop();
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
      score.update(myGameArea.dropScore);
      myMoney.splice(i, 1);
      //myOpponentPiece.desiredPosition -= 100;
      break;
    }
  }
  // Player and Opponent collision

  if (myPlayerPiece.interactWith(myOpponentPiece)) {
    score.update(myGameArea.thiefScore);
    myGameArea.options = 1;
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
    if (myGameArea.frameNo === 1) {
      myObstacles.push(new Component(OBSTACLE_WIDTH, 150, "green", 700, 0));
      myObstacles.push(new Component(OBSTACLE_WIDTH, 700 - 150 - gap, "green", 700, 150 + gap));

      myObstacles.push(new Component(OBSTACLE_WIDTH, 300, "green", 900, 0));
      myObstacles.push(new Component(OBSTACLE_WIDTH, 900 - 300 - gap, "green", 900, 300 + gap));
    }
  }
  // Moves obstacles
  for (let i = 0; i < myObstacles.length; i += 1) {
    myObstacles[i].x += -1;
    myObstacles[i].update(myGameArea);
  }


  if (myGameArea.frameNo % 5 === 0) {
    myPlayerPiece.frame = myGameArea.frameNo % 2;
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

    myGameArea.thiefScore -= myGameArea.dropScore;
    if (myGameArea.frameNo % 2 === 1) {
      myMoney.push(new Component(MONEY_WIDTH, MONEY_HEIGHT, coinOne, myOpponentPiece.x, myOpponentPiece.y + (myOpponentPiece.height / 2) - (MONEY_HEIGHT / 2), "image"));
    } else {
      myMoney.push(new Component(MONEY_WIDTH, MONEY_HEIGHT, coinTwo, myOpponentPiece.x, myOpponentPiece.y + (myOpponentPiece.height / 2) - (MONEY_HEIGHT / 2), "image"));
    }
  }

  myScoreBackground.update(myGameArea);
  // Score
  myScoreText.text = score.get() + ",- Kr";
  myScoreText.update(myGameArea);

  if (myGameArea.options === 1) {
    localStorage.setItem("sideScrollerScore", score.get());
    myGameArea.stop();
  }
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
  if (gameType === 3) {
    return function () {
      updateGameArea(myGameArea, gameElements, prng)
    }
  } else if (gameType === 1) {
    return function () {
      gameOne(myGameArea, gameElements)
    }
  } else if (gameType === 2) {
    return function () {
      gameTwo(myGameArea, gameElements)
    }
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
    score,
    gameOneHelpTextBackground,
    gameOneHelpTextLineOne,
    gameOneHelpTextLineTwo,
    gameOneHelpTextLineThree,
    gameOneHelpTextLineFour,
    gameOneHelpTextLineFive,
    gameOneHelpTextLineSix
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
    if (myGameArea.options === 1) {
      myGameArea.firstClick = false;
      myGameArea.readyToFire = false;
      score.update(123214);
      gameOneGubbeSprite.frame = Math.floor(Math.random() * 2.99);
      myGameArea.counter += 1;
    } else if (myGameArea.options === 0) {
      myGameArea.readyToFire = false;
      myGameArea.options = 1;
    }

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
    switch (myGameArea.counter) {
      case 0:
        gameOneGubbeSprite.frame = 3;
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
    gameOneButtonText.text = "Du klarte " + myGameArea.counter + " trykk på 10 sekunder";
  }


  if (gameOneEasterEgg.y > 600) {
    gameOneEasterEgg.speedY = 0;
  }


  gameOneEasterEgg.newPos();

  gameOneBackground.update(myGameArea);
  gameOneEasterEgg.update(myGameArea);
  gameOneGubbeSprite.update(myGameArea);

  if (myGameArea.options === 1) {
    gameOneTextBubble.update(myGameArea);
    gameOneButtonText.update(myGameArea);
  }
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
      localStorage.setItem("buttonMashScore", score.get());
      myGameArea.stop();
    } else {
      gameOneCountDownTimer.newPos();
      gameOneCountDownTimer.text = countDownTimer + "";
      gameOneCountDownTimer.update(myGameArea);

      gameOneHourglass.newPos();
      gameOneHourglass.update(myGameArea);

      if (myGameArea.counter >= 25) {
        gameOneFace.update(myGameArea);
      }
    }
  } else if (myGameArea.options === 1) {
    gameOneCountDownTimer.text = (10).toFixed(2) + "";
    gameOneCountDownTimer.update(myGameArea);
    gameOneHourglass.update(myGameArea);
  }

  if (myGameArea.options === 0) {
    gameOneHelpTextBackground.update(myGameArea);
    gameOneHelpTextLineOne.text = "Nivå 1: Hastighet";
    gameOneHelpTextLineOne.update(myGameArea);
    /*
    gameOneHelpTextLineTwo.text = "Følg instruksjonene for å starte spillet";
    gameOneHelpTextLineTwo.update(myGameArea);
    */
    gameOneHelpTextLineThree.text = "Trykk på knappen så mange ganger du klarer i løpet av 10 sekunder";
    gameOneHelpTextLineThree.update(myGameArea);
    gameOneHelpTextLineFour.text = "Tiden starter fra første trykk etter at denne hjelpeteksten er borte";
    gameOneHelpTextLineFour.update(myGameArea);
    /*
    gameOneHelpTextLineFive.text = "Trykker du for tidlig vil du miste halvparten av pengene i skattekassa";
    gameOneHelpTextLineFive.update(myGameArea);
    */
    gameOneHelpTextLineSix.text = "Trykk på en knapp for å fortsette..";
    gameOneHelpTextLineSix.update(myGameArea);
  }


}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// GameTwo
function gameTwo(myGameArea, gameElements) {


  let {
    gameTwoBackground,
    gameTwoGubbeSprite,
    gameTwoTextBubble,
    gameTwoKassaSprite,
    gameTwoScoreBackground,
    gameOneScoreText,
    gameOneButtonText,
    score,
    gameTwoHelpTextBackground,
    gameTwoHelpTextLineOne,
    gameTwoHelpTextLineTwo,
    gameTwoHelpTextLineThree,
    gameTwoHelpTextLineFour,
    gameTwoHelpTextLineFive,
    gameTwoHelpTextLineSix
  } = gameElements;


  myGameArea.clear();

  if (myGameArea.frameNo <= 0) {
    // get score
    score.update(parseInt(localStorage.getItem("buttonMashScore")));
    gameOneButtonText.text = "Trykk på knappen for å starte spillet";
    gameTwoKassaSprite.frame = 3;
    gameTwoGubbeSprite.frame = 0;
    myGameArea.reactTime = Math.round(Math.random() * (6 - 3) + 3);
  }


  // Gamepad integration
  if (myGameArea.gamepadConnected === true) {
    // Gamepad støtte om den er koblet til
    let gamepad = navigator.getGamepads()[0];
    let button1 = gamepad.buttons[0];
    myGameArea.keys["ArrowUp"] = button1.value === 1;
  }

  if (myGameArea.keys["ArrowUp"] && myGameArea.readyToFire === true) {
    myGameArea.readyToFire = false;
    myGameArea.firstClick = false;

    if (myGameArea.options === 2) {
      gameOneButtonText.text = "Du trykket for tidlig og mistet halvparten av pengene";
      gameTwoBackground.color = "#df4661";
      gameTwoGubbeSprite.frame = 1;
      score.update((score.get() / 2) * -1);
      gameTwoKassaSprite.frame = 3;
      localStorage.setItem("reactionGameScore", score.get());
      myGameArea.stop();
    } else if (myGameArea.options === 1) {
      gameOneButtonText.text = "Spillet er i gang, vent på signal..";
      myGameArea.options = 2;
    } else if (myGameArea.options === 0) {
      gameOneButtonText.text = "Trykk på knappen for å starte spillet";
      myGameArea.options = 1;
    }


    if (myGameArea.options === 3) {
      myGameArea.options = 4;
      gameOneButtonText.text = "Du brukte " + (myGameArea.frameNo * 1000) * 0.015 + "ms på å stoppe lekkasjen";
      gameTwoGubbeSprite.frame = 0;
      gameTwoBackground.color = "#CDB7BA";
      localStorage.setItem("reactionGameScore", score.get());
      myGameArea.stop();

    }
  }

  if (!myGameArea.keys["ArrowUp"]) {
    myGameArea.readyToFire = true;
  }

  if (myGameArea.options === 2) {
    myGameArea.counter += 1;
    if (myGameArea.reactTime === myGameArea.counter * 0.01) {
      myGameArea.frameNo = 1;
      gameOneButtonText.text = "TRYKK PÅ KNAPPEN!!!";
      gameTwoBackground.color = "#df4661";
      gameTwoGubbeSprite.frame = 1;
      myGameArea.options = 3;
    }
  }

  if (myGameArea.options === 3) {
    if (myGameArea.frameNo % 4 === 1) {
      gameTwoKassaSprite.frame = Math.floor(Math.random() * 2.99);
    }
    score.update(-65425);
  }


  myGameArea.frameNo += 1;

  gameTwoBackground.update(myGameArea);
  gameTwoKassaSprite.update(myGameArea);
  gameTwoGubbeSprite.update(myGameArea);
  gameTwoScoreBackground.update(myGameArea);
  gameOneScoreText.text = score.get() + ",- Kr";
  gameOneScoreText.update(myGameArea);
  if (myGameArea.options > 0) {
    gameTwoTextBubble.update(myGameArea);
    gameOneButtonText.update(myGameArea);
  }
  if (myGameArea.options === 0) {
    gameTwoHelpTextBackground.update(myGameArea);
    gameTwoHelpTextLineOne.text = "Nivå 2: Reaksjon";
    gameTwoHelpTextLineOne.update(myGameArea);
    /*
    gameTwoHelpTextLineTwo.text = "Følg instruksjonene for å starte spillet";
    gameTwoHelpTextLineTwo.update(myGameArea);
    */
    gameTwoHelpTextLineThree.text = "Når spillet er i gang er det viktig å ikke trykke på knappen før du får beskjed";
    gameTwoHelpTextLineThree.update(myGameArea);
    gameTwoHelpTextLineFour.text = "Trykker du for tidlig vil du miste halvparten av pengene i skattekassa";
    gameTwoHelpTextLineFour.update(myGameArea);
    /*
    gameTwoHelpTextLineFive.text = "Trykker du for tidlig vil du miste halvparten av pengene i skattekassa";
    gameTwoHelpTextLineFive.update(myGameArea);
    */
    gameTwoHelpTextLineSix.text = "Trykk på en knapp for å fortsette..";
    gameTwoHelpTextLineSix.update(myGameArea);
  }


}


export {
  updateGameArea,
  updateGameAreaWithRng
};
