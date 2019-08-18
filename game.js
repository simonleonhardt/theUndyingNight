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
let heroSX = 0;
let heroSY = 381;
let swordExist = false;
let heroAttacking = false;
let heroLastFacing = "right";
let heroSpriteTick = 0;
let upKey = { key: "w", keyCode: 87 };
let downKey = { key: "s", keyCode: 83 };
let rightKey = { key: "d", keyCode: 68 };
let leftKey = { key: "a", keyCode: 65 };
let enemyArr = [];
let swordArr = [];
let entityArr = [];
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
    displayScore();
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
document.addEventListener("keydown", e => {
  keyPressed = true;
  keyCode = e.keyCode;
});

document.addEventListener("keyup", e => {
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
draw = elem => {};

// Update Elements
update = elem => {
  elem.x += elem.dx;
  elem.y += elem.dy;
};

let allSpriteLoop = () => {
  heroSpriteTick++;
  enemyArr.forEach(enemy => {
    enemy.zombieSpriteTick++;
  });
  heroSpriteLoop();
  enemyArr.forEach(enemy => {
    enemy.zombieSpriteLoop();
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
        character.dy = 7;
        character.swordX = character.x + character.width / 2 - 17.5;
        character.swordY = character.y + character.height + 10;
        heroSY = 252;
        heroLastFacing = "down";
      }
      if (keyCode == upKey.keyCode) {
        character.dy = -7;
        character.swordX = character.x + character.width / 2 - 17.5;
        character.swordY = character.y - 35 - 10;
        heroSY = 0;
        heroLastFacing = "up";
      }
      if (keyCode == rightKey.keyCode) {
        character.dx = 7;
        character.swordX = character.x + character.width + 10;
        character.swordY = character.y + character.height / 2 - 17.5;
        heroSY = 378;
        heroLastFacing = "right";
      }
      if (keyCode == leftKey.keyCode) {
        character.dx = -7;
        character.swordX = character.x - 35 - 10;
        character.swordY = character.y + character.height / 2 - 17.5;
        heroSY = 126;
        heroLastFacing = "left";
      }
      if (keyCode == 32) {
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

let displayScore = () => {
  c.font = "20px Arial";
  c.fillStyle = "white";
  c.fillText("Wave: " + wave, 25, 25);
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
  enemyArr.forEach(enemy => {
    enemy.chasePlayer();
  });
};

checkAllCollision = () => {
  checkCharacterCollision();
  checkEnemyCollision();
};

checkCharacterCollision = () => {
  entityArr.forEach(collider => {
    if (collider.physical) {
      if (collider != character) {
        character.checkCollision(collider);
      }
    }
  });
};

checkEnemyCollision = () => {
  enemyArr.forEach(enemy => {
    entityArr.forEach(collider => {
      if (collider != enemy) {
        enemy.checkCollision(collider);
      }
    });
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
