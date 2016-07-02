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
- Story / Writing / Dialogue
- Cinematography
- Artifical Intelligence

### Being able to control something on the screen and have an effect on the game world is pretty gosh darn delightful.

## III: Let's Build a Game

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

### What We're Making

#### Bare Bones Pong! 
- Cosmic Paddle Warfare 2084: Wimbledon in Ruins
- The Medieval Racketeer: A Tale from Love to Deuce
- Volley of the Vikings: A Quest for Valhalla

#### The DOM (The tools you know and love)

### Coordinate System

### Drawing from Top Left of Shapes

### HTML: Set the Stage

### CSS: Style the Game Objects

### JS: Game Logic

### Not making Skynet

### AABB Collision Detection
	
## IV: Game Juice / Polish: Enhance That

### Explain Juice / Polish

### Gameplay Changes
- shooting multiple balls at you
- trying to avoid the balls
- change the level for round pong
- add powerups
- add spike move
- add increasing ai difficulty
- add graphics that help the player visualize certain behaviors
	- add edges to paddles to reflect collision detection
- illustrate benefits of good hitboxes vs bad hitboxes
- play against yourself
- influence ball trajectory by moving paddle

### Non-Gameplay Changes
- colors
- add characters
- change setting
- add effects
- add sound
- add music
- add weather
- rotate ball based on direction
- dynamic sound that is affected by the game pieces! paddles and ball
- particles
	- channel bob ross
	- happy little trees = happy little particles
- user video as background (reactions)
- random screenshake
- accurate screenshake
- light flashes
- slow motion
- trails
- 3d stransform based on ball pos
- use svg for lines?
- goo filter
- add stats
- all together

## V: Go Make a Game

### Remix or Innovate, it doesn't matter

- Whether modifying a classic or building a brand new game, put your own twist or flavor into it

### Start small, build working prototypes that demonstrate the core game mechanic. See if it's fun before committing to the long haul.

### In the end, tools don't matter

- any medium is fine, just do it. dom, canvas, gamemaker, unity, board game, etc.

### Resources

#### Go To jackrugile.com/game-dev-resources

### Tutorials

### Game Jams

---

# Slide Notes
- New part introduction (swapped colors?)
- General text slide
- Code slide
- Demo slide (gamepad + arrow indicator)
- Code/Demo slide (gamepad + arrow indicator)
- Keep it somewhat classy, but still funny. Avoid GIFs.

---

# Tech Notes
- 16:9 or 4:3
- Large text
- Two fonts: Lato and (monospace TBD)
- High contrast mode
- Swapped lightness mode
- Control with keyboard and gamepad
- Limit raster images (none if possible)
- Simple transition between slides, hopefully not page reload
- Test thoroughly on laptop for performance, fullscreen, and sound
- Bring speakers in case sound is out of sync with visuals
- Opacity animations are causing the text to snap into a different mode (px shift)
- Option for audio calibration?
- Pause button
- Pause / Step function?

---

# Extended Game Dev Resources
- Game engines
- Game tutorials
- Game jams
- Denver MeetUps
- Canvas and DOM versions available after

---

# Credits and Resources

## Talks
- [Juice it or lose it - a talk by Martin Jonasson & Petri Purho](https://www.youtube.com/watch?v=Fy0aCDmgnxg)
- [Jan Willem Nijman - Vlambeer - "The art of screenshake"](https://www.youtube.com/watch?v=AJdEqssNZ-U)
- [The Creative Coding Podcast - 53 – Iain's guide to Game Design!](http://creativecodingpodcast.com/53-iains-guide-to-game-design/)

## Tutorials
- [Game Mechanic Explorer by John Watson](http://gamemechanicexplorer.com/)
- [Foundation HTML5 Animation with JavaSCript](https://www.amazon.com/dp/1430236655)
- [Coding Math - Keith Peters](https://www.youtube.com/user/codingmath)
- [Coding Rainbow - Daniel Shiffman](https://www.youtube.com/channel/UCvjgXvBlbQiydffZU7m1_aw)

## Tools
- [CodePen](http://codepen.io/)
- [Playground.js](http://playgroundjs.com/)
- [Bfxr](http://www.bfxr.net/)

## People
- [Justin Gitlin - @cacheflowe](http://twitter.com/cacheflowe)
- [Keith Peters - @bit101](http://twitter.com/bit101)
- [Przemysław Sikorski - @rezoner](http://twitter.com/rezoner)

## Competitions and Challenges
- [js13k](http://js13kgames.com/)
- [js1k](http://js1k.com/)
- [Ludum Dare](http://ludumdare.com/compo/)
- [#1GAM - One Game a Month](http://onegameamonth.com/)

---

# Miscellaneous
- easy to get started, difficult to master
- math plays a role
- don't need to know it all
- hide it away in a utility/helper function
- pythagoreans theorem? totally useful!
- I don't learn all the math because of pythagoreasons
- show "where" we are when zoomed in on code
- whole journey that other game developers have experience that you get to experience too
	- even if you weren't the one to invent or discover a concept, it still feels great to understand it and implement it in your own way