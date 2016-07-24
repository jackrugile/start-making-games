game = {};
game.raf = null;
game.wrapper = document.querySelector( '.random-elems' );
game.random20 = document.querySelector( '.random-percent-20' );
game.random80 = document.querySelector( '.random-percent-80' );
game.randomGauge20 = document.querySelector( '.random-gauge-20' );
game.tick = 0;
game.reg = 0;
game.alt = 0;
game.max = 500;

game.init = function() {
	game.loop();
};

game.update = function() {
	var elem = document.createElement( 'div' ),
		val = Math.random();
	if( val < 0.2 ) {
		elem.classList.add( 'in-range' );
		game.alt++
	} else {
		game.reg++;
	}
	elem.style.left = ( val * 1910 ) + 'px';
	game.wrapper.appendChild( elem );
	game.tick++;
	game.random20.innerHTML = ( ( game.alt / game.tick ) * 100 ).toPrecision( 4 ) + '%';
	game.random80.innerHTML = ( ( game.reg / game.tick ) * 100 ).toPrecision( 4 ) + '%';
	game.randomGauge20.style.transform = 'scaleX(' + ( game.alt / game.tick ) + ')';
};

game.loop = function() {
	if( game && game.tick < game.max ) {
		game.raf = requestAnimationFrame(game.loop);
		game.update();
	}
};

game.kill = function() {
	cancelAnimationFrame( game.raf );
	game.wrapper = null;
};

game.init();