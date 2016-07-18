/*==============================================================================

Creation

==============================================================================*/

var G = function( opt ) {
	// configuration
	this.config = {
		paddle: {
			width: 60,
			height: 240,
			speed: 16
		},
		ball: {
			width: 60,
			height: 60,
			speed: 16,
			inc: 1
		},
		score: {
			max: 5
		}
	};

	// general
	this.raf = null;
	this.muted = false;
	this.paused = false;
	this.pausedTime = 0;
	this.pausedStartTime = null;
	this.pausedEndTime = null;

	// level / stage / world
	this.stage = new this.Stage( this );

	// ball
	this.ball = new this.Ball( this );

	// paddle player
	this.paddlePlayer = new this.Paddle( this, true );

	// paddle enemy
	this.paddleEnemy = new this.Paddle( this, false );

	// score / scoring
	this.scorePlayer = new this.Score( this, true );
	this.scoreEnemy = new this.Score( this, false );

	// screenshake
	this.screenshake = new this.Screenshake( this );

	// time / time scaling / timescale
	this.timescale = new this.Timescale( this );

	// initialize on creation
	this.init();
};

/*==============================================================================

Stage Object

==============================================================================*/

G.prototype.Stage = function( g ) {
	this.g = g;
	this.elem = document.querySelector('.pong');
	this.xDeg = 0;
	this.xDegTarget = 0;
	this.yDeg = 0;
	this.yDegTarget = 0;
	this.rangeDeg = 10;
	this.xTrans = 0;
	this.xTransTarget = 0;
	this.yTrans = 0;
	this.yTransTarget = 0;
	this.smoothingDeg = 0.05;
	this.rotation = 0;
	this.scaleBase = 0.85;
	this.scale = this.scaleBase;
	this.width = 1920;
	this.height = 1080;
};

G.prototype.Stage.prototype.step = function() {
	this.xDegTarget = ( ( this.g.ball.y / ( this.height - this.g.ball.height ) - 0.5 ) * 2 ) * this.rangeDeg;
	this.xDeg += ( this.xDegTarget - this.xDeg ) * this.smoothingDeg;

	this.yDegTarget = ( ( this.g.ball.x / ( this.width - this.g.ball.width ) - 0.5 ) * 2 ) * this.rangeDeg;
	this.yDeg += ( this.yDegTarget - this.yDeg ) * this.smoothingDeg;

	this.xTransTarget = ( -this.g.ball.x + this.width / 2 ) * 0.1 * ( ( 1 - this.g.timescale.current ) * 10 );
	this.xTrans += ( this.xTransTarget - this.xTrans ) * this.smoothingDeg;

	this.yTransTarget = ( -this.g.ball.y + this.height / 2 ) * 0.1 * ( ( 1 - this.g.timescale.current ) * 10 );
	this.yTrans += ( this.yTransTarget - this.yTrans ) * this.smoothingDeg;

	this.rotation = this.g.screenshake.angle;

	this.scale = this.scaleBase + ( ( 1 - this.g.timescale.current ) * 0.3 );
};

G.prototype.Stage.prototype.draw = function() {
	this.elem.style.transform = 'scale( ' + this.scale + ' ) translateX(' + ( this.xTrans + this.g.screenshake.x ) + 'px) translateY(' + ( this.yTrans + this.g.screenshake.y ) + 'px) rotateX(' + -this.xDeg + 'deg) rotateY(' + this.yDeg + 'deg) rotateZ(' + this.rotation + 'rad)';
};

/*==============================================================================

Ball Object

==============================================================================*/

G.prototype.Ball = function( g ) {
	this.g = g;
	this.elem = document.querySelector('.ball');
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
			rate: rand( 2, 3 ) * ( 1 - ( 1 - this.g.timescale.current ) * 0.4 )
		});

		var angle = Math.atan2( this.vy, this.vx );
		this.g.screenshake.apply({
			translate: 10,
			rotate: 0.15,
			xBias: Math.cos( angle ) * 0,
			yBias: Math.sin( angle ) * -75
		});
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
	} else {
		if ( this.vx > 0 ) {
			this.rotation += 0.1 * this.g.timescale.getDt();
		} else {
			this.rotation -= 0.1 * this.g.timescale.getDt();
		}
		this.x += this.vx * this.g.timescale.getDt();
		this.y += this.vy * this.g.timescale.getDt();
	}

	this.contain();
};

G.prototype.Ball.prototype.draw = function() {
	this.elem.style.transform = 'translate3d(' + this.x + 'px, ' + this.y + 'px, ' + this.z + 'px) rotateZ(' + this.rotation + 'rad)';
};

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
		this.elem = document.querySelector( '.paddle-player' );
		this.x = 0;
	} else {
		this.elem = document.querySelector( '.paddle-enemy' );
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
		if ( this.isPlayer ) {
			this.g.ball.x = this.x + this.width;

			var ballAngle = -Math.PI / 4,
				ballSpeed = Math.sqrt( this.g.ball.vx * this.g.ball.vx + this.g.ball.vy * this.g.ball.vy ),
				//paddleSpeed = Math.max( 0, Math.abs( game.state.paddleHero.vx ) * 1.2 );
				speed = ballSpeed;// + paddleSpeed;

			ballAngle = -Math.PI * 0.35 + ( ( this.g.ball.y + this.g.ball.height - this.y ) / ( this.height + this.g.ball.height ) ) * Math.PI * 0.7;

			this.g.ball.vx = Math.cos( ballAngle ) * speed;
			this.g.ball.vy = Math.sin( ballAngle ) * speed;

		} else {
			this.g.ball.x = this.x - this.g.ball.width;

			var ballAngle = -Math.PI / 4,
				ballSpeed = Math.sqrt( this.g.ball.vx * this.g.ball.vx + this.g.ball.vy * this.g.ball.vy ),
				//paddleSpeed = Math.max( 0, Math.abs( game.state.paddleHero.vx ) * 1.2 );
				speed = ballSpeed;// + paddleSpeed;

			ballAngle = -Math.PI * 0.35 + ( ( this.g.ball.y + this.g.ball.height - this.y ) / ( this.height + this.g.ball.height ) ) * Math.PI * 0.7;

			this.g.ball.vx = Math.cos( ballAngle ) * -speed;
			this.g.ball.vy = Math.sin( ballAngle ) * speed;
		}

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
				rate: rand( 1, 1.6 ) * ( 1 - ( 1 - this.g.timescale.current ) * 0.4 )
			});
			pg.soundPlay({
				name: 'spike-2',
				volume: 0.7,
				rate: rand( 1, 1.6 ) * ( 1 - ( 1 - this.g.timescale.current ) * 0.4 )
			});
			pg.soundPlay({
				name: 'spike-3',
				volume: 0.7,
				rate: rand( 1, 1.6 ) * ( 1 - ( 1 - this.g.timescale.current ) * 0.4 )
			});
		} else {
			pg.soundPlay({
				name: 'paddle-1',
				volume: 0.7,
				rate: rand( 1, 1.6 ) * ( 1 - ( 1 - this.g.timescale.current ) * 0.4 )
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
	this.elem.style.transform = 'translate3d(' + this.x + 'px, ' + this.y + 'px, ' + this.z + 'px) rotateZ(' + this.angle + 'rad)';
};

/*==============================================================================

Score Object

==============================================================================*/

G.prototype.Score = function( g, isPlayer ) {
	this.g = g;
	this.isPlayer = isPlayer;
	this.isEnemy = !isPlayer;
	this.value = 0;
	this.flag = true;

	if ( this.isPlayer) {
		this.elem = document.querySelector( '.score-player' );
	} else {
		this.elem = document.querySelector( '.score-enemy' );
	}
};

G.prototype.Score.prototype.setValue = function( value ) {
	this.value = value;
	this.flag = true;
};

G.prototype.Score.prototype.draw = function() {
	if ( this.flag ) {
		this.elem.innerHTML = this.value;
		this.elem.setAttribute( 'data-score', this.value );
		this.flag = false;
	}
};

/*==============================================================================

Screenshake Object

==============================================================================*/

G.prototype.Screenshake = function( g ) {
	this.g = g;
	this.translate = 0;
	this.rotate = 0;
	this.x = 0;
	this.y = 0;
	this.xTarget = 0;
	this.yTarget = 0;
	this.xBias  = 0;
	this.yBias  = 0;
	this.angle = 0;
	this.angleTarget = 0;
};

G.prototype.Screenshake.prototype.apply = function( opt ) {
	this.translate = opt.translate;
	this.rotate = opt.rotate;
	this.xBias = opt.xBias;
	this.yBias = opt.yBias;
};

G.prototype.Screenshake.prototype.step = function() {
	this.xBias *= 0.9;
	this.yBias *= 0.9;

	if ( this.translate > 0 ) {
		this.translate *= 0.9;
		this.xTarget = ( rand( -this.translate, this.translate ) + this.xBias );
		this.yTarget =( rand( -this.translate, this.translate ) + this.yBias );
	} else {
		this.xTarget = 0;
		this.yTarget = 0;
	}

	if ( this.rotate > 0 ) {
		this.rotate *= 0.9;
		this.angleTarget = rand( -this.rotate, this.rotate );
	} else {
		this.angleTarget = 0;
	}

	this.x += ( this.xTarget - this.x ) * 0.1;
	this.y += ( this.yTarget - this.y ) * 0.1;
	this.angle += ( this.angleTarget - this.angle ) * 0.1;
};

/*==============================================================================

Timescale Object

==============================================================================*/

G.prototype.Timescale = function( g ) {
	this.g = g;
	this.current = 1;
	this.target = 0.15;
	this.timer =0;
	this.timerMax = 180;
	this.inDuration = 0.6;
	this.outDuration = 1;
	this.isSlow = false;
};

G.prototype.Timescale.prototype.step = function() {
	if ( this.isSlow ) {
		if ( this.timer < this.timerMax ) {
			this.timer += this.getCoreDt();
		} else {
			this.timer = 0;
			this.isSlow = false;
			pg.tween( this ).to(
				{
					current: 1
				},
				this.outDuration,
				'inQuad'
			);
		}
	}
};

G.prototype.Timescale.prototype.triggerSlowMo = function() {
	if ( !this.isSlow ) {
		var sound = pg.playSound( 'slow-mo-1' );
		pg.sound.setVolume( sound, 1 );
		this.isSlow = true;
		pg.tween( this ).to(
			{
				current: this.target
			},
			this.inDuration,
			'outQuad'
		);
	}
};

G.prototype.Timescale.prototype.getDt = function() {
	return pg.getDt() * this.current;
};

G.prototype.Timescale.prototype.getInverseDt = function() {
	return 1 - pg.getDt() * this.current;
};

G.prototype.Timescale.prototype.getCoreDt = function() {
	return pg.getDt();
};

G.prototype.Timescale.prototype.getCoreInverseDt = function() {
	return 1 - pg.getDt();
};

/*==============================================================================

Initialize

==============================================================================*/

G.prototype.init = function() {
	this.addEventListeners();
	this.loop();
};

/*==============================================================================

Reset

==============================================================================*/

G.prototype.reset = function() {
	this.scorePlayer.setValue( 0 );
	this.scoreEnemy.setValue( 0 );
	this.ball.speed = this.config.ball.speed;
	this.ball.reset();
};

/*==============================================================================

Events / Add Event Listeners / Remove Event Listeners

==============================================================================*/

G.prototype.addEventListeners = function() {
	// need to create stored bound events for a common reference when removing event listeners

	this.controlUpDownBound = this.onControlUpDown.bind( this );
	this.controlDownDownBound = this.onControlDownDown.bind( this );
	this.controlUpUpBound = this.onControlUpUp.bind( this );
	this.controlDownUpBound = this.onControlDownUp.bind( this );
	this.mouseLeftDownBound = this.onMouseLeftDown.bind( this );
	this.controlMuteDownBound = this.onControlMuteDown.bind( this );
	this.controlPauseDownBound = this.onControlPauseDown.bind( this );

	window.addEventListener( 'controlUpDown', this.controlUpDownBound );
	window.addEventListener( 'controlDownDown', this.controlDownDownBound );
	window.addEventListener( 'controlUpUp', this.controlUpUpBound );
	window.addEventListener( 'controlDownUp', this.controlDownUpBound );
	window.addEventListener( 'mouseLeftDown', this.mouseLeftDownBound );
	/*window.addEventListener( 'mouseRightDown', this.onMouseRightDown.bind( this ) );
	window.addEventListener( 'mouseLeftUp', this.onMouseLeftUp.bind( this ) );
	window.addEventListener( 'mouseRightUp', this.onMouseRightUp.bind( this ) );*/
	window.addEventListener( 'controlMuteDown', this.controlMuteDownBound );
	window.addEventListener( 'controlPauseDown', this.controlPauseDownBound );
};

G.prototype.removeEventListeners = function() {
	window.removeEventListener( 'controlUpDown', this.controlUpDownBound );
	window.removeEventListener( 'controlDownDown', this.controlDownDownBound );
	window.removeEventListener( 'controlUpUp', this.controlUpUpBound );
	window.removeEventListener( 'controlDownUp', this.controlDownUpBound );
	window.removeEventListener( 'mouseLeftDown', this.mouseLeftDownBound );
	/*window.removeEventListener( 'mouseRightDown', this.onMouseRightDown.bind( this ) );
	window.removeEventListener( 'mouseLeftUp', this.onMouseLeftUp.bind( this ) );
	window.removeEventListener( 'mouseRightUp', this.onMouseRightUp.bind( this ) );*/
	window.removeEventListener( 'controlMuteDown', this.controlMuteDownBound );
	window.removeEventListener( 'controlPauseDown', this.controlPauseDownBound );
};

G.prototype.onControlUpDown = function() {
	this.paddlePlayer.moveUp = true;
};

G.prototype.onControlDownDown = function() {
	this.paddlePlayer.moveDown = true;
};

G.prototype.onControlUpUp = function() {
	this.paddlePlayer.moveUp = false;
};

G.prototype.onControlDownUp = function() {
	this.paddlePlayer.moveDown = false;
};

G.prototype.onMouseLeftDown = function() {
	if( !this.paused ) {
		this.timescale.triggerSlowMo();
	}
};

/*
G.prototype.onMouseRightDown = function() {
};

G.prototype.onMouseLeftUp = function() {
};

G.prototype.onMouseRightUp = function() {
};
*/

G.prototype.onControlMuteDown = function() {
	this.muteToggle();
};

G.prototype.onControlPauseDown = function() {
	this.pauseToggle();
};

/*==============================================================================

AABB Collision Detection / Axis Aligned Bounding Box

==============================================================================*/

G.prototype.collisionAABB = function( r1, r2 ) {
	if (!(
		r1.x > r2.x + r2.width ||  // rect1 is on the right of rect2
		r1.x + r1.width < r2.x ||  // rect1 is on the left of rect2
		r1.y > r2.y + r2.height || // rect1 is below rect2
		r1.y + r1.height < r2.y    // rect1 is above rect2
	)) {
		return true;
	}
};

/*==============================================================================

Check Win State

==============================================================================*/

G.prototype.checkWinState = function() {
	if ( this.scorePlayer.value >= this.config.score.max ) {
		console.log( 'You Won!' );
		this.reset();
	} else if ( this.scoreEnemy.value >= this.config.score.max  ) {
		console.log( 'You Lost!' );
		this.reset();
	}
};

/*==============================================================================

Mute / Umute / Mute Toggle

==============================================================================*/

G.prototype.muteToggle = function() {
	if( this.muted ) {
		this.unmute();
	} else {
		this.mute();
	}
};

G.prototype.mute = function() {
	this.muted = true;
	pg.sound.setMaster( 0 );
};

G.prototype.unmute = function() {
	this.muted = false;
	pg.sound.setMaster( 1 );
};

/*==============================================================================

Pause / Unpause / Pause Toggle

==============================================================================*/

G.prototype.pauseToggle = function() {
	if( this.paused ) {
		this.unpause();
	} else {
		this.pause();
	}
};

G.prototype.pause = function() {
	this.paused = true;
	document.documentElement.classList.add( 'paused' );
};

G.prototype.unpause = function() {
	this.paused = false;
	document.documentElement.classList.remove( 'paused' );
};

/*==============================================================================

Step / Update

==============================================================================*/

G.prototype.step = function() {
	if( this.paused ) {
		return;
	}
	this.stage.step();
	this.paddlePlayer.step();
	this.paddleEnemy.step();
	this.ball.step();
	this.screenshake.step();
	this.timescale.step();
	this.checkWinState();
};

/*==============================================================================

Draw / Render

==============================================================================*/

G.prototype.draw = function() {
	this.stage.draw();
	this.paddlePlayer.draw();
	this.paddleEnemy.draw();
	this.ball.draw();
	this.scorePlayer.draw();
	this.scoreEnemy.draw();
};

/*==============================================================================

Loop

==============================================================================*/

G.prototype.loop = function() {
	this.raf = requestAnimationFrame( this.loop.bind( this ) );
	this.step();
	this.draw();
};

/*==============================================================================

Kill / Destroy

==============================================================================*/

G.prototype.kill = function() {
	this.config = null;
	this.stage = null;
	this.ball = null;
	this.paddlePlayer = null;
	this.paddleEnemy = null;
	this.scorePlayer = null;
	this.scoreEnemy = null;
	this.screenshake = null;
	this.timescale = null;
	this.unpause();
	this.removeEventListeners();
	cancelAnimationFrame( this.raf );
};