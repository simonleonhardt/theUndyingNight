class Enemy {
  constructor(x, y, speed, color, type) {
    this.x = x;
    this.y = y;
    this.width = 55;
    this.height = 75;
    this.physical = true;
    this.type = type;
    this.speed = speed;
    this.color = color;
    this.attacking = false;
    this.zombieSpriteTick = 0;
    this.SX = 0;
    this.SY = 0;
    this.distanceX = character.x - this.x;
    this.distanceY = character.y - this.y;
  }
  chasePlayer = () => {
    if (!this.attacking) {
      if (this.distanceY * this.distanceY > this.distanceX * this.distanceX) {
        if (this.x > character.x) {
          this.x -= this.speed;
          this.SY = 128;
        }
        if (this.x < character.x) {
          this.x += this.speed;
          this.SY = 384;
        }
        if (this.y > character.y) {
          this.y -= this.speed;
          this.SY = 0;
        }
        if (this.y < character.y) {
          this.y += this.speed;
          this.SY = 256;
        }
      } else {
        if (this.y > character.y) {
          this.y -= this.speed;
          this.SY = 0;
        }
        if (this.y < character.y) {
          this.y += this.speed;
          this.SY = 256;
        }
        if (this.x > character.x) {
          this.x -= this.speed;
          this.SY = 128;
        }
        if (this.x < character.x) {
          this.x += this.speed;
          this.SY = 384;
        }
      }
    }
  };
  zombieSpriteLoop = () => {
    if (this.zombieSpriteTick >= 10 && !this.attacking) {
      this.SX += 128;
      this.zombieSpriteTick = 0;
    }
    if (this.zombieSpriteTick >= 20 && this.attacking) {
      this.SX += 128;
      this.zombieSpriteTick = 0;
    }
    if (this.SX >= 1024 && !this.attacking) {
      this.SX = 0;
    }
    if (this.attacking) {
      if (this.distanceY * this.distanceY > this.distanceX * this.distanceX) {
        if (this.x > character.x) {
          this.SY = 640;
        }
        if (this.x < character.x) {
          this.SY = 896;
        }
        if (this.y > character.y) {
          this.SY = 512;
        }
        if (this.y < character.y) {
          this.SY = 768;
        }
      } else {
        if (this.y > character.y) {
          this.SY = 512;
        }
        if (this.y < character.y) {
          this.SY = 768;
        }
        if (this.x > character.x) {
          this.SY = 640;
        }
        if (this.x < character.x) {
          this.SY = 896;
        }
      }
      if (this.SX > 640) {
        this.SX = 0;
      }
    }
    c.drawImage(
      zombieImg,
      this.SX,
      this.SY,
      128,
      128,
      this.x - 30,
      this.y - 20,
      110,
      110
    );
  };
  checkCollision = entity => {
    if (
      this.x <= entity.x + entity.width &&
      this.x + this.width >= entity.x &&
      this.y <= entity.y + entity.height &&
      this.y + this.height >= entity.y
    ) {
      let vectorX = this.x + this.width / 2 - (entity.x + entity.width / 2);
      let vectorY = this.y + this.height / 2 - (entity.y + entity.height / 2);

      if (entity == character) {
        this.attacking = true;
        this.zombieSpriteTick = 0;
        setTimeout(() => {
          this.attacking = false;
          if (
            this.x <= character.x + character.width &&
            this.x + this.width >= character.x &&
            this.y <= character.y + character.height &&
            this.y + this.height >= character.y
          ) {
            if (entityArr.indexOf(this) >= 0) {
              makeMenu();
            }
          }
        }, 2000);
      }

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
  zombie: { speed: { min: 3, max: 5 } },
  orc: { speed: { min: 1, max: 3 } }
};
