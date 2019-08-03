let swordExist = false;

let destroySword = () => {
  swordArr.splice(0, 1);
};

class Sword {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 50;
    this.height = 50;
    this.dx = 0;
    this.dy = 0;
  }
  draw = () => {
    c.fillStyle = "grey";
    c.fillRect(this.x, this.y, this.width, this.height);
  };
}
