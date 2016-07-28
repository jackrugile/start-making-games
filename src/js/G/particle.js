/*==============================================================================

Particle

==============================================================================*/

G.prototype.Particle = function( g ) {
	this.g = g;
	this.elem = this.g.cE( this.g.stage.elem, 'g-particle' );
	this.g.css( this.elem, 'transform', 'translate3d(-999px , -999px, 0)');
};

G.prototype.Particle.prototype.init = function( opt ) {
	this.color = opt.color;
	this.size = this.g.randInt( 1, 20 )
	this.width = this.size;
	this.height = this.size;
	this.x = opt.x - this.width / 2;
	this.y = opt.y - this.height / 2;
	this.z = opt.z;
	this.vx = this.g.rand( -2, 2 );
	this.vy = this.g.rand( -2, 2 );
	this.vz = this.g.rand( -2, 2 );
	this.rx = 0;
	this.ry = 0;
	this.rz = 0;
	this.opacity = 1;
	this.life = 1;
	this.decay = this.g.rand( 0.01, 0.05 );

	this.g.css( this.elem, {
		background: this.color,
		width: this.width + 'px',
		height: this.height + 'px'
	});
};

G.prototype.Particle.prototype.step = function() {
	this.x += this.vx;
	this.y += this.vy;
	this.z += this.vz;
	this.life -= this.decay;
	this.opacity = this.life;
	if( this.life <= 0 ) {
		this.destroy();
	}
};

G.prototype.Particle.prototype.draw = function() {
	this.g.css( this.elem, {
		opacity: this.opacity,
		transform: 'translate3d(' + this.x + 'px, ' + this.y + 'px, ' + this.z + 'px) rotateX(' + this.rx + 'rad) rotateY(' + this.ry + 'rad) rotateZ(' + this.rz + 'rad)'
	});
};

G.prototype.Particle.prototype.destroy = function() {
	this.g.css( this.elem, 'transform', 'translate3d(-999px , -999px, 0)');
	this.g.particles.release( this );
};