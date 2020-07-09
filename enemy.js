class Enemy {
  constructor(x, y, speed, color, type) {
    this.x = x;
    this.y = y;
    this.width = 55;
    this.height = 75;
    this.physical = true;
    this.weapon = false;
    this.type = type;
    this.speed = speed;
    this.color = color;
    this.attacking = false;
    this.enemySpriteTick = 0;
    this.SX = 0;
    this.SY = 0;
    this.distanceX = character.x * character.x - this.x * this.x;
    this.distanceY = character.y * character.y - this.y * this.y;
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
      this.distanceX = character.x * character.x - this.x * this.x;
      this.distanceY = character.y * character.y - this.y * this.y;
    }
  };
  enemySpriteLoop = () => {
    if (this.enemySpriteTick >= 10 && !this.attacking) {
      this.SX += 128;
      this.enemySpriteTick = 0;
    }
    if (this.enemySpriteTick >= 25 && this.attacking) {
      this.SX += 128;
      this.enemySpriteTick = 0;
    }
    if (this.SX >= 1024 && !this.attacking) {
      this.SX = 0;
    }
    if (this.attacking) {
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
      if (this.SX > 640) {
        this.SX = 0;
      }
    }
    if (this.type.typeName == "zombie") {
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
    } else if (this.type.typeName == "orc") {
      c.drawImage(
        orcImg,
        this.SX,
        this.SY,
        128,
        128,
        this.x - 30,
        this.y - 20,
        110,
        110
      );
    }
  };
  checkCollision = (entity) => {
    if (
      // Check if this enemy collides with any entity
      this.x <= entity.x + entity.width &&
      this.x + this.width >= entity.x &&
      this.y <= entity.y + entity.height &&
      this.y + this.height >= entity.y
    ) {
      let vectorX = (this.x + this.width) / 2 - (entity.x + entity.width) / 2;
      let vectorY = (this.y + this.height) / 2 - (entity.y + entity.height) / 2;

      if (entity == character) {
        // Is collision with character, then attack
        this.attacking = true;
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

      if (!entity.weapon && this.physical) {
        // Is collision with physical obj
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
      if (entity.weapon) {
        // enitity dies
        entityArr.splice(entityArr.indexOf(this), 1);
        enemyArr.splice(enemyArr.indexOf(this), 1);
        coinArr.push(
          new Coin(
            this.x,
            this.y,
            Math.round(
              Math.random() *
                (this.type.coinDrop.max - this.type.coinDrop.min) +
                this.type.coinDrop.min
            )
          )
        );
      }
    }
  };
}

let enemyType = {
  zombie: {
    typeName: "zombie",
    speed: { min: 3, max: 5 },
    coinDrop: { min: 0, max: 3 },
  },
  orc: {
    typeName: "orc",
    speed: { min: 1, max: 3 },
    coinDrop: { min: 1, max: 4 },
  },
};
