/*==============================================================================

Score Object

==============================================================================*/

G.prototype.Score = function( g, isPlayer ) {
	this.g = g;
	this.isPlayer = isPlayer;
	this.isEnemy = !isPlayer;
	this.value = 0;
	this.flag = true;

	if ( this.isPlayer) {
		this.elem = document.querySelector( '.g-score-player' );
	} else {
		this.elem = document.querySelector( '.g-score-enemy' );
	}
};

G.prototype.Score.prototype.setValue = function( value ) {
	this.value = value;
	this.flag = true;
};

G.prototype.Score.prototype.draw = function() {
	if ( this.flag ) {
		this.g.text( this.elem, this.value );
		this.g.attr( this.elem, 'data-score', this.value.toString() );
		this.flag = false;
	}
};