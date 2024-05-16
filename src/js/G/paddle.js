/*==============================================================================

Paddle Object

==============================================================================*/

G.prototype.Paddle = function (g, isPlayer) {
  this.g = g;
  this.isPlayer = isPlayer;
  this.isEnemy = !isPlayer;
  this.y = this.g.stage.height / 2 - this.g.config.paddle.height / 2;
  this.z = this.g.opt.extrude ? 60 : 1;
  this.vx = 0;
  this.vy = 0;
  this.vxMax = 100;
  this.vyMax = 25;
  this.ax = 20;
  this.ay = 2;
  this.friction = 0.85;
  this.width = this.g.config.paddle.width;
  this.height = this.g.config.paddle.height;
  this.speed = this.g.config.paddle.speed;
  this.angle = 0;
  this.moveUp = false;
  this.moveDown = false;
  this.hasHit = false;

  this.isSpiking = false;
  this.canSpike = true;
  this.isCharging = false;
  this.currentCharge = 0;
  this.spikeRange = 200;
  this.spikeTarget = 0;
  this.chargeRate = 0.0075;
  this.chargeDecay = 0.075;
  this.lastCharge = 0;

  this.spikeHoldTick = 0;
  this.spikeHoldTickMax = 5;

  if (this.isPlayer) {
    this.elem = document.querySelector(".g-paddle-player");
    this.x = 0;
  } else {
    this.elem = document.querySelector(".g-paddle-enemy");
    this.x = this.g.stage.width - this.g.config.paddle.width;
  }

  this.chargeElem = document.querySelector(".g-charge");

  this.xOrigin = this.x;
};

G.prototype.Paddle.prototype.contain = function () {
  if (this.y < 0) {
    this.y = 0;
    this.vy = 0;
    this.moveUp = false;
  }

  if (this.y > this.g.stage.height - this.height) {
    this.y = this.g.stage.height - this.height;
    this.vy = 0;
    this.moveDown = false;
  }
};

G.prototype.Paddle.prototype.spike = function () {
  if (this.g.opt.spike && this.canSpike) {
    this.isSpiking = true;
    this.spikeTarget = this.spikeRange * this.currentCharge;
    this.lastCharge = this.currentCharge;
    this.g.removeClass(this.elem, "hit");
  }
};

G.prototype.Paddle.prototype.checkCollisions = function () {
  var tempRect;
  if (this.isPlayer) {
    tempRect = {
      x: this.x - 1000,
      y: this.y,
      width: this.width + 1000,
      height: this.height,
    };
  } else {
    tempRect = {
      x: this.x,
      y: this.y,
      width: this.width + 1000,
      height: this.height,
    };
  }

  if (this.g.collisionAABB(this.g.ball, tempRect)) {
    if (this.isPlayer && this.g.ball.vx > 0) {
      return;
    }

    if (this.isEnemy && this.g.ball.vx < 0) {
      return;
    }

    this.g.paddleCollision = true;

    var ballAngle, ballSpeed, paddleSpeed, speed;

    if (this.isPlayer) {
      ballAngle = -Math.PI / 4;
      ballSpeed = Math.sqrt(
        this.g.ball.vx * this.g.ball.vx + this.g.ball.vy * this.g.ball.vy
      );
      if (this.isSpiking) {
        pg.soundPlay({
          active: this.g.opt.sound,
          name: "spike-1",
          volume: this.lastCharge * 0.8,
          rate:
            this.g.rand(1, 1.6) * (1 - (1 - this.g.timescale.current) * 0.4),
        });
        pg.soundPlay({
          active: this.g.opt.sound,
          name: "spike-2",
          volume: this.lastCharge * 0.8,
          rate:
            this.g.rand(1, 1.6) * (1 - (1 - this.g.timescale.current) * 0.4),
        });
        pg.soundPlay({
          active: this.g.opt.sound,
          name: "spike-3",
          volume: this.lastCharge * 0.8,
          rate:
            this.g.rand(1, 1.6) * (1 - (1 - this.g.timescale.current) * 0.4),
        });
        if (this.lastCharge >= 1) {
          paddleSpeed = 25 + this.lastCharge * 175;
        } else {
          paddleSpeed = 25 + this.lastCharge * 125;
        }
      } else {
        paddleSpeed = 0;
      }
      speed = ballSpeed + paddleSpeed;

      if (this.isSpiking && this.lastCharge >= 1) {
        this.g.ball.wasSpiked = true;
        //if( this.currentCharge >= 1 ) {
        this.g.timescale.triggerSlowMo();
        if (this.g.opt.reaction) {
          this.g.triggerClass(this.g.overlay, "flash");
        }
        //}
      } else {
        this.g.ball.wasSpiked = false;
      }

      ballAngle =
        -Math.PI * 0.35 +
        ((this.g.ball.y + this.g.ball.height - this.y) /
          (this.height + this.g.ball.height)) *
          Math.PI *
          0.7;

      this.g.ball.x = this.x + this.width;
      if (this.g.opt.trajectory) {
        this.g.ball.vx = Math.cos(ballAngle) * speed;
        this.g.ball.vy = Math.sin(ballAngle) * speed;
      } else {
        this.g.ball.vx *= -1;
      }

      if (this.g.opt.reaction) {
        this.angle = ballAngle / 2;
      }

      if (this.g.opt.particles) {
        for (var i = 0; i < 15; i++) {
          var size = this.g.rand(10, 20);
          this.g.particlesGreen.create({
            width: size,
            height: size,
            x: this.x + this.g.rand(0, this.width) - size / 2,
            y: this.y + this.g.rand(0, this.height) - size / 2,
            z: this.g.rand(60, 120),
            vx: this.g.rand(-8, -4),
            vy: this.g.rand(-1, 1),
            vz: this.g.rand(-4, 4),
            rx: this.g.rand(0, Math.PI * 2),
            ry: this.g.rand(0, Math.PI * 2),
            rz: this.g.rand(0, Math.PI * 2),
            decay: this.g.rand(0.01, 0.05),
            friction: 0.95,
            shrink: true,
            opacity: 1,
          });
        }

        size = 60;
        this.g.pulsesGreen.create({
          width: size,
          height: size,
          x: this.g.ball.x + this.g.ball.width / 2 - size / 2,
          y: this.g.ball.y + this.g.ball.height / 2 - size / 2,
          z: 1,
          r: Math.PI / 4,
          shrink: false,
          decay: 0.05,
          opacity: 1,
        });
      }
    } else {
      this.g.ball.x = this.x - this.g.ball.width;

      ballAngle = -Math.PI / 4;
      ballSpeed = Math.sqrt(
        this.g.ball.vx * this.g.ball.vx + this.g.ball.vy * this.g.ball.vy
      );
      //paddleSpeed = Math.max( 0, Math.abs( game.state.paddleHero.vx ) * 1.2 );
      speed = ballSpeed; // + paddleSpeed;

      this.g.ball.wasSpiked = false;

      ballAngle =
        -Math.PI * 0.35 +
        ((this.g.ball.y + this.g.ball.height - this.y) /
          (this.height + this.g.ball.height)) *
          Math.PI *
          0.7;
      this.g.ball.x = this.x - this.g.ball.width;

      if (this.g.opt.trajectory) {
        this.g.ball.vx = Math.cos(ballAngle) * -speed;
        this.g.ball.vy = Math.sin(ballAngle) * speed;
      } else {
        this.g.ball.vx *= -1;
      }

      if (this.g.opt.reaction) {
        this.angle = -ballAngle / 2;
      }

      if (this.g.opt.particles) {
        for (var i = 0; i < 15; i++) {
          var size = this.g.rand(10, 20);
          this.g.particlesBlue.create({
            width: size,
            height: size,
            x: this.x + this.g.rand(0, this.width) - size / 2,
            y: this.y + this.g.rand(0, this.height) - size / 2,
            z: this.g.rand(60, 120),
            vx: this.g.rand(4, 8),
            vy: this.g.rand(-1, 1),
            vz: this.g.rand(-4, 4),
            rx: this.g.rand(0, Math.PI * 2),
            ry: this.g.rand(0, Math.PI * 2),
            rz: this.g.rand(0, Math.PI * 2),
            decay: this.g.rand(0.01, 0.05),
            friction: 0.95,
            shrink: true,
            opacity: 1,
          });
        }

        size = 60;
        this.g.pulsesBlue.create({
          width: size,
          height: size,
          x: this.g.ball.x + this.g.ball.width / 2 - size / 2,
          y: this.g.ball.y + this.g.ball.height / 2 - size / 2,
          z: 1,
          r: Math.PI / 4,
          shrink: false,
          decay: 0.05,
          opacity: 1,
        });
      }
    }

    // ball particles
    if (this.g.opt.particles) {
      for (var i = 0; i < 15; i++) {
        var size = this.g.rand(10, 20);
        this.g.particlesWhite.create({
          width: size,
          height: size,
          x: this.g.ball.x + this.g.rand(0, this.g.ball.width) - size / 2,
          y: this.g.ball.y + this.g.rand(0, this.g.ball.height) - size / 2,
          z: this.g.rand(0, 60),
          vx: this.g.rand(-3, 3),
          vy: this.g.rand(-3, 3),
          vz: this.g.rand(-2, 2),
          rx: this.g.rand(0, Math.PI * 2),
          ry: this.g.rand(0, Math.PI * 2),
          rz: this.g.rand(0, Math.PI * 2),
          decay: this.g.rand(0.01, 0.05),
          friction: 0.99,
          shrink: true,
          opacity: 1,
        });
      }
    }

    if (this.g.opt.reaction) {
      this.g.triggerClass(this.elem, "hit");
    }

    this.hasHit = true;

    var angle = Math.atan2(this.g.ball.vy, this.g.ball.vx);

    if (this.isSpiking) {
      if (this.lastCharge < 1) {
        this.g.screenshake.apply({
          translate: 15 + this.lastCharge * 100,
          rotate: 0.2,
          xBias: Math.cos(angle) * (450 + this.lastCharge * 400),
          yBias: Math.sin(angle) * 0,
        });
      }
    } else {
      this.g.screenshake.apply({
        translate: 15,
        rotate: 0.2,
        xBias: Math.cos(angle) * 450,
        yBias: Math.sin(angle) * 0,
      });
    }

    pg.soundPlay({
      active: this.g.opt.sound,
      name: "paddle-1",
      volume: 0.7,
      rate: this.g.rand(1.4, 2) * (1 - (1 - this.g.timescale.current) * 0.4),
      //pan: this.isPlayer ? -1 : 1
    });

    if (this.isPlayer) {
      this.g.ball.ghost.active = true;
      this.g.ball.ghost.x = this.g.ball.x;
      this.g.ball.ghost.y = this.g.ball.y;

      // this.g.ball.ghost.vx = Math.cos( ballAngle ) * ( speed * 2 );
      // this.g.ball.ghost.vy = Math.sin( ballAngle ) * ( speed * 2 );

      this.g.ball.ghost.vx =
        Math.cos(ballAngle) * (speed * this.g.enemyForesight);
      this.g.ball.ghost.vy =
        Math.sin(ballAngle) * (speed * this.g.enemyForesight);
    } else {
      this.g.ball.ghost.active = false;
    }
  }
};

G.prototype.Paddle.prototype.step = function () {
  if (this.isEnemy) {
    //if ( !this.hasHit || Math.random() < 0.2 ) {
    if (!this.hasHit || Math.random() < this.g.enemyBlind) {
      this.moveUp = false;
      this.moveDown = false;
      if (this.g.opt.trajectory && this.g.ball.ghost.active) {
        if (
          this.g.ball.ghost.y + this.g.ball.height <
          this.y + this.height / 2
        ) {
          this.moveUp = true;
        } else if (this.g.ball.ghost.y > this.y + this.height / 2) {
          this.moveDown = true;
        }
      } else {
        if (this.g.ball.y + this.g.ball.height < this.y + this.height / 2) {
          this.moveUp = true;
        } else if (this.g.ball.y > this.y + this.height / 2) {
          this.moveDown = true;
        }
      }
    }
  }

  if (this.g.opt.accel) {
    if (this.moveUp) {
      this.vy -= this.ay * this.g.timescale.getDt();
    } else if (this.moveDown) {
      this.vy += this.ay * this.g.timescale.getDt();
    } else {
      this.vy *= this.friction;
    }
  } else {
    if (this.moveUp) {
      this.y -= this.speed * this.g.timescale.getDt();
    } else if (this.moveDown) {
      this.y += this.speed * this.g.timescale.getDt();
    }
  }

  this.angle += (0 - this.angle) * 0.1;

  if (this.isSpiking) {
    this.canSpike = false;
    this.vx += this.ax;
  } else {
    this.vx -= this.ax / 20;
  }

  if (this.vx < -this.vxMax) {
    this.vx = -this.vxMax;
  }
  if (this.vx > this.vxMax) {
    this.vx = this.vxMax;
  }
  if (this.vy < -this.vyMax) {
    this.vy = -this.vyMax;
  }
  if (this.vy > this.vyMax) {
    this.vy = this.vyMax;
  }

  this.x += this.vx * this.g.timescale.getDt();
  if (this.isCharging && this.currentCharge > 0 && this.currentCharge <= 1) {
    this.y +=
      (this.vy / (1 + this.currentCharge * 4)) * this.g.timescale.getDt();
  } else {
    this.y += this.vy * this.g.timescale.getDt();
  }

  if (
    this.g.opt.spike &&
    this.isCharging &&
    this.currentCharge < 1 &&
    this.canSpike
  ) {
    this.currentCharge += this.chargeRate * this.g.timescale.getDt();
  }

  if ((!this.isCharging && this.currentCharge > 0) || !this.canSpike) {
    this.currentCharge -= this.chargeDecay * this.g.timescale.getDt();
    //this.currentCharge = 0;
  }

  this.currentCharge = Math.max(0, this.currentCharge);
  this.currentCharge = Math.min(1, this.currentCharge);

  if (
    this.g.opt.particles &&
    this.currentCharge > 0 &&
    Math.random() < this.currentCharge / 3
  ) {
    var size = this.g.rand(10, 20);
    this.g.particlesGreen.create({
      width: size,
      height: size,
      x: this.x,
      y: this.y + this.g.rand(0, this.height) - size / 2,
      z: this.g.rand(0, 60),
      vx: this.g.rand(-20, -10),
      vy: this.g.rand(-2, 2),
      vz: this.g.rand(-2, 2),
      rx: this.g.rand(0, Math.PI * 2),
      ry: this.g.rand(0, Math.PI * 2),
      rz: this.g.rand(0, Math.PI * 2),
      decay: this.g.rand(0.01, 0.05),
      friction: 0.9,
      shrink: true,
      opacity: 1,
    });
  }

  // lock x bounds
  if (this.x > this.spikeTarget) {
    this.x = this.spikeTarget;
    this.vx = 0;
    if (this.spikeHoldTick < this.spikeHoldTickMax) {
      this.spikeHoldTick++;
    } else {
      this.spikeHoldTick = 0;
      this.isSpiking = false;
    }
  }
  if (this.x < this.xOrigin) {
    this.x = this.xOrigin;
    this.vx = 0;
    if (this.g.opt.spike && !this.canSpike) {
      this.canSpike = true;
    }
  }

  if (this.isPlayer && this.g.opt.sound) {
    pg.sound.setVolume(pg.humLoop, 0.2 + this.currentCharge * 0.4);
    pg.sound.setPlaybackRate(pg.humLoop, this.currentCharge * 5);

    pg.sound.setVolume(pg.alarmLoop, 0.2 + this.currentCharge * 0.3);
    pg.sound.setPlaybackRate(pg.alarmLoop, this.currentCharge * 3);
  }

  if (this.isPlayer) {
    if (this.currentCharge >= 1) {
      this.g.addClass(this.elem, "hit");
    }
  }

  this.contain();
  this.checkCollisions();
};

G.prototype.Paddle.prototype.draw = function () {
  if (this.isCharging) {
    var opac =
      this.currentCharge < 1 ? 1 : 0.75 + Math.cos(Date.now() / 30) * 0.25;
    // chrome bug causing any opacity below zero to hide 3d children
    opac = 1;
    //opac = 0.9
    this.g.css(this.elem, {
      opacity: opac,
      transform:
        "translate3d(" +
        (this.x +
          this.g.rand(-this.currentCharge * 5, this.currentCharge * 5)) +
        "px, " +
        (this.y +
          this.g.rand(-this.currentCharge * 5, this.currentCharge * 5)) +
        "px, " +
        this.z +
        "px) rotateZ(" +
        (this.angle +
          this.g.rand(-this.currentCharge * 0.05, this.currentCharge * 0.05)) +
        "rad)",
    });
  } else {
    this.g.css(this.elem, {
      opacity: 1,
      transform:
        "translate3d(" +
        this.x +
        "px, " +
        this.y +
        "px, " +
        this.z +
        "px) rotateZ(" +
        this.angle +
        "rad)",
    });
  }
  if (this.isPlayer) {
    this.g.css(this.chargeElem, {
      opacity:
        this.currentCharge < 1
          ? this.currentCharge
          : 0.75 + Math.sin(Date.now() / 30) * 0.25,
      transform:
        "scaleX(" + (0.23 + this.currentCharge * 0.77) + ") translateZ( 2px )",
    });
  }
};
