let canvas;
let c;
let gameRunning = false;
let keyCode;
let keyPressed = false;
let character;
let entitiesArr = [];
let heroImg = new Image();
heroImg.src = "images/hero.png";
let heroSX = 0;
let heroSY = 0;
let tick = 0;
let upKey = { key: "w", keyCode: 87 };
let downKey = { key: "s", keyCode: 83 };
let rightKey = { key: "d", keyCode: 68 };
let leftKey = { key: "a", keyCode: 65 };
let enemyArr = [];

// Start Game
let startGame = () => {
  gameRunning = true;
  document.querySelector("body").innerHTML = "<canvas></canvas>";

  canvas = document.querySelector("canvas");
  c = canvas.getContext("2d");

  character = new Character(300, 300, 50, 50);

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  makeWave(Math.random() * 5, Math.random() * 5);

  // Heartbeat
  let heartbeat = () => {
    makeWorld();
    checkKeys();
    update(character);
    updateEnemies();
    spriteLoop();
    checkSword();
    drawEntities();
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
    32,
    character.x,
    character.y,
    75,
    75
  );
};

let checkKeys = () => {
  if (keyPressed) {
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
      heroSY = 96;
    }
    if (keyCode == rightKey.keyCode) {
      character.dx = 7;
      character.swordX = 50;
      character.swordY = 0;
      heroSY = 64;
    }
    if (keyCode == leftKey.keyCode) {
      character.dx = -7;
      character.swordX = -50;
      character.swordY = 0;
      heroSY = 32;
    }
    if (keyCode == 32) {
      if (!swordExist) {
        sword = new Sword(
          character.x + character.width / 2 + character.swordX,
          character.y + character.height / 2 + character.swordY
        );
        sword.swing();
        swordExist = true;
      }
    }
    if (keyCode == 27) {
      makeMenu();
    }
  }
};

let drawEntities = () => {
  entitiesArr.map(ent => {
    draw(ent);
    update(ent);
  });
};

let checkSword = () => {
  if (swordExist) {
    sword.draw();
  }
};

let summonEnemy = (x, y, enemyType) => {
  enemyArr.push(new Enemy(x, y, enemyType.speed, enemyType.color));
};

let makeWave = (numOfZombs, numOfOrcs) => {
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
};

let updateEnemies = () => {
  enemyArr.forEach(enemy => {
    enemy.draw();
    enemy.chasePlayer();
  });
};

// Make menu
let makeMenu = () => {
  gameRunning = false;
  for (let i = 0; i < enemyArr.length; ) {
    enemyArr.pop();
  }
  document.querySelector("body").innerHTML =
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
