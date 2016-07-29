/*==============================================================================

Stage Object

==============================================================================*/

G.prototype.Stage = function( g ) {
	this.g = g;
	this.elem = document.querySelector('.g-pong');
	this.xDeg = 0;
	this.xDegTarget = 0;
	this.yDeg = 0;
	this.yDegTarget = 0;
	this.rangeDeg = 10;
	this.xTrans = 0;
	this.xTransTarget = 0;
	this.yTrans = 0;
	this.yTransTarget = 0;
	this.smoothingDeg = 0.05;
	this.rotation = 0;
	this.scaleBase = 0.85;
	this.scale = this.scaleBase;
	this.width = 1920;
	this.height = 1080;
};

G.prototype.Stage.prototype.step = function() {
	this.xDegTarget = ( ( this.g.ball.y / ( this.height - this.g.ball.height ) - 0.5 ) * 2 ) * this.rangeDeg;
	this.xDeg += ( this.xDegTarget - this.xDeg ) * this.smoothingDeg;

	this.yDegTarget = ( ( this.g.ball.x / ( this.width - this.g.ball.width ) - 0.5 ) * 2 ) * this.rangeDeg;
	this.yDeg += ( this.yDegTarget - this.yDeg ) * this.smoothingDeg;

	this.xTransTarget = ( -this.g.ball.x + this.width / 2 ) * 0.1 * ( ( 1 - this.g.timescale.current ) * 10 );
	this.xTrans += ( this.xTransTarget - this.xTrans ) * this.smoothingDeg;

	this.yTransTarget = ( -this.g.ball.y + this.height / 2 ) * 0.1 * ( ( 1 - this.g.timescale.current ) * 10 );
	this.yTrans += ( this.yTransTarget - this.yTrans ) * this.smoothingDeg;

	this.rotation = this.g.screenshake.angle;

	this.scale = this.scaleBase + ( ( 1 - this.g.timescale.current ) * 0.3 );
};

G.prototype.Stage.prototype.draw = function() {
	this.g.css( this.elem, 'transform', 'scale( ' + this.scale + ' ) translateX(' + ( this.xTrans + this.g.screenshake.x ) + 'px) translateY(' + ( this.yTrans + this.g.screenshake.y ) + 'px) rotateX(' + -this.xDeg + 'deg) rotateY(' + this.yDeg + 'deg) rotateZ(' + this.rotation + 'rad)' )
};