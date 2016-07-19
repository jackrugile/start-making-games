/*==============================================================================
Game
==============================================================================*/

var game = null;

/*==============================================================================
Dev Class
==============================================================================*/

if( window.location.search === '?dev' ) {
	document.documentElement.classList.add( 'dev' );
	var isDev = true;
}

/*==============================================================================
Slide Scaling
==============================================================================*/
var slides = [
	// intro
		'intro-t-title',
		'intro-t-jack',
		'intro-t-quotes',
	// why
	// build
		'build-c-test-html',
		'build-c-test-css',
		'build-cd-test-js',
		'build-d-final',
	// juice
		'juice-d-final'
	// outro
];

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

var slideTimeout = null,
	currentSlide = location.hash ? location.hash.slice( 1 ) - 1 : 0,
	lastSlide = null,
	totalSlides = slides.length,
	prevSlideButton = document.querySelector( '.nav-prev' ),
	nextSlideButton = document.querySelector( '.nav-next' ),
	slideIndicator = document.querySelector( '.slide-indicator' ),
	slideRequest;

if( currentSlide > totalSlides ) {
	currentSlide = 0;
}

function loadSlide( i ) {
	if( slideRequest ) {
		return;
	}
	location.hash = ( i + 1 );
	slideIndicator.innerHTML = ( i + 1 );
	if( isDev ) {
		document.title = slides[ i ] + ' // Start Making Games';
	}
	if( game && typeof game.kill == 'function' ) {
		game.kill();
	}
	game = null;
	document.documentElement.classList.add( 'loading' );
	slideRequest = new XMLHttpRequest();
	slideRequest.open('GET', 'slides/' + slides[ i ] + '/index.html', true);
	slideRequest.onload = function() {
		if (slideRequest.status >= 200 && slideRequest.status < 400) {
			clearTimeout( slideTimeout );
			slideTimeout = setTimeout( function() {
				if( lastSlide !== null) {
					// remove the old css
					var oldStylesheet = document.querySelector( '.stylesheet-' + lastSlide );
					if( oldStylesheet ) {
						oldStylesheet.parentNode.removeChild( oldStylesheet );
					}

					// remove the old js
					var oldScript = document.querySelector( '.script-' + lastSlide );
					if( oldScript ) {
						oldScript.parentNode.removeChild( oldScript );
					}
				}

				var stylesheet = document.createElement( 'link' );
				stylesheet.rel = 'stylesheet';
				stylesheet.href = 'slides/' + slides[ i ] + '/index.css' ;
				stylesheet.classList.add( 'stylesheet-' + i );
				document.getElementsByTagName( 'head' )[ 0 ].appendChild( stylesheet );

				// load the content
				slideContent.innerHTML = slideRequest.responseText;

				// load the new js
				var script = document.createElement( 'script' );
				script.setAttribute( 'src', 'slides/' + slides[ i ] + '/index.js' );
				//script.async = true;
				script.classList.add( 'script-' + i );
				document.getElementsByTagName( 'head' )[0].appendChild( script );
				document.documentElement.classList.remove( 'loading' );
				slideRequest = null;

				// rehighlight syntax
				Prism.highlightAll();
			}, 20 );
		} 
	};
	slideRequest.send();
}

function prevSlide() {
	if( currentSlide > 0 && !slideRequest ) {
		document.documentElement.classList.add( 'prev' );
		document.documentElement.classList.remove( 'next' );
		lastSlide = currentSlide;
		currentSlide--;
		loadSlide( currentSlide );
	}
}

function nextSlide() {
	if( currentSlide < totalSlides - 1 && !slideRequest ) {
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
Utility
==============================================================================*/

function rand( min, max ) {
	return Math.random() * ( max - min ) + min;
}

function randInt( min, max ) {
	return Math.floor( min + Math.random() * ( max - min + 1 ) );
}

/*==============================================================================
Playground Gamepad
==============================================================================*/

var controlDownDownEvent = new Event( 'controlDownDown' ),
	controlDownUpEvent = new Event( 'controlDownUp' ),
	controlUpDownEvent = new Event( 'controlUpDown' ),
	controlUpUpEvent = new Event( 'controlUpUp' ),
	mouseLeftDownEvent = new Event( 'mouseLeftDown' ),
	mouseLeftUpEvent = new Event( 'mouseLeftUp' ),
	mouseRightDownEvent = new Event( 'mouseRightDown' ),
	mouseRightUpEvent = new Event( 'mouseRightUp' ),
	controlMuteDownEvent = new Event( 'controlMuteDown' ),
	controlPauseDownEvent = new Event( 'controlPauseDown' ),
	keyMap = {
		up: [ 'up', 'w' ],
		right: [ 'right', 'd' ],
		down: [ 'down', 's' ],
		left: [ 'left', 'a' ],
		prev: [ 'openbracket', 'l2' ],
		next: [ 'closebraket', 'l1' ],
		mute: [ 'm', 'r2' ],
		pause: [ 'p', 'r1' ]
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

/*==============================================================================
Playground General
==============================================================================*/

var pg = playground({
	mousemove: function( e ) {
		if( this.mouseIdle ) {
			document.documentElement.classList.remove( 'mouse-idle' );
		}
		this.mouseIdle = false;
		this.mouseIdleTick = this.mouseIdleTickMax;
	},
	mousedown: function( e ) {
		if ( e.button == 'left' ) {
			window.dispatchEvent( mouseLeftDownEvent );
		}
		if ( e.button == 'right' ) {
			window.dispatchEvent( mouseRightDownEvent );
		}
	},
	mouseup: function( e ) {
		if ( e.button == 'left' ) {
			window.dispatchEvent( mouseLeftUpEvent );
		}
		if ( e.button == 'right' ) {
			window.dispatchEvent( mouseRightUpEvent );
		}
	},
	keydown: function( e ) {
		if(      keyMap.up.indexOf( e.key ) > -1 )    { keys.up = 1; dirs.up.classList.add( 'is-active' ); window.dispatchEvent( controlUpDownEvent ); }
		else if( keyMap.right.indexOf( e.key ) > -1 ) { keys.right = 1; dirs.right.classList.add( 'is-active' ); }
		else if( keyMap.down.indexOf( e.key ) > -1 )  { keys.down = 1; dirs.down.classList.add( 'is-active' ); window.dispatchEvent( controlDownDownEvent ); }
		else if( keyMap.left.indexOf( e.key ) > -1 )  { keys.left = 1; dirs.left.classList.add( 'is-active' ); }
		else if( keyMap.prev.indexOf( e.key ) > -1 )  { prevSlide(); }
		else if( keyMap.next.indexOf( e.key ) > -1 )  { nextSlide(); }
		else if( keyMap.mute.indexOf( e.key ) > -1 )  { window.dispatchEvent( controlMuteDownEvent ); }
		else if( keyMap.pause.indexOf( e.key ) > -1 ) { window.dispatchEvent( controlPauseDownEvent ); }
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
		else if( keyMap.mute.indexOf( e.button ) > -1 )  { window.dispatchEvent( controlMuteDownEvent ); }
		else if( keyMap.pause.indexOf( e.button ) > -1 ) { window.dispatchEvent( controlPauseDownEvent ); }
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
		this.dt = 0.016;
		this.dtMs = 16;
		this.dtNorm = 1;
		this.time = 0;
		this.timeMs = 0;
		this.timeNorm = 0;

		this.mouseIdle = false;
		this.mouseIdleTickMax = 180;
		this.mouseIdleTick = this.mouseIdleTickMax;

		this.loadSounds([
			'paddle-1',
			'wall-1',
			'score-player-1',
			'score-enemy-1',
			'spike-1',
			'spike-2',
			'spike-3',
			'slow-mo-1'
		]);
	},
	step: function( dt ) {
		this.manageTime( dt );

		if( !this.mouseIdle ) {
			if( this.mouseIdleTick > 0 ) {
				this.mouseIdleTick--;
			} else {
				this.mouseIdle = true;
				document.documentElement.classList.add( 'mouse-idle' );
			}
		}
	},
	manageTime: function( dt ) {
		this.dt = dt;
		this.dtMs = this.dt * 1000;
		this.dtNorm = this.dt * 60;
		this.time += this.dt;
		this.timeMs += this.dtMs;
		this.timeNorm += this.dtNorm;
	},
	getDt: function() {
		return this.dtNorm === undefined ? 1 : this.dtNorm;
	},
	soundPlay: function( opt ) {
		var name = opt.name === undefined ? null : opt.name;
		var volume = opt.volume === undefined ? 1 : opt.volume;
		var rate = opt.rate === undefined ? 1 : opt.rate;
		if ( name ) {
			var sound = pg.playSound( name );
			pg.sound.setVolume( sound, volume );
			pg.sound.setPlaybackRate( sound, rate );
		}
	}
});