/*==========================================
Config 
==========================================*/

game = {};
game.raf = null;

// game
game.gameWidth = 1920;
game.gameHeight = 1080;

// paddles
game.paddleWidth = 60;
game.paddleHeight = 240;
game.paddleSpeed = 16;

// ball
game.ballWidth = 60;
game.ballHeight = 60;
game.ballSpeedStart = 16;
game.ballSpeed = game.ballSpeedStart;

// score - what are we playing to?
game.scoreMax = 5;

/*==========================================
Objects 
==========================================*/

game.paddlePlayer = {
	elem: document.querySelector('.paddle-player'),
	x: 0,
	y: game.gameHeight / 2 - game.paddleHeight / 2,
	width: game.paddleWidth,
	height: game.paddleHeight,
	speed: game.paddleSpeed,
	moveUp: false,
	moveDown: false
};

game.paddleEnemy = {
	elem: document.querySelector('.paddle-enemy'),
	x: game.gameWidth - game.paddleWidth,
	y: game.gameHeight / 2 - game.paddleHeight / 2,
	width: game.paddleWidth,
	height: game.paddleHeight,
	speed: game.paddleSpeed,
	moveUp: false,
	moveDown: false
};

game.ball = {
	elem: document.querySelector('.ball'),
	x: game.gameWidth / 2 - game.ballWidth / 2,
	y: game.gameHeight / 2 - game.ballHeight / 2,
	vx: game.ballSpeed,
	vy: game.ballSpeed,
	width: game.ballWidth,
	height: game.ballHeight
};

game.scorePlayer = {
	elem: document.querySelector('.score-player'),
	value: 0
};

game.scoreEnemy = {
	elem: document.querySelector('.score-enemy'),
	value: 0
};

/*==========================================
Initialize 
==========================================*/

game.init = function() {
	game.addEventListeners();
	game.loop();
};

/*==========================================
Events 
==========================================*/

game.addEventListeners = function() {
	window.addEventListener( 'controlUpDown', game.onControlUpDown );
	window.addEventListener( 'controlDownDown', game.onControlDownDown );
	window.addEventListener( 'controlUpUp', game.onControlUpUp );
	window.addEventListener( 'controlDownUp', game.onControlDownUp );
};

game.onControlUpDown = function() {
	game.paddlePlayer.moveUp = true;
};

game.onControlDownDown = function() {
	game.paddlePlayer.moveDown = true;
};

game.onControlUpUp = function() {
	game.paddlePlayer.moveUp = false;
};

game.onControlDownUp = function() {
	game.paddlePlayer.moveDown = false;
};

/*==========================================
AABB Collision Detection
==========================================*/

game.collisionAABB = function(r1, r2) {
	if (!(
		r1.x > r2.x + r2.width ||  // rect1 is on the right of rect2
		r1.x + r1.width < r2.x ||  // rect1 is on the left of rect2
		r1.y > r2.y + r2.height || // rect1 is below rect2
		r1.y + r1.height < r2.y    // rect1 is above rect2
	)) {
		return true;
	}
};

/*==========================================
Move Ball
==========================================*/

game.moveBall = function() {
	game.ball.x += game.ball.vx;
	game.ball.y += game.ball.vy;
};

/*==========================================
Move Player
==========================================*/

game.movePlayer = function() {
	if (game.paddlePlayer.moveUp) {
		game.paddlePlayer.y -= game.paddlePlayer.speed;
	} else if (game.paddlePlayer.moveDown) {
		game.paddlePlayer.y += game.paddlePlayer.speed;
	}
};

/*==========================================
Move Enemy
==========================================*/

game.moveEnemy = function() {
	if (Math.random() < 0.2) {
		game.paddleEnemy.moveUp = false;
		game.paddleEnemy.moveDown = false;
		if (game.ball.y + game.ballHeight < game.paddleEnemy.y + game.paddleEnemy.height / 2) {
			game.paddleEnemy.moveUp = true;
		} else if (game.ball.y > game.paddleEnemy.y + game.paddleEnemy.height / 2) {
			game.paddleEnemy.moveDown = true;
		}
	}
	
	if (game.paddleEnemy.moveUp) {
		game.paddleEnemy.y -= game.paddleEnemy.speed;
	} else if (game.paddleEnemy.moveDown) {
		game.paddleEnemy.y += game.paddleEnemy.speed;
	}
};

/*==========================================
Contain Ball
==========================================*/

game.containBall = function() {
	if (game.ball.y <= 0) {
		game.ball.y = 0;
		game.ball.vy = -game.ball.vy;
	} else if (game.ball.y + game.ball.height >= game.gameHeight) {
		game.ball.y = game.gameHeight - game.ball.height;
		game.ball.vy = -game.ball.vy;
	}

	if (game.ball.x <= 0) {
		game.scoreEnemy.value++;
		game.ball.x = 0;
		game.ball.vx = -game.ball.vx;
	} else if (game.ball.x + game.ball.width >= game.gameWidth) {
		game.scorePlayer.value++;
		game.ball.x = game.gameWidth - game.ball.width;
		game.ball.vx = -game.ball.vx;
	}
};

/*==========================================
Contain Paddles
==========================================*/

game.containPaddles = function() {
	game.paddlePlayer.y = Math.max(0, game.paddlePlayer.y);
	game.paddlePlayer.y = Math.min(game.gameHeight - game.paddlePlayer.height, game.paddlePlayer.y);
	
	game.paddleEnemy.y = Math.max(0, game.paddleEnemy.y);
	game.paddleEnemy.y = Math.min(game.gameHeight - game.paddleEnemy.height, game.paddleEnemy.y);
};

/*==========================================
Check Collisions
==========================================*/

game.checkCollisions = function() {
	if (game.collisionAABB(game.ball, game.paddlePlayer)) {
		game.ball.x = game.paddlePlayer.x + game.paddlePlayer.width;
		game.ball.vx = -game.ball.vx;
	}
	
	if (game.collisionAABB(game.ball, game.paddleEnemy)) {
		game.ball.x = game.paddleEnemy.x - game.ball.width;
		game.ball.vx = -game.ball.vx;
	}
};

/*==========================================
Update
==========================================*/

game.update = function() {
	game.moveBall();
	game.movePlayer();
	game.moveEnemy();
	game.containBall();
	game.containPaddles();
	game.checkCollisions();
};

/*==========================================
Render
==========================================*/

game.render = function() {
	game.paddlePlayer.elem.style.transform = 'translate(' + game.paddlePlayer.x + 'px, ' + game.paddlePlayer.y + 'px)';
	game.paddleEnemy.elem.style.transform = 'translate(' + game.paddleEnemy.x + 'px, ' + game.paddleEnemy.y + 'px)';
	game.ball.elem.style.transform = 'translate(' + game.ball.x + 'px, ' + game.ball.y + 'px)';
	game.scorePlayer.elem.innerHTML = game.scorePlayer.value;
	game.scoreEnemy.elem.innerHTML = game.scoreEnemy.value;
};

/*==========================================
Loop 
==========================================*/

game.loop = function() {
	if( game ) {
		game.raf = requestAnimationFrame(game.loop);
		game.update();
		game.render();
	}
};

/*==========================================
Kill
==========================================*/

game.kill = function() {
	cancelAnimationFrame( game.raf );
	game.paddlePlayer = null;
	game.paddleEnemy = null;
	game.ball = null;
	game.scorePlayer = null;
	game.scoreEnemy = null;
	window.removeEventListener( 'controlUpDown', game.onControlUpDown );
	window.removeEventListener( 'controlDownDown', game.onControlDownDown );
	window.removeEventListener( 'controlUpUp', game.onControlUpUp );
	window.removeEventListener( 'controlDownUp', game.onControlDownUp );
};

/*==========================================
Let's Play! 
==========================================*/

game.init(); // to win it!