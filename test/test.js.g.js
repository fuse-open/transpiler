"use strict";

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
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = fs.readdirSync(__dirname)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
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
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return != null) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  if (!failed) console.log("\nall tests passed");else console.log("\n".concat(failed, " tests failed"));
  return failed;
} // Start transpiler server.


var server = spawn("node", [process.argv.length > 2 ? process.argv[2] : path.join(__dirname, "..", "src", "server.js")]);
server.stdout.on('data', function (data) {
  // Get port from log.
  var port = data.toString().trim().split(":")[1]; // Run test suite.

  process.exit(runTests(port));
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRlc3QuanMiXSwibmFtZXMiOlsiZnMiLCJyZXF1aXJlIiwicGF0aCIsInNwYXduIiwic3Bhd25TeW5jIiwidHJhbnNwaWxlIiwicG9ydCIsImZpbGUiLCJjbGllbnQiLCJqb2luIiwiX19kaXJuYW1lIiwiZXJyb3IiLCJzdGRlcnIiLCJTdHJpbmciLCJsZW5ndGgiLCJjb25zb2xlIiwid3JpdGVGaWxlU3luYyIsInN0ZG91dCIsInN0YXR1cyIsInJ1blRlc3RzIiwiZmFpbGVkIiwicmVhZGRpclN5bmMiLCJlbmRzV2l0aCIsInNwbGl0IiwicG9wIiwibG9nIiwic2VydmVyIiwicHJvY2VzcyIsImFyZ3YiLCJvbiIsImRhdGEiLCJ0b1N0cmluZyIsInRyaW0iLCJleGl0Il0sIm1hcHBpbmdzIjoiOztBQUFBLElBQU1BLEVBQUUsR0FBR0MsT0FBTyxDQUFDLElBQUQsQ0FBbEI7O0FBQ0EsSUFBTUMsSUFBSSxHQUFHRCxPQUFPLENBQUMsTUFBRCxDQUFwQjs7ZUFDZ0JBLE9BQU8sQ0FBQyxlQUFELEM7SUFBaEJFLEssWUFBQUEsSzs7Z0JBQ2FGLE9BQU8sQ0FBQyxlQUFELEM7SUFBcEJHLFMsYUFBQUEsUzs7QUFFUCxTQUFTQyxTQUFULENBQW1CQyxJQUFuQixFQUF5QkMsSUFBekIsRUFBK0I7QUFDM0IsTUFBTUMsTUFBTSxHQUFHSixTQUFTLENBQUMsTUFBRCxFQUFTLENBQzdCRixJQUFJLENBQUNPLElBQUwsQ0FBVUMsU0FBVixFQUFxQixJQUFyQixFQUEyQixLQUEzQixFQUFrQyxXQUFsQyxDQUQ2QixFQUU3QkosSUFGNkIsRUFFdkJKLElBQUksQ0FBQ08sSUFBTCxDQUFVQyxTQUFWLEVBQXFCSCxJQUFyQixDQUZ1QixDQUFULENBQXhCO0FBS0EsTUFBSUMsTUFBTSxDQUFDRyxLQUFYLEVBQ0ksTUFBTUgsTUFBTSxDQUFDRyxLQUFiO0FBRUosTUFBTUMsTUFBTSxHQUFHQyxNQUFNLENBQUNMLE1BQU0sQ0FBQ0ksTUFBUixDQUFyQjtBQUNBLE1BQUlBLE1BQU0sQ0FBQ0UsTUFBWCxFQUNJQyxPQUFPLENBQUNKLEtBQVIsQ0FBY0MsTUFBZDtBQUVKWixFQUFBQSxFQUFFLENBQUNnQixhQUFILENBQWlCZCxJQUFJLENBQUNPLElBQUwsQ0FBVUMsU0FBVixFQUFxQkgsSUFBckIsSUFBNkIsT0FBOUMsRUFBdURNLE1BQU0sQ0FBQ0wsTUFBTSxDQUFDUyxNQUFSLENBQTdEO0FBQ0EsU0FBT1QsTUFBTSxDQUFDVSxNQUFkO0FBQ0g7O0FBRUQsU0FBU0MsUUFBVCxDQUFrQmIsSUFBbEIsRUFBd0I7QUFDcEIsTUFBSWMsTUFBTSxHQUFHLENBQWI7QUFEb0I7QUFBQTtBQUFBOztBQUFBO0FBR3BCLHlCQUFhcEIsRUFBRSxDQUFDcUIsV0FBSCxDQUFlWCxTQUFmLENBQWIsOEhBQXdDO0FBQW5DSCxNQUFBQSxJQUFtQztBQUNwQyxVQUFJQSxJQUFJLENBQUNlLFFBQUwsQ0FBYyxPQUFkLENBQUosRUFDSTs7QUFFSixjQUFRZixJQUFJLENBQUNnQixLQUFMLENBQVcsR0FBWCxFQUFnQkMsR0FBaEIsRUFBUjtBQUNJLGFBQUssSUFBTDtBQUNBLGFBQUssSUFBTDtBQUNJOztBQUNKO0FBQ0k7QUFMUjs7QUFRQVQsTUFBQUEsT0FBTyxDQUFDVSxHQUFSLENBQVlsQixJQUFaO0FBQ0EsVUFBTVcsTUFBTSxHQUFHYixTQUFTLENBQUNDLElBQUQsRUFBT0MsSUFBUCxDQUF4QjtBQUVBLFVBQUlXLE1BQU0sSUFBSSxDQUFkLEVBQ0lFLE1BQU07QUFDYjtBQXBCbUI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUFzQnBCLE1BQUksQ0FBQ0EsTUFBTCxFQUNJTCxPQUFPLENBQUNVLEdBQVIsdUJBREosS0FHSVYsT0FBTyxDQUFDVSxHQUFSLGFBQWlCTCxNQUFqQjtBQUVKLFNBQU9BLE1BQVA7QUFDSCxDLENBRUQ7OztBQUNBLElBQU1NLE1BQU0sR0FBR3ZCLEtBQUssQ0FBQyxNQUFELEVBQVMsQ0FDekJ3QixPQUFPLENBQUNDLElBQVIsQ0FBYWQsTUFBYixHQUFzQixDQUF0QixHQUNNYSxPQUFPLENBQUNDLElBQVIsQ0FBYSxDQUFiLENBRE4sR0FFTTFCLElBQUksQ0FBQ08sSUFBTCxDQUFVQyxTQUFWLEVBQXFCLElBQXJCLEVBQTJCLEtBQTNCLEVBQWtDLFdBQWxDLENBSG1CLENBQVQsQ0FBcEI7QUFNQWdCLE1BQU0sQ0FBQ1QsTUFBUCxDQUFjWSxFQUFkLENBQWlCLE1BQWpCLEVBQXlCLFVBQUFDLElBQUksRUFBSTtBQUM3QjtBQUNBLE1BQU14QixJQUFJLEdBQUd3QixJQUFJLENBQUNDLFFBQUwsR0FBZ0JDLElBQWhCLEdBQXVCVCxLQUF2QixDQUE2QixHQUE3QixFQUFrQyxDQUFsQyxDQUFiLENBRjZCLENBSTdCOztBQUNBSSxFQUFBQSxPQUFPLENBQUNNLElBQVIsQ0FBYWQsUUFBUSxDQUFDYixJQUFELENBQXJCO0FBQ0gsQ0FORCIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IGZzID0gcmVxdWlyZShcImZzXCIpO1xuY29uc3QgcGF0aCA9IHJlcXVpcmUoXCJwYXRoXCIpO1xuY29uc3Qge3NwYXdufSA9IHJlcXVpcmUoXCJjaGlsZF9wcm9jZXNzXCIpO1xuY29uc3Qge3NwYXduU3luY30gPSByZXF1aXJlKFwiY2hpbGRfcHJvY2Vzc1wiKTtcblxuZnVuY3Rpb24gdHJhbnNwaWxlKHBvcnQsIGZpbGUpIHtcbiAgICBjb25zdCBjbGllbnQgPSBzcGF3blN5bmMoXCJub2RlXCIsIFtcbiAgICAgICAgcGF0aC5qb2luKF9fZGlybmFtZSwgXCIuLlwiLCBcInNyY1wiLCBcImNsaWVudC5qc1wiKSxcbiAgICAgICAgcG9ydCwgcGF0aC5qb2luKF9fZGlybmFtZSwgZmlsZSlcbiAgICBdKTtcblxuICAgIGlmIChjbGllbnQuZXJyb3IpXG4gICAgICAgIHRocm93IGNsaWVudC5lcnJvcjtcblxuICAgIGNvbnN0IHN0ZGVyciA9IFN0cmluZyhjbGllbnQuc3RkZXJyKTtcbiAgICBpZiAoc3RkZXJyLmxlbmd0aClcbiAgICAgICAgY29uc29sZS5lcnJvcihzdGRlcnIpO1xuXG4gICAgZnMud3JpdGVGaWxlU3luYyhwYXRoLmpvaW4oX19kaXJuYW1lLCBmaWxlKSArIFwiLmcuanNcIiwgU3RyaW5nKGNsaWVudC5zdGRvdXQpKTtcbiAgICByZXR1cm4gY2xpZW50LnN0YXR1cztcbn1cblxuZnVuY3Rpb24gcnVuVGVzdHMocG9ydCkge1xuICAgIGxldCBmYWlsZWQgPSAwO1xuXG4gICAgZm9yIChmaWxlIG9mIGZzLnJlYWRkaXJTeW5jKF9fZGlybmFtZSkpIHtcbiAgICAgICAgaWYgKGZpbGUuZW5kc1dpdGgoJy5nLmpzJykpXG4gICAgICAgICAgICBjb250aW51ZTtcblxuICAgICAgICBzd2l0Y2ggKGZpbGUuc3BsaXQoJy4nKS5wb3AoKSkge1xuICAgICAgICAgICAgY2FzZSBcInRzXCI6XG4gICAgICAgICAgICBjYXNlIFwianNcIjpcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zb2xlLmxvZyhmaWxlKTtcbiAgICAgICAgY29uc3Qgc3RhdHVzID0gdHJhbnNwaWxlKHBvcnQsIGZpbGUpO1xuXG4gICAgICAgIGlmIChzdGF0dXMgIT0gMClcbiAgICAgICAgICAgIGZhaWxlZCsrO1xuICAgIH1cblxuICAgIGlmICghZmFpbGVkKVxuICAgICAgICBjb25zb2xlLmxvZyhgXFxuYWxsIHRlc3RzIHBhc3NlZGApO1xuICAgIGVsc2VcbiAgICAgICAgY29uc29sZS5sb2coYFxcbiR7ZmFpbGVkfSB0ZXN0cyBmYWlsZWRgKTtcblxuICAgIHJldHVybiBmYWlsZWQ7XG59XG5cbi8vIFN0YXJ0IHRyYW5zcGlsZXIgc2VydmVyLlxuY29uc3Qgc2VydmVyID0gc3Bhd24oXCJub2RlXCIsIFtcbiAgICBwcm9jZXNzLmFyZ3YubGVuZ3RoID4gMlxuICAgICAgICA/IHByb2Nlc3MuYXJndlsyXVxuICAgICAgICA6IHBhdGguam9pbihfX2Rpcm5hbWUsIFwiLi5cIiwgXCJzcmNcIiwgXCJzZXJ2ZXIuanNcIilcbl0pO1xuXG5zZXJ2ZXIuc3Rkb3V0Lm9uKCdkYXRhJywgZGF0YSA9PiB7XG4gICAgLy8gR2V0IHBvcnQgZnJvbSBsb2cuXG4gICAgY29uc3QgcG9ydCA9IGRhdGEudG9TdHJpbmcoKS50cmltKCkuc3BsaXQoXCI6XCIpWzFdO1xuXG4gICAgLy8gUnVuIHRlc3Qgc3VpdGUuXG4gICAgcHJvY2Vzcy5leGl0KHJ1blRlc3RzKHBvcnQpKTtcbn0pO1xuIl19
