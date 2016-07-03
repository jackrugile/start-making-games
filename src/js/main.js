/*==============================================================================
Slide Scaling
==============================================================================*/

var slideWrap = document.querySelector( '.slide-wrap' ),
	slide = document.querySelector( '.slide' ),
	slideContent = document.querySelector( '.slide-content' ),
	slideBcr = slide.getBoundingClientRect(),
	slideWidth = slideBcr.width,
	slideHeight = slideBcr.height,
	slideRatio = slideHeight / slideWidth,
	slideScaleMin = 0,
	slideScaleMax = Infinity,
	slideScale;

function setScale() {
	if( slideWrap.offsetWidth > slideWrap.offsetHeight / slideRatio ) {
		slideScale = slideWrap.offsetHeight / slideRatio / slideWidth;
	} else {
		slideScale = slideWrap.offsetWidth * slideRatio / slideHeight;
	}
	slideScale = Math.max( Math.min( slideScale, slideScaleMax ), slideScaleMin ) + 0.001;
	slide.style.transform = 'scale(' + slideScale + ')';
}

function onResize( e ) {
	setScale();
}

addEventListener( 'resize', onResize );

setScale();

/*==============================================================================
Slide Loading
==============================================================================*/

var slides = [
	'title',
	'demo',
	'demo-2'
];

var slideChangeEvent = new Event( 'slideChange' );

var slideTimeout = null,
	currentSlide = location.hash ? location.hash.slice( 1 ) - 1 : 0,
	lastSlide = null,
	totalSlides = slides.length,
	prevSlideButton = document.querySelector( '.nav-prev' ),
	nextSlideButton = document.querySelector( '.nav-next' );

if( currentSlide > totalSlides ) {
	currentSlide = 0;
}

function loadSlide( i ) {
	location.hash = ( i + 1 );
	window.dispatchEvent( slideChangeEvent );
	document.documentElement.classList.add( 'loading' );
	var request = new XMLHttpRequest();
	request.open('GET', 'slides/' + slides[ i ] + '/index.html', true);
	request.onload = function() {
		if (request.status >= 200 && request.status < 400) {
			clearTimeout( slideTimeout );
			slideTimeout = setTimeout( function() {
				document.documentElement.classList.remove( 'loading' );

				if( lastSlide !== null) {
					// remove the old css
					var oldStylesheet = document.querySelector( '.stylesheet-' + lastSlide );
					oldStylesheet.parentNode.removeChild( oldStylesheet );

					// remove the old js
					var oldScript = document.querySelector( '.script-' + lastSlide );
					oldScript.parentNode.removeChild( oldScript );
				}

				var stylesheet = document.createElement( 'link' );
				stylesheet.rel = 'stylesheet';
				stylesheet.href = 'slides/' + slides[ i ] + '/index.css' ;
				stylesheet.classList.add( 'stylesheet-' + i );
				document.getElementsByTagName( 'head' )[ 0 ].appendChild( stylesheet );

				// load the content
				slideContent.innerHTML = request.responseText;

				// run per slide code
				// syntax highlighting

				// load the new js
				var script = document.createElement( 'script' );
				script.setAttribute( 'src', 'slides/' + slides[ i ] + '/index.js' );
				script.classList.add( 'script-' + i );
				document.getElementsByTagName( 'head' )[0].appendChild( script );
			}, 20 );
		} 
	};
	request.onerror = function() {};
	request.send();
}

function prevSlide() {
	if( currentSlide > 0 ) {
		document.documentElement.classList.add( 'prev' );
		document.documentElement.classList.remove( 'next' );
		lastSlide = currentSlide;
		currentSlide--;
		loadSlide( currentSlide );
	}
}

function nextSlide() {
	if( currentSlide < totalSlides - 1 ) {
		document.documentElement.classList.add( 'next' );
		document.documentElement.classList.remove( 'prev' );
		lastSlide = currentSlide;
		currentSlide++;
		loadSlide( currentSlide );
	}
}

prevSlideButton.addEventListener( 'click', function( e ) {
	e.preventDefault();
	prevSlide();
});

nextSlideButton.addEventListener( 'click', function( e ) {
	e.preventDefault();
	nextSlide();
});

loadSlide( currentSlide );


/*==============================================================================
Playground Gamepad
==============================================================================*/

var controlDownDownEvent = new Event( 'controlDownDown' ),
	controlDownUpEvent = new Event( 'controlDownUp' ),
	controlUpDownEvent = new Event( 'controlUpDown' ),
	controlUpUpEvent = new Event( 'controlUpUp' ),
	keyMap = {
		up: [ 'up', 'w' ],
		right: [ 'right', 'd' ],
		down: [ 'down', 's' ],
		left: [ 'left', 'a' ],
		prev: [ 'openbracket', 'l1' ],
		next: [ 'closebraket', 'r1' ],
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

/*
up
right
down
left
y
b
a
x


make this more dry

separate dir stuff


*/

var pg = playground({
	keydown: function( e ) {
		if(      keyMap.up.indexOf( e.key ) > -1 )    { keys.up = 1; dirs.up.classList.add( 'is-active' ); window.dispatchEvent( controlUpDownEvent ); }
		else if( keyMap.right.indexOf( e.key ) > -1 ) { keys.right = 1; dirs.right.classList.add( 'is-active' ); }
		else if( keyMap.down.indexOf( e.key ) > -1 )  { keys.down = 1; dirs.down.classList.add( 'is-active' ); window.dispatchEvent( controlDownDownEvent ); }
		else if( keyMap.left.indexOf( e.key ) > -1 )  { keys.left = 1; dirs.left.classList.add( 'is-active' ); }
		else if( keyMap.prev.indexOf( e.key ) > -1 )  { prevSlide(); }
		else if( keyMap.next.indexOf( e.key ) > -1 )  { nextSlide(); }
	},
	keyup: function( e ) {
		if(      keyMap.up.indexOf( e.key ) > -1 )    { keys.up = 0; dirs.up.classList.remove( 'is-active' ); window.dispatchEvent( controlUpUpEvent ); }
		else if( keyMap.right.indexOf( e.key ) > -1 ) { keys.right = 0; dirs.right.classList.remove( 'is-active' ); }
		else if( keyMap.down.indexOf( e.key ) > -1 )  { keys.down = 0; dirs.down.classList.remove( 'is-active' ); window.dispatchEvent( controlDownUpEvent ); }
		else if( keyMap.left.indexOf( e.key ) > -1 )  { keys.left = 0; dirs.left.classList.remove( 'is-active' ); }
	},
	gamepaddown: function( e ) {
		if(      keyMap.up.indexOf( e.button ) > -1 )    { keys.up = 1; dirs.up.classList.add( 'is-active' ); window.dispatchEvent( controlUpDownEvent ); }
		else if( keyMap.right.indexOf( e.button ) > -1 ) { keys.right = 1; dirs.right.classList.add( 'is-active' ); }
		else if( keyMap.down.indexOf( e.button ) > -1 )  { keys.down = 1; dirs.down.classList.add( 'is-active' ); window.dispatchEvent( controlDownDownEvent ); }
		else if( keyMap.left.indexOf( e.button ) > -1 )  { keys.left = 1; dirs.left.classList.add( 'is-active' ); }
		else if( keyMap.prev.indexOf( e.button ) > -1 )  { prevSlide(); }
		else if( keyMap.next.indexOf( e.button ) > -1 )  { nextSlide(); }
	},
	gamepadup: function( e ) {
		if(      keyMap.up.indexOf( e.button ) > -1 )    { keys.up = 0; dirs.up.classList.remove( 'is-active' ); window.dispatchEvent( controlUpUpEvent ); }
		else if( keyMap.right.indexOf( e.button ) > -1 ) { keys.right = 0; dirs.right.classList.remove( 'is-active' ); }
		else if( keyMap.down.indexOf( e.button ) > -1 )  { keys.down = 0; dirs.down.classList.remove( 'is-active' ); window.dispatchEvent( controlDownUpEvent ); }
		else if( keyMap.left.indexOf( e.button ) > -1 )  { keys.left = 0; dirs.left.classList.remove( 'is-active' ); }
	},
	paths: {
		sounds: 'snd/',
	},
	create: function() {
		//this.loadSounds( 'move' );
	},
	step: function() {
	}
});
