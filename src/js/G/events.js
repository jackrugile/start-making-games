/*==============================================================================

Events / Add Event Listeners / Remove Event Listeners

==============================================================================*/

G.prototype.addEventListeners = function() {
	// need to create stored bound events for a common reference when removing event listeners

	this.controlUpDownBound = this.onControlUpDown.bind( this );
	this.controlDownDownBound = this.onControlDownDown.bind( this );
	this.controlSpikeDownBound = this.onControlSpikeDown.bind( this );
	this.controlUpUpBound = this.onControlUpUp.bind( this );
	this.controlDownUpBound = this.onControlDownUp.bind( this );
	this.controlSpikeUpBound = this.onControlSpikeUp.bind( this );
	this.mouseLeftDownBound = this.onMouseLeftDown.bind( this );
	this.controlMuteDownBound = this.onControlMuteDown.bind( this );
	this.controlPauseDownBound = this.onControlPauseDown.bind( this );

	window.addEventListener( 'controlUpDown', this.controlUpDownBound );
	window.addEventListener( 'controlDownDown', this.controlDownDownBound );
	window.addEventListener( 'controlSpikeDown', this.controlSpikeDownBound );
	window.addEventListener( 'controlUpUp', this.controlUpUpBound );
	window.addEventListener( 'controlDownUp', this.controlDownUpBound );
	window.addEventListener( 'controlSpikeUp', this.controlSpikeUpBound );
	window.addEventListener( 'mouseLeftDown', this.mouseLeftDownBound );
	/*window.addEventListener( 'mouseRightDown', this.onMouseRightDown.bind( this ) );
	window.addEventListener( 'mouseLeftUp', this.onMouseLeftUp.bind( this ) );
	window.addEventListener( 'mouseRightUp', this.onMouseRightUp.bind( this ) );*/
	window.addEventListener( 'controlMuteDown', this.controlMuteDownBound );
	window.addEventListener( 'controlPauseDown', this.controlPauseDownBound );
};

G.prototype.removeEventListeners = function() {
	window.removeEventListener( 'controlUpDown', this.controlUpDownBound );
	window.removeEventListener( 'controlDownDown', this.controlDownDownBound );
	window.removeEventListener( 'controlSpikeDown', this.controlSpikeDownBound );
	window.removeEventListener( 'controlUpUp', this.controlUpUpBound );
	window.removeEventListener( 'controlDownUp', this.controlDownUpBound );
	window.removeEventListener( 'mouseLeftDown', this.mouseLeftDownBound );
	/*window.removeEventListener( 'mouseRightDown', this.onMouseRightDown.bind( this ) );
	window.removeEventListener( 'mouseLeftUp', this.onMouseLeftUp.bind( this ) );
	window.removeEventListener( 'mouseRightUp', this.onMouseRightUp.bind( this ) );*/
	window.removeEventListener( 'controlMuteDown', this.controlMuteDownBound );
	window.removeEventListener( 'controlPauseDown', this.controlPauseDownBound );
};

G.prototype.onControlUpDown = function() {
	this.paddlePlayer.moveUp = true;
};

G.prototype.onControlDownDown = function() {
	this.paddlePlayer.moveDown = true;
};

G.prototype.onControlSpikeDown = function() {
	this.paddlePlayer.isCharging = true;
};

G.prototype.onControlUpUp = function() {
	this.paddlePlayer.moveUp = false;
};

G.prototype.onControlDownUp = function() {
	this.paddlePlayer.moveDown = false;
};

G.prototype.onControlSpikeUp = function() {
	if( !this.paused ) {
		this.paddlePlayer.isCharging = false;
		this.paddlePlayer.spike();
	}
};

G.prototype.onMouseLeftDown = function() {
	/*if( !this.paused ) {
		this.timescale.triggerSlowMo();
	}*/
};

/*
G.prototype.onMouseRightDown = function() {
};

G.prototype.onMouseLeftUp = function() {
};

G.prototype.onMouseRightUp = function() {
};
*/

G.prototype.onControlMuteDown = function() {
	this.muteToggle();
};

G.prototype.onControlPauseDown = function() {
	this.pauseToggle();
};