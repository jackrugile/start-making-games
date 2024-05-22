import G from "./game.js";

/*==============================================================================

Pause / Unpause / Pause Toggle

==============================================================================*/

G.prototype.pauseToggle = function () {
  if (this.paused) {
    this.unpause();
  } else {
    this.pause();
  }
};

G.prototype.pause = function () {
  this.paused = true;
  document.documentElement.classList.add("paused");
  window.pg.sound.setVolume(pg.humLoop, 0);
  window.pg.sound.setVolume(pg.alarmLoop, 0);
};

G.prototype.unpause = function () {
  this.paused = false;
  document.documentElement.classList.remove("paused");
};
