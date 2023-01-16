"use strict";

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
var fs = require("fs");
var path = require("path");
var _require = require("child_process"),
  spawn = _require.spawn;
var _require2 = require("child_process"),
  spawnSync = _require2.spawnSync;
function transpile(port, file) {
  var client = spawnSync("node", [path.join(__dirname, "..", "src", "client.js"), port, path.join(__dirname, file)]);
  if (client.error) throw client.error;
  var stderr = String(client.stderr);
  if (stderr.length) console.error(stderr);
  fs.writeFileSync(path.join(__dirname, file) + ".g.js", String(client.stdout));
  return client.status;
}
function runTests(port) {
  var failed = 0;
  var _iterator = _createForOfIteratorHelper(fs.readdirSync(__dirname)),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      file = _step.value;
      if (file.endsWith('.g.js')) continue;
      switch (file.split('.').pop()) {
        case "ts":
        case "js":
          break;
        default:
          continue;
      }
      console.log(file);
      var status = transpile(port, file);
      if (status != 0) failed++;
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
  if (!failed) console.log("\nall tests passed");else console.log("\n".concat(failed, " tests failed"));
  return failed;
}

// Start transpiler server.
var server = spawn("node", [process.argv.length > 2 ? process.argv[2] : path.join(__dirname, "..", "src", "server.js")]);
server.stdout.on('data', function (data) {
  // Get port from log.
  var port = data.toString().trim().split(":")[1];

  // Run test suite.
  process.exit(runTests(port));
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJmcyIsInJlcXVpcmUiLCJwYXRoIiwic3Bhd24iLCJzcGF3blN5bmMiLCJ0cmFuc3BpbGUiLCJwb3J0IiwiZmlsZSIsImNsaWVudCIsImpvaW4iLCJfX2Rpcm5hbWUiLCJlcnJvciIsInN0ZGVyciIsIlN0cmluZyIsImxlbmd0aCIsImNvbnNvbGUiLCJ3cml0ZUZpbGVTeW5jIiwic3Rkb3V0Iiwic3RhdHVzIiwicnVuVGVzdHMiLCJmYWlsZWQiLCJyZWFkZGlyU3luYyIsImVuZHNXaXRoIiwic3BsaXQiLCJwb3AiLCJsb2ciLCJzZXJ2ZXIiLCJwcm9jZXNzIiwiYXJndiIsIm9uIiwiZGF0YSIsInRvU3RyaW5nIiwidHJpbSIsImV4aXQiXSwic291cmNlcyI6WyJ0ZXN0LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImNvbnN0IGZzID0gcmVxdWlyZShcImZzXCIpO1xuY29uc3QgcGF0aCA9IHJlcXVpcmUoXCJwYXRoXCIpO1xuY29uc3Qge3NwYXdufSA9IHJlcXVpcmUoXCJjaGlsZF9wcm9jZXNzXCIpO1xuY29uc3Qge3NwYXduU3luY30gPSByZXF1aXJlKFwiY2hpbGRfcHJvY2Vzc1wiKTtcblxuZnVuY3Rpb24gdHJhbnNwaWxlKHBvcnQsIGZpbGUpIHtcbiAgICBjb25zdCBjbGllbnQgPSBzcGF3blN5bmMoXCJub2RlXCIsIFtcbiAgICAgICAgcGF0aC5qb2luKF9fZGlybmFtZSwgXCIuLlwiLCBcInNyY1wiLCBcImNsaWVudC5qc1wiKSxcbiAgICAgICAgcG9ydCwgcGF0aC5qb2luKF9fZGlybmFtZSwgZmlsZSlcbiAgICBdKTtcblxuICAgIGlmIChjbGllbnQuZXJyb3IpXG4gICAgICAgIHRocm93IGNsaWVudC5lcnJvcjtcblxuICAgIGNvbnN0IHN0ZGVyciA9IFN0cmluZyhjbGllbnQuc3RkZXJyKTtcbiAgICBpZiAoc3RkZXJyLmxlbmd0aClcbiAgICAgICAgY29uc29sZS5lcnJvcihzdGRlcnIpO1xuXG4gICAgZnMud3JpdGVGaWxlU3luYyhwYXRoLmpvaW4oX19kaXJuYW1lLCBmaWxlKSArIFwiLmcuanNcIiwgU3RyaW5nKGNsaWVudC5zdGRvdXQpKTtcbiAgICByZXR1cm4gY2xpZW50LnN0YXR1cztcbn1cblxuZnVuY3Rpb24gcnVuVGVzdHMocG9ydCkge1xuICAgIGxldCBmYWlsZWQgPSAwO1xuXG4gICAgZm9yIChmaWxlIG9mIGZzLnJlYWRkaXJTeW5jKF9fZGlybmFtZSkpIHtcbiAgICAgICAgaWYgKGZpbGUuZW5kc1dpdGgoJy5nLmpzJykpXG4gICAgICAgICAgICBjb250aW51ZTtcblxuICAgICAgICBzd2l0Y2ggKGZpbGUuc3BsaXQoJy4nKS5wb3AoKSkge1xuICAgICAgICAgICAgY2FzZSBcInRzXCI6XG4gICAgICAgICAgICBjYXNlIFwianNcIjpcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zb2xlLmxvZyhmaWxlKTtcbiAgICAgICAgY29uc3Qgc3RhdHVzID0gdHJhbnNwaWxlKHBvcnQsIGZpbGUpO1xuXG4gICAgICAgIGlmIChzdGF0dXMgIT0gMClcbiAgICAgICAgICAgIGZhaWxlZCsrO1xuICAgIH1cblxuICAgIGlmICghZmFpbGVkKVxuICAgICAgICBjb25zb2xlLmxvZyhgXFxuYWxsIHRlc3RzIHBhc3NlZGApO1xuICAgIGVsc2VcbiAgICAgICAgY29uc29sZS5sb2coYFxcbiR7ZmFpbGVkfSB0ZXN0cyBmYWlsZWRgKTtcblxuICAgIHJldHVybiBmYWlsZWQ7XG59XG5cbi8vIFN0YXJ0IHRyYW5zcGlsZXIgc2VydmVyLlxuY29uc3Qgc2VydmVyID0gc3Bhd24oXCJub2RlXCIsIFtcbiAgICBwcm9jZXNzLmFyZ3YubGVuZ3RoID4gMlxuICAgICAgICA/IHByb2Nlc3MuYXJndlsyXVxuICAgICAgICA6IHBhdGguam9pbihfX2Rpcm5hbWUsIFwiLi5cIiwgXCJzcmNcIiwgXCJzZXJ2ZXIuanNcIilcbl0pO1xuXG5zZXJ2ZXIuc3Rkb3V0Lm9uKCdkYXRhJywgZGF0YSA9PiB7XG4gICAgLy8gR2V0IHBvcnQgZnJvbSBsb2cuXG4gICAgY29uc3QgcG9ydCA9IGRhdGEudG9TdHJpbmcoKS50cmltKCkuc3BsaXQoXCI6XCIpWzFdO1xuXG4gICAgLy8gUnVuIHRlc3Qgc3VpdGUuXG4gICAgcHJvY2Vzcy5leGl0KHJ1blRlc3RzKHBvcnQpKTtcbn0pO1xuIl0sIm1hcHBpbmdzIjoiOzs7OztBQUFBLElBQU1BLEVBQUUsR0FBR0MsT0FBTyxDQUFDLElBQUksQ0FBQztBQUN4QixJQUFNQyxJQUFJLEdBQUdELE9BQU8sQ0FBQyxNQUFNLENBQUM7QUFDNUIsZUFBZ0JBLE9BQU8sQ0FBQyxlQUFlLENBQUM7RUFBakNFLEtBQUssWUFBTEEsS0FBSztBQUNaLGdCQUFvQkYsT0FBTyxDQUFDLGVBQWUsQ0FBQztFQUFyQ0csU0FBUyxhQUFUQSxTQUFTO0FBRWhCLFNBQVNDLFNBQVMsQ0FBQ0MsSUFBSSxFQUFFQyxJQUFJLEVBQUU7RUFDM0IsSUFBTUMsTUFBTSxHQUFHSixTQUFTLENBQUMsTUFBTSxFQUFFLENBQzdCRixJQUFJLENBQUNPLElBQUksQ0FBQ0MsU0FBUyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsV0FBVyxDQUFDLEVBQzlDSixJQUFJLEVBQUVKLElBQUksQ0FBQ08sSUFBSSxDQUFDQyxTQUFTLEVBQUVILElBQUksQ0FBQyxDQUNuQyxDQUFDO0VBRUYsSUFBSUMsTUFBTSxDQUFDRyxLQUFLLEVBQ1osTUFBTUgsTUFBTSxDQUFDRyxLQUFLO0VBRXRCLElBQU1DLE1BQU0sR0FBR0MsTUFBTSxDQUFDTCxNQUFNLENBQUNJLE1BQU0sQ0FBQztFQUNwQyxJQUFJQSxNQUFNLENBQUNFLE1BQU0sRUFDYkMsT0FBTyxDQUFDSixLQUFLLENBQUNDLE1BQU0sQ0FBQztFQUV6QlosRUFBRSxDQUFDZ0IsYUFBYSxDQUFDZCxJQUFJLENBQUNPLElBQUksQ0FBQ0MsU0FBUyxFQUFFSCxJQUFJLENBQUMsR0FBRyxPQUFPLEVBQUVNLE1BQU0sQ0FBQ0wsTUFBTSxDQUFDUyxNQUFNLENBQUMsQ0FBQztFQUM3RSxPQUFPVCxNQUFNLENBQUNVLE1BQU07QUFDeEI7QUFFQSxTQUFTQyxRQUFRLENBQUNiLElBQUksRUFBRTtFQUNwQixJQUFJYyxNQUFNLEdBQUcsQ0FBQztFQUFDLDJDQUVGcEIsRUFBRSxDQUFDcUIsV0FBVyxDQUFDWCxTQUFTLENBQUM7SUFBQTtFQUFBO0lBQXRDLG9EQUF3QztNQUFuQ0gsSUFBSTtNQUNMLElBQUlBLElBQUksQ0FBQ2UsUUFBUSxDQUFDLE9BQU8sQ0FBQyxFQUN0QjtNQUVKLFFBQVFmLElBQUksQ0FBQ2dCLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQ0MsR0FBRyxFQUFFO1FBQ3pCLEtBQUssSUFBSTtRQUNULEtBQUssSUFBSTtVQUNMO1FBQ0o7VUFDSTtNQUFTO01BR2pCVCxPQUFPLENBQUNVLEdBQUcsQ0FBQ2xCLElBQUksQ0FBQztNQUNqQixJQUFNVyxNQUFNLEdBQUdiLFNBQVMsQ0FBQ0MsSUFBSSxFQUFFQyxJQUFJLENBQUM7TUFFcEMsSUFBSVcsTUFBTSxJQUFJLENBQUMsRUFDWEUsTUFBTSxFQUFFO0lBQ2hCO0VBQUM7SUFBQTtFQUFBO0lBQUE7RUFBQTtFQUVELElBQUksQ0FBQ0EsTUFBTSxFQUNQTCxPQUFPLENBQUNVLEdBQUcsc0JBQXNCLENBQUMsS0FFbENWLE9BQU8sQ0FBQ1UsR0FBRyxhQUFNTCxNQUFNLG1CQUFnQjtFQUUzQyxPQUFPQSxNQUFNO0FBQ2pCOztBQUVBO0FBQ0EsSUFBTU0sTUFBTSxHQUFHdkIsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUN6QndCLE9BQU8sQ0FBQ0MsSUFBSSxDQUFDZCxNQUFNLEdBQUcsQ0FBQyxHQUNqQmEsT0FBTyxDQUFDQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQ2YxQixJQUFJLENBQUNPLElBQUksQ0FBQ0MsU0FBUyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsV0FBVyxDQUFDLENBQ3ZELENBQUM7QUFFRmdCLE1BQU0sQ0FBQ1QsTUFBTSxDQUFDWSxFQUFFLENBQUMsTUFBTSxFQUFFLFVBQUFDLElBQUksRUFBSTtFQUM3QjtFQUNBLElBQU14QixJQUFJLEdBQUd3QixJQUFJLENBQUNDLFFBQVEsRUFBRSxDQUFDQyxJQUFJLEVBQUUsQ0FBQ1QsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQzs7RUFFakQ7RUFDQUksT0FBTyxDQUFDTSxJQUFJLENBQUNkLFFBQVEsQ0FBQ2IsSUFBSSxDQUFDLENBQUM7QUFDaEMsQ0FBQyxDQUFDIn0=
