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
	this.width = this.g.config.ball.width;
	this.height = this.g.config.ball.height;
	this.rotation = Math.PI / 4;
	this.opacity = 1;
};

G.prototype.Ball.prototype.reset = function() {
	this.serving = true;
	this.x = this.g.stage.width / 2 - this.width / 2;
	this.y = this.g.stage.height / 2 - this.height / 2;
	this.vx = 0;
	this.vy = 0;
	this.g.paddlePlayer.hasHit = false;
	this.g.paddleEnemy.hasHit = false;
};

G.prototype.Ball.prototype.contain = function() {
	// wall was hit
	if ( this.y <= 0 || this.y + this.height >= this.g.stage.height ) {
		if ( this.y <= 0 ) {
			this.y = 0;
		} else {
			this.y = this.g.stage.height - this.height;
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

		for( var i = 0; i < 50; i++ ) {
			this.g.particles.create({
				color: '#fff',
				x: this.x + this.g.rand( 0, this.width ),
				y: this.y + this.g.rand( 0, this.height ),
				z: this.g.rand( 0, 120 )
			});
		}
	}

	// player scored
	if ( this.x + this.width > this.g.stage.width ) {
		this.g.scorePlayer.setValue( this.g.scorePlayer.value + 1 );
		this.speed += this.g.config.ball.inc;
		this.reset();
		pg.soundPlay({
			name: 'score-player-1',
			volume: 0.3,
			rate: 2 * ( 1 - ( 1 - this.g.timescale.current ) * 0.4 )
		});
	}

	// enemy scored
	if ( this.x < 0 ) {
		this.g.scoreEnemy.setValue( this.g.scoreEnemy.value + 1 );
		this.speed += this.g.config.ball.inc;
		this.reset();
		pg.soundPlay({
			name: 'score-enemy-1',
			volume: 0.7,
			rate: 1 * ( 1 - ( 1 - this.g.timescale.current ) * 0.4 )
		});
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
		//this.opacity = this.servingTimer / this.servingTimerMax;
	} else {
		if ( this.vx > 0 ) {
			this.rotation += 0.005 * Math.abs( this.vx ) * this.g.timescale.getDt();
		} else {
			this.rotation -= 0.005 * Math.abs( this.vx ) * this.g.timescale.getDt();
		}
		this.x += this.vx * this.g.timescale.getDt();
		this.y += this.vy * this.g.timescale.getDt();
		//this.opacity = 1;
	}

	this.contain();
};

G.prototype.Ball.prototype.draw = function() {
	this.g.css( this.elem, {
		opacity: this.opacity,
		transform: 'translate3d(' + this.x + 'px, ' + this.y + 'px, ' + this.z + 'px) rotateZ(' + this.rotation + 'rad)'
	});
};