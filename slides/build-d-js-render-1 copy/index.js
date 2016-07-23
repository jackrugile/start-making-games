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
	this.render();
};

/*==========================================
Update
==========================================*/

game.update = function() {
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