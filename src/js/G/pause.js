/*==============================================================================

Pause / Unpause / Pause Toggle

==============================================================================*/

G.prototype.pauseToggle = function() {
	if( this.paused ) {
		this.unpause();
	} else {
		this.pause();
	}
};

G.prototype.pause = function() {
	this.paused = true;
	document.documentElement.classList.add( 'paused' );
};

G.prototype.unpause = function() {
	this.paused = false;
	document.documentElement.classList.remove( 'paused' );
};