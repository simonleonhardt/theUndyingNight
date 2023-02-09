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
  spriteLoop = () => {
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
              character.health -= this.damage;
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
        if (swordDamageTick == 20 && entity == swordArr[0]) {
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
          entityArr.forEach(entity => {
            if(entity == this) {
            }
          });
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
  spriteLoop = () => {
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
              character.health -= this.damage;
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
        if (swordDamageTick == 20 && entity == swordArr[0]) {
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
  constructor(dx, dy, piece, thrown, ...args) {
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
    this.thrown = thrown;
    this.landingPos = { x: character.x, y: character.y };
    this.distanceX;
    this.distanceY;
  }
  //If this is a piece, then move
  update = () => {
    if (this.piece) {
      this.x += this.dx;
      this.y += this.dy;
    }
    if (this.health <= 0 && !this.piece) {
      for (let i = 0; i < 4; i++) {
        boulderArr.push(
          new Boulder(
            Math.random() > 0.5 ? 1 : -1,
            Math.random() > 0.5 ? 1 : -1,
            true,
            false,
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
        character.health -= this.damage;
        entityArr.splice(entityArr.indexOf(this), 1);
        boulderArr.splice(boulderArr.indexOf(this), 1);
        return;
      }
      if (entity == character && this.thrown) {
        this.health = 0;
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
          return;
        }
      });
      if (entity.weapon) {
        swordDamageTick == 20 && entity == swordArr[0]
          ? (this.health -= swordDamage)
          : null;
        arrowArr.forEach((arrow) => {
          if (
            this.x <= arrow.x + arrow.width &&
            this.x + this.width >= arrow.x &&
            this.y <= arrow.y + arrow.height &&
            this.y + this.height >= arrow.y
          ) {
            this.health -= bowDamage;
            arrowArr.splice(arrowArr.indexOf(arrow), 1);
            entityArr.splice(arrowArr.indexOf(arrow), 1);
          }
        });
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
  beingThrown = () => {
    if (this.distanceY * this.distanceY > this.distanceX * this.distanceX) {
      if (this.x > this.landingPos.x) {
        this.x -= this.speed;
      }
      if (this.x < this.landingPos.x) {
        this.x += this.speed;
      }
      if (this.y > this.landingPos.y) {
        this.y -= this.speed;
      }
      if (this.y < this.landingPos.y) {
        this.y += this.speed;
      }
    } else {
      if (this.y > this.landingPos.y) {
        this.y -= this.speed;
      }
      if (this.y < this.landingPos.y) {
        this.y += this.speed;
      }
      if (this.x > this.landingPos.x) {
        this.x -= this.speed;
      }
      if (this.x < this.landingPos.x) {
        this.x += this.speed;
      }
    }
    this.distanceX = this.landingPos.x * this.landingPos.x - this.x * this.x;
    this.distanceY = this.landingPos.y * this.landingPos.y - this.y * this.y;
    if (this.x == this.landingPos.x && this.y == this.landingPos.y) {
      this.health = 0;
    }
  };
  //Sprite loop
  spriteLoop = () => {
    c.fillStyle = "grey";
    c.fillRect(this.x, this.y, this.width, this.height);
  };
}

class OgreBoss extends Enemy {
  constructor(...args) {
    super(...args);
    this.facing = "down";
    this.club;
    this.clubSwingFrame = Math.round(
      Math.random() * (this.type.attackSpeed.max - this.type.attackSpeed.min) +
        this.type.attackSpeed.min
    );
    this.chasingBoulder = false;
    this.boulder;
    this.throwingBoulder = false;
    this.boulderThrowFrame = Math.round(
      Math.random() * (this.type.attackSpeed.max - this.type.attackSpeed.min) +
        this.type.attackSpeed.min
    );
    this.boulderDistanceX;
    this.boulderDistanceY;
  }
  //Chases player or boulder
  chasePlayer = () => {
    if (!this.attacking) {
      if (this.chasingBoulder) {
        if (
          this.boulderDistanceY * this.boulderDistanceY >
          this.boulderDistanceX * this.boulderDsistanceX
        ) {
          if (this.x > this.boulder.x) {
            this.x -= this.speed;
            this.facing = "left";
          }
          if (this.x < this.boulder.x) {
            this.x += this.speed;
            this.facing = "right";
          }
          if (this.y > this.boulder.y) {
            this.y -= this.speed;
            this.facing = "up";
          }
          if (this.y < this.boulder.y) {
            this.y += this.speed;
            this.facing = "down";
          }
        } else {
          if (this.y > this.boulder.y) {
            this.y -= this.speed;
            this.facing = "up";
          }
          if (this.y < this.boulder.y) {
            this.y += this.speed;
            this.facing = "down";
          }
          if (this.x > this.boulder.x) {
            this.x -= this.speed;
            this.facing = "left";
          }
          if (this.x < this.boulder.x) {
            this.x += this.speed;
            this.facing = "right";
          }
        }
        this.boulderDistanceX =
          this.boulder.x * this.boulder.x - this.x * this.x;
        this.boulderDistanceY =
          this.boulder.y * this.boulder.y - this.y * this.y;
      } else {
        if (this.distanceY * this.distanceY > this.distanceX * this.distanceX) {
          if (this.x > character.x) {
            this.x -= this.speed;
            this.facing = "left";
          }
          if (this.x < character.x) {
            this.x += this.speed;
            this.facing = "right";
          }
          if (this.y > character.y) {
            this.y -= this.speed;
            this.facing = "up";
          }
          if (this.y < character.y) {
            this.y += this.speed;
            this.facing = "down";
          }
        } else {
          if (this.y > character.y) {
            this.y -= this.speed;
            this.facing = "up";
          }
          if (this.y < character.y) {
            this.y += this.speed;
            this.facing = "down";
          }
          if (this.x > character.x) {
            this.x -= this.speed;
            this.facing = "left";
          }
          if (this.x < character.x) {
            this.x += this.speed;
            this.facing = "right";
          }
        }
        this.distanceX = character.x * character.x - this.x * this.x;
        this.distanceY = character.y * character.y - this.y * this.y;
      }
    }
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
      }
      boulderArr.forEach((boulder) => {
        //If collision with boulder, then throw boulder
        if (
          this.x <= boulder.x + boulder.width &&
          this.x + this.width >= boulder.x &&
          this.y <= boulder.y + boulder.height &&
          this.y + this.height >= boulder.y &&
          boulder == this.boulder
        ) {
          this.chasingBoulder = false;
          this.throwingBoulder = true;
          this.attacking = true;
          boulderArr.splice(boulderArr.indexOf(boulder), 1);
          entityArr.splice(entityArr.indexOf(boulder), 1);
        }
      });

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
        if (swordDamageTick == 20 && entity == swordArr[0]) {
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
          bossArr.splice(bossArr.indexOf(this), 1);
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
  swingClub = () => {
    this.clubSwingFrame--;
    if (this.clubSwingFrame == 1) {
      switch (this.facing) {
        case "up":
          this.club = new Club(this.x, this.y - 50);
          entityArr.push(this.club);
          clubArr.push(this.club);
          break;
        case "down":
          this.club = new Club(this.x, this.y + this.height);
          entityArr.push(this.club);
          clubArr.push(this.club);
          break;
        case "left":
          this.club = new Club(this.x - 50, this.y);
          entityArr.push(this.club);
          clubArr.push(this.club);
          break;
        case "right":
          this.club = new Club(this.x + this.width, this.y);
          entityArr.push(this.club);
          clubArr.push(this.club);
          break;
      }
    }
    if (this.clubSwingFrame == 0) {
      entityArr.splice(entityArr.indexOf(this.club), 1);
      clubArr.splice(clubArr.indexOf(this.club), 1);
      this.club = null;
      this.attacking = false;
      this.clubSwingFrame = Math.round(
        Math.random() *
          (this.type.attackSpeed.max - this.type.attackSpeed.min) +
          this.type.attackSpeed.min
      );
      if (boulderArr.length > 0) {
        this.chasingBoulder = true;
        this.boulder =
          boulderArr[Math.round(Math.random() * (boulderArr.length - 1))];
      }
    }
  };
  throwingBoulderFunction = () => {
    this.boulderThrowFrame--;
    if (this.boulderThrowFrame == 0) {
      boulderArr.push(
        new Boulder(
          0,
          0,
          false,
          true,
          this.x,
          this.y - 60,
          50,
          50,
          true,
          enemyType.boulder
        )
      );
      entityArr.push(boulderArr[boulderArr.length - 1]);
      this.throwingBoulder = false;
      this.attacking = false;
      this.boulderThrowFrame = Math.round(
        Math.random() *
          (this.type.attackSpeed.max - this.type.attackSpeed.min) +
          this.type.attackSpeed.min
      );
    }
  };
  spriteLoop = () => {
    c.fillStyle = "red";
    c.fillRect(this.x, this.y, this.width, this.height);
  };
}

class Club {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 50;
    this.height = 50;
    this.damage = Math.round(Math.random() * (75 - 50) + 50);
    this.collide = true;
  }
  checkCollision = (collider) => {
    if (
      // Check if this enemy collides with any entity
      this.x <= collider.x + collider.width &&
      this.x + this.width >= collider.x &&
      this.y <= collider.y + collider.height &&
      this.y + this.height >= collider.y
    ) {
      this.collide = true;
      bossArr.forEach((boss) => {
        if (collider == boss) {
          this.collide = false;
        }
      });
      this.collide ? (collider.health -= this.damage) : null;
    }
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
    speed: { min: 2, max: 3 },
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
  ogreBoss: {
    typeName: "ogre",
    speed: { min: 1.5, max: 2 },
    coinDrop: { min: 10, max: 20 },
    damage: { min: 50, max: 75 },
    attackSpeed: { min: 200, max: 300 },
    health: { min: 1000, max: 1000 },
  },
};
