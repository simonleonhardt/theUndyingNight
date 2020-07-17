class Character {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.dx = 0;
    this.dy = 0;
    this.width = width;
    this.height = height;
    this.physical = true;
    this.weapon = false;
    this.swordX = this.x + this.width;
    this.swordY = this.y + this.height / 2 - 17.5;
  }
  checkCollision = (entity) => {
    if (
      this.x < entity.x + entity.width &&
      this.x + this.width > entity.x &&
      this.y < entity.y + entity.height &&
      this.y + this.height > entity.y
    ) {
      let vectorX = this.x + this.width / 2 - (entity.x + entity.width / 2);
      let vectorY = this.y + this.height / 2 - (entity.y + entity.height / 2);

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
    }
    if (this.x <= 0) {
      this.x = 0;
    }
    if (this.x + this.width >= window.innerWidth) {
      this.x = window.innerWidth - this.width;
    }
    if (this.y <= 10) {
      this.y = 10;
    }
    if (this.y + this.height > window.innerHeight) {
      this.y = window.innerHeight - this.height;
    }
  };
}
