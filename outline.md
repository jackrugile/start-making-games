##### Develop Denver 2016

# Start Making Games

## I: Intro (Who the heck?)

### By Day

#### Jack Rugile
- Front End Developer at The Firm Graphics
- 28 year old introverted Virgo
- Loves sandwiches, cookies, pizza, and beer
- Approaches most things like ¯\\_(ツ)_/¯
- @jackrugile on The Internet

### By Night

#### Jack Rugile (still)
- Hobby HTML5 Game Developer
- Game Jammer
- CodePen Demo Maker

### My Goal
- Get you to start making games
- Already do? Make more games. Make better games.















## II: Game Dev is Amazing

### It's also painful, frustrating, exhausting

### But mainly it's amazing!

### The Ultimate Creative Expression
- Visual Art / Graphics
- Animation
- Sound
- Music
- Interactivity
- User Interface
- Story / Writing / Dialogue / Characters
- Cinematography
- Artifical Intelligence

### Being able to control something on the screen and have an effect on the game world is pretty gosh darn delightful.

### Similarities between Front End Dev and Game Dev

#### context/position aware
- use TD game as example

#### performance is key
- framerate
- load time

#### use analytics to improve your game
- how many people beat it?
- which levels to people quit at?
- which control scheme is most used?
- when do people play?
- how many people mute the game?
- how many people are experiencing a low frame rate?













## III: Let's Build a Game

- explanation
	- we're building pong
	- DOM renderer with html, css, and js
	- not using an engine
	- coordinate system
	- drawing from top left
	- to be used as a reference later, don't memorize


- html
	- *** build-c-html-1
		- perfect since nothing gets added or removed from the game
		- can add more elements later
- css
	- *** build-c-css-pong-1
	- *** build-d-css-pong-1
	- *** build-c-css-paddles-1
	- *** build-d-css-paddles-1
	- *** build-c-css-score-1
	- *** build-d-css-score-1
	- *** build-c-css-net-ball-1
	- *** build-d-css-net-ball-1
- js
	- *** build-c-js-structure-1
		- show the stubs for each function
		- also show it being called with init to win it
	- *** build-c-js-config-1
		 - explain that ballSpeed will change
	- *** build-c-js-object-paddle-player-1
	- *** build-c-js-object-paddle-enemy-1
	- *** build-c-js-object-ball-1
	- *** build-c-js-object-score-1
	- *** build-c-js-render-1
		- explain why transforms hardware accelerated (GPU)
		- only affects composite layer
		- not painting or redoing layout on each frame, subpixel rendering
	- *** build-d-js-render-1
	- *** build-c-js-move-ball-1
		- explain about adding a negative value
	- *** build-c-js-update-1
	- *** build-c-js-loop-1
		- explain frame based animation
		- explain request animation frame
			- syncs with a browsers refresh, target of 60 fps
			- prevents possible queued or out of sync operations caused by setInterval() and setTimeout()
			- stops running when browser window/tab is not in focus
			- results in a smoother animation overall
	- *** build-c-js-init-1
	- *** build-d-js-loop-1
	- *** build-c-js-contain-ball-1
		- placeholder bounce off walls on left and right
	- *** build-c-js-update-2
	- *** build-d-js-contain-ball-1
	- *** build-c-js-move-player-1
	- *** build-c-js-update-3
	- *** build-c-js-add-event-listeners-1
		 - explain keycodes
	- *** build-c-js-init-2
	- *** build-d-js-move-player-1
	- *** build-c-js-move-enemy-1
		- not making skynet
		- explain temporary blindness
	- build-i-js-random-1
	- *** build-c-js-update-4
	- *** build-d-js-move-enemy-1
	- *** build-c-js-contain-paddles-1
		- explain math min/max
		- could use if condition on both sides, but is not needed
	- *** build-c-js-update-5
	- *** build-d-js-contain-paddles-1
	- *** build-c-js-collision-aabb-1
		- possibly supplement with illustrative slide explaining
	- *** build-i-js-aabb-separation-conditions-1
	- *** build-c-js-collide-ball-paddles-1
		- explain why x has to be explicitly set so that it doesn't collide again
		- not checking angle, just checking for a boolean of it hit or not
	- *** build-c-js-update-6
	- *** build-d-js-collide-ball-paddles-1
	- *** build-c-js-contain-ball-2
		- add on scoring logic, still bounce off left and right walls, no speed inc
		- explain score updating
	- *** build-d-js-contain-ball-2
	- *** build-c-js-reset-ball-1
	- ***build-c-js-contain-ball-3
		- add on reset function
		- add and explain speed inc
	- *** build-d-js-reset-ball-1
	- *** build-c-js-check-win-state-1
	- *** build-c-js-update-7
	- *** build-c-js-reset-game-1
	- *** build-d-js-check-win-state-1
















## IV: Game Juice / Polish: Enhance That

### Explain Juice / Polish

### Gameplay Changes
- spike move
- add increasing ai difficulty
- angle changes depending on where on paddle it hits
- add acceleration and friction
- add wind?

### Non-Gameplay Changes
- title
	- The Medieval Racketeer: A Tale from Love to Deuce
	- Volley of the Vikings: A Quest for Valhalla
	- Cosmic Paddle Warfare 2084: Wimbledon in Ruins
- add characters
- audio
	- sfx
	- stereo sound
	- music
- ambience
	- diagonal light streaks
	- background grid
		- anaglyph or chromatic shake
		- light up panel bases on where ball is
- rotate ball based on direction
- particles
	- trails
	- channel bob ross : happy little trees = happy little particles
- screenshake
	- subtle random
	- accurate on big movements
	- chromatic abberation?
- light flashes
	- entire screen
	- paddles
	- ball pulse light
	- flash score
- slow motion
	- zoom on ball?
- 3d
	- level transform based on ball pos
	- extrude game objects
- misc polish
	- animate ball in
	- alternate ball direction
	- victory screen
	- pre game display
	- general shadows for game objects
- total score and progress meter (bar)
- all together





















## V: Go Make a Game

### Remix or Innovate, it doesn't matter

- Whether modifying a classic or building a brand new game, put your own twist or flavor into it

### Start small, build working prototypes that demonstrate the core game mechanic. See if it's fun before committing to the long haul.

### In the end, tools don't matter

- any medium is fine, just do it. dom, canvas, gamemaker, unity, board game, etc.

### Resources

#### Go To jackrugile.com/game-dev-resources

- final slides
- final game
- getting started resources
	- http://codepen.io/desandro/pen/ezNawy