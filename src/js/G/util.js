/*==============================================================================

Random

==============================================================================*/

G.prototype.rand = function (min, max) {
  return Math.random() * (max - min) + min;
};

G.prototype.randInt = function (min, max) {
  return Math.floor(min + Math.random() * (max - min + 1));
};

/*==============================================================================

AABB Collision Detection / Axis Aligned Bounding Box

==============================================================================*/

G.prototype.collisionAABB = function (r1, r2) {
  if (
    !(
      (
        r1.x > r2.x + r2.width || // rect1 is on the right of rect2
        r1.x + r1.width < r2.x || // rect1 is on the left of rect2
        r1.y > r2.y + r2.height || // rect1 is below rect2
        r1.y + r1.height < r2.y
      ) // rect1 is above rect2
    )
  ) {
    return true;
  }
};

/*==============================================================================
Miscellaneous
==============================================================================*/

G.prototype.isString = function (variable) {
  return typeof variable === "string";
};

G.prototype.isObject = function (variable) {
  return typeof variable === "object";
};

G.prototype.isSet = function (prop) {
  return typeof prop != "undefined";
};

G.prototype.isObjEmpty = function (obj) {
  for (var prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      return false;
    }
  }
  return true;
};

G.prototype.merge = function (obj1, obj2) {
  for (var prop in obj2) {
    obj1[prop] = obj2[prop];
  }
};
