//(function(){

var pong = document.querySelector('.pong'),
	xDeg = 0,
	xDegTarget = 0,
	yDeg = 0,
	yDegTarget = 0,
	rangeDeg = 10,
	xTrans = 0,
	xTransTarget = 0,
	yTrans = 0,
	yTransTarget = 0,
	smoothingDeg = 0.05,
	scale = 0.85;

	var shake = {
		translate: 0,
		rotate: 0,
		x: 0,
		y: 0,
		xTarget: 0,
		yTarget: 0,
		xBias : 0,
		yBias : 0,
		angle: 0,
		angleTarget: 0
	};

	var timescaleTarget = 0.2,
		timescale = 1,
		timescaleTimer = 0,
		timescaleTimerMax = 180,
		timescaleInDuration = 0.6,
		timescaleOutDuration = 1,
		isSlow = false;

/*==========================================
Config 
==========================================*/

// loop
var raf;

// game
var gameWidth = 1920,
	gameHeight = 1080;

// paddles
var paddleWidth = 60,
	paddleHeight = 240,
	paddleSpeed = 16;
	
// ball
var ballWidth = 60,
	ballHeight = 60,
	ballSpeedStart = 16,
	ballSpeed = ballSpeedStart;

// score - what are we playing to?
var scoreMax = 5;

// movement
var	playerMoveUp = false,
	playerMoveDown = false,
	enemyMoveUp = false,
	enemyMoveDown = false;

/*==========================================
Entities 
==========================================*/

var paddlePlayer = {
		elem: document.querySelector('.paddle-player'),
		//x: paddleWidth,
		x: 0,
		y: gameHeight / 2 - paddleHeight / 2,
		width: paddleWidth,
		height: paddleHeight,
		speed: paddleSpeed
	},
	paddleEnemy = {
		elem: document.querySelector('.paddle-enemy'),
		//x: gameWidth - paddleWidth - paddleWidth,
		x: gameWidth - paddleWidth,
		y: gameHeight / 2 - paddleHeight / 2,
		width: paddleWidth,
		height: paddleHeight,
		speed: paddleSpeed
	},
	ball = {
		elem: document.querySelector('.ball'),
		x: gameWidth / 2 - ballWidth / 2,
		y: gameHeight / 2 - ballHeight / 2,
		vx: ballSpeed,
		vy: ballSpeed,
		width: ballWidth,
		height: ballHeight,
		rotation: 0
	},
	scorePlayer = {
		elem: document.querySelector('.score-player'),
		value: 0,
		flag: true
	},
	scoreEnemy = {
		elem: document.querySelector('.score-enemy'),
		value: 0,
		flag: true
	};

/*==========================================
Initialize 
==========================================*/

function init() {
	addEventListeners();
	loop();
}

/*==========================================
Resets
==========================================*/

function resetGame() {
	ballSpeed = ballSpeedStart;
	scorePlayer.value = 0;
	scoreEnemy.value = 0;
	resetBall();
}

function resetBall() {
	ball.x = gameWidth / 2 - ballWidth / 2;
	ball.y = gameHeight / 2 - ballHeight / 2;
	ball.vx = 0;
	ball.vy = 0;
	ball.rotation = 0;
	setTimeout( function() {
		ball.vx = ballSpeed;
		ball.vy = ballSpeed;
	}, 1000);
}

/*==========================================
Events 
==========================================*/

function addEventListeners() {
	window.addEventListener( 'controlUpDown', onControlUpDown );
	window.addEventListener( 'controlDownDown', onControlDownDown );
	window.addEventListener( 'controlUpUp', onControlUpUp );
	window.addEventListener( 'controlDownUp', onControlDownUp );

	window.addEventListener( 'mouseLeftDown', onMouseLeftDown );
	window.addEventListener( 'mouseRightDown', onMouseRightDown );
	window.addEventListener( 'mouseLeftUp', onMouseLeftUp);
	window.addEventListener( 'mouseRightUp', onMouseRightUp );
};

function onControlUpDown() {
	playerMoveUp = true;
}

function onControlDownDown() {
	playerMoveDown = true;
}

function onControlUpUp() {
	playerMoveUp = false;
}

function onControlDownUp() {
	playerMoveDown = false;
}

function onMouseLeftDown() {
	slowMo();
}

function onMouseRightDown() {
}

function onMouseLeftUp() {
}

function onMouseRightUp() {
}

/*==========================================
AABB Collision Detection
Axis Aligned Bounding Box
==========================================*/

function collisionAABB( r1, r2 ) {
	if(!(
		r1.x > r2.x + r2.width ||  // rect1 is on the right of rect2
		r1.x + r1.width < r2.x ||  // rect1 is on the left of rect2
		r1.y > r2.y + r2.height || // rect1 is below rect2
		r1.y + r1.height < r2.y    // rect1 is above rect2
	)) {
		return true;
	}
}

/*==========================================
Update
==========================================*/

function update() {
	
	/*==========================================
	Apply Controls and Forces
	==========================================*/
	
	if (playerMoveUp) {
		paddlePlayer.y -= paddlePlayer.speed * getDt();
	}
	if (playerMoveDown) {
		paddlePlayer.y += paddlePlayer.speed * getDt();
	}
	
	ball.x += ball.vx * getDt();
	ball.y += ball.vy * getDt();
	
	/*==========================================
	Enemy Behavior
	==========================================*/
	
	if( Math.random() < 0.2 ) {
		enemyMoveUp = false;
		enemyMoveDown = false;
		if(ball.y + ballHeight < paddleEnemy.y + paddleEnemy.height / 2) {
			enemyMoveUp = true;
		} else if(ball.y > paddleEnemy.y + paddleEnemy.height / 2) {
			enemyMoveDown = true;
		}
	}
	
	if(enemyMoveUp) {
		paddleEnemy.y -= paddleEnemy.speed * getDt();
	}
	if(enemyMoveDown) {
		paddleEnemy.y += paddleEnemy.speed * getDt();
	}
	
	/*==========================================
	Contain Paddles
	==========================================*/
	
	paddlePlayer.y = Math.max(0, paddlePlayer.y);
	paddlePlayer.y = Math.min(gameHeight - paddlePlayer.height, paddlePlayer.y);
	
	paddleEnemy.y = Math.max(0, paddleEnemy.y);
	paddleEnemy.y = Math.min(gameHeight - paddleEnemy.height, paddleEnemy.y);
	
	/*==========================================
	Contain Ball
	==========================================*/
	
	if(ball.y <= 0) {
		ball.y = 0;
		ball.vy = -ball.vy;
		var sound = pg.playSound( 'wall-1' );
		pg.sound.setVolume( sound, 0.5 );
		pg.sound.setPlaybackRate( sound, rand( 2, 3 ) );

		var impactAngle = Math.atan2( ball.vy, ball.vx );
		shake.translate = 10;
		shake.rotate = 0.15;
		shake.xBias = Math.cos( impactAngle ) * 0;
		shake.yBias = Math.sin( impactAngle ) * -75;
}
	
	if(ball.y + ball.height >= gameHeight) {
		ball.y = gameHeight - ball.height;
		ball.vy = -ball.vy;
		var sound = pg.playSound( 'wall-1' );
		pg.sound.setVolume( sound, 0.5 );
		pg.sound.setPlaybackRate( sound, rand( 2, 3 ) );

		var impactAngle = Math.atan2( ball.vy, ball.vx );
		shake.translate = 10;
		shake.rotate = 0.15;
		shake.xBias = Math.cos( impactAngle ) * 0;
		shake.yBias = Math.sin( impactAngle ) * -75;
	}

	if(ball.x + ball.width > gameWidth) {
		scorePlayer.value++;
		scorePlayer.flag = true;
		ballSpeed += 1;
		resetBall();
		var sound = pg.playSound( 'score-player-1' );
		pg.sound.setVolume( sound, 0.3 );
		pg.sound.setPlaybackRate( sound, 2 );
	} else if(ball.x < 0) {
		scoreEnemy.value++;
		scoreEnemy.flag = true;
		ballSpeed += 1;
		resetBall();
		var sound = pg.playSound( 'score-enemy-1' );
		pg.sound.setVolume( sound, 0.7 );
	}
	
	/*==========================================
	Paddle Ball Collisions
	==========================================*/
	
	if(collisionAABB(ball, paddlePlayer)) {
		ball.x = paddlePlayer.x + paddlePlayer.width;
		ball.vx = -ball.vx;
		/*var sound = pg.playSound( 'paddle-1' );
		pg.sound.setVolume( sound, 0.7 );
		pg.sound.setPlaybackRate( sound, rand( 1, 1.6 ) );*/

		var sound = pg.playSound( 'spike-1' );
		pg.sound.setVolume( sound, 0.7 );
		pg.sound.setPlaybackRate( sound, rand( 1, 1.6 ) );

		var sound = pg.playSound( 'spike-2' );
		pg.sound.setVolume( sound, 0.7 );
		pg.sound.setPlaybackRate( sound, rand( 1, 1.6 ) );

		var sound = pg.playSound( 'spike-3' );
		pg.sound.setVolume( sound, 0.7 );
		pg.sound.setPlaybackRate( sound, rand( 1, 1.6 ) );

		var impactAngle = Math.atan2( ball.vy, ball.vx );
		shake.translate = 10;
		shake.rotate = 0.3;
		shake.xBias = Math.cos( impactAngle ) * 400;
		shake.yBias = Math.sin( impactAngle ) * 0;
	}
	
	if(collisionAABB(ball, paddleEnemy)) {
		ball.x = paddleEnemy.x - ball.width;
		ball.vx = -ball.vx;
		var sound = pg.playSound( 'paddle-1' );
		pg.sound.setVolume( sound, 0.7 );
		pg.sound.setPlaybackRate( sound, rand( 1, 1.6 ) );

		var impactAngle = Math.atan2( ball.vy, ball.vx );
		shake.translate = 10;
		shake.rotate = 0.3;
		shake.xBias = Math.cos( impactAngle ) * 400;
		shake.yBias = Math.sin( impactAngle ) * 0;
	}
	
	/*==========================================
	Check Win State
	==========================================*/
	
	if(scorePlayer.value >= scoreMax) {
		console.log( 'You Won!' );
		resetGame();
	} else if(scoreEnemy.value >= scoreMax) {
		console.log( 'You Lost!' );
		resetGame();
	}

	handleScreenShake();

	if( isSlow ) {
		if( timescaleTimer < timescaleTimerMax ) {
			timescaleTimer += 1 * getNormalDt();
		} else {
			timescaleTimer = 0;
			isSlow = false;
			pg.tween( window ).to(
				{
					timescale: 1
				},
				timescaleOutDuration,
				'inQuad'
			);
		}

	}

}

/*==========================================
Screenshake
==========================================*/

function handleScreenShake() {
	shake.xBias *= 0.9;
	shake.yBias *= 0.9;

	if( shake.translate > 0 ) {
		shake.translate *= 0.9;
		shake.xTarget = rand( -shake.translate, shake.translate ) + shake.xBias;
		shake.yTarget = rand( -shake.translate, shake.translate ) + shake.yBias;
	} else {
		shake.xTarget = 0;
		shake.yTarget = 0;
	}

	if( shake.rotate > 0 ) {
		shake.rotate *= 0.9;
		shake.angleTarget = rand( -shake.rotate, shake.rotate );
	} else {
		shake.angleTarget = 0;
	}

	shake.x += ( shake.xTarget - shake.x ) * 0.1;
	shake.y += ( shake.yTarget - shake.y ) * 0.1;
	shake.angle += ( shake.angleTarget - shake.angle ) * 0.1;
}

/*==========================================
Timescale and DT
==========================================*/

function slowMo() {
	if ( !isSlow ) {
		var sound = pg.playSound( 'slow-mo-1' );
		pg.sound.setVolume( sound, 1 );

		isSlow = true;
		pg.tween( window ).to(
			{
				timescale: timescaleTarget
			},
			timescaleInDuration,
			'outQuad'
		);
	}
}

function getDt() {
	return pg.getDt() * timescale;
}

function getInverseDt() {
	return 1 - pg.getDt();
}

function getNormalDt() {
	return pg.getDt();
}

/*==========================================
Render
==========================================*/

function render() {
	xDegTarget = ( ( ball.y / ( gameHeight - ballHeight ) - 0.5 ) * 2 ) * rangeDeg;
	xDeg += ( xDegTarget - xDeg ) * smoothingDeg;

	yDegTarget = ( ( ball.x / ( gameWidth - ballWidth ) - 0.5 ) * 2 ) * rangeDeg;
	yDeg += ( yDegTarget - yDeg ) * smoothingDeg;

	xTransTarget = ( -ball.x / 1 + gameWidth / 2 ) * 0.1 * ( ( 1- timescale ) * 10 );
	xTrans += ( xTransTarget - xTrans ) * smoothingDeg;

	yTransTarget = ( -ball.y / 1 + gameHeight / 2 ) * 0.1 * ( ( 1- timescale ) * 10 );
	yTrans += ( yTransTarget - yTrans ) * smoothingDeg;

	var calcScale = scale + ( ( 1 - timescale ) * 0.3 )


	//$.ctx.translate( $.game.width / 2 + shake.x, $.game.height / 2 + shake.y );
	//$.ctx.rotate( shake.angle );

	// no shake
	//pong.style.transform = 'scale( ' + calcScale + ' ) translateX(' + xTrans + 'px) translateY(' + yTrans + 'px) rotateX(' + -xDeg + 'deg) rotateY(' + yDeg + 'deg) rotateZ(0deg)';

	// with shake
	pong.style.transform = 'scale( ' + calcScale + ' ) translateX(' + ( xTrans + shake.x) + 'px) translateY(' + ( yTrans + shake.y ) + 'px) rotateX(' + -xDeg + 'deg) rotateY(' + yDeg + 'deg) rotateZ('+shake.angle+'rad)';
	//pong.style.transform = 'scale( ' + calcScale + ' ) translateX(' + ( xTrans) + 'px) translateY(' + ( yTrans) + 'px) rotateX(' + -xDeg + 'deg) rotateY(' + yDeg + 'deg)';
	//pong.style.transform = 'scale3d(' + calcScale + ', ' + calcScale + ', 1) translateX(' + ( xTrans + shake.x) + 'px) translateY(' + ( yTrans + shake.y ) + 'px) rotateX(' + -xDeg + 'deg) rotateY(' + yDeg + 'deg) rotateZ('+shake.angle+'rad)';
	//slideContent.style.perspectiveOrigin = ( 50 + xTrans/6 ) + '% ' + ( 50 + yTrans/6 ) + '%';

	paddlePlayer.elem.style.transform = 'translate3d(' + paddlePlayer.x + 'px, ' + paddlePlayer.y + 'px, 60px)';
	paddleEnemy.elem.style.transform = 'translate3d(' + paddleEnemy.x + 'px, ' + paddleEnemy.y + 'px, 60px)';

	//ball.z = 60 + ( 1 - Math.abs( ( gameWidth * -0.5 + ( + ball.x + ballWidth ) ) / gameWidth * 2 ) ) * 160;
	//ball.elem.style.transform = 'translate3d(' + ball.x + 'px, ' + ball.y + 'px, 60px) rotateX(' + Date.now() * 0.1 + 'deg) rotateY(' + Date.now() * 0.2 + 'deg) rotateZ(' + Date.now() * 0.3 + 'deg)';
	//var ballRot = Math.atan2(ball.vy, ball.vx) + Math.PI / 4;

	/*var dx = ball.vx,
		dy = ball.vy,
		dist = Math.abs(Math.sqrt( dx * dx + dy * dy ));
	dx /= dist ? dist : 1.0; dy /= dist ? dist : 1.0;
	var dirx = Math.cos(ball.rotation),
		diry = Math.sin(ball.rotation);
	dirx += (dx - dirx) * 0.125;
	diry += (dy - diry) * 0.125;
	ball.rotation= Math.atan2( diry, dirx );*/

	//ball.rotation += ( Math.PI / 4 + Math.atan2(ball.vy, ball.vx) - ball.rotation )* 0.1;
	//ball.elem.style.transform = 'translate3d(' + ball.x + 'px, ' + ball.y + 'px, 60px) rotateZ(' + ball.rotation + 'rad)';

	ball.elem.style.transform = 'translate3d(' + ball.x + 'px, ' + ball.y + 'px, 60px)';

	if ( scorePlayer.flag ) {
		scorePlayer.elem.innerHTML = scorePlayer.value;
		scorePlayer.elem.setAttribute( 'data-score', scorePlayer.value );
		scorePlayer.flag = false;
	}
	if ( scoreEnemy.flag ) {
		scoreEnemy.elem.innerHTML = scoreEnemy.value;
		scoreEnemy.elem.setAttribute( 'data-score', scoreEnemy.value );
		scoreEnemy.flag = false;
	}
}

/*==========================================
Game Loop 
==========================================*/

function loop() {
	raf = requestAnimationFrame(loop);
	update();
	render();
}

/*==========================================
Let's Play! 
==========================================*/

init(); // to win it!

/*==========================================
Destroy
==========================================*/

function destroy() {
	window.removeEventListener( 'controlUpDown', onControlUpDown );
	window.removeEventListener( 'controlDownDown', onControlDownDown );
	window.removeEventListener( 'controlUpUp', onControlUpUp );
	window.removeEventListener( 'controlDownUp', onControlDownUp );
	cancelAnimationFrame( raf );
}

//})();