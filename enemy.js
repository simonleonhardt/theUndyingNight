class Enemy {
  constructor(x, y, speed) {
    this.x = x;
    this.y = y;
    this.speed = speed;
  }
  draw = () => {
    c.fillStyle = "coral";
    c.fillRect(this.x, this.y, 50, 50);
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

let enemyArr = [];
