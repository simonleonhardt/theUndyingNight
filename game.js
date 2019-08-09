let canvas;
let c;
let gameRunning = false;
let keyCode;
let keyPressed = false;
let character;
let heroImg = new Image();
heroImg.src = "images/hero.png";
let heroSX = 0;
let heroSY = 82;
let swordExist = false;
let tick = 0;
let upKey = { key: "w", keyCode: 87 };
let downKey = { key: "s", keyCode: 83 };
let rightKey = { key: "d", keyCode: 68 };
let leftKey = { key: "a", keyCode: 65 };
let enemyArr = [];
let swordArr = [];
let entityArr = [];

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

  // Heartbeat
  let heartbeat = () => {
    makeWorld();
    makeWave(Math.random() * 10, Math.random() * 5);
    checkKeys();
    draw(character);
    update(character);
    checkAllCollision();
    updateEnemies();
    swordArr.length > 0 ? swordArr[0].draw() : null;
    spriteLoop();
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
});

// Draw Elements
draw = elem => {};

// Update Elements
update = elem => {
  elem.x += elem.dx;
  elem.y += elem.dy;
};

let spriteLoop = () => {
  tick++;
  if (tick >= 10) {
    if (keyPressed) {
      if (
        keyCode == upKey.keyCode ||
        keyCode == downKey.keyCode ||
        keyCode == rightKey.keyCode ||
        keyCode == leftKey.keyCode
      )
        heroSX += 32;
    }
    tick = 0;
  }
  if (heroSX == 96) {
    heroSX = 0;
  }
  c.drawImage(
    heroImg,
    heroSX,
    heroSY,
    32,
    41,
    character.x - 10,
    character.y - 10,
    75,
    75
  );
};

let checkKeys = () => {
  if (keyPressed) {
    if (swordArr.length == 0) {
      if (keyCode == downKey.keyCode) {
        character.dy = 7;
        character.swordX = 0;
        character.swordY = 50;
        heroSY = 0;
      }
      if (keyCode == upKey.keyCode) {
        character.dy = -7;
        character.swordX = 0;
        character.swordY = -50;
        heroSY = 123;
      }
      if (keyCode == rightKey.keyCode) {
        character.dx = 7;
        character.swordX = 50;
        character.swordY = 0;
        heroSY = 82;
      }
      if (keyCode == leftKey.keyCode) {
        character.dx = -7;
        character.swordX = -50;
        character.swordY = 0;
        heroSY = 41;
      }
      if (keyCode == 32) {
        swordArr.push(
          new Sword(
            character.x + character.swordX,
            character.y + character.swordY
          )
        );
        entityArr.push(swordArr[0]);
        setTimeout(destroySword, 250);
      }
      if (keyCode == 27) {
        makeMenu();
      }
    }
  }
};

let summonEnemy = (x, y, enemyType) => {
  enemyArr.push(new Enemy(x, y, enemyType.speed, enemyType.color, enemyType));
  entityArr.push(enemyArr[enemyArr.length - 1]);
};

let makeWave = (numOfZombs, numOfOrcs) => {
  if (enemyArr.length == 0) {
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
    enemy.draw();
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
  document.querySelector("body").innerHTML =
    "<img src='images/theUndyingNightLogoEdited.jpg' id='logo'>" +
    "<img src='images/theUndyingNightTitleEdited.png' id='title'>" +
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
