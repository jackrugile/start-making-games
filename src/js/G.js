/*==============================================================================

Configuration

==============================================================================*/

var G = function( opt ) {
	this.config = {
		paddle: {
			width: 60,
			height: 240,
			speed: 16
		},
		ball: {
			width: 60,
			height: 60,
			speed: 1,
			inc: 1
		},
		score: {
			max: 5
		}
	};

	// general
	this.raf = null;

	// movement
	/*var	playerMoveUp = false,
		playerMoveDown = false,
		enemyMoveUp = false,
		enemyMoveDown = false;*/

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
	this.timescale = {
		current: 1,
		target: 0.2,
		timer: 0,
		timerMax: 180,
		inDuration: 0.6,
		outDuration: 1,
		isSlow: false
	}

	

}

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

G.prototype.Stage.step = function() {
	this.xDegTarget = ( ( g.ball.y / ( this.height - g.ball.height ) - 0.5 ) * 2 ) * this.rangeDeg;
	this.xDeg += ( this.xDegTarget - this.xDeg ) * this.smoothingDeg;

	this.yDegTarget = ( ( g.ball.x / ( this.width - g.ball.width ) - 0.5 ) * 2 ) * this.rangeDeg;
	this.yDeg += ( this.yDegTarget - this.yDeg ) * this.smoothingDeg;

	this.xTransTarget = ( -g.ball.x + this.width / 2 ) * 0.1 * ( ( 1 - g.timescale.current ) * 10 ) + shake.x;
	this.xTrans += ( this.xTransTarget - this.xTrans ) * this.smoothingDeg;

	this.yTransTarget = ( -g.ball.y + this.height / 2 ) * 0.1 * ( ( 1 - g.timescale.current ) * 10 ) + shake.y;
	this.yTrans += ( this.yTransTarget - this.yTrans ) * this.smoothingDeg;

	this.rotation = shake.angle;

	this.scale = this.scaleBase + ( ( 1 - g.timescale.current ) * 0.3 );
};

G.prototype.Stage.draw = function() {
	this.style.transform = 'scale( ' + this.scale + ' ) translateX(' + this.xTrans + 'px) translateY(' + this.yTrans + 'px) rotateX(' + -this.xDeg + 'deg) rotateY(' + this.yDeg + 'deg) rotateZ(' + this.rotation + 'rad)';
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
	this.x = g.stage.width / 2 - g.config.ball.width / 2;
	this.y = g.stage.height / 2 - g.config.ball.height / 2;
	this.z = 60;
	this.vx = g.config.ball.speed;
	this.vy = g.config.ball.speed;
	this.width = g.config.ball.width;
	this.height = g.config.ball.height;
	this.rotation = Math.PI / 4;
};

G.prototype.reset = function() {
	this.ball.serving = true;
	this.ball.x = this.stage.width / 2 - this.ball.width / 2;
	this.ball.y = this.stage.height / 2 - this.ball.height / 2;
	this.ball.vx = 0;
	this.ball.vy = 0;
	
};

G.prototype.Ball.step = function() {
	if ( this.serving ) {
		if ( this.servingTimer < this.servingTimerMax ) {
			this.servingTimer++;
		} else {
			this.serving = false;
			this.servingTimer = 0;
		}
		this.ball.rotation = Math.PI / 4;
	} else {
		if ( ball.vx > 0 ) {
			this.rotation += 0.2 * g.getDt();
		} else {
			this.rotation -= 0.2 * g.getDt();
		}
	}
};

G.prototype.Ball.draw = function() {
	this.elem.style.transform = 'translate3d(' + this.x + 'px, ' + this.y + 'px, ' + this.z + 'px) rotateZ(' + this.rotation + 'rad)';
};

/*==============================================================================

Paddle Object

==============================================================================*/

G.prototype.Paddle = function( g, isPlayer ) {
	this.g = g;
	this.isPlayer = isPlayer;
	this.isEnemy = !isPlayer;
	this.y = g.stage.height / 2 - g.config.paddle.height / 2;
	this.z = 60;
	this.width = g.config.paddle.width;
	this.height = g.config.paddle.height;
	this.speed = g.config.paddle.speed;

	if ( this.isPlayer) {
		this.elem = document.querySelector( '.paddle-player' );
		this.x = 0;
	} else {
		this.elem = document.querySelector( '.paddle-enemy' );
		this.x = g.stage.width - g.config.paddle.width;
	}
};

G.prototype.Paddle.step = function() {

};

G.prototype.Paddle.draw = function() {
	this.elem.style.transform = 'translate3d(' + this.x + 'px, ' + this.y + 'px, ' + this.z +'px)';
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

G.prototype.Score.step = function() {

};

G.prototype.Score.draw = function() {
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

G.prototype.Screenshake.step = function() {
	this.xBias *= 0.9;
	this.yBias *= 0.9;

	if( this.translate > 0 ) {
		this.translate *= 0.9;
		this.xTarget = rand( -this.translate, this.translate ) + this.xBias;
		this.yTarget = rand( -this.translate, this.translate ) + this.yBias;
	} else {
		this.xTarget = 0;
		this.yTarget = 0;
	}

	if( this.rotate > 0 ) {
		this.rotate *= 0.9;
		this.angleTarget = rand( -this.rotate, this.rotate );
	} else {
		this.angleTarget = 0;
	}

	this.x += ( this.xTarget - this.x ) * 0.1;
	this.y += ( this.yTarget - this.y ) * 0.1;
	this.angle += ( this.angleTarget - this.angle ) * 0.1;
};

G.prototype.Screenshake.draw = function() {
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
	this.scorePlayer.value = 0;
	this.scoreEnemy.value = 0;
	this.ball.speed = this.config.ball.speed;
	this.ball.reset();
};

/*==============================================================================

Events / Add Event Listeners / Remove Event Listeners

==============================================================================*/

G.prototype.addEventListeners = function() {
	window.addEventListener( 'controlUpDown', onControlUpDown );
	window.addEventListener( 'controlDownDown', onControlDownDown );
	window.addEventListener( 'controlUpUp', onControlUpUp );
	window.addEventListener( 'controlDownUp', onControlDownUp );

	window.addEventListener( 'mouseLeftDown', onMouseLeftDown );
	window.addEventListener( 'mouseRightDown', onMouseRightDown );
	window.addEventListener( 'mouseLeftUp', onMouseLeftUp);
	window.addEventListener( 'mouseRightUp', onMouseRightUp );
};

G.prototype.removeEventListeners = function() {
	window.removeEventListener( 'controlUpDown', onControlUpDown );
	window.removeEventListener( 'controlDownDown', onControlDownDown );
	window.removeEventListener( 'controlUpUp', onControlUpUp );
	window.removeEventListener( 'controlDownUp', onControlDownUp );

	window.removeEventListener( 'mouseLeftDown', onMouseLeftDown );
	window.removeEventListener( 'mouseRightDown', onMouseRightDown );
	window.removeEventListener( 'mouseLeftUp', onMouseLeftUp);
	window.removeEventListener( 'mouseRightUp', onMouseRightUp );
};

G.prototype.onControlUpDown = function() {
	//playerMoveUp = true;
};

G.prototype.onControlDownDown = function() {
	//playerMoveDown = true;
};

G.prototype.onControlUpUp = function() {
	//playerMoveUp = false;
};

G.prototype.onControlDownUp = function() {
	//playerMoveDown = false;
};

G.prototype.onMouseLeftDown = function() {
	slowMo();
};

G.prototype.onMouseRightDown = function() {
};

G.prototype.onMouseLeftUp = function() {
};

G.prototype.onMouseRightUp = function() {
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

Step / Update

==============================================================================*/

G.prototype.step = function() {
}

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
}

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
	this.removeEventListeners();
	cancelAnimationFrame( this.raf );
};