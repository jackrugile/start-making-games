/*==============================================================================

Ball Object

==============================================================================*/

G.prototype.Ball = function( g ) {
	this.g = g;
	this.elem = document.querySelector('.g-ball');
	this.serving = true;
	this.servingTimer = 0;
	this.servingTimerMax = 60;
	this.x = this.g.stage.width / 2 - this.g.config.ball.width / 2;
	this.y = this.g.stage.height / 2 - this.g.config.ball.height / 2;
	this.z = 60;
	this.speed = this.g.config.ball.speed;
	this.vx = 0;
	this.vy = 0;
	this.friction = 0.95;
	this.width = this.g.config.ball.width;
	this.height = this.g.config.ball.height;
	this.rotation = Math.PI / 4;
	this.opacity = 1;
	this.reset();
};

G.prototype.Ball.prototype.reset = function() {
	this.serving = true;
	this.x = this.g.stage.width / 2 - this.width / 2;
	this.y = this.g.stage.height / 2 - this.height / 2 + this.g.stage.height / 3;
	this.opacity = 0;

	var k = pg.tween( this ).to(
		{
			y: this.g.stage.height / 2 - this.height / 2,
			opacity: 1
		},
		0.65,
		'inOutExpo'
	);

	this.vx = 0;
	this.vy = 0;
	//this.opacity = 0;
	this.g.paddlePlayer.hasHit = false;
	this.g.paddleEnemy.hasHit = false;
};

G.prototype.Ball.prototype.contain = function() {
	// wall was hit
	if ( this.y <= 0 || this.y + this.height >= this.g.stage.height ) {
		if ( this.y <= 0 ) {
			this.y = 0;
			this.g.triggerClass( this.g.edgeTop, 'hit' );
		} else {
			this.y = this.g.stage.height - this.height;
			this.g.triggerClass( this.g.edgeBot, 'hit' );
		}
		this.vy = -this.vy;

		pg.soundPlay({
			name: 'wall-1',
			volume: 0.5,
			rate: this.g.rand( 2, 3 ) * ( 1 - ( 1 - this.g.timescale.current ) * 0.4 )
		});

		var angle = Math.atan2( this.vy, this.vx );
		this.g.screenshake.apply({
			translate: 10,
			rotate: 0.15,
			xBias: Math.cos( angle ) * 0,
			yBias: Math.sin( angle ) * -75
		});

		for( var i = 0; i < 15; i++ ) {
			var size = this.g.rand( 10, 20 );
			this.g.particlesWhite.create({
				width: size,
				height: size,
				x: this.x + this.g.rand( 0, this.width ) - size / 2,
				y: this.y + this.g.rand( 0, this.height ) - size / 2,
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

		size = 60;
		this.g.pulsesWhite.create({
			width: size,
			height: size,
			x: this.x + this.width / 2 - size / 2,
			y: this.y + this.height / 2 - size / 2,
			z: 1,
			r: Math.PI / 4,
			shrink: false,
			decay: 0.05,
			opacity: 1
		});
	}

	var hasScored = false;

	// player scored
	if ( this.x + this.width > this.g.stage.width ) {
		hasScored = true;
		this.g.scorePlayer.setValue( this.g.scorePlayer.value + 1 );
		this.g.triggerClass( this.g.edgeRight, 'hit' );
		this.g.triggerClass( this.g.scorePlayer.elem, 'scored' );
		pg.soundPlay({
			name: 'score-player-1',
			volume: 0.3,
			rate: 2 * ( 1 - ( 1 - this.g.timescale.current ) * 0.4 )
		});
	}

	// enemy scored
	if ( this.x < 0 ) {
		hasScored = true;
		this.g.scoreEnemy.setValue( this.g.scoreEnemy.value + 1 );
		this.g.triggerClass( this.g.edgeLeft, 'hit' );
		this.g.triggerClass( this.g.scoreEnemy.elem, 'scored' );
		pg.soundPlay({
			name: 'score-enemy-1',
			volume: 0.7,
			rate: 1 * ( 1 - ( 1 - this.g.timescale.current ) * 0.4 )
		});
	}

	if( hasScored ) {
		this.speed += this.g.config.ball.inc;
		this.g.triggerClass( this.g.overlay, 'flash' );

		for( var i = 0; i < 15; i++ ) {
			var size = this.g.rand( 10, 20 );
			this.g.particlesWhite.create({
				width: size,
				height: size,
				x: this.x + this.g.rand( 0, this.width ) - size / 2,
				y: this.y + this.g.rand( 0, this.height ) - size / 2,
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

		size = 60;
		this.g.pulsesWhite.create({
			width: size,
			height: size,
			x: this.x + this.width / 2 - size / 2,
			y: this.y + this.height / 2 - size / 2,
			z: 1,
			r: Math.PI / 4,
			shrink: false,
			decay: 0.05,
			opacity: 1
		});

		this.reset();
	}
};

G.prototype.Ball.prototype.step = function() {
	if ( this.serving ) {
		if ( this.servingTimer < this.servingTimerMax ) {
			this.servingTimer++;
		} else {
			this.serving = false;
			this.servingTimer = 0;
			this.vx = this.speed;
			this.vy = this.speed;
		}
		this.rotation = Math.PI / 4;
	} else {
		if ( this.vx > 0 ) {
			this.rotation += 0.005 * Math.abs( this.vx ) * this.g.timescale.getDt();
		} else {
			this.rotation -= 0.005 * Math.abs( this.vx ) * this.g.timescale.getDt();
		}
		this.x += this.vx * this.g.timescale.getDt();
		this.y += this.vy * this.g.timescale.getDt();

		// lock velocity
		if( Math.sqrt( this.vx * this.vx + this.vy * this.vy ) > this.speed ) {
			this.vx *= this.friction;
			this.vy *= this.friction;
		}

		if( Math.random() < 0.5 * this.g.timescale.getDt() ) {
			var size = 60;
			this.g.pulsesWhite.create({
				width: size,
				height: size,
				x: this.x + this.width / 2 - size / 2,
				y: this.y + this.height / 2 - size / 2,
				z: 1 + this.g.rand( 0, 60 ),
				r: this.rotation,
				shrink: true,
				decay: 0.06,
				opacity: 0.25
			});
		}

		if( Math.random() < 0.5 * this.g.timescale.getDt() ) {
			var size = this.g.rand( 10, 20 );
			this.g.particlesWhite.create({
				width: size,
				height: size,
				x: this.x + this.g.rand( 0, this.width ) - size / 2,
				y: this.y + this.g.rand( 0, this.height ) - size / 2,
				z: this.g.rand( 0, 60 ),
				vx: -this.vx / 3,
				vy: -this.vy / 3,
				vz: this.g.rand( -2, 2 ),
				rx: this.g.rand( 0, Math.PI * 2 ),
				ry: this.g.rand( 0, Math.PI * 2 ),
				rz: this.g.rand( 0, Math.PI * 2 ),
				decay: this.g.rand( 0.01, 0.1 ),
				friction: 0.95,
				shrink: true,
				opacity: 1
			});
		}
	}

	this.contain();
};

G.prototype.Ball.prototype.draw = function() {
	this.g.css( this.elem, {
		opacity: this.opacity,
		transform: 'translate3d(' + this.x + 'px, ' + this.y + 'px, ' + this.z + 'px) rotateZ(' + this.rotation + 'rad)'
	});
};