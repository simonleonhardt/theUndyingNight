let canvas;
let c;
let keyCode;
let keyPressed = false;
let character;
let entitiesArr = [];

// Start Game
let startGame = () => {
  document.querySelector("body").innerHTML = "<canvas></canvas>";

  canvas = document.querySelector("canvas");
  c = canvas.getContext("2d");

  character = new Character(300, 300, 50, 50);
  // entitiesArr.push(new Character(300, 300, 50, 50));

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // Heartbeat
  let heartbeat = () => {
    makeWorld();
    checkKeys();
    draw(character);
    update(character);
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
draw = elem => {
  c.fillStyle = elem.color;
  c.fillRect(elem.x, elem.y, elem.width, elem.height);
};

// Update Elements
update = elem => {
  elem.x += elem.dx;
  elem.y += elem.dy;
};

let checkKeys = () => {
  if (keyPressed) {
    if (keyCode == 83) {
      character.dy = 10;
      character.swordX = 0;
      character.swordY = 50;
    }
    if (keyCode == 87) {
      character.dy = -10;
      character.swordX = 0;
      character.swordY = -50;
    }
    if (keyCode == 68) {
      character.dx = 10;
      character.swordX = 50;
      character.swordY = 0;
    }
    if (keyCode == 65) {
      character.dx = -10;
      character.swordX = -50;
      character.swordY = 0;
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
