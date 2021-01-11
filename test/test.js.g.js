"use strict";

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

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
} // Start transpiler server.


var server = spawn("node", [path.join(__dirname, "..", "src", "server.js")]);
server.stdout.on('data', function (data) {
  // Get port from log.
  var port = data.toString().trim().split(":")[1]; // Run test suite.

  process.exit(runTests(port));
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRlc3QuanMiXSwibmFtZXMiOlsiZnMiLCJyZXF1aXJlIiwicGF0aCIsInNwYXduIiwic3Bhd25TeW5jIiwidHJhbnNwaWxlIiwicG9ydCIsImZpbGUiLCJjbGllbnQiLCJqb2luIiwiX19kaXJuYW1lIiwiZXJyb3IiLCJzdGRlcnIiLCJTdHJpbmciLCJsZW5ndGgiLCJjb25zb2xlIiwid3JpdGVGaWxlU3luYyIsInN0ZG91dCIsInN0YXR1cyIsInJ1blRlc3RzIiwiZmFpbGVkIiwicmVhZGRpclN5bmMiLCJlbmRzV2l0aCIsInNwbGl0IiwicG9wIiwibG9nIiwic2VydmVyIiwib24iLCJkYXRhIiwidG9TdHJpbmciLCJ0cmltIiwicHJvY2VzcyIsImV4aXQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUEsSUFBTUEsRUFBRSxHQUFHQyxPQUFPLENBQUMsSUFBRCxDQUFsQjs7QUFDQSxJQUFNQyxJQUFJLEdBQUdELE9BQU8sQ0FBQyxNQUFELENBQXBCOztlQUNnQkEsT0FBTyxDQUFDLGVBQUQsQztJQUFoQkUsSyxZQUFBQSxLOztnQkFDYUYsT0FBTyxDQUFDLGVBQUQsQztJQUFwQkcsUyxhQUFBQSxTOztBQUVQLFNBQVNDLFNBQVQsQ0FBbUJDLElBQW5CLEVBQXlCQyxJQUF6QixFQUErQjtBQUMzQixNQUFNQyxNQUFNLEdBQUdKLFNBQVMsQ0FBQyxNQUFELEVBQVMsQ0FDN0JGLElBQUksQ0FBQ08sSUFBTCxDQUFVQyxTQUFWLEVBQXFCLElBQXJCLEVBQTJCLEtBQTNCLEVBQWtDLFdBQWxDLENBRDZCLEVBRTdCSixJQUY2QixFQUV2QkosSUFBSSxDQUFDTyxJQUFMLENBQVVDLFNBQVYsRUFBcUJILElBQXJCLENBRnVCLENBQVQsQ0FBeEI7QUFLQSxNQUFJQyxNQUFNLENBQUNHLEtBQVgsRUFDSSxNQUFNSCxNQUFNLENBQUNHLEtBQWI7QUFFSixNQUFNQyxNQUFNLEdBQUdDLE1BQU0sQ0FBQ0wsTUFBTSxDQUFDSSxNQUFSLENBQXJCO0FBQ0EsTUFBSUEsTUFBTSxDQUFDRSxNQUFYLEVBQ0lDLE9BQU8sQ0FBQ0osS0FBUixDQUFjQyxNQUFkO0FBRUpaLEVBQUFBLEVBQUUsQ0FBQ2dCLGFBQUgsQ0FBaUJkLElBQUksQ0FBQ08sSUFBTCxDQUFVQyxTQUFWLEVBQXFCSCxJQUFyQixJQUE2QixPQUE5QyxFQUF1RE0sTUFBTSxDQUFDTCxNQUFNLENBQUNTLE1BQVIsQ0FBN0Q7QUFDQSxTQUFPVCxNQUFNLENBQUNVLE1BQWQ7QUFDSDs7QUFFRCxTQUFTQyxRQUFULENBQWtCYixJQUFsQixFQUF3QjtBQUNwQixNQUFJYyxNQUFNLEdBQUcsQ0FBYjs7QUFEb0IsNkNBR1BwQixFQUFFLENBQUNxQixXQUFILENBQWVYLFNBQWYsQ0FITztBQUFBOztBQUFBO0FBR3BCLHdEQUF3QztBQUFuQ0gsTUFBQUEsSUFBbUM7QUFDcEMsVUFBSUEsSUFBSSxDQUFDZSxRQUFMLENBQWMsT0FBZCxDQUFKLEVBQ0k7O0FBRUosY0FBUWYsSUFBSSxDQUFDZ0IsS0FBTCxDQUFXLEdBQVgsRUFBZ0JDLEdBQWhCLEVBQVI7QUFDSSxhQUFLLElBQUw7QUFDQSxhQUFLLElBQUw7QUFDSTs7QUFDSjtBQUNJO0FBTFI7O0FBUUFULE1BQUFBLE9BQU8sQ0FBQ1UsR0FBUixDQUFZbEIsSUFBWjtBQUNBLFVBQU1XLE1BQU0sR0FBR2IsU0FBUyxDQUFDQyxJQUFELEVBQU9DLElBQVAsQ0FBeEI7QUFFQSxVQUFJVyxNQUFNLElBQUksQ0FBZCxFQUNJRSxNQUFNO0FBQ2I7QUFwQm1CO0FBQUE7QUFBQTtBQUFBO0FBQUE7O0FBc0JwQixNQUFJLENBQUNBLE1BQUwsRUFDSUwsT0FBTyxDQUFDVSxHQUFSLHVCQURKLEtBR0lWLE9BQU8sQ0FBQ1UsR0FBUixhQUFpQkwsTUFBakI7QUFFSixTQUFPQSxNQUFQO0FBQ0gsQyxDQUVEOzs7QUFDQSxJQUFNTSxNQUFNLEdBQUd2QixLQUFLLENBQUMsTUFBRCxFQUFTLENBQ3pCRCxJQUFJLENBQUNPLElBQUwsQ0FBVUMsU0FBVixFQUFxQixJQUFyQixFQUEyQixLQUEzQixFQUFrQyxXQUFsQyxDQUR5QixDQUFULENBQXBCO0FBSUFnQixNQUFNLENBQUNULE1BQVAsQ0FBY1UsRUFBZCxDQUFpQixNQUFqQixFQUF5QixVQUFBQyxJQUFJLEVBQUk7QUFDN0I7QUFDQSxNQUFNdEIsSUFBSSxHQUFHc0IsSUFBSSxDQUFDQyxRQUFMLEdBQWdCQyxJQUFoQixHQUF1QlAsS0FBdkIsQ0FBNkIsR0FBN0IsRUFBa0MsQ0FBbEMsQ0FBYixDQUY2QixDQUk3Qjs7QUFDQVEsRUFBQUEsT0FBTyxDQUFDQyxJQUFSLENBQWFiLFFBQVEsQ0FBQ2IsSUFBRCxDQUFyQjtBQUNILENBTkQiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBmcyA9IHJlcXVpcmUoXCJmc1wiKTtcbmNvbnN0IHBhdGggPSByZXF1aXJlKFwicGF0aFwiKTtcbmNvbnN0IHtzcGF3bn0gPSByZXF1aXJlKFwiY2hpbGRfcHJvY2Vzc1wiKTtcbmNvbnN0IHtzcGF3blN5bmN9ID0gcmVxdWlyZShcImNoaWxkX3Byb2Nlc3NcIik7XG5cbmZ1bmN0aW9uIHRyYW5zcGlsZShwb3J0LCBmaWxlKSB7XG4gICAgY29uc3QgY2xpZW50ID0gc3Bhd25TeW5jKFwibm9kZVwiLCBbXG4gICAgICAgIHBhdGguam9pbihfX2Rpcm5hbWUsIFwiLi5cIiwgXCJzcmNcIiwgXCJjbGllbnQuanNcIiksXG4gICAgICAgIHBvcnQsIHBhdGguam9pbihfX2Rpcm5hbWUsIGZpbGUpXG4gICAgXSk7XG5cbiAgICBpZiAoY2xpZW50LmVycm9yKVxuICAgICAgICB0aHJvdyBjbGllbnQuZXJyb3I7XG5cbiAgICBjb25zdCBzdGRlcnIgPSBTdHJpbmcoY2xpZW50LnN0ZGVycik7XG4gICAgaWYgKHN0ZGVyci5sZW5ndGgpXG4gICAgICAgIGNvbnNvbGUuZXJyb3Ioc3RkZXJyKTtcblxuICAgIGZzLndyaXRlRmlsZVN5bmMocGF0aC5qb2luKF9fZGlybmFtZSwgZmlsZSkgKyBcIi5nLmpzXCIsIFN0cmluZyhjbGllbnQuc3Rkb3V0KSk7XG4gICAgcmV0dXJuIGNsaWVudC5zdGF0dXM7XG59XG5cbmZ1bmN0aW9uIHJ1blRlc3RzKHBvcnQpIHtcbiAgICBsZXQgZmFpbGVkID0gMDtcblxuICAgIGZvciAoZmlsZSBvZiBmcy5yZWFkZGlyU3luYyhfX2Rpcm5hbWUpKSB7XG4gICAgICAgIGlmIChmaWxlLmVuZHNXaXRoKCcuZy5qcycpKVxuICAgICAgICAgICAgY29udGludWU7XG5cbiAgICAgICAgc3dpdGNoIChmaWxlLnNwbGl0KCcuJykucG9wKCkpIHtcbiAgICAgICAgICAgIGNhc2UgXCJ0c1wiOlxuICAgICAgICAgICAgY2FzZSBcImpzXCI6XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc29sZS5sb2coZmlsZSk7XG4gICAgICAgIGNvbnN0IHN0YXR1cyA9IHRyYW5zcGlsZShwb3J0LCBmaWxlKTtcblxuICAgICAgICBpZiAoc3RhdHVzICE9IDApXG4gICAgICAgICAgICBmYWlsZWQrKztcbiAgICB9XG5cbiAgICBpZiAoIWZhaWxlZClcbiAgICAgICAgY29uc29sZS5sb2coYFxcbmFsbCB0ZXN0cyBwYXNzZWRgKTtcbiAgICBlbHNlXG4gICAgICAgIGNvbnNvbGUubG9nKGBcXG4ke2ZhaWxlZH0gdGVzdHMgZmFpbGVkYCk7XG5cbiAgICByZXR1cm4gZmFpbGVkO1xufVxuXG4vLyBTdGFydCB0cmFuc3BpbGVyIHNlcnZlci5cbmNvbnN0IHNlcnZlciA9IHNwYXduKFwibm9kZVwiLCBbXG4gICAgcGF0aC5qb2luKF9fZGlybmFtZSwgXCIuLlwiLCBcInNyY1wiLCBcInNlcnZlci5qc1wiKVxuXSk7XG5cbnNlcnZlci5zdGRvdXQub24oJ2RhdGEnLCBkYXRhID0+IHtcbiAgICAvLyBHZXQgcG9ydCBmcm9tIGxvZy5cbiAgICBjb25zdCBwb3J0ID0gZGF0YS50b1N0cmluZygpLnRyaW0oKS5zcGxpdChcIjpcIilbMV07XG5cbiAgICAvLyBSdW4gdGVzdCBzdWl0ZS5cbiAgICBwcm9jZXNzLmV4aXQocnVuVGVzdHMocG9ydCkpO1xufSk7XG4iXX0=
