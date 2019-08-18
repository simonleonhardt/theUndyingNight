class Sword {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 55;
    this.height = 55;
    this.physical = false;
  }
  draw = () => {
    c.fillStyle = "grey";
    c.fillRect(this.x, this.y, this.width, this.height);
  };
}

let clearMultipleSwords = () => {
  if (swordArr.length > 1) {
    for (let i = 1; swordArr.length > i; ) {
      swordArr.pop();
    }
  }
};

let destroySword = () => {
  swordArr.pop();
  entityArr.splice(entityArr.indexOf(swordArr[0]), 1);
};
