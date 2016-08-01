/*==============================================================================

Ball Object

==============================================================================*/

G.prototype.Ball = function( g ) {
	this.g = g;
	this.elem = document.querySelector('.g-ball-normal');
	this.serving = true;
	this.servingTimer = 0;
	this.servingTimerMax = this.g.opt.spin ? 100 : 60;
	this.x = this.g.stage.width / 2 - this.g.config.ball.width / 2;
	this.y = this.g.stage.height / 2 - this.g.config.ball.height / 2;
	this.z = this.g.opt.extrude ? 60 : 2;
	this.speed = this.g.config.ball.speed;
	this.vx = 0;
	this.vy = 0;
	this.friction = 0.92;
	this.width = this.g.config.ball.width;
	this.height = this.g.config.ball.height;
	this.rotation = this.g.opt.spin ? Math.PI / 4 : 0;
	this.opacity = 0;
	this.wasSpiked = false;

	this.ghost = {
		elem: document.querySelector('.g-ball-ghost'),
		x: this.x,
		y: this.y,
		z: 60,
		vx: 0,
		vy: 0,
		rotation: this.g.opt.spin ? Math.PI / 4 : 0,
		active: false
	}
};

G.prototype.Ball.prototype.reset = function() {
	this.serving = true;
	this.ghost.active = false;
	
	this.x = this.g.stage.width / 2 - this.width / 2;
	this.opacity = 0;
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
			if( this.g.opt.reaction ) {
				this.g.triggerClass( this.g.edgeTop, 'hit' );
			}
		} else {
			this.y = this.g.stage.height - this.height;
			if( this.g.opt.reaction ) {
				this.g.triggerClass( this.g.edgeBot, 'hit' );
			}
		}
		this.vy = -this.vy;

		pg.soundPlay({
			active: this.g.opt.sound,
			name: 'wall-1',
			volume: 0.5,
			rate: this.g.rand( 2.5, 4 ) * ( 1 - ( 1 - this.g.timescale.current ) * 0.4 )
		});

		var angle = Math.atan2( this.vy, this.vx );
		this.g.screenshake.apply({
			translate: 15,
			rotate: 0.15,
			xBias: Math.cos( angle ) * 0,
			yBias: Math.sin( angle ) * -90
		});

		if( this.g.opt.particles ) {
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
	}

	if ( this.ghost.y <= 0 || this.ghost.y + this.height >= this.g.stage.height ) {
		if ( this.ghost.y <= 0 ) {
			this.ghost.y = 0;
		} else {
			this.ghost.y = this.g.stage.height - this.height;
		}
		this.ghost.vy = -this.ghost.vy;
	}

	var hasScored = false;

	// player scored
	if ( !this.g.paddleCollision && this.x + this.width > this.g.stage.width ) {
		hasScored = true;
		this.g.scorePlayer.setValue( this.g.scorePlayer.value + 1 );
		if( this.g.opt.reaction ) {
			this.g.triggerClass( this.g.edgeRight, 'hit' );
			this.g.triggerClass( this.g.scorePlayer.elem, 'scored' );
		}
		this.g.enemyBlind += this.g.config.enemy.blindInc;
		this.g.enemyForesight += this.g.config.enemy.foresightInc;
		pg.soundPlay({
			active: this.g.opt.sound,
			name: 'score-player-2',
			volume: 0.9,
			rate: 1 * ( 1 - ( 1 - this.g.timescale.current ) * 0.4 )
			//rate: 2 * ( 1 - ( 1 - this.g.timescale.current ) * 0.4 )
		});
	}

	// ghost scored
	if ( this.ghost.active && this.ghost.x + this.width > this.g.stage.width ) {
		//this.ghost.active = false;
		this.ghost.vx = 0;
		this.ghost.vy = 0;
	}

	// enemy scored
	if ( !this.g.paddleCollision && this.x < 0 ) {
		hasScored = true;
		this.g.scoreEnemy.setValue( this.g.scoreEnemy.value + 1 );
		if( this.g.opt.reaction ) {
			this.g.triggerClass( this.g.edgeLeft, 'hit' );
			this.g.triggerClass( this.g.scoreEnemy.elem, 'scored' );
		}
		pg.soundPlay({
			active: this.g.opt.sound,
			name: 'score-enemy-2',
			volume: 0.5,
			rate: 1 * ( 1 - ( 1 - this.g.timescale.current ) * 0.4 )
			//rate: 1 * ( 1 - ( 1 - this.g.timescale.current ) * 0.4 )
		});
	}

	if( hasScored ) {
		this.speed += this.g.config.ball.inc;
		if( this.g.opt.reaction ) {
			this.g.triggerClass( this.g.overlay, 'flash' );
		}
		this.wasSpiked = false;

		this.g.screenshake.apply({
			translate: 30,
			rotate: 0.3,
			xBias: 0,
			yBias: 0
		});

		if( this.g.opt.particles ) {
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

		this.reset();
	}
};

G.prototype.Ball.prototype.step = function() {
	this.contain();

	if ( this.serving && !this.g.done ) {
		if ( this.servingTimer < this.servingTimerMax ) {
			this.servingTimer++;
			if( this.servingTimer === 45 ) {
				if( this.g.opt.spin ) {
					this.opacity = 0;
					this.y = this.g.stage.height / 2 - this.height / 2 + this.g.stage.height / 3;
					var k = pg.tween( this ).to(
						{
							y: this.g.stage.height / 2 - this.height / 2,
							opacity: 1
						},
						0.65,
						'inOutExpo'
					);
				} else {
					this.y = this.g.stage.height / 2 - this.height / 2;
					this.opacity = 1;
				}

				pg.soundPlay({
					active: this.g.opt.sound,
					name: 'whoosh-1',
					volume: 1.3,
					rate: 1 * ( 1 - ( 1 - this.g.timescale.current ) * 0.4 )
				});
			}
		} else {
			this.serving = false;
			this.servingTimer = 0;
			this.vx = this.speed;
			this.vy = this.speed;

			this.ghost.x = this.x;
			this.ghost.y = this.y;
			this.ghost.vx = this.speed * this.g.enemyForesight;
			this.ghost.vy = this.speed * this.g.enemyForesight;
			this.ghost.active = true;
		}
		if( this.g.opt.spin ) {
			this.rotation = Math.PI / 4;
		}
	} else {
		if( this.g.opt.spin ) {
			if ( this.vx > 0 ) {
				this.rotation += 0.005 * Math.abs( this.vx ) * this.g.timescale.getDt();
				this.ghost.rotation += 0.005 * Math.abs( this.ghost.vx ) * this.g.timescale.getDt();
			} else {
				this.rotation -= 0.005 * Math.abs( this.vx ) * this.g.timescale.getDt();
				this.ghost.rotation -= 0.005 * Math.abs( this.ghost.vx ) * this.g.timescale.getDt();
			}
		}
		this.x += this.vx * this.g.timescale.getDt();
		this.y += this.vy * this.g.timescale.getDt();

		this.ghost.x += this.ghost.vx * this.g.timescale.getDt();
		this.ghost.y += this.ghost.vy * this.g.timescale.getDt();

		// lock velocity
		if( Math.sqrt( this.vx * this.vx + this.vy * this.vy ) > this.speed ) {

			this.vx *= Math.pow( this.friction, this.g.timescale.getDt() );
			this.vy *= Math.pow( this.friction, this.g.timescale.getDt() );

			this.ghost.vx *= Math.pow( this.friction, this.g.timescale.getDt() );
			this.ghost.vy *= Math.pow( this.friction, this.g.timescale.getDt() );

			/*this.vx *= this.friction;
			this.vy *= this.friction;
			this.ghost.vx *= this.friction;
			this.ghost.vy *= this.friction;*/
		}

		if( this.g.opt.particles && !this.g.done ) {

			if( Math.random() < 0.5 * this.g.timescale.getDt() ) {
				var size = 60;
				if( this.wasSpiked ) {
					this.g.pulsesGreen.create({
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
				} else {
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
			}

			if( Math.random() < 0.6 * this.g.timescale.getDt() ) {
				var size = this.g.rand( 10, 20 );
				if( this.wasSpiked ) {
					this.g.particlesGreen.create({
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
				} else {
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
		}
	}
};

G.prototype.Ball.prototype.draw = function() {
	this.g.css( this.elem, {
		opacity: this.opacity,
		transform: 'translate3d(' + this.x + 'px, ' + this.y + 'px, ' + this.z + 'px) rotateZ(' + this.rotation + 'rad)'
	});

	if( this.g.opt.ghost ) {
		this.g.css( this.ghost.elem, {
			opacity: this.ghost.active ? 0.5 : 0,
			transform: 'translate3d(' + this.ghost.x + 'px, ' + this.ghost.y + 'px, ' + this.ghost.z + 'px) rotateZ(' + this.ghost.rotation + 'rad)'
		});
	}
};