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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRlc3QuanMiXSwibmFtZXMiOlsiZnMiLCJyZXF1aXJlIiwicGF0aCIsInNwYXduIiwic3Bhd25TeW5jIiwidHJhbnNwaWxlIiwicG9ydCIsImZpbGUiLCJjbGllbnQiLCJqb2luIiwiX19kaXJuYW1lIiwiZXJyb3IiLCJzdGRlcnIiLCJTdHJpbmciLCJsZW5ndGgiLCJjb25zb2xlIiwid3JpdGVGaWxlU3luYyIsInN0ZG91dCIsInN0YXR1cyIsInJ1blRlc3RzIiwiZmFpbGVkIiwicmVhZGRpclN5bmMiLCJlbmRzV2l0aCIsInNwbGl0IiwicG9wIiwibG9nIiwic2VydmVyIiwicHJvY2VzcyIsImFyZ3YiLCJvbiIsImRhdGEiLCJ0b1N0cmluZyIsInRyaW0iLCJleGl0Il0sIm1hcHBpbmdzIjoiOztBQUFBLElBQU1BLEVBQUUsR0FBR0MsT0FBTyxDQUFDLElBQUQsQ0FBbEI7O0FBQ0EsSUFBTUMsSUFBSSxHQUFHRCxPQUFPLENBQUMsTUFBRCxDQUFwQjs7ZUFDZ0JBLE9BQU8sQ0FBQyxlQUFELEM7SUFBaEJFLEssWUFBQUEsSzs7Z0JBQ2FGLE9BQU8sQ0FBQyxlQUFELEM7SUFBcEJHLFMsYUFBQUEsUzs7QUFFUCxTQUFTQyxTQUFULENBQW1CQyxJQUFuQixFQUF5QkMsSUFBekIsRUFBK0I7QUFDM0IsTUFBTUMsTUFBTSxHQUFHSixTQUFTLENBQUMsTUFBRCxFQUFTLENBQzdCRixJQUFJLENBQUNPLElBQUwsQ0FBVUMsU0FBVixFQUFxQixJQUFyQixFQUEyQixLQUEzQixFQUFrQyxXQUFsQyxDQUQ2QixFQUU3QkosSUFGNkIsRUFFdkJKLElBQUksQ0FBQ08sSUFBTCxDQUFVQyxTQUFWLEVBQXFCSCxJQUFyQixDQUZ1QixDQUFULENBQXhCO0FBS0EsTUFBSUMsTUFBTSxDQUFDRyxLQUFYLEVBQ0ksTUFBTUgsTUFBTSxDQUFDRyxLQUFiO0FBRUosTUFBTUMsTUFBTSxHQUFHQyxNQUFNLENBQUNMLE1BQU0sQ0FBQ0ksTUFBUixDQUFyQjtBQUNBLE1BQUlBLE1BQU0sQ0FBQ0UsTUFBWCxFQUNJQyxPQUFPLENBQUNKLEtBQVIsQ0FBY0MsTUFBZDtBQUVKWixFQUFBQSxFQUFFLENBQUNnQixhQUFILENBQWlCZCxJQUFJLENBQUNPLElBQUwsQ0FBVUMsU0FBVixFQUFxQkgsSUFBckIsSUFBNkIsT0FBOUMsRUFBdURNLE1BQU0sQ0FBQ0wsTUFBTSxDQUFDUyxNQUFSLENBQTdEO0FBQ0EsU0FBT1QsTUFBTSxDQUFDVSxNQUFkO0FBQ0g7O0FBRUQsU0FBU0MsUUFBVCxDQUFrQmIsSUFBbEIsRUFBd0I7QUFDcEIsTUFBSWMsTUFBTSxHQUFHLENBQWI7QUFEb0I7QUFBQTtBQUFBOztBQUFBO0FBR3BCLHlCQUFhcEIsRUFBRSxDQUFDcUIsV0FBSCxDQUFlWCxTQUFmLENBQWIsOEhBQXdDO0FBQW5DSCxNQUFBQSxJQUFtQztBQUNwQyxVQUFJQSxJQUFJLENBQUNlLFFBQUwsQ0FBYyxPQUFkLENBQUosRUFDSTs7QUFFSixjQUFRZixJQUFJLENBQUNnQixLQUFMLENBQVcsR0FBWCxFQUFnQkMsR0FBaEIsRUFBUjtBQUNJLGFBQUssSUFBTDtBQUNBLGFBQUssSUFBTDtBQUNJOztBQUNKO0FBQ0k7QUFMUjs7QUFRQVQsTUFBQUEsT0FBTyxDQUFDVSxHQUFSLENBQVlsQixJQUFaO0FBQ0EsVUFBTVcsTUFBTSxHQUFHYixTQUFTLENBQUNDLElBQUQsRUFBT0MsSUFBUCxDQUF4QjtBQUVBLFVBQUlXLE1BQU0sSUFBSSxDQUFkLEVBQ0lFLE1BQU07QUFDYjtBQXBCbUI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUFzQnBCLE1BQUksQ0FBQ0EsTUFBTCxFQUNJTCxPQUFPLENBQUNVLEdBQVIsdUJBREosS0FHSVYsT0FBTyxDQUFDVSxHQUFSLGFBQWlCTCxNQUFqQjtBQUVKLFNBQU9BLE1BQVA7QUFDSCxDLENBRUQ7OztBQUNBLElBQU1NLE1BQU0sR0FBR3ZCLEtBQUssQ0FBQyxNQUFELEVBQVMsQ0FDekJ3QixPQUFPLENBQUNDLElBQVIsQ0FBYWQsTUFBYixHQUFzQixDQUF0QixHQUNNYSxPQUFPLENBQUNDLElBQVIsQ0FBYSxDQUFiLENBRE4sR0FFTTFCLElBQUksQ0FBQ08sSUFBTCxDQUFVQyxTQUFWLEVBQXFCLElBQXJCLEVBQTJCLEtBQTNCLEVBQWtDLFdBQWxDLENBSG1CLENBQVQsQ0FBcEI7QUFNQWdCLE1BQU0sQ0FBQ1QsTUFBUCxDQUFjWSxFQUFkLENBQWlCLE1BQWpCLEVBQXlCLFVBQUFDLElBQUksRUFBSTtBQUM3QjtBQUNBLE1BQU14QixJQUFJLEdBQUd3QixJQUFJLENBQUNDLFFBQUwsR0FBZ0JDLElBQWhCLEdBQXVCVCxLQUF2QixDQUE2QixHQUE3QixFQUFrQyxDQUFsQyxDQUFiLENBRjZCLENBSTdCOztBQUNBSSxFQUFBQSxPQUFPLENBQUNNLElBQVIsQ0FBYWQsUUFBUSxDQUFDYixJQUFELENBQXJCO0FBQ0gsQ0FORCIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IGZzID0gcmVxdWlyZShcImZzXCIpO1xyXG5jb25zdCBwYXRoID0gcmVxdWlyZShcInBhdGhcIik7XHJcbmNvbnN0IHtzcGF3bn0gPSByZXF1aXJlKFwiY2hpbGRfcHJvY2Vzc1wiKTtcclxuY29uc3Qge3NwYXduU3luY30gPSByZXF1aXJlKFwiY2hpbGRfcHJvY2Vzc1wiKTtcclxuXHJcbmZ1bmN0aW9uIHRyYW5zcGlsZShwb3J0LCBmaWxlKSB7XHJcbiAgICBjb25zdCBjbGllbnQgPSBzcGF3blN5bmMoXCJub2RlXCIsIFtcclxuICAgICAgICBwYXRoLmpvaW4oX19kaXJuYW1lLCBcIi4uXCIsIFwic3JjXCIsIFwiY2xpZW50LmpzXCIpLFxyXG4gICAgICAgIHBvcnQsIHBhdGguam9pbihfX2Rpcm5hbWUsIGZpbGUpXHJcbiAgICBdKTtcclxuXHJcbiAgICBpZiAoY2xpZW50LmVycm9yKVxyXG4gICAgICAgIHRocm93IGNsaWVudC5lcnJvcjtcclxuXHJcbiAgICBjb25zdCBzdGRlcnIgPSBTdHJpbmcoY2xpZW50LnN0ZGVycik7XHJcbiAgICBpZiAoc3RkZXJyLmxlbmd0aClcclxuICAgICAgICBjb25zb2xlLmVycm9yKHN0ZGVycik7XHJcblxyXG4gICAgZnMud3JpdGVGaWxlU3luYyhwYXRoLmpvaW4oX19kaXJuYW1lLCBmaWxlKSArIFwiLmcuanNcIiwgU3RyaW5nKGNsaWVudC5zdGRvdXQpKTtcclxuICAgIHJldHVybiBjbGllbnQuc3RhdHVzO1xyXG59XHJcblxyXG5mdW5jdGlvbiBydW5UZXN0cyhwb3J0KSB7XHJcbiAgICBsZXQgZmFpbGVkID0gMDtcclxuXHJcbiAgICBmb3IgKGZpbGUgb2YgZnMucmVhZGRpclN5bmMoX19kaXJuYW1lKSkge1xyXG4gICAgICAgIGlmIChmaWxlLmVuZHNXaXRoKCcuZy5qcycpKVxyXG4gICAgICAgICAgICBjb250aW51ZTtcclxuXHJcbiAgICAgICAgc3dpdGNoIChmaWxlLnNwbGl0KCcuJykucG9wKCkpIHtcclxuICAgICAgICAgICAgY2FzZSBcInRzXCI6XHJcbiAgICAgICAgICAgIGNhc2UgXCJqc1wiOlxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnNvbGUubG9nKGZpbGUpO1xyXG4gICAgICAgIGNvbnN0IHN0YXR1cyA9IHRyYW5zcGlsZShwb3J0LCBmaWxlKTtcclxuXHJcbiAgICAgICAgaWYgKHN0YXR1cyAhPSAwKVxyXG4gICAgICAgICAgICBmYWlsZWQrKztcclxuICAgIH1cclxuXHJcbiAgICBpZiAoIWZhaWxlZClcclxuICAgICAgICBjb25zb2xlLmxvZyhgXFxuYWxsIHRlc3RzIHBhc3NlZGApO1xyXG4gICAgZWxzZVxyXG4gICAgICAgIGNvbnNvbGUubG9nKGBcXG4ke2ZhaWxlZH0gdGVzdHMgZmFpbGVkYCk7XHJcblxyXG4gICAgcmV0dXJuIGZhaWxlZDtcclxufVxyXG5cclxuLy8gU3RhcnQgdHJhbnNwaWxlciBzZXJ2ZXIuXHJcbmNvbnN0IHNlcnZlciA9IHNwYXduKFwibm9kZVwiLCBbXHJcbiAgICBwcm9jZXNzLmFyZ3YubGVuZ3RoID4gMlxyXG4gICAgICAgID8gcHJvY2Vzcy5hcmd2WzJdXHJcbiAgICAgICAgOiBwYXRoLmpvaW4oX19kaXJuYW1lLCBcIi4uXCIsIFwic3JjXCIsIFwic2VydmVyLmpzXCIpXHJcbl0pO1xyXG5cclxuc2VydmVyLnN0ZG91dC5vbignZGF0YScsIGRhdGEgPT4ge1xyXG4gICAgLy8gR2V0IHBvcnQgZnJvbSBsb2cuXHJcbiAgICBjb25zdCBwb3J0ID0gZGF0YS50b1N0cmluZygpLnRyaW0oKS5zcGxpdChcIjpcIilbMV07XHJcblxyXG4gICAgLy8gUnVuIHRlc3Qgc3VpdGUuXHJcbiAgICBwcm9jZXNzLmV4aXQocnVuVGVzdHMocG9ydCkpO1xyXG59KTtcclxuIl19
