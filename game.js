//Variables
let canvas;
let c;
let gameRunning = false;
let keyCode;
let character;
let heroImg = new Image();
heroImg.src = "images/hero.png";
let zombieImg = new Image();
zombieImg.src = "images/zombie.png";
let orcImg = new Image();
orcImg.src = "images/orc.png";
let coinImg = new Image();
coinImg.src = "images/coin.png";
let arrowImg = new Image();
arrowImg.src = "images/arrow.png";
let heroSX = 0;
let heroSY = 381;
let swordExist = false;
let heroAttacking = false;
let swingingSword = false;
let shootingBow = false;
let heroLastFacing = "right";
let heroSpriteTick = 0;
let coins = 0;
let health = 200;
let swordDamage = 15;
let swordDamageTick = 0;
let bowDamage = 20;
let bowShootTick = 0;
let upKey = { key: "w", keyCode: 87, pressed: false };
let downKey = { key: "s", keyCode: 83, pressed: false };
let rightKey = { key: "d", keyCode: 68, pressed: false };
let leftKey = { key: "a", keyCode: 65, pressed: false };
let swordKey = { key: "space", keyCode: 32, pressed: false };
let bowKey = { key: "e", keyCode: 69, pressed: false };
let enemyArr = [];
let swordArr = [];
let arrowArr = [];
let entityArr = [];
let coinArr = [];
let boulderArr = [];
let wave;
let devMode = false;

// Start Game
let startGame = () => {
  gameRunning = true;
  document.querySelector("body").innerHTML = "<canvas></canvas>";

  canvas = document.querySelector("canvas");
  c = canvas.getContext("2d");

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  character = new Character(300, 300, 55, 70);
  entityArr.push(character);

  wave = 0;

  // Heartbeat
  let heartbeat = () => {
    makeWorld();
    makeWave(Math.random() * 7, Math.random() * 4);
    checkKeys();
    update(character);
    clearMultipleSwords();
    checkAllCollision();
    weaponTickFunction();
    updateEnemies();
    updateArrows();
    updateCoins();
    drawScoreAndHealth();
    updateHealth();
    allSpriteLoop();
    if (devMode) {
      drawHitboxes();
    }
    if (gameRunning) {
      window.requestAnimationFrame(heartbeat);
    }
  };
  heartbeat();
};

//Resive canvas with window
window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

// Make World
let makeWorld = () => {
  c.fillStyle = "#153d17";
  c.fillRect(0, 0, canvas.width, canvas.height);
};

// Listen for key changes
document.addEventListener("keydown", (e) => {
  keyCode = e.keyCode;
  if (keyCode == upKey.keyCode) {
    upKey.pressed = true;
  } else if (keyCode == downKey.keyCode) {
    downKey.pressed = true;
  } else if (keyCode == rightKey.keyCode) {
    rightKey.pressed = true;
  } else if (keyCode == leftKey.keyCode) {
    leftKey.pressed = true;
  } else if (keyCode == swordKey.keyCode) {
    swordKey.pressed = true;
  } else if (keyCode == bowKey.keyCode) {
    bowKey.pressed = true;
  }
});

document.addEventListener("keyup", (e) => {
  if (e.keyCode == upKey.keyCode) {
    upKey.pressed = false;
  } else if (e.keyCode == downKey.keyCode) {
    downKey.pressed = false;
  } else if (e.keyCode == rightKey.keyCode) {
    rightKey.pressed = false;
  } else if (e.keyCode == leftKey.keyCode) {
    leftKey.pressed = false;
  } else if (e.keyCode == swordKey.keyCode) {
    swordKey.pressed = false;
  } else if (e.keyCode == bowKey.keyCode) {
    bowKey.pressed = false;
  }
  if (e.keyCode == 32) {
    heroSX = 508;
  }
  if (e.keyCode == 120) {
    devMode = !devMode;
  }
});

// Update Elements
update = (elem) => {
  elem.x += elem.dx;
  elem.y += elem.dy;
};

//Sprite loops
let allSpriteLoop = () => {
  heroSpriteTick++;
  enemyArr.forEach((enemy) => {
    enemy.enemySpriteTick++;
  });
  heroSpriteLoop();
  enemyArr.forEach((enemy) => {
    enemy.enemySpriteLoop();
  });
  arrowArr.forEach((arrow) => {
    arrow.spriteLoop();
  });
  boulderArr.forEach((boulder) => {
    boulder.spriteLoop();
  });
};

let heroSpriteLoop = () => {
  if (heroSpriteTick >= 10) {
    if (
      upKey.pressed ||
      downKey.pressed ||
      leftKey.pressed ||
      rightKey.pressed ||
      swingingSword ||
      shootingBow
    ) {
      if (!shootingBow) {
        heroSX += 127;
      } else if (shootingBow) {
        heroSX += 129;
      }
    } else {
      heroSX = 0;
    }
    heroSpriteTick = 0;
  }
  if (heroSX >= 1016 && !heroAttacking) {
    heroSX = 0;
  }
  if (heroSX >= 635 && swingingSword) {
    heroSX = 0;
  }
  if (heroSX >= 1600 && shootingBow) {
    heroSX = 774;
  }
  if (swingingSword) {
    if (heroLastFacing == "down") {
      heroSY = 756;
    } else if (heroLastFacing == "up") {
      heroSY = 504;
    } else if (heroLastFacing == "right") {
      heroSY = 882;
    } else if (heroLastFacing == "left") {
      heroSY = 630;
    }
  }
  if (shootingBow) {
    if (heroLastFacing == "down") {
      heroSY = 1296;
    } else if (heroLastFacing == "up") {
      heroSY = 1012;
    } else if (heroLastFacing == "right") {
      heroSY = 1417;
    } else if (heroLastFacing == "left") {
      heroSY = 1144;
    }
    c.drawImage(
      heroImg,
      heroSX + 10,
      heroSY,
      127,
      126,
      character.x - 20,
      character.y - 8,
      90,
      90
    );
  }
  if (!heroAttacking) {
    if (heroLastFacing == "down") {
      heroSY = 252;
    } else if (heroLastFacing == "up") {
      heroSY = 0;
    } else if (heroLastFacing == "right") {
      heroSY = 378;
    } else if (heroLastFacing == "left") {
      heroSY = 126;
    }
  }
  if (!heroAttacking || swingingSword) {
    c.drawImage(
      heroImg,
      heroSX,
      heroSY,
      127,
      126,
      character.x - 20,
      character.y - 8,
      90,
      90
    );
  }
};

//Draw hitboxes while in dev mode
let drawHitboxes = () => {
  c.fillStyle = "red";
  entityArr.forEach((entity) => {
    c.fillRect(entity.x, entity.y, entity.width, entity.height);
  });
};

//Check if keys are pressed or not
let checkKeys = () => {
  if (upKey.pressed == false && downKey.pressed == false) {
    character.dy = 0;
  }
  if (rightKey.pressed == false && leftKey.pressed == false) {
    character.dx = 0;
  }
  if (!heroAttacking) {
    if (downKey.pressed) {
      character.dy = 4;
      character.swordX = character.x + character.width / 2 - 17.5;
      character.swordY = character.y + character.height + 10;
      heroSY = 252;
      heroLastFacing = "down";
    }
    if (upKey.pressed) {
      character.dy = -4;
      character.swordX = character.x + character.width / 2 - 17.5;
      character.swordY = character.y - 35 - 10;
      heroSY = 0;
      heroLastFacing = "up";
    }

    if (rightKey.pressed) {
      character.dx = 4;
      character.swordX = character.x + character.width + 10;
      character.swordY = character.y + character.height / 2 - 17.5;
      heroSY = 378;
      heroLastFacing = "right";
    }
    if (leftKey.pressed) {
      character.dx = -4;
      character.swordX = character.x - 35 - 10;
      character.swordY = character.y + character.height / 2 - 17.5;
      heroSY = 126;
      heroLastFacing = "left";
    }
    if (swordKey.pressed) {
      heroAttacking = true;
      swingingSword = true;
      character.dx = 0;
      character.dy = 0;
      swordArr.push(new Sword(character.swordX, character.swordY));
      entityArr.push(swordArr[0]);
      setTimeout(destroySword, 100);
    }
  }
  if (bowKey.pressed) {
    heroAttacking = true;
    shootingBow = true;
    character.dx = 0;
    character.dy = 0;
    if (bowShootTick == 70) {
      arrowArr.push(
        new Arrow(
          heroLastFacing == "up" || "down"
            ? character.x + character.width / 2 - 10
            : heroLastFacing == "right"
            ? character.x + character.width + 5
            : heroLastFacing == "left"
            ? character.x - 5
            : null,
          heroLastFacing == "left" || "right"
            ? character.y + character.height / 2 - 10
            : heroLastFacing == "up"
            ? character.y - 5
            : heroLastFacing == "down"
            ? character.y + character.width + 5
            : null,
          10,
          10,
          heroLastFacing == "right" ? 5 : heroLastFacing == "left" ? -5 : null,
          heroLastFacing == "up" ? -5 : heroLastFacing == "down" ? 5 : null,
          heroLastFacing == "up"
            ? 0
            : heroLastFacing == "down"
            ? 193
            : heroLastFacing == "left"
            ? 114
            : heroLastFacing == "right"
            ? 303
            : null
        )
      );
      entityArr.push(arrowArr[arrowArr.length - 1]);
    }
  }
  if (keyCode == 27) {
    makeMenu();
  }
  if (!swordKey.pressed) {
    swingingSword = false;
  }
  if (!bowKey.pressed) {
    shootingBow = false;
  }
  if (!swordKey.pressed && !bowKey.pressed) {
    heroAttacking = false;
  }
};

//Draw the score and health
let drawScoreAndHealth = () => {
  c.font = "20px Arial";
  c.fillStyle = "white";
  c.fillText("Wave: " + wave, 25, 25);
  c.fillText("Score: " + coins, 25, 50);
  c.fillStyle = "#646262";
  c.fillRect(25, 60, 100, 25);
  c.fillStyle = "#D12B2B";
  c.fillRect(25, 60, health / 2, 25);
};

//Go to menu if player died
let updateHealth = () => {
  if (health <= 0) {
    makeMenu();
  }
};

//Do sword damage every 10 frames, shoots arrow every 70 frames
let weaponTickFunction = () => {
  swordDamageTick++;
  bowShootTick++;
  swordDamageTick == 11 ? (swordDamageTick = 0) : null;
  bowShootTick == 71 ? (bowShootTick = 0) : null;
};

//Update all arrows
let updateArrows = () => {
  arrowArr.forEach((arrow) => {
    arrow.update();
  });
};

//Summons enemy
let summonEnemy = (x, y, width, height, physical, enemyType) => {
  if (enemyType.typeName == "zombie") {
    enemyArr.push(new Zombie(x, y, width, height, physical, enemyType));
    entityArr.push(enemyArr[enemyArr.length - 1]);
  }
  if (enemyType.typeName == "orc") {
    enemyArr.push(new Orc(x, y, width, height, physical, enemyType));
    entityArr.push(enemyArr[enemyArr.length - 1]);
  }
  if (enemyType.typeName == "boulder") {
    boulderArr.push(new Boulder(x, y, width, height, physical, enemyType));
    entityArr.push(boulderArr[boulderArr.length - 1]);
  }
};

//Create a wave of enemies
let makeWave = (numOfZombs, numOfOrcs) => {
  if (enemyArr.length == 0) {
    wave++;
    for (let i = 0; i < numOfZombs; i++) {
      summonEnemy(
        Math.random() * canvas.width,
        Math.random() * canvas.height,
        55,
        75,
        true,
        enemyType.zombie
      );
    }
    for (let i = 0; i < numOfOrcs; i++) {
      summonEnemy(
        Math.random() * canvas.width,
        Math.random() * canvas.height,
        55,
        75,
        true,
        enemyType.orc
      );
    }
  }
};

//Make enemies chase the player and update boulder
let updateEnemies = () => {
  enemyArr.forEach((enemy) => {
    enemy.chasePlayer();
  });
  boulderArr.forEach((boulder) => {
    boulder.update();
  });
};

//Check for all collision
checkAllCollision = () => {
  checkCharacterCollision();
  checkEnemyCollision();
  checkOtherCollision();
};

checkCharacterCollision = () => {
  entityArr.forEach((collider) => {
    if (collider != undefined) {
      if (collider != character && collider.physical) {
        character.checkCollision(collider);
      }
    }
  });
};

checkEnemyCollision = () => {
  enemyArr.forEach((enemy) => {
    entityArr.forEach((collider) => {
      if (collider != undefined) {
        if (collider != enemy) {
          enemy.checkCollision(collider);
        }
      }
    });
  });
};

checkOtherCollision = () => {
  boulderArr.forEach((boulder) => {
    entityArr.forEach((collider) => {
      if (collider != undefined) {
        if (collider != boulder) {
          boulder.checkCollision(collider);
        }
      }
    });
  });
};

//Create coin
class Coin {
  constructor(x, y, value) {
    this.x = x;
    this.y = y;
    this.SX = 0;
    this.width = 25;
    this.height = 25;
    this.value = value;
    this.coinSpriteTick = 0;
  }
  pickedUp = () => {
    if (
      this.x < character.x + character.width &&
      this.x + this.width > character.x &&
      this.y < character.y + character.height &&
      this.y + this.height > character.y
    ) {
      coinArr.splice(coinArr.indexOf(this), 1);
      entityArr.splice(entityArr.indexOf(this), 1);
      coins += this.value;
    }
  };
  coinSpriteLoop = () => {
    this.coinSpriteTick++;
    if (this.coinSpriteTick >= 10) {
      this.SX += 50;
      this.coinSpriteTick = 0;
    }
    if (this.SX == 300) {
      this.SX = 0;
    }
    c.drawImage(coinImg, this.SX, 0, 50, 59, this.x, this.y, 50, 59);
  };
}

//Update coins
let updateCoins = () => {
  coinArr.forEach((coin) => {
    coin.coinSpriteLoop();
    coin.pickedUp();
  });
};

// Make menu
let makeMenu = () => {
  gameRunning = false;
  for (let i = 0; i < enemyArr.length; ) {
    enemyArr.pop();
  }
  for (let i = 0; i < entityArr.length; ) {
    entityArr.pop();
  }
  for (let i = 0; i < swordArr.length; ) {
    swordArr.pop();
  }
  health = 200;
  swordDamage = 15;
  coins = 0;

  document.querySelector("body").innerHTML =
    "<img src='images/theUndyingNightLogo.jpg' id='logo'>" +
    "<img src='images/theUndyingNightTitle.png' id='title'>" +
    "<div id='playButton' class='button'>PLAY</div>" +
    "<div id='optionsButton' class='button'>OPTIONS</div>" +
    "<div id='quitButton' class='button'>QUIT</div>";
  document.getElementById("playButton").addEventListener("click", () => {
    startGame();
  });
  document.getElementById("optionsButton").addEventListener("click", () => {
    document.querySelector("body").innerHTML =
      "<div class='button' id='upKeyDiv'>UP: " +
      upKey.key +
      "</div>" +
      "<div class='button' id='downKeyDiv'>DOWN: " +
      downKey.key +
      "</div>" +
      "<div class='button' id='rightKeyDiv'>RIGHT: " +
      rightKey.key +
      "</div>" +
      "<div class='button' id='leftKeyDiv'>LEFT: " +
      leftKey.key +
      "</div>" +
      "<div class = 'button' id='quitOptionsButton'>MENU</div>";
    document
      .getElementById("quitOptionsButton")
      .addEventListener("click", () => {
        makeMenu();
      });
  });
  document.getElementById("quitButton").addEventListener("click", () => {
    window.close();
  });
};

makeMenu();
