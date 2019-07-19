let canvas = document.querySelector("canvas");
let c = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Character {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.dx = 0;
    this.dy = 0;
    this.width = width;
    this.height = height;
    this.swordX = 50;
    this.swordY = 0;
  }
  draw = () => {
    c.fillStyle = "#5f9afa";
    c.fillRect(this.x, this.y, this.width, this.height);
  };
  update = () => {
    this.draw();
    this.x += this.dx;
    this.y += this.dy;
  };
}

let character = new Character(300, 300, 50, 50);

class Sword {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.dx = 0;
    this.dy = 0;
  }
  draw = () => {
    c.fillStyle = "grey";
    c.arc(this.x, this.y, 15, 0, Math.PI * 2, false);
    c.fill();
  };
  swing = () => {
    this.draw();
    setTimeout(() => {
      swordExist = false;
    }, 500);
  };
}
let sword;
let swordExist = false;

let keyCode;
let keyPressed = false;

let heartbeat = () => {
  c.fillStyle = "#153d17";
  c.fillRect(0, 0, canvas.width, canvas.height);
  character.update();
  if (swordExist) {
    sword.draw();
  }
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
  window.requestAnimationFrame(heartbeat);
};
heartbeat();

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
