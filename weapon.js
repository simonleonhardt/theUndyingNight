let swordExist = false;

let destroySword = () => {
  swordArr.splice(0, 1);
};

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
