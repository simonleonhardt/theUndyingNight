class Enemy {
  constructor(x, y, speed, color, type) {
    this.x = x;
    this.y = y;
    this.width = 55;
    this.height = 55;
    this.physical = true;
    this.type = type;
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
  checkCollision = entity => {
    if (
      this.x < entity.x + entity.width &&
      this.x + this.width > entity.x &&
      this.y < entity.y + entity.height &&
      this.y + this.height > entity.y
    ) {
      let vectorX = this.x + this.width / 2 - (entity.x + entity.width / 2);
      let vectorY = this.y + this.height / 2 - (entity.y + entity.height / 2);

      if (entity.physical) {
        if (vectorX * vectorX > vectorY * vectorY) {
          if (vectorX > 0) {
            this.x = entity.x + entity.width;
          } else {
            this.x = entity.x - this.width;
          }
        } else {
          if (vectorY > 0) {
            this.y = entity.y + entity.height;
          } else {
            this.y = entity.y - this.height;
          }
        }
      } else {
        entityArr.splice(entityArr.indexOf(this), 1);
        enemyArr.splice(enemyArr.indexOf(this), 1);
      }
    }
  };
}

let enemyType = {
  zombie: { speed: 4, color: "green" },
  orc: { speed: 2, color: "coral" }
};
