class Enemy {
  constructor(x, y, speed, color) {
    this.x = x;
    this.y = y;
    this.width = 55;
    this.height = 55;
    this.speed = speed;
    this.color = color;
  }
  draw = () => {
    c.fillStyle = this.color;
    c.fillRect(this.x, this.y, this.width, this.height);
  };
  chasePlayer = () => {
    if (this.x > character.x) {
      this.x -= this.speed;
    }
    if (this.x < character.x) {
      this.x += this.speed;
    }
    if (this.y > character.y) {
      this.y -= this.speed;
    }
    if (this.y < character.y) {
      this.y += this.speed;
    }
  };
}

let enemyType = {
  zombie: { speed: 4, color: "green" },
  orc: { speed: 2, color: "coral" }
};
