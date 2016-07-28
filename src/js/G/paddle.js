/*==============================================================================

Paddle Object

==============================================================================*/

G.prototype.Paddle = function( g, isPlayer ) {
	this.g = g;
	this.isPlayer = isPlayer;
	this.isEnemy = !isPlayer;
	this.y = this.g.stage.height / 2 - this.g.config.paddle.height / 2;
	this.z = 60;
	this.vx = 0;
	this.vy = 0;
	this.vxMax = 100;
	this.vyMax = 20;
	this.ax = 2;
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

	if ( this.isPlayer) {
		this.elem = document.querySelector( '.g-paddle-player' );
		this.x = 0;
	} else {
		this.elem = document.querySelector( '.g-paddle-enemy' );
		this.x = this.g.stage.width - this.g.config.paddle.width;
	}
};

G.prototype.Paddle.prototype.contain = function() {
	//this.y = Math.max( 0, this.y );
	//this.y = Math.min( this.g.stage.height - this.height, this.y );

	if ( this.y < 0 ) {
		this.y = 0;
		this.vy = 0;
		this.moveUp = false;
	}

	if ( this.y > this.g.stage.height - this.height ) {
		this.y = this.g.stage.height - this.height;
		this.vy = 0;
		this.moveDown = false;
	}
};

G.prototype.Paddle.prototype.checkCollisions = function() {
	if ( this.g.collisionAABB( this.g.ball, this ) ) {
		var ballAngle,
			ballSpeed,
			speed;

		if ( this.isPlayer ) {
			this.g.ball.x = this.x + this.width;

			ballAngle = -Math.PI / 4;
			ballSpeed = Math.sqrt( this.g.ball.vx * this.g.ball.vx + this.g.ball.vy * this.g.ball.vy );
				//paddleSpeed = Math.max( 0, Math.abs( game.state.paddleHero.vx ) * 1.2 );
			speed = ballSpeed;// + paddleSpeed;

			ballAngle = -Math.PI * 0.35 + ( ( this.g.ball.y + this.g.ball.height - this.y ) / ( this.height + this.g.ball.height ) ) * Math.PI * 0.7;

			this.g.ball.vx = Math.cos( ballAngle ) * speed;
			this.g.ball.vy = Math.sin( ballAngle ) * speed;

			for( var i = 0; i < 15; i++ ) {
				var size = this.g.rand( 10, 20 );
				this.g.particlesGreen.create({
					width: size,
					height: size,
					x: this.x + this.g.rand( 0, this.width ) - size / 2,
					y: this.y + this.g.rand( 0, this.height ) - size / 2,
					z: this.g.rand( 60, 120 ),
					vx: this.g.rand( -8, -4 ),
					vy: this.g.rand( -1, 1 ),
					vz: this.g.rand( -4, 4 ),
					rx: this.g.rand( 0, Math.PI * 2 ),
					ry: this.g.rand( 0, Math.PI * 2 ),
					rz: this.g.rand( 0, Math.PI * 2 ),
					decay: this.g.rand( 0.01, 0.05 ),
					friction: 0.95,
					shrink: true,
					opacity: 1
				});
			}
		} else {
			this.g.ball.x = this.x - this.g.ball.width;

			ballAngle = -Math.PI / 4;
			ballSpeed = Math.sqrt( this.g.ball.vx * this.g.ball.vx + this.g.ball.vy * this.g.ball.vy );
				//paddleSpeed = Math.max( 0, Math.abs( game.state.paddleHero.vx ) * 1.2 );
			speed = ballSpeed;// + paddleSpeed;

			ballAngle = -Math.PI * 0.35 + ( ( this.g.ball.y + this.g.ball.height - this.y ) / ( this.height + this.g.ball.height ) ) * Math.PI * 0.7;

			this.g.ball.vx = Math.cos( ballAngle ) * -speed;
			this.g.ball.vy = Math.sin( ballAngle ) * speed;

			for( var i = 0; i < 15; i++ ) {
				var size = this.g.rand( 10, 20 );
				this.g.particlesBlue.create({
					width: size,
					height: size,
					x: this.x + this.g.rand( 0, this.width ) - size / 2,
					y: this.y + this.g.rand( 0, this.height ) - size / 2,
					z: this.g.rand( 60, 120 ),
					vx: this.g.rand( 4, 8 ),
					vy: this.g.rand( -1, 1 ),
					vz: this.g.rand( -4, 4 ),
					rx: this.g.rand( 0, Math.PI * 2 ),
					ry: this.g.rand( 0, Math.PI * 2 ),
					rz: this.g.rand( 0, Math.PI * 2 ),
					decay: this.g.rand( 0.01, 0.05 ),
					friction: 0.95,
					shrink: true,
					opacity: 1
				});
			}
		}

		// ball particles
		for( var i = 0; i < 15; i++ ) {
			var size = this.g.rand( 10, 20 );
			this.g.particlesWhite.create({
				width: size,
				height: size,
				x: this.g.ball.x + this.g.rand( 0, this.g.ball.width ) - size / 2,
				y: this.g.ball.y + this.g.rand( 0, this.g.ball.height ) - size / 2,
				z: this.g.rand( 0, 60 ),
				vx: this.g.rand( -3, 3 ),
				vy: this.g.rand( -3, 3 ),
				vz: this.g.rand( -2, 2 ),
				rx: this.g.rand( 0, Math.PI * 2 ),
				ry: this.g.rand( 0, Math.PI * 2 ),
				rz: this.g.rand( 0, Math.PI * 2 ),
				decay: this.g.rand( 0.01, 0.05 ),
				friction: 0.99,
				shrink: true,
				opacity: 1
			});
		}

		this.g.triggerClass( this.elem, 'hit' );

		this.hasHit = true;

		var angle = Math.atan2( this.g.ball.vy, this.g.ball.vx );
		this.g.screenshake.apply({
			translate: 10,
			rotate: 0.3,
			xBias: Math.cos( angle ) * 400,
			yBias: Math.sin( angle ) * 0
		});

		if ( this.isPlayer ) {
			pg.soundPlay({
				name: 'spike-1',
				volume: 0.7,
				rate: this.g.rand( 1, 1.6 ) * ( 1 - ( 1 - this.g.timescale.current ) * 0.4 )
			});
			pg.soundPlay({
				name: 'spike-2',
				volume: 0.7,
				rate: this.g.rand( 1, 1.6 ) * ( 1 - ( 1 - this.g.timescale.current ) * 0.4 )
			});
			pg.soundPlay({
				name: 'spike-3',
				volume: 0.7,
				rate: this.g.rand( 1, 1.6 ) * ( 1 - ( 1 - this.g.timescale.current ) * 0.4 )
			});
		} else {
			pg.soundPlay({
				name: 'paddle-1',
				volume: 0.7,
				rate: this.g.rand( 1, 1.6 ) * ( 1 - ( 1 - this.g.timescale.current ) * 0.4 )
			});
		}
	}
};

G.prototype.Paddle.prototype.step = function() {
	if ( this.isEnemy ) {
		if ( !this.hasHit || Math.random() < 0.2 ) {
			this.moveUp = false;
			this.moveDown = false;
			if ( this.g.ball.y + this.g.ball.height < this.y + this.height / 2 ) {
				this.moveUp = true;
			} else if ( this.g.ball.y > this.y + this.height / 2 ) {
				this.moveDown = true;
			}
		}
	}

	if ( this.moveUp ) {
		//this.y -= this.speed * this.g.timescale.getDt();
		this.vy -= this.ay * this.g.timescale.getDt();
	} else if ( this.moveDown ) {
		//this.y += this.speed * this.g.timescale.getDt();
		this.vy += this.ay * this.g.timescale.getDt();
	} else {
		this.vy *= this.friction;
	}

	//this.angle = -Math.PI * 0.35 + ( ( this.g.ball.y + this.g.ball.height - this.y ) / ( this.height + this.g.ball.height ) ) * Math.PI * 0.7;
	//this.angle = Math.max( -Math.PI * 0.1, this.angle );
	//this.angle = Math.min( Math.PI * 0.1, this.angle );

	if( this.vx < -this.vxMax ) {
		this.vx = -this.vxMax;
	}
	if( this.vx > this.vxMax ) {
		this.vx = this.vxMax;
	}
	if( this.vy < -this.vyMax ) {
		this.vy = -this.vyMax;
	}
	if( this.vy > this.vyMax ) {
		this.vy = this.vyMax;
	}

	this.x += this.vx * this.g.timescale.getDt();
	this.y += this.vy * this.g.timescale.getDt();

	this.contain();
	this.checkCollisions();
};

G.prototype.Paddle.prototype.draw = function() {
	this.g.css( this.elem, 'transform', 'translate3d(' + this.x + 'px, ' + this.y + 'px, ' + this.z + 'px) rotateZ(' + this.angle + 'rad)' );
};