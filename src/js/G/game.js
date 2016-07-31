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
			speed: 24,
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

	// restart music
	pg.startMusic();

	// level / stage / world
	this.stage = new this.Stage( this );

	// paddle player
	this.paddlePlayer = new this.Paddle( this, true );

	// paddle enemy
	this.paddleEnemy = new this.Paddle( this, false );

	// ball
	this.ball = new this.Ball( this );

	// score / scoring
	this.scorePlayer = new this.Score( this, true );
	this.scoreEnemy = new this.Score( this, false );

	// screenshake
	this.screenshake = new this.Screenshake( this );

	// time / time scaling / timescale
	this.timescale = new this.Timescale( this );

	// overlay
	this.overlay = document.querySelector( '.g-overlay' );

	// edges
	this.edgeTop = document.querySelector( '.g-edge-top' );
	this.edgeRight = document.querySelector( '.g-edge-right' );
	this.edgeBot = document.querySelector( '.g-edge-bot' );
	this.edgeLeft = document.querySelector( '.g-edge-left' );

	// particles
	this.particlesWhite = new this.Pool( this, this.ParticleWhite, 30 );
	this.particlesGreen = new this.Pool( this, this.ParticleGreen, 30 );
	this.particlesBlue = new this.Pool( this, this.ParticleBlue, 30 );

	// pulses
	this.pulsesWhite = new this.Pool( this, this.PulseWhite, 30 );
	this.pulsesGreen = new this.Pool( this, this.PulseGreen, 30 );
	this.pulsesBlue = new this.Pool( this, this.PulseBlue, 30 );

	// initialize on creation
	this.init();
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

Step / Update

==============================================================================*/

G.prototype.step = function() {
	this.stage.step();
	if( this.paused ) {
		return;
	}
	
	this.paddlePlayer.step();
	this.paddleEnemy.step();
	this.ball.step();
	this.screenshake.step();
	this.timescale.step();
	this.particlesWhite.each( 'step' );
	this.particlesGreen.each( 'step' );
	this.particlesBlue.each( 'step' );
	this.pulsesWhite.each( 'step' );
	this.pulsesGreen.each( 'step' );
	this.pulsesBlue.each( 'step' );
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
	this.particlesWhite.each( 'draw' );
	this.particlesGreen.each( 'draw' );
	this.particlesBlue.each( 'draw' );
	this.pulsesWhite.each( 'draw' );
	this.pulsesGreen.each( 'draw' );
	this.pulsesBlue.each( 'draw' );
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
	cancelAnimationFrame( this.raf );
	pg.stopMusic();
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
};