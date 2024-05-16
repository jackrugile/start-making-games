/*==============================================================================

Screenshake Object

==============================================================================*/

G.prototype.Screenshake = function (g) {
  this.g = g;
  this.translate = 0;
  this.rotate = 0;
  this.x = 0;
  this.y = 0;
  this.xTarget = 0;
  this.yTarget = 0;
  this.xBias = 0;
  this.yBias = 0;
  this.angle = 0;
  this.angleTarget = 0;
};

G.prototype.Screenshake.prototype.apply = function (opt) {
  this.translate = opt.translate;
  this.rotate = opt.rotate;
  this.xBias = opt.xBias;
  this.yBias = opt.yBias;
};

G.prototype.Screenshake.prototype.step = function () {
  this.xBias *= 0.9;
  this.yBias *= 0.9;

  if (this.translate > 0) {
    this.translate *= 0.9;
    this.xTarget = this.g.rand(-this.translate, this.translate) + this.xBias;
    this.yTarget = this.g.rand(-this.translate, this.translate) + this.yBias;
  } else {
    this.xTarget = 0;
    this.yTarget = 0;
  }

  if (this.rotate > 0) {
    this.rotate *= 0.9;
    this.angleTarget = this.g.rand(-this.rotate, this.rotate);
  } else {
    this.angleTarget = 0;
  }

  this.x += (this.xTarget - this.x) * 0.1;
  this.y += (this.yTarget - this.y) * 0.1;
  this.angle += (this.angleTarget - this.angle) * 0.1;
};
