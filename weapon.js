class Sword {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.dx = 0;
    this.dy = 0;
  }
  draw = () => {
    c.fillStyle = "grey";
    c.arc(this.x, this.y, 20, 0, Math.PI * 2, false);
    c.fill();
  };
  swing = () => {
    this.draw();
    setTimeout(() => {
      swordExist = false;
    }, 1000);
  };
}
let sword;
let swordExist = false;
