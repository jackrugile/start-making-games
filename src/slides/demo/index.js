(function(){

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
		x: paddleWidth,
		y: gameHeight / 2 - paddleHeight / 2,
		width: paddleWidth,
		height: paddleHeight,
		speed: paddleSpeed
	},
	paddleEnemy = {
		elem: document.querySelector('.paddle-enemy'),
		x: gameWidth - paddleWidth - paddleWidth,
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
		height: ballHeight
	},
	scorePlayer = {
		elem: document.querySelector('.score-player'),
		value: 0	
	},
	scoreEnemy = {
		elem: document.querySelector('.score-enemy'),
		value: 0	
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
	setTimeout( function() {
		ball.vx = ballSpeed;
		ball.vy = ballSpeed;
	}, 500);
}

/*==========================================
Events 
==========================================*/

function addEventListeners() {
	/*
	window.addEventListener('keydown', function(e) {
		if(e.which === 38) { playerMoveUp = true; }
		if(e.which === 40) { playerMoveDown = true; }
	});

	window.addEventListener('keyup', function(e) {
		if(e.which === 38) { playerMoveUp = false; }
		if(e.which === 40) { playerMoveDown = false; }
	});
	*/

	window.addEventListener( 'controlUpDown', onControlUpDown );
	window.addEventListener( 'controlDownDown', onControlDownDown );
	window.addEventListener( 'controlUpUp', onControlUpUp );
	window.addEventListener( 'controlDownUp', onControlDownUp );
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
	
	if(playerMoveUp) { paddlePlayer.y -= paddlePlayer.speed; }
	if(playerMoveDown) { paddlePlayer.y += paddlePlayer.speed; }
	
	ball.x += ball.vx;
	ball.y += ball.vy;
	
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
		paddleEnemy.y -= paddleEnemy.speed;
	}
	if(enemyMoveDown) {
		paddleEnemy.y += paddleEnemy.speed;
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
	}
	
	if(ball.y + ball.height >= gameHeight) {
		ball.y = gameHeight - ball.height;
		ball.vy = -ball.vy;
	}
	
	if(ball.x + ball.width > gameWidth) {
		scorePlayer.value++;
		ballSpeed += 0.5;
		resetBall();
	} else if(ball.x < 0) {
		scoreEnemy.value++;
		ballSpeed += 0.5;
		resetBall();
	}
	
	/*==========================================
	Paddle Ball Collisions
	==========================================*/
	
	if(collisionAABB(ball, paddlePlayer)) {
		ball.x = paddlePlayer.x + paddlePlayer.width;
		ball.vx = -ball.vx;
	}
	
	if(collisionAABB(ball, paddleEnemy)) {
		ball.x = paddleEnemy.x - ball.width;
		ball.vx = -ball.vx;
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
}

/*==========================================
Render
==========================================*/

function render() {
	paddlePlayer.elem.style.transform = 'translate(' + paddlePlayer.x + 'px, ' + paddlePlayer.y + 'px)';
	paddleEnemy.elem.style.transform = 'translate(' + paddleEnemy.x + 'px, ' + paddleEnemy.y + 'px)';
	ball.elem.style.transform = 'translate(' + ball.x + 'px, ' + ball.y + 'px)';
	scorePlayer.elem.innerHTML = scorePlayer.value;
	scoreEnemy.elem.innerHTML = scoreEnemy.value;
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

window.addEventListener( 'slideChange', destroy );

function destroy() {
	window.removeEventListener( 'slideChange', destroy );
	window.removeEventListener( 'controlUpDown', onControlUpDown );
	window.removeEventListener( 'controlDownDown', onControlDownDown );
	window.removeEventListener( 'controlUpUp', onControlUpUp );
	window.removeEventListener( 'controlDownUp', onControlDownUp );
	cancelAnimationFrame( raf );
}

})();