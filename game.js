let canvas;
let c;
let gameRunning = false;
let keyCode;
let keyPressed = false;
let character;
let heroImg = new Image();
heroImg.src = "images/hero.png";
let zombieImg = new Image();
zombieImg.src = "images/zombie.png";
let orcImg = new Image();
orcImg.src = "images/orc.png";
let coinImg = new Image();
coinImg.src = "images/coin.png";
let heroSX = 0;
let heroSY = 381;
let swordExist = false;
let heroAttacking = false;
let heroLastFacing = "right";
let heroSpriteTick = 0;
let coins = 0;
let health = 200;
let swordDamage = 15;
let upKey = { key: "w", keyCode: 87 };
let downKey = { key: "s", keyCode: 83 };
let rightKey = { key: "d", keyCode: 68 };
let leftKey = { key: "a", keyCode: 65 };
let enemyArr = [];
let swordArr = [];
let entityArr = [];
let coinArr = [];
let wave;

// Start Game
let startGame = () => {
  gameRunning = true;
  document.querySelector("body").innerHTML = "<canvas></canvas>";

  canvas = document.querySelector("canvas");
  c = canvas.getContext("2d");

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  character = new Character(300, 300, 55, 55);
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
    updateEnemies();
    updateCoins();
    drawScoreAndHealth();
    updateHealth();
    allSpriteLoop();
    if (gameRunning) {
      window.requestAnimationFrame(heartbeat);
    }
  };
  heartbeat();
};

// Make World
let makeWorld = () => {
  c.fillStyle = "#153d17";
  c.fillRect(0, 0, canvas.width, canvas.height);
};

// Listen for key changes
document.addEventListener("keydown", (e) => {
  keyPressed = true;
  keyCode = e.keyCode;
});

document.addEventListener("keyup", (e) => {
  keyPressed = false;
  if (e.keyCode == 83) {
    character.dy = 0;
  }
  if (e.keyCode == 87) {
    character.dy = 0;
  }
  if (e.keyCode == 68) {
    character.dx = 0;
  }
  if (e.keyCode == 65) {
    character.dx = 0;
  }
  if (e.keyCode == 32) {
    heroSX = 508;
  }
});

// Draw Elements
draw = (elem) => {};

// Update Elements
update = (elem) => {
  elem.x += elem.dx;
  elem.y += elem.dy;
};

let allSpriteLoop = () => {
  heroSpriteTick++;
  enemyArr.forEach((enemy) => {
    enemy.enemySpriteTick++;
  });
  heroSpriteLoop();
  enemyArr.forEach((enemy) => {
    enemy.enemySpriteLoop();
  });
};

let heroSpriteLoop = () => {
  if (heroSpriteTick >= 10) {
    if (keyPressed) {
      if (
        keyCode == upKey.keyCode ||
        keyCode == downKey.keyCode ||
        keyCode == rightKey.keyCode ||
        keyCode == leftKey.keyCode ||
        keyCode == 32
      )
        heroSX += 127;
    } else {
      heroSX = 0;
    }
    heroSpriteTick = 0;
  }
  if (heroSX >= 1016 && !heroAttacking) {
    heroSX = 0;
  }
  if (heroSX >= 635 && heroAttacking) {
    heroSX = 0;
  }
  if (heroAttacking) {
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
  c.drawImage(
    heroImg,
    heroSX,
    heroSY,
    127,
    126,
    character.x - 20,
    character.y - 20,
    90,
    90
  );
};

let checkKeys = () => {
  if (keyPressed) {
    if (!heroAttacking) {
      if (keyCode == downKey.keyCode) {
        if (!heroAttacking) {
          character.dy = 4;
          character.swordX = character.x + character.width / 2 - 17.5;
          character.swordY = character.y + character.height + 10;
          heroSY = 252;
          heroLastFacing = "down";
        }
      }
      if (keyCode == upKey.keyCode) {
        if (!heroAttacking) {
          character.dy = -4;
          character.swordX = character.x + character.width / 2 - 17.5;
          character.swordY = character.y - 35 - 10;
          heroSY = 0;
          heroLastFacing = "up";
        }
      }
      if (keyCode == rightKey.keyCode) {
        if (!heroAttacking) {
          character.dx = 4;
          character.swordX = character.x + character.width + 10;
          character.swordY = character.y + character.height / 2 - 17.5;
          heroSY = 378;
          heroLastFacing = "right";
        }
      }
      if (keyCode == leftKey.keyCode) {
        if (!heroAttacking) {
          character.dx = -4;
          character.swordX = character.x - 35 - 10;
          character.swordY = character.y + character.height / 2 - 17.5;
          heroSY = 126;
          heroLastFacing = "left";
        }
      }
      if (keyCode == 32) {
        character.dx = 0;
        character.dy = 0;
        swordArr.push(new Sword(character.swordX, character.swordY));
        entityArr.push(swordArr[0]);
        heroAttacking = true;
        setTimeout(destroySword, 500);
      }
      if (keyCode == 27) {
        makeMenu();
      }
    }
  }
};

let drawScoreAndHealth = () => {
  c.font = "20px Arial";
  c.fillStyle = "white";
  c.fillText("Wave: " + wave, 25, 25);
  c.fillText("Score: " + coins, 25, 50);
  c.fillStyle = "grey";
  c.fillRect(25, 60, 100, 25);
  c.fillStyle = "#D12B2B";
  c.fillRect(25, 60, health / 2, 25);
};

let updateHealth = () => {
  if (health <= 0) {
    makeMenu();
  }
};

let summonEnemy = (x, y, enemyType) => {
  enemyArr.push(
    new Enemy(
      x,
      y,
      Math.random() * (enemyType.speed.max - enemyType.speed.min) +
        enemyType.speed.min,
      enemyType.color,
      enemyType
    )
  );
  entityArr.push(enemyArr[enemyArr.length - 1]);
};

let makeWave = (numOfZombs, numOfOrcs) => {
  if (enemyArr.length == 0) {
    wave++;
    if (wave == 2) {
      entityArr.splice(entityArr.indexOf(swordArr[0]), 1);
    }
    for (let i = 0; i < numOfZombs; i++) {
      summonEnemy(
        Math.random() * canvas.width,
        Math.random() * canvas.height,
        enemyType.zombie
      );
    }
    for (let i = 0; i < numOfOrcs; i++) {
      summonEnemy(
        Math.random() * canvas.width,
        Math.random() * canvas.height,
        enemyType.orc
      );
    }
  }
};

let updateEnemies = () => {
  enemyArr.forEach((enemy) => {
    enemy.chasePlayer();
  });
};

checkAllCollision = () => {
  checkCharacterCollision();
  checkEnemyCollision();
};

checkCharacterCollision = () => {
  entityArr.forEach((collider) => {
    if (collider.physical) {
      if (collider != character) {
        character.checkCollision(collider);
      }
    }
  });
};

checkEnemyCollision = () => {
  enemyArr.forEach((enemy) => {
    entityArr.forEach((collider) => {
      if (collider != enemy) {
        enemy.checkCollision(collider);
      }
    });
  });
};

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
      coinArr.splice(coinArr.indexOf(this, 1));
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

let updateCoins = () => {
  for (i = 0; i < coinArr.length; i++) {
    coinArr[i].coinSpriteLoop();
    coinArr[i].pickedUp();
  }
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
