/*==============================================================================

Timescale Object

==============================================================================*/

G.prototype.Timescale = function( g ) {
	this.g = g;
	this.current = 1;
	this.target = 0.15;
	this.timer = 0;
	this.timerMax = 30; //180;
	this.inDuration = 0.2; //0.6;
	this.outDuration = 0.6; //1;
	this.isSlow = false;
};

G.prototype.Timescale.prototype.step = function() {
	if ( this.isSlow ) {
		if ( this.timer < this.timerMax ) {
			this.timer += this.getCoreDt();
		} else {
			this.timer = 0;
			this.isSlow = false;
			pg.tween( this ).to(
				{
					current: 1
				},
				this.outDuration,
				'inQuad'
			);
		}
	}
};

G.prototype.Timescale.prototype.triggerSlowMo = function() {
	if ( !this.isSlow ) {
		var sound = pg.playSound( 'slow-mo-1' );
		pg.sound.setVolume( sound, 1 );
		this.isSlow = true;
		pg.tween( this ).to(
			{
				current: this.target
			},
			this.inDuration,
			'outQuad'
		);
	}
};

G.prototype.Timescale.prototype.getDt = function() {
	return pg.getDt() * this.current;
};

G.prototype.Timescale.prototype.getInverseDt = function() {
	return 1 - pg.getDt() * this.current;
};

G.prototype.Timescale.prototype.getCoreDt = function() {
	return pg.getDt();
};

G.prototype.Timescale.prototype.getCoreInverseDt = function() {
	return 1 - pg.getDt();
};