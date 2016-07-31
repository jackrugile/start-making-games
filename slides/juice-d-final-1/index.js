game = new G({
	/*[x]*/ accel: false, // acceleration and friction of paddles
	/*[x]*/ ghost: false, // render ghost ball
	/*[x]*/ extrude: false, // cuboids and raised scores with shadows
	/*[ ]*/ menu: false, // title/control screen and gamewin/gameover screen and score physical visual indicator
	/*[x]*/ move3d: false, // 3d stage rotation based on ball position
	/*[x]*/ music: false, // music soundtrack
	/*[x]*/ particles: false, // particles/pulses - channel bob ross: happy little trees = happy little particles
	/*[x]*/ reaction: false, // light flashes for walls, score, paddles and paddle rotation
	/*[x]*/ screenshake: false, // screenshake!
	/*[x]*/ sound: false, // audio sfx
	/*[ ]*/ spike: false, // spike move with charge and slow motion
	/*[x]*/ spin: false, // rotate ball based on speed and animate in on start
	/*[ ]*/ trajectory: false // bounce ball off paddle bases on position
});

// game = new G({
// 	accel: true,
// 	ghost: true,
// 	extrude: true,
// 	menu: true,
// 	move3d: true,
// 	music: true,
// 	particles: true,
// 	reaction: true,
// 	screenshake: true,
// 	sound: true,
// 	spike: true,
// 	spin: true,
// 	trajectory: true
// });