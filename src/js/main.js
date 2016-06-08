var slide = document.querySelector( '.slide' ),
	slideBcr = slide.getBoundingClientRect(),
	slideWidth = slideBcr.width,
	slideHeight = slideBcr.height,
	slideRatio = slideHeight / slideWidth,
	scaleMin = 0,
	scaleMax = Infinity,
	scale,
	scaleOutline,
	keyCodes = {
		up: [ 38, 87 ],
		right: [ 39, 68 ],
		down: [ 40, 83 ],
		left: [ 37, 65 ]
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
	}

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

function onKeydown( e ) {
	if(      keyCodes.up.indexOf( e.which ) > -1 ) { keys.up = 1; }
	else if( keyCodes.right.indexOf( e.which ) > -1 ) { keys.right = 1; }
	else if( keyCodes.down.indexOf( e.which ) > -1 ) { keys.down = 1; }
	else if( keyCodes.left.indexOf( e.which ) > -1 ) { keys.left = 1; }
	
	if(      keyCodes.up.indexOf( e.which ) > -1 ) { dirs.up.classList.add( 'is-active' ); }
	else if( keyCodes.right.indexOf( e.which ) > -1 ) { dirs.right.classList.add( 'is-active' ); }
	else if( keyCodes.down.indexOf( e.which ) > -1 ) { dirs.down.classList.add( 'is-active' ); }
	else if( keyCodes.left.indexOf( e.which ) > -1 ) { dirs.left.classList.add( 'is-active' ); }
}

function onKeyup( e ) {
	if(      keyCodes.up.indexOf( e.which ) > -1 ) { keys.up = 0; }
	else if( keyCodes.right.indexOf( e.which ) > -1 ) { keys.right = 0; }
	else if( keyCodes.down.indexOf( e.which ) > -1 ) { keys.down = 0; }
	else if( keyCodes.left.indexOf( e.which ) > -1 ) { keys.left = 0; }
	
	if(      keyCodes.up.indexOf( e.which ) > -1 ) { dirs.up.classList.remove( 'is-active' ); }
	else if( keyCodes.right.indexOf( e.which ) > -1 ) { dirs.right.classList.remove( 'is-active' ); }
	else if( keyCodes.down.indexOf( e.which ) > -1 ) { dirs.down.classList.remove( 'is-active' ); }
	else if( keyCodes.left.indexOf( e.which ) > -1 ) { dirs.left.classList.remove( 'is-active' ); }
}

addEventListener( 'resize', onResize );
addEventListener( 'keydown', onKeydown );
addEventListener( 'keyup', onKeyup );

setScale();