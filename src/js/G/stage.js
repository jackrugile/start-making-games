import G from "./game.js";

/*==============================================================================

Stage Object

==============================================================================*/

G.prototype.Stage = function (g) {
  this.g = g;
  this.elem = document.querySelector(".g-pong");
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
  this.scaleBase = this.g.opt.move3d ? 0.85 : 1;
  this.scale = this.scaleBase;
  this.width = 1920;
  this.height = 1080;
};

G.prototype.Stage.prototype.step = function () {
  let lerp = 1 - Math.exp(-this.smoothingDeg * this.g.timescale.getDt());

  this.xDegTarget =
    this.g.done || this.g.ball.serving
      ? 0
      : (this.g.ball.y / (this.height - this.g.ball.height) - 0.5) *
        2 *
        this.rangeDeg;
  this.xDeg += (this.xDegTarget - this.xDeg) * lerp;

  this.yDegTarget =
    this.g.done || this.g.ball.serving
      ? 0
      : (this.g.ball.x / (this.width - this.g.ball.width) - 0.5) *
        2 *
        this.rangeDeg;
  this.yDeg += (this.yDegTarget - this.yDeg) * lerp;

  this.xTransTarget =
    this.g.done || this.g.ball.serving
      ? 0
      : (-this.g.ball.x + this.width / 2) *
        0.1 *
        ((1 - this.g.timescale.current) * 10);
  this.xTrans += (this.xTransTarget - this.xTrans) * lerp;

  this.yTransTarget =
    this.g.done || this.g.ball.serving
      ? 0
      : (-this.g.ball.y + this.height / 2) *
        0.1 *
        ((1 - this.g.timescale.current) * 10);
  this.yTrans += (this.yTransTarget - this.yTrans) * lerp;

  this.rotation = this.g.screenshake.angle;

  this.scale = this.scaleBase + (1 - this.g.timescale.current) * 0.3;
};

G.prototype.Stage.prototype.draw = function () {
  this.g.css(
    this.elem,
    "transform",
    "scale( " +
      this.scale +
      " ) translateX(" +
      (this.xTrans + this.g.screenshake.x) +
      "px) translateY(" +
      (this.yTrans + this.g.screenshake.y) +
      "px) rotateX(" +
      -this.xDeg +
      "deg) rotateY(" +
      this.yDeg +
      "deg) rotateZ(" +
      this.rotation +
      "rad)"
  );
};
