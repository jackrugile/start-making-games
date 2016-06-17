var slide = document.querySelector( '.slide' ),
	slideBcr = slide.getBoundingClientRect(),
	slideWidth = slideBcr.width,
	slideHeight = slideBcr.height,
	slideRatio = slideHeight / slideWidth,
	scaleMin = 0,
	scaleMax = Infinity,
	scale,
	scaleOutline,
	keyMap = {
		up: [ 'up', 'w' ],
		right: [ 'right', 'd' ],
		down: [ 'down', 's' ],
		left: [ 'left', 'a' ]
	},
	keys = {
		up: 0,
		right: 0,
		down: 0,
		left: 0
	},
	dirs = {
		up: document.querySelector( '.dir-up' ),
		right: document.querySelector( '.dir-right' ),
		down: document.querySelector( '.dir-down' ),
		left: document.querySelector( '.dir-left' )
	};

function setScale() {
	if( innerWidth > innerHeight / slideRatio ) {
		scale = innerHeight / slideRatio / slideWidth;
	} else {
		scale = innerWidth * slideRatio / slideHeight;
	}
	scale = Math.max( Math.min( scale, scaleMax ), scaleMin ) + 0.001;
	scaleOutline = ( 1 / scale ) * 5;
	slide.style.transform = 'scale(' + scale + ')';
	slide.style.outlineWidth = scaleOutline+ 'px';
}

function onResize( e ) {
	setScale();
}

addEventListener( 'resize', onResize );

playground({
	keydown: function( e ) {
		if(      keyMap.up.indexOf( e.key ) > -1 )    { keys.up = 1; dirs.up.classList.add( 'is-active' ); }
		else if( keyMap.right.indexOf( e.key ) > -1 ) { keys.right = 1; dirs.right.classList.add( 'is-active' ); }
		else if( keyMap.down.indexOf( e.key ) > -1 )  { keys.down = 1; dirs.down.classList.add( 'is-active' ); }
		else if( keyMap.left.indexOf( e.key ) > -1 )  { keys.left = 1; dirs.left.classList.add( 'is-active' ); }
	},
	keyup: function( e ) {
		if(      keyMap.up.indexOf( e.key ) > -1 )    { keys.up = 0; dirs.up.classList.remove( 'is-active' ); }
		else if( keyMap.right.indexOf( e.key ) > -1 ) { keys.right = 0; dirs.right.classList.remove( 'is-active' ); }
		else if( keyMap.down.indexOf( e.key ) > -1 )  { keys.down = 0; dirs.down.classList.remove( 'is-active' ); }
		else if( keyMap.left.indexOf( e.key ) > -1 )  { keys.left = 0; dirs.left.classList.remove( 'is-active' ); }
	},
	gamepaddown: function( e ) {
		if(      keyMap.up.indexOf( e.button ) > -1 )    { keys.up = 1; dirs.up.classList.add( 'is-active' ); }
		else if( keyMap.right.indexOf( e.button ) > -1 ) { keys.right = 1; dirs.right.classList.add( 'is-active' ); }
		else if( keyMap.down.indexOf( e.button ) > -1 )  { keys.down = 1; dirs.down.classList.add( 'is-active' ); }
		else if( keyMap.left.indexOf( e.button ) > -1 )  { keys.left = 1; dirs.left.classList.add( 'is-active' ); }
	},
	gamepadup: function( e ) {
		if(      keyMap.up.indexOf( e.button ) > -1 )    { keys.up = 0; dirs.up.classList.remove( 'is-active' ); }
		else if( keyMap.right.indexOf( e.button ) > -1 ) { keys.right = 0; dirs.right.classList.remove( 'is-active' ); }
		else if( keyMap.down.indexOf( e.button ) > -1 )  { keys.down = 0; dirs.down.classList.remove( 'is-active' ); }
		else if( keyMap.left.indexOf( e.button ) > -1 )  { keys.left = 0; dirs.left.classList.remove( 'is-active' ); }
	}
});

setScale();