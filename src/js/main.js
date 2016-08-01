/*==============================================================================
Slides
==============================================================================*/
var slides = [
	// intro
		'intro-t-title-1',
		'intro-t-jack-1',
		'intro-t-quotes-1',
		'intro-t-poll-1',
		'intro-t-poll-2',
	// why
		'why-t-title-1',
	// build
		'build-t-title-1',
		'build-c-html-1',
		'build-c-css-pong-1',
		'build-d-css-pong-1',
		'build-c-css-paddles-1',
		'build-d-css-paddles-1',
		'build-c-css-score-1',
		'build-d-css-score-1',
		'build-c-css-net-ball-1',
		'build-d-css-net-ball-1',
		'build-c-js-structure-1',
		'build-c-js-config-1',
		'build-c-js-object-paddle-player-1',
		'build-c-js-object-paddle-enemy-1',
		'build-c-js-object-ball-1',
		'build-c-js-object-score-1',
		'build-c-js-render-1',
		'build-d-js-render-1',
		'build-c-js-move-ball-1',
		'build-c-js-update-1',
		'build-c-js-loop-1',
		'build-c-js-init-1',
		'build-d-js-loop-1',
		'build-c-js-contain-ball-1',
		'build-c-js-update-2',
		'build-d-js-contain-ball-1',
		'build-c-js-move-player-1',
		'build-c-js-update-3',
		'build-c-js-add-event-listeners-1',
		'build-c-js-init-2',
		'build-d-js-move-player-1',
		'build-c-js-move-enemy-1',
		'build-i-js-random-1',
		'build-c-js-update-4',
		'build-d-js-move-enemy-1',
		'build-c-js-contain-paddles-1',
		'build-c-js-update-5',
		'build-d-js-contain-paddles-1',
		'build-c-js-collision-aabb-1',
		'build-i-js-aabb-separation-conditions-1',
		'build-c-js-check-collisions-1',
		'build-c-js-update-6',
		'build-d-js-check-collisions-1',
		'build-c-js-contain-ball-2',
		'build-d-js-contain-ball-2',
		'build-c-js-reset-ball-1',
		'build-c-js-contain-ball-3',
		'build-d-js-reset-ball-1',
		'build-c-js-check-win-state-1',
		'build-c-js-update-7',
		'build-c-js-reset-game-1',
		'build-d-js-check-win-state-1',
	// juice
		'juice-t-title-1',
		'juice-t-titles-1',
		'juice-d-menu-1',
		'juice-d-accel-1',
		'juice-d-spin-1',
		'juice-d-reaction-1',
		'juice-d-move3d-1',
		'juice-d-extrude-1',
		'juice-d-particles-1',
		'juice-d-sound-1',
		'juice-d-screenshake-1',
		'juice-d-trajectory-1',
		'juice-d-spike-1',
		'juice-d-ghost-1',
		'juice-d-music-1'
	// outro
];

/*==============================================================================
Game
==============================================================================*/

var game = null;

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
	slideScale,
	slideScaleTimeout;

function applyScale() {
	slide.style.transform = 'scale(1)';
	slideBcr = slide.getBoundingClientRect();
	slideWidth = slideBcr.width;
	slideHeight = slideBcr.height;
	slideRatio = slideHeight / slideWidth;
	if( slideWrap.offsetWidth > slideWrap.offsetHeight / slideRatio ) {
		slideScale = slideWrap.offsetHeight / slideRatio / slideWidth;
	} else {
		slideScale = slideWrap.offsetWidth * slideRatio / slideHeight;
	}
	slideScale = Math.max( Math.min( slideScale, slideScaleMax ), slideScaleMin ) + 0.001;
	slide.style.transform = 'scale(' + slideScale + ')';
}

function setScale() {
	applyScale();
	clearTimeout( slideScaleTimeout );
	slideScaleTimeout = setTimeout( applyScale, 332 );
}

function onResize( e ) {
	setScale();
}

addEventListener( 'resize', onResize );

setScale();

/*==============================================================================
Dev Class
==============================================================================*/

if( window.location.search.indexOf( 'dev' ) > -1 ) {
	document.documentElement.classList.add( 'dev' );
	var isDev = true;
}

/*==============================================================================
Invert Class
==============================================================================*/

if( window.location.search.indexOf( 'invert' ) > -1 ) {
	document.documentElement.classList.add( 'invert' );
	var isInverted = true;
}

/*==============================================================================
Zoom Class
==============================================================================*/

var isZoom = false;

if( window.location.search.indexOf( 'zoom' ) > -1 ) {
	toggleZoom();
}

function toggleZoom() {
	isZoom = !isZoom;
	document.documentElement.classList.toggle( 'zoom' );
	setScale();
}


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
				setTimeout( function() {
					document.documentElement.classList.remove( 'loading' );
				}, 32 );
				slideRequest = null;

				// rehighlight syntax
				Prism.highlightAll();
			}, 32 );
		} 
	};
	slideRequest.send();
}

function prevSlide( jump ) {
	if( currentSlide > 0 && !slideRequest ) {
		document.documentElement.classList.add( 'prev' );
		document.documentElement.classList.remove( 'next' );
		lastSlide = currentSlide;
		if( jump ) {
			currentSlide -= 5;
		} else {
			currentSlide--;
		}
		currentSlide = Math.max( 0, currentSlide );
		loadSlide( currentSlide );
	}
}

function nextSlide( jump ) {
	if( currentSlide < totalSlides - 1 && !slideRequest ) {
		document.documentElement.classList.add( 'next' );
		document.documentElement.classList.remove( 'prev' );
		lastSlide = currentSlide;
		if( jump ) {
			currentSlide += 5;
		} else {
			currentSlide++;
		}
		currentSlide = Math.min( totalSlides - 1, currentSlide );
		loadSlide( currentSlide );
	}
}

prevSlideButton.addEventListener( 'click', function( e ) {
	e.preventDefault();
	prevSlide( e.shiftKey );
});

nextSlideButton.addEventListener( 'click', function( e ) {
	e.preventDefault();
	nextSlide( e.shiftKey );
});

slides.forEach( function( elem, i ) {
	var html = new XMLHttpRequest();
	html.open('GET', 'slides/' + elem + '/index.html', true);
	html.send();

	var css = new XMLHttpRequest();
	css.open('GET', 'slides/' + elem + '/index.css', true);
	css.send();

	var js = new XMLHttpRequest();
	js.open('GET', 'slides/' + elem + '/index.js', true);
	js.send();
});

/*==============================================================================
Playground Gamepad
==============================================================================*/

var controlDownDownEvent = new Event( 'controlDownDown' ),
	controlDownUpEvent = new Event( 'controlDownUp' ),
	controlUpDownEvent = new Event( 'controlUpDown' ),
	controlUpUpEvent = new Event( 'controlUpUp' ),
	controlSpikeDownEvent = new Event( 'controlSpikeDown' ),
	controlSpikeUpEvent = new Event( 'controlSpikeUp' ),
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
		spike: [ 'space', '1' ],
		prev: [ 'openbracket', 'l2' ],
		next: [ 'closebraket', 'l1' ],
		mute: [ 'm', 'r2' ],
		pause: [ 'p', 'r1' ],
		refresh: [ '4' ],
		zoom: [ 'z', '2' ]
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
/*==============================================================================
Playground General
==============================================================================*/

var pg = playground({
	mousemove: function( e ) {
		document.documentElement.classList.remove( 'mouse-idle' );
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
		else if( keyMap.spike.indexOf( e.key ) > -1 ) { window.dispatchEvent( controlSpikeDownEvent ); }
		else if( keyMap.prev.indexOf( e.key ) > -1 )  { prevSlide( e.original.shiftKey ); }
		else if( keyMap.next.indexOf( e.key ) > -1 )  { nextSlide( e.original.shiftKey ); }
		else if( keyMap.mute.indexOf( e.key ) > -1 )  { window.dispatchEvent( controlMuteDownEvent ); }
		else if( keyMap.pause.indexOf( e.key ) > -1 ) { window.dispatchEvent( controlPauseDownEvent ); }
		else if( keyMap.zoom.indexOf( e.key ) > -1 ) { toggleZoom(); }
	},
	keyup: function( e ) {
		if(      keyMap.up.indexOf( e.key ) > -1 )    { keys.up = 0; dirs.up.classList.remove( 'is-active' ); window.dispatchEvent( controlUpUpEvent ); }
		else if( keyMap.right.indexOf( e.key ) > -1 ) { keys.right = 0; dirs.right.classList.remove( 'is-active' ); }
		else if( keyMap.down.indexOf( e.key ) > -1 )  { keys.down = 0; dirs.down.classList.remove( 'is-active' ); window.dispatchEvent( controlDownUpEvent ); }
		else if( keyMap.left.indexOf( e.key ) > -1 )  { keys.left = 0; dirs.left.classList.remove( 'is-active' ); }
		else if( keyMap.spike.indexOf( e.key ) > -1 ) { window.dispatchEvent( controlSpikeUpEvent ); }
	},
	gamepaddown: function( e ) {
		if(      keyMap.up.indexOf( e.button ) > -1 )    { keys.up = 1; dirs.up.classList.add( 'is-active' ); window.dispatchEvent( controlUpDownEvent ); }
		else if( keyMap.right.indexOf( e.button ) > -1 ) { keys.right = 1; dirs.right.classList.add( 'is-active' ); }
		else if( keyMap.down.indexOf( e.button ) > -1 )  { keys.down = 1; dirs.down.classList.add( 'is-active' ); window.dispatchEvent( controlDownDownEvent ); }
		else if( keyMap.left.indexOf( e.button ) > -1 )  { keys.left = 1; dirs.left.classList.add( 'is-active' ); }
		else if( keyMap.spike.indexOf( e.button ) > -1 ) { window.dispatchEvent( controlSpikeDownEvent ); }
		else if( keyMap.prev.indexOf( e.button ) > -1 )  { console.log( this.gamepads[ 0 ].buttons[ '3' ] ); prevSlide( this.gamepads[ 0 ].buttons[ '3' ] ); }
		else if( keyMap.next.indexOf( e.button ) > -1 )  { nextSlide( this.gamepads[ 0 ].buttons[ '3' ] ); }
		else if( keyMap.mute.indexOf( e.button ) > -1 )  { window.dispatchEvent( controlMuteDownEvent ); }
		else if( keyMap.pause.indexOf( e.button ) > -1 ) { window.dispatchEvent( controlPauseDownEvent ); }
		else if( keyMap.refresh.indexOf( e.button ) > -1 ) { this.refreshTick++; if( this.refreshTick > 1 ) { location.reload(true); } }
		else if( keyMap.zoom.indexOf( e.button ) > -1 ) { toggleZoom(); }
	},
	gamepadup: function( e ) {
		if(      keyMap.up.indexOf( e.button ) > -1 )    { keys.up = 0; dirs.up.classList.remove( 'is-active' ); window.dispatchEvent( controlUpUpEvent ); }
		else if( keyMap.right.indexOf( e.button ) > -1 ) { keys.right = 0; dirs.right.classList.remove( 'is-active' ); }
		else if( keyMap.down.indexOf( e.button ) > -1 )  { keys.down = 0; dirs.down.classList.remove( 'is-active' ); window.dispatchEvent( controlDownUpEvent ); }
		else if( keyMap.left.indexOf( e.button ) > -1 )  { keys.left = 0; dirs.left.classList.remove( 'is-active' ); }
		else if( keyMap.spike.indexOf( e.button ) > -1 ) { window.dispatchEvent( controlSpikeUpEvent ); }
	},
	paths: {
		sounds: 'snd/',
	},
	preferedAudioFormat: 'mp3',
	create: function() {
		this.loadSounds([
			'paddle-1',
			'wall-1',
			'score-player-1',
			'score-player-2',
			'score-enemy-1',
			'score-enemy-2',
			'spike-1',
			'spike-2',
			'spike-3',
			'slow-mo-1',
			'hum-1',
			'alarm-1',
			'whoosh-1',
			'music-1'
		]);
	},
	ready: function() {
		this.dt = 0.016;
		this.dtMs = 16;
		this.dtNorm = 1;
		this.time = 0;
		this.timeMs = 0;
		this.timeNorm = 0;

		this.mouseIdle = false;
		this.mouseIdleTickMax = 180;
		this.mouseIdleTick = this.mouseIdleTickMax;

		// fix gamepad refresh bug
		// button gets stuck on and a refresh loop occurs
		this.refreshTick = 0;

		this.humLoop = this.playSound( 'hum-1', true );
		this.sound.setVolume( this.humLoop, 0 );
		this.sound.setPlaybackRate( this.humLoop, 1 );

		this.alarmLoop = this.playSound( 'alarm-1', true );
		this.sound.setVolume( this.alarmLoop, 0 );
		this.sound.setPlaybackRate( this.alarmLoop, 1 );

		loadSlide( currentSlide );
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
	startMusic: function() {
		this.song = this.music.play( 'music-1', true );
		this.music.setVolume( this.song, 0.3 );
	},
	stopMusic: function() {
		this.music.fadeOut( this.song );
		this.song = null;
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
		return typeof this.dtNorm === 'undefined' ? 1 : this.dtNorm;
	},
	soundPlay: function( opt ) {
		var active = typeof opt.active === 'undefined' ? false : opt.active;
		if( !active ) {
			return;
		}
		var name = typeof opt.name === 'undefined' ? null : opt.name;
		var volume = typeof opt.volume === 'undefined' ? 1 : opt.volume;
		var rate = typeof opt.rate === 'undefined' ? 1 : opt.rate;
		var pan = typeof opt.pan === 'undefined' ? 0 : opt.pan;
		if ( name ) {
			var sound = pg.playSound( name );
			pg.sound.setVolume( sound, volume );
			pg.sound.setPlaybackRate( sound, rate );
			pg.sound.setPanning( sound, pan );
		}
	}
});