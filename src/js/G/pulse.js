import G from "./game.js";

/*==============================================================================

Pulse

==============================================================================*/

G.prototype.Pulse = function (g, parent) {
  this.g = g;
  this.parent = parent;
  this.elem = this.g.cE(this.g.stage.elem, "g-pulse");
  this.g.css(this.elem, {
    opacity: 0,
    transform: "translate3d(-999px , -999px, 0)",
  });
};

G.prototype.Pulse.prototype.init = function (opt) {
  this.width = opt.width;
  this.height = opt.height;
  this.x = opt.x;
  this.y = opt.y;
  this.z = opt.z;
  this.r = opt.r;
  this.shrink = opt.shrink;
  this.decay = opt.decay;
  this.opacityBase = opt.opacity;

  this.life = 1;
  this.scale = 1;
  this.opacity = this.opacityBase;
};

G.prototype.Pulse.prototype.step = function () {
  this.life -= this.decay * this.g.timescale.getDt();
  if (this.shrink) {
    this.scale = this.life;
  } else {
    this.scale = 0 + (2 - this.life * 2);
  }

  this.opacity = this.life * this.opacityBase;
  if (this.life <= 0) {
    this.destroy();
  }
};

G.prototype.Pulse.prototype.draw = function () {
  this.g.css(this.elem, {
    opacity: this.opacity,
    transform:
      "translate3d(" +
      this.x +
      "px, " +
      this.y +
      "px, " +
      this.z +
      "px) rotateZ(" +
      this.r +
      "rad) scaleX(" +
      this.scale +
      ") scaleY(" +
      this.scale +
      ")",
  });
};

G.prototype.Pulse.prototype.destroy = function () {
  this.g.css(this.elem, {
    opacity: 0,
    transform: "translate3d(-999px , -999px, 0)",
  });
  this.parent.release(this);
};

/*==============================================================================

Colors

==============================================================================*/

G.prototype.PulseWhite = function (g) {
  this.g = g;
  G.prototype.Pulse.apply(this, arguments);
  this.color = "#fff";
  this.g.css(this.elem, "border-color", this.color);
  //this.g.css( this.elem, 'background', this.color );
};
G.prototype.PulseWhite.prototype = G.prototype.Pulse.prototype;
G.prototype.PulseWhite.prototype.constructor = G.prototype.PulseWhite;

G.prototype.PulseGreen = function (g) {
  this.g = g;
  G.prototype.Pulse.apply(this, arguments);
  this.color = "hsl(130, 100%, 60%)";
  this.g.css(this.elem, "border-color", this.color);
  //this.g.css( this.elem, 'background', this.color );
};
G.prototype.PulseGreen.prototype = G.prototype.Pulse.prototype;
G.prototype.PulseGreen.prototype.constructor = G.prototype.PulseGreen;

G.prototype.PulseBlue = function (g) {
  this.g = g;
  G.prototype.Pulse.apply(this, arguments);
  this.color = "hsl(200, 100%, 60%)";
  this.g.css(this.elem, "border-color", this.color);
  //this.g.css( this.elem, 'background', this.color );
};
G.prototype.PulseBlue.prototype = G.prototype.Pulse.prototype;
G.prototype.PulseBlue.prototype.constructor = G.prototype.PulseBlue;
