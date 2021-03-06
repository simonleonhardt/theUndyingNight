class Enemy {
  constructor(x, y, width, height, physical, type) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.physical = physical;
    this.weapon = false;
    this.type = type;
    this.speed = Math.round(
      Math.random() * (this.type.speed.max - this.type.speed.min) +
        this.type.speed.min
    );
    this.damage = Math.round(
      Math.random() * (this.type.damage.max - this.type.damage.min) +
        this.type.damage.min
    );
    this.health = Math.round(
      Math.random() * (this.type.health.max - this.type.health.min) +
        this.type.health.min
    );
    this.attacking = false;
    this.distanceX = character.x * character.x - this.x * this.x;
    this.distanceY = character.y * character.y - this.y * this.y;
  }
}

class Zombie extends Enemy {
  constructor(...args) {
    super(...args);
    this.enemySpriteTick = 0;
    this.SX = 0;
    this.SY = 0;
  }
  //Chases the player
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
  //Sprite loop
  enemySpriteLoop = () => {
    if (this.enemySpriteTick >= 10 && !this.attacking) {
      this.SX += 128;
      this.enemySpriteTick = 0;
    }
    if (this.enemySpriteTick >= 10 && this.attacking) {
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
  //Checks for all collision
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

      if (entity == character && !this.attacking) {
        // Is collision with character, then attack
        this.attacking = true;
        setTimeout(() => {
          if (
            this.x <= character.x + character.width &&
            this.x + this.width >= character.x &&
            this.y <= character.y + character.height &&
            this.y + this.height >= character.y
          ) {
            if (entityArr.indexOf(this) >= 0) {
              health -= this.damage;
            }
          }
          this.attacking = false;
        }, Math.round(Math.random() * (this.type.attackSpeed.max - this.type.attackSpeed.min) + this.type.attackSpeed.min));
      }

      if (!entity.weapon && entity.physical) {
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
        if (swordDamageTick == 10 && entity == swordArr[0]) {
          this.health -= swordDamage;
        }
        arrowArr.forEach((arrow) => {
          if (
            entity == arrow &&
            this.x <= entity.x + entity.width &&
            this.x + this.width >= entity.x &&
            this.y <= entity.y + entity.height &&
            this.y + this.height >= entity.y
          ) {
            this.health -= bowDamage;
            arrowArr.splice(arrowArr.indexOf(entity), 1);
            entityArr.splice(entityArr.indexOf(entity), 1);
          }
        });
        if (this.health <= 0) {
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
    }
  };
}

class Orc extends Enemy {
  constructor(...args) {
    super(...args);
    this.enemySpriteTick = 0;
    this.SX = 0;
    this.SY = 0;
  }
  //Chases the player
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
  //Sprite loop
  enemySpriteLoop = () => {
    if (this.enemySpriteTick >= 10 && !this.attacking) {
      this.SX += 128;
      this.enemySpriteTick = 0;
    }
    if (this.enemySpriteTick >= 10 && this.attacking) {
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
  };
  //Checks for all collision
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

      if (entity == character && !this.attacking) {
        // Is collision with character, then attack
        this.attacking = true;
        setTimeout(() => {
          if (
            this.x <= character.x + character.width &&
            this.x + this.width >= character.x &&
            this.y <= character.y + character.height &&
            this.y + this.height >= character.y
          ) {
            if (entityArr.indexOf(this) >= 0) {
              health -= this.damage;
            }
          }
          this.attacking = false;
        }, Math.round(Math.random() * (this.type.attackSpeed.max - this.type.attackSpeed.min) + this.type.attackSpeed.min));
      }

      if (!entity.weapon && entity.physical) {
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
      //If hit with a weapon, take damage
      if (entity.weapon) {
        if (swordDamageTick == 10 && entity == swordArr[0]) {
          this.health -= swordDamage;
        }
        arrowArr.forEach((arrow) => {
          if (
            entity == arrow &&
            this.x <= entity.x + entity.width &&
            this.x + this.width >= entity.x &&
            this.y <= entity.y + entity.height &&
            this.y + this.height >= entity.y
          ) {
            this.health -= bowDamage;
            arrowArr.splice(arrowArr.indexOf(entity), 1);
            entityArr.splice(entityArr.indexOf(entity), 1);
          }
        });
        //If at 0 health, then die
        if (this.health <= 0) {
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
          entityArr.push(coinArr[coinArr.length - 1]);
        }
      }
    }
  };
}

class Boulder extends Enemy {
  constructor(dx, dy, piece, ...args) {
    super(...args);
    this.dx =
      dx *
      Math.round(
        Math.random() * (this.type.speed.max - this.type.speed.min) +
          this.type.speed.min
      );
    this.dy =
      dy *
      Math.round(
        Math.random() * (this.type.speed.max - this.type.speed.min) +
          this.type.speed.min
      );
    this.piece = piece;
  }
  //If this is a piece, then move
  update = () => {
    this.x += this.dx;
    this.y += this.dy;
  };
  //Checks for all collision
  checkCollision = (entity) => {
    if (
      // Check if this enemy collides with any entity
      this.x <= entity.x + entity.width &&
      this.x + this.width >= entity.x &&
      this.y <= entity.y + entity.height &&
      this.y + this.height >= entity.y
    ) {
      if (entity == character && this.piece) {
        health -= this.damage;
        entityArr.splice(entityArr.indexOf(this), 1);
        boulderArr.splice(boulderArr.indexOf(this), 1);
        console.log(entityArr.indexOf(this));
        return;
      }
      enemyArr.forEach((enemy) => {
        if (
          entity == enemy &&
          this.x <= entity.x + entity.width &&
          this.x + this.width >= entity.x &&
          this.y <= entity.y + entity.height &&
          this.y + this.height >= entity.y &&
          enemy.typeName != "boulder" &&
          this.piece
        ) {
          enemy.health -= this.damage;
          entityArr.splice(entityArr.indexOf(this), 1);
          boulderArr.splice(boulderArr.indexOf(this), 1);
          console.log(entityArr.indexOf(this));
          return;
        }
      });
      if (entity.weapon) {
        swordDamageTick == 10 && entity == swordArr[0]
          ? (this.health -= swordDamage)
          : null;
        arrowArr.forEach((arrow) => {
          entity == arrow ? (this.health -= bowDamage) : null;
          arrowArr.splice(arrowArr.indexOf(arrow, 1));
        });
        if (this.health <= 0 && !this.piece) {
          for (let i = 0; i < 4; i++) {
            boulderArr.push(
              new Boulder(
                Math.random() > 0.5 ? 1 : -1,
                Math.random() > 0.5 ? 1 : -1,
                true,
                this.x,
                this.y,
                20,
                20,
                true,
                enemyType.boulder
              )
            );
            entityArr.push(boulderArr[boulderArr.length]);
          }
          entityArr.splice(entityArr.indexOf(this), 1);
          boulderArr.splice(boulderArr.indexOf(this), 1);
        }
      }
    }
    if (
      this.x > window.innerWidth ||
      this.x + this.width < 0 ||
      this.y > window.innerHeight ||
      this.y + this.height < 0
    ) {
      entityArr.splice(entityArr.indexOf(this), 1);
      boulderArr.splice(boulderArr.indexOf(this), 1);
    }
  };
  //Sprite loop
  spriteLoop = () => {
    c.fillStyle = "grey";
    c.fillRect(this.x, this.y, this.width, this.height);
  };
}

//All types of enemies with data for each
let enemyType = {
  zombie: {
    typeName: "zombie",
    speed: { min: 3, max: 5 },
    coinDrop: { min: 0, max: 3 },
    damage: { min: 10, max: 20 },
    attackSpeed: { min: 500, max: 1500 },
    health: { min: 30, max: 45 },
  },
  orc: {
    typeName: "orc",
    speed: { min: 1, max: 3 },
    coinDrop: { min: 1, max: 4 },
    damage: { min: 15, max: 30 },
    attackSpeed: { min: 1500, max: 2500 },
    health: { min: 45, max: 60 },
  },
  boulder: {
    typeName: "boulder",
    speed: { min: 4, max: 6 },
    coinDrop: null,
    damage: { min: 30, max: 40 },
    attackSpeed: null,
    health: { min: 20, max: 30 },
  },
};
