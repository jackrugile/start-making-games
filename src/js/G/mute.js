import G from "./game.js";

/*==============================================================================

Mute / Umute / Mute Toggle

==============================================================================*/

G.prototype.muteToggle = function () {
  if (this.muted) {
    this.unmute();
  } else {
    this.mute();
  }
};

G.prototype.mute = function () {
  this.muted = true;
  pg.sound.setMaster(0);
  pg.music.setMaster(0);
};

G.prototype.unmute = function () {
  this.muted = false;
  pg.sound.setMaster(1);
  pg.music.setMaster(1);
};
