"use strict";

function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
class Foo {
  constructor() {
    _defineProperty(this, "bar", 1);
  }
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJGb28iXSwic291cmNlcyI6WyJjbGFzcy1wcm9wLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImNsYXNzIEZvbyB7XG4gICAgYmFyID0gMVxufVxuIl0sIm1hcHBpbmdzIjoiOzs7OztBQUFBLE1BQU1BLEdBQUcsQ0FBQztFQUFBO0lBQUEsNkJBQ0EsQ0FBQztFQUFBO0FBQ1gifQ==
