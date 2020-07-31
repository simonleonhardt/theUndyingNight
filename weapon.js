class Sword {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 35;
    this.height = 35;
    this.physical = false;
    this.weapon = true;
  }
}

//If more than 1 sword, delete all swords but 1
let clearMultipleSwords = () => {
  if (swordArr.length > 1) {
    for (let i = 1; swordArr.length > i; ) {
      swordArr.pop();
    }
  }
};

//Destory the sword
let destroySword = () => {
  swordArr.pop();
  entityArr.splice(entityArr.indexOf(swordArr[0]), 1);
  heroAttacking = false;
  swingingSword = false;
};

class Arrow {
  constructor(x, y, width, height, dx, dy, sy) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.dx = dx;
    this.dy = dy;
    this.sx = 0;
    this.sy = sy;
    this.physical = false;
    this.weapon = true;
  }
  //Move the arrow
  update = () => {
    this.x += this.dx;
    this.y += this.dy;
    if (
      this.x > window.innerWidth ||
      this.x + this.width < 0 ||
      this.y > window.innerHeight ||
      this.y + this.height < 0
    ) {
      arrowArr.splice(arrowArr.indexOf(this), 1);
      entityArr.splice(entityArr.indexOf(this), 1);
    }
  };
  //Sprite loop
  spriteLoop = () => {
    c.drawImage(
      arrowImg,
      this.sx,
      this.sy,
      139,
      102,
      this.x - 15,
      this.y - 15,
      50,
      50
    );
  };
}
