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


var server = spawn("node", [path.join(__dirname, "..", "src", "server.js")]);
server.stdout.on('data', function (data) {
  // Get port from log.
  var port = data.toString().trim().split(":")[1]; // Run test suite.

  process.exit(runTests(port));
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRlc3QuanMiXSwibmFtZXMiOlsiZnMiLCJyZXF1aXJlIiwicGF0aCIsInNwYXduIiwic3Bhd25TeW5jIiwidHJhbnNwaWxlIiwicG9ydCIsImZpbGUiLCJjbGllbnQiLCJqb2luIiwiX19kaXJuYW1lIiwiZXJyb3IiLCJzdGRlcnIiLCJTdHJpbmciLCJsZW5ndGgiLCJjb25zb2xlIiwid3JpdGVGaWxlU3luYyIsInN0ZG91dCIsInN0YXR1cyIsInJ1blRlc3RzIiwiZmFpbGVkIiwicmVhZGRpclN5bmMiLCJlbmRzV2l0aCIsInNwbGl0IiwicG9wIiwibG9nIiwic2VydmVyIiwib24iLCJkYXRhIiwidG9TdHJpbmciLCJ0cmltIiwicHJvY2VzcyIsImV4aXQiXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBTUEsRUFBRSxHQUFHQyxPQUFPLENBQUMsSUFBRCxDQUFsQjs7QUFDQSxJQUFNQyxJQUFJLEdBQUdELE9BQU8sQ0FBQyxNQUFELENBQXBCOztlQUNnQkEsT0FBTyxDQUFDLGVBQUQsQztJQUFoQkUsSyxZQUFBQSxLOztnQkFDYUYsT0FBTyxDQUFDLGVBQUQsQztJQUFwQkcsUyxhQUFBQSxTOztBQUVQLFNBQVNDLFNBQVQsQ0FBbUJDLElBQW5CLEVBQXlCQyxJQUF6QixFQUErQjtBQUMzQixNQUFNQyxNQUFNLEdBQUdKLFNBQVMsQ0FBQyxNQUFELEVBQVMsQ0FDN0JGLElBQUksQ0FBQ08sSUFBTCxDQUFVQyxTQUFWLEVBQXFCLElBQXJCLEVBQTJCLEtBQTNCLEVBQWtDLFdBQWxDLENBRDZCLEVBRTdCSixJQUY2QixFQUV2QkosSUFBSSxDQUFDTyxJQUFMLENBQVVDLFNBQVYsRUFBcUJILElBQXJCLENBRnVCLENBQVQsQ0FBeEI7QUFLQSxNQUFJQyxNQUFNLENBQUNHLEtBQVgsRUFDSSxNQUFNSCxNQUFNLENBQUNHLEtBQWI7QUFFSixNQUFNQyxNQUFNLEdBQUdDLE1BQU0sQ0FBQ0wsTUFBTSxDQUFDSSxNQUFSLENBQXJCO0FBQ0EsTUFBSUEsTUFBTSxDQUFDRSxNQUFYLEVBQ0lDLE9BQU8sQ0FBQ0osS0FBUixDQUFjQyxNQUFkO0FBRUpaLEVBQUFBLEVBQUUsQ0FBQ2dCLGFBQUgsQ0FBaUJkLElBQUksQ0FBQ08sSUFBTCxDQUFVQyxTQUFWLEVBQXFCSCxJQUFyQixJQUE2QixPQUE5QyxFQUF1RE0sTUFBTSxDQUFDTCxNQUFNLENBQUNTLE1BQVIsQ0FBN0Q7QUFDQSxTQUFPVCxNQUFNLENBQUNVLE1BQWQ7QUFDSDs7QUFFRCxTQUFTQyxRQUFULENBQWtCYixJQUFsQixFQUF3QjtBQUNwQixNQUFJYyxNQUFNLEdBQUcsQ0FBYjtBQURvQjtBQUFBO0FBQUE7O0FBQUE7QUFHcEIseUJBQWFwQixFQUFFLENBQUNxQixXQUFILENBQWVYLFNBQWYsQ0FBYiw4SEFBd0M7QUFBbkNILE1BQUFBLElBQW1DO0FBQ3BDLFVBQUlBLElBQUksQ0FBQ2UsUUFBTCxDQUFjLE9BQWQsQ0FBSixFQUNJOztBQUVKLGNBQVFmLElBQUksQ0FBQ2dCLEtBQUwsQ0FBVyxHQUFYLEVBQWdCQyxHQUFoQixFQUFSO0FBQ0ksYUFBSyxJQUFMO0FBQ0EsYUFBSyxJQUFMO0FBQ0k7O0FBQ0o7QUFDSTtBQUxSOztBQVFBVCxNQUFBQSxPQUFPLENBQUNVLEdBQVIsQ0FBWWxCLElBQVo7QUFDQSxVQUFNVyxNQUFNLEdBQUdiLFNBQVMsQ0FBQ0MsSUFBRCxFQUFPQyxJQUFQLENBQXhCO0FBRUEsVUFBSVcsTUFBTSxJQUFJLENBQWQsRUFDSUUsTUFBTTtBQUNiO0FBcEJtQjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOztBQXNCcEIsTUFBSSxDQUFDQSxNQUFMLEVBQ0lMLE9BQU8sQ0FBQ1UsR0FBUix1QkFESixLQUdJVixPQUFPLENBQUNVLEdBQVIsYUFBaUJMLE1BQWpCO0FBRUosU0FBT0EsTUFBUDtBQUNILEMsQ0FFRDs7O0FBQ0EsSUFBTU0sTUFBTSxHQUFHdkIsS0FBSyxDQUFDLE1BQUQsRUFBUyxDQUN6QkQsSUFBSSxDQUFDTyxJQUFMLENBQVVDLFNBQVYsRUFBcUIsSUFBckIsRUFBMkIsS0FBM0IsRUFBa0MsV0FBbEMsQ0FEeUIsQ0FBVCxDQUFwQjtBQUlBZ0IsTUFBTSxDQUFDVCxNQUFQLENBQWNVLEVBQWQsQ0FBaUIsTUFBakIsRUFBeUIsVUFBQUMsSUFBSSxFQUFJO0FBQzdCO0FBQ0EsTUFBTXRCLElBQUksR0FBR3NCLElBQUksQ0FBQ0MsUUFBTCxHQUFnQkMsSUFBaEIsR0FBdUJQLEtBQXZCLENBQTZCLEdBQTdCLEVBQWtDLENBQWxDLENBQWIsQ0FGNkIsQ0FJN0I7O0FBQ0FRLEVBQUFBLE9BQU8sQ0FBQ0MsSUFBUixDQUFhYixRQUFRLENBQUNiLElBQUQsQ0FBckI7QUFDSCxDQU5EIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgZnMgPSByZXF1aXJlKFwiZnNcIik7XHJcbmNvbnN0IHBhdGggPSByZXF1aXJlKFwicGF0aFwiKTtcclxuY29uc3Qge3NwYXdufSA9IHJlcXVpcmUoXCJjaGlsZF9wcm9jZXNzXCIpO1xyXG5jb25zdCB7c3Bhd25TeW5jfSA9IHJlcXVpcmUoXCJjaGlsZF9wcm9jZXNzXCIpO1xyXG5cclxuZnVuY3Rpb24gdHJhbnNwaWxlKHBvcnQsIGZpbGUpIHtcclxuICAgIGNvbnN0IGNsaWVudCA9IHNwYXduU3luYyhcIm5vZGVcIiwgW1xyXG4gICAgICAgIHBhdGguam9pbihfX2Rpcm5hbWUsIFwiLi5cIiwgXCJzcmNcIiwgXCJjbGllbnQuanNcIiksXHJcbiAgICAgICAgcG9ydCwgcGF0aC5qb2luKF9fZGlybmFtZSwgZmlsZSlcclxuICAgIF0pO1xyXG5cclxuICAgIGlmIChjbGllbnQuZXJyb3IpXHJcbiAgICAgICAgdGhyb3cgY2xpZW50LmVycm9yO1xyXG5cclxuICAgIGNvbnN0IHN0ZGVyciA9IFN0cmluZyhjbGllbnQuc3RkZXJyKTtcclxuICAgIGlmIChzdGRlcnIubGVuZ3RoKVxyXG4gICAgICAgIGNvbnNvbGUuZXJyb3Ioc3RkZXJyKTtcclxuXHJcbiAgICBmcy53cml0ZUZpbGVTeW5jKHBhdGguam9pbihfX2Rpcm5hbWUsIGZpbGUpICsgXCIuZy5qc1wiLCBTdHJpbmcoY2xpZW50LnN0ZG91dCkpO1xyXG4gICAgcmV0dXJuIGNsaWVudC5zdGF0dXM7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJ1blRlc3RzKHBvcnQpIHtcclxuICAgIGxldCBmYWlsZWQgPSAwO1xyXG5cclxuICAgIGZvciAoZmlsZSBvZiBmcy5yZWFkZGlyU3luYyhfX2Rpcm5hbWUpKSB7XHJcbiAgICAgICAgaWYgKGZpbGUuZW5kc1dpdGgoJy5nLmpzJykpXHJcbiAgICAgICAgICAgIGNvbnRpbnVlO1xyXG5cclxuICAgICAgICBzd2l0Y2ggKGZpbGUuc3BsaXQoJy4nKS5wb3AoKSkge1xyXG4gICAgICAgICAgICBjYXNlIFwidHNcIjpcclxuICAgICAgICAgICAgY2FzZSBcImpzXCI6XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc29sZS5sb2coZmlsZSk7XHJcbiAgICAgICAgY29uc3Qgc3RhdHVzID0gdHJhbnNwaWxlKHBvcnQsIGZpbGUpO1xyXG5cclxuICAgICAgICBpZiAoc3RhdHVzICE9IDApXHJcbiAgICAgICAgICAgIGZhaWxlZCsrO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICghZmFpbGVkKVxyXG4gICAgICAgIGNvbnNvbGUubG9nKGBcXG5hbGwgdGVzdHMgcGFzc2VkYCk7XHJcbiAgICBlbHNlXHJcbiAgICAgICAgY29uc29sZS5sb2coYFxcbiR7ZmFpbGVkfSB0ZXN0cyBmYWlsZWRgKTtcclxuXHJcbiAgICByZXR1cm4gZmFpbGVkO1xyXG59XHJcblxyXG4vLyBTdGFydCB0cmFuc3BpbGVyIHNlcnZlci5cclxuY29uc3Qgc2VydmVyID0gc3Bhd24oXCJub2RlXCIsIFtcclxuICAgIHBhdGguam9pbihfX2Rpcm5hbWUsIFwiLi5cIiwgXCJzcmNcIiwgXCJzZXJ2ZXIuanNcIilcclxuXSk7XHJcblxyXG5zZXJ2ZXIuc3Rkb3V0Lm9uKCdkYXRhJywgZGF0YSA9PiB7XHJcbiAgICAvLyBHZXQgcG9ydCBmcm9tIGxvZy5cclxuICAgIGNvbnN0IHBvcnQgPSBkYXRhLnRvU3RyaW5nKCkudHJpbSgpLnNwbGl0KFwiOlwiKVsxXTtcclxuXHJcbiAgICAvLyBSdW4gdGVzdCBzdWl0ZS5cclxuICAgIHByb2Nlc3MuZXhpdChydW5UZXN0cyhwb3J0KSk7XHJcbn0pO1xyXG4iXX0=
