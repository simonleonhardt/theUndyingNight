let canvas;
let c;
let keyCode;
let keyPressed = false;
let character;
let entitiesArr = [];
let heroImg = new Image();
heroImg.src = "images/hero.png";
let heroSX = 0;
let heroSY = 0;
let tick = 0;

// Start Game
let startGame = () => {
  document.querySelector("body").innerHTML = "<canvas></canvas>";

  canvas = document.querySelector("canvas");
  c = canvas.getContext("2d");

  character = new Character(300, 300, 50, 50);

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // Heartbeat
  let heartbeat = () => {
    makeWorld();
    checkKeys();
    update(character);
    spriteLoop();
    checkSword();
    drawEntities();
    window.requestAnimationFrame(heartbeat);
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
    if (
      (keyPressed && keyCode == 83) ||
      keyCode == 87 ||
      keyCode == 68 ||
      keyCode == 65
    ) {
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
    if (keyCode == 83) {
      character.dy = 7;
      character.swordX = 0;
      character.swordY = 50;
      heroSY = 0;
    }
    if (keyCode == 87) {
      character.dy = -7;
      character.swordX = 0;
      character.swordY = -50;
      heroSY = 96;
    }
    if (keyCode == 68) {
      character.dx = 7;
      character.swordX = 50;
      character.swordY = 0;
      heroSY = 64;
    }
    if (keyCode == 65) {
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

// Make menu
let makeMenu = () => {
  document.querySelector("body").innerHTML =
    "<div id='playButton' class='button'>PLAY</div>" +
    "<div id='optionsButton' class='button'>OPTIONS</div>" +
    "<div id='quitButton' class='button'>QUIT</div>";
  document.getElementById("playButton").addEventListener("click", () => {
    startGame();
  });
  document.getElementById("quitButton").addEventListener("click", () => {
    window.close();
  });
};

makeMenu();
