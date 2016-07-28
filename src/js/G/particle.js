/*==============================================================================

Particle

==============================================================================*/

G.prototype.Particle = function( g, parent ) {
	this.g = g;
	this.parent = parent;
	this.elem = this.g.cE( this.g.stage.elem, 'g-particle' );
	this.g.css( this.elem, 'transform', 'translate3d(-999px , -999px, 0)');
};

G.prototype.Particle.prototype.init = function( opt ) {
	this.width = opt.width;
	this.height = opt.height;
	this.x = opt.x;
	this.y = opt.y;
	this.z = opt.z;
	this.vx = opt.vx;
	this.vy = opt.vy;
	this.vz = opt.vz;
	this.rx = opt.rx;
	this.ry = opt.ry;
	this.rz = opt.rz;
	this.decay = opt.decay;
	this.friction = opt.friction;
	this.shrink = opt.shrink;
	this.opacityBase = opt.opacity;

	this.life = 1;
	this.scale = 1;
	this.opacity = this.opacityBase;
};

G.prototype.Particle.prototype.step = function() {
	this.vx *= this.friction;
	this.vy *= this.friction;
	this.vz *= this.friction;
	this.x += this.vx * this.g.timescale.getDt();
	this.y += this.vy * this.g.timescale.getDt();
	this.z += this.vz * this.g.timescale.getDt();
	this.life -= this.decay * this.g.timescale.getDt();
	if( this.shrink ) {
		this.scale = this.life;
	}

	this.opacity = this.life * this.opacityBase;
	if( this.life <= 0 ) {
		this.destroy();
	}
};

G.prototype.Particle.prototype.draw = function() {
	this.g.css( this.elem, {
		opacity: this.opacity,
		transform: 'translate3d(' + this.x + 'px, ' + this.y + 'px, ' + this.z + 'px) rotateX(' + this.rx + 'rad) rotateY(' + this.ry + 'rad) rotateZ(' + this.rz + 'rad) scaleX(' + ( this.width * this.scale ) + ') scaleY(' + ( this.height * this.scale ) + ')'
	});
};

G.prototype.Particle.prototype.destroy = function() {
	this.g.css( this.elem, 'transform', 'translate3d(-999px , -999px, 0)');
	this.parent.release( this );
};

/*==============================================================================

Colors

==============================================================================*/

G.prototype.ParticleWhite = function( g ) {
	this.g = g;
	G.prototype.Particle.apply( this, arguments );
	this.color = '#fff';
	this.g.css( this.elem, 'background', this.color );
}
G.prototype.ParticleWhite.prototype = G.prototype.Particle.prototype;
G.prototype.ParticleWhite.prototype.constructor = G.prototype.ParticleWhite;

G.prototype.ParticleGreen = function( g ) {
	this.g = g;
	G.prototype.Particle.apply( this, arguments );
	this.color = 'hsl(130, 100%, 60%)';
	this.g.css( this.elem, 'background', this.color );
}
G.prototype.ParticleGreen.prototype = G.prototype.Particle.prototype;
G.prototype.ParticleGreen.prototype.constructor = G.prototype.ParticleGreen;

G.prototype.ParticleBlue = function( g ) {
	this.g = g;
	G.prototype.Particle.apply( this, arguments );
	this.color = 'hsl(200, 100%, 60%)';
	this.g.css( this.elem, 'background', this.color );
}
G.prototype.ParticleBlue.prototype = G.prototype.Particle.prototype;
G.prototype.ParticleBlue.prototype.constructor = G.prototype.ParticleBlue;
