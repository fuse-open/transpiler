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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJmcyIsInJlcXVpcmUiLCJwYXRoIiwiX3JlcXVpcmUiLCJzcGF3biIsIl9yZXF1aXJlMiIsInNwYXduU3luYyIsInRyYW5zcGlsZSIsInBvcnQiLCJmaWxlIiwiY2xpZW50Iiwiam9pbiIsIl9fZGlybmFtZSIsImVycm9yIiwic3RkZXJyIiwiU3RyaW5nIiwibGVuZ3RoIiwiY29uc29sZSIsIndyaXRlRmlsZVN5bmMiLCJzdGRvdXQiLCJzdGF0dXMiLCJydW5UZXN0cyIsImZhaWxlZCIsIl9pdGVyYXRvciIsIl9jcmVhdGVGb3JPZkl0ZXJhdG9ySGVscGVyIiwicmVhZGRpclN5bmMiLCJfc3RlcCIsInMiLCJuIiwiZG9uZSIsInZhbHVlIiwiZW5kc1dpdGgiLCJzcGxpdCIsInBvcCIsImxvZyIsImVyciIsImUiLCJmIiwiY29uY2F0Iiwic2VydmVyIiwicHJvY2VzcyIsImFyZ3YiLCJvbiIsImRhdGEiLCJ0b1N0cmluZyIsInRyaW0iLCJleGl0Il0sInNvdXJjZXMiOlsidGVzdC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBmcyA9IHJlcXVpcmUoXCJmc1wiKTtcbmNvbnN0IHBhdGggPSByZXF1aXJlKFwicGF0aFwiKTtcbmNvbnN0IHtzcGF3bn0gPSByZXF1aXJlKFwiY2hpbGRfcHJvY2Vzc1wiKTtcbmNvbnN0IHtzcGF3blN5bmN9ID0gcmVxdWlyZShcImNoaWxkX3Byb2Nlc3NcIik7XG5cbmZ1bmN0aW9uIHRyYW5zcGlsZShwb3J0LCBmaWxlKSB7XG4gICAgY29uc3QgY2xpZW50ID0gc3Bhd25TeW5jKFwibm9kZVwiLCBbXG4gICAgICAgIHBhdGguam9pbihfX2Rpcm5hbWUsIFwiLi5cIiwgXCJzcmNcIiwgXCJjbGllbnQuanNcIiksXG4gICAgICAgIHBvcnQsIHBhdGguam9pbihfX2Rpcm5hbWUsIGZpbGUpXG4gICAgXSk7XG5cbiAgICBpZiAoY2xpZW50LmVycm9yKVxuICAgICAgICB0aHJvdyBjbGllbnQuZXJyb3I7XG5cbiAgICBjb25zdCBzdGRlcnIgPSBTdHJpbmcoY2xpZW50LnN0ZGVycik7XG4gICAgaWYgKHN0ZGVyci5sZW5ndGgpXG4gICAgICAgIGNvbnNvbGUuZXJyb3Ioc3RkZXJyKTtcblxuICAgIGZzLndyaXRlRmlsZVN5bmMocGF0aC5qb2luKF9fZGlybmFtZSwgZmlsZSkgKyBcIi5nLmpzXCIsIFN0cmluZyhjbGllbnQuc3Rkb3V0KSk7XG4gICAgcmV0dXJuIGNsaWVudC5zdGF0dXM7XG59XG5cbmZ1bmN0aW9uIHJ1blRlc3RzKHBvcnQpIHtcbiAgICBsZXQgZmFpbGVkID0gMDtcblxuICAgIGZvciAoZmlsZSBvZiBmcy5yZWFkZGlyU3luYyhfX2Rpcm5hbWUpKSB7XG4gICAgICAgIGlmIChmaWxlLmVuZHNXaXRoKCcuZy5qcycpKVxuICAgICAgICAgICAgY29udGludWU7XG5cbiAgICAgICAgc3dpdGNoIChmaWxlLnNwbGl0KCcuJykucG9wKCkpIHtcbiAgICAgICAgICAgIGNhc2UgXCJ0c1wiOlxuICAgICAgICAgICAgY2FzZSBcImpzXCI6XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc29sZS5sb2coZmlsZSk7XG4gICAgICAgIGNvbnN0IHN0YXR1cyA9IHRyYW5zcGlsZShwb3J0LCBmaWxlKTtcblxuICAgICAgICBpZiAoc3RhdHVzICE9IDApXG4gICAgICAgICAgICBmYWlsZWQrKztcbiAgICB9XG5cbiAgICBpZiAoIWZhaWxlZClcbiAgICAgICAgY29uc29sZS5sb2coYFxcbmFsbCB0ZXN0cyBwYXNzZWRgKTtcbiAgICBlbHNlXG4gICAgICAgIGNvbnNvbGUubG9nKGBcXG4ke2ZhaWxlZH0gdGVzdHMgZmFpbGVkYCk7XG5cbiAgICByZXR1cm4gZmFpbGVkO1xufVxuXG4vLyBTdGFydCB0cmFuc3BpbGVyIHNlcnZlci5cbmNvbnN0IHNlcnZlciA9IHNwYXduKFwibm9kZVwiLCBbXG4gICAgcHJvY2Vzcy5hcmd2Lmxlbmd0aCA+IDJcbiAgICAgICAgPyBwcm9jZXNzLmFyZ3ZbMl1cbiAgICAgICAgOiBwYXRoLmpvaW4oX19kaXJuYW1lLCBcIi4uXCIsIFwic3JjXCIsIFwic2VydmVyLmpzXCIpXG5dKTtcblxuc2VydmVyLnN0ZG91dC5vbignZGF0YScsIGRhdGEgPT4ge1xuICAgIC8vIEdldCBwb3J0IGZyb20gbG9nLlxuICAgIGNvbnN0IHBvcnQgPSBkYXRhLnRvU3RyaW5nKCkudHJpbSgpLnNwbGl0KFwiOlwiKVsxXTtcblxuICAgIC8vIFJ1biB0ZXN0IHN1aXRlLlxuICAgIHByb2Nlc3MuZXhpdChydW5UZXN0cyhwb3J0KSk7XG59KTtcbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxJQUFNQSxFQUFFLEdBQUdDLE9BQU8sQ0FBQyxJQUFJLENBQUM7QUFDeEIsSUFBTUMsSUFBSSxHQUFHRCxPQUFPLENBQUMsTUFBTSxDQUFDO0FBQzVCLElBQUFFLFFBQUEsR0FBZ0JGLE9BQU8sQ0FBQyxlQUFlLENBQUM7RUFBakNHLEtBQUssR0FBQUQsUUFBQSxDQUFMQyxLQUFLO0FBQ1osSUFBQUMsU0FBQSxHQUFvQkosT0FBTyxDQUFDLGVBQWUsQ0FBQztFQUFyQ0ssU0FBUyxHQUFBRCxTQUFBLENBQVRDLFNBQVM7QUFFaEIsU0FBU0MsU0FBU0EsQ0FBQ0MsSUFBSSxFQUFFQyxJQUFJLEVBQUU7RUFDM0IsSUFBTUMsTUFBTSxHQUFHSixTQUFTLENBQUMsTUFBTSxFQUFFLENBQzdCSixJQUFJLENBQUNTLElBQUksQ0FBQ0MsU0FBUyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsV0FBVyxDQUFDLEVBQzlDSixJQUFJLEVBQUVOLElBQUksQ0FBQ1MsSUFBSSxDQUFDQyxTQUFTLEVBQUVILElBQUksQ0FBQyxDQUNuQyxDQUFDO0VBRUYsSUFBSUMsTUFBTSxDQUFDRyxLQUFLLEVBQ1osTUFBTUgsTUFBTSxDQUFDRyxLQUFLO0VBRXRCLElBQU1DLE1BQU0sR0FBR0MsTUFBTSxDQUFDTCxNQUFNLENBQUNJLE1BQU0sQ0FBQztFQUNwQyxJQUFJQSxNQUFNLENBQUNFLE1BQU0sRUFDYkMsT0FBTyxDQUFDSixLQUFLLENBQUNDLE1BQU0sQ0FBQztFQUV6QmQsRUFBRSxDQUFDa0IsYUFBYSxDQUFDaEIsSUFBSSxDQUFDUyxJQUFJLENBQUNDLFNBQVMsRUFBRUgsSUFBSSxDQUFDLEdBQUcsT0FBTyxFQUFFTSxNQUFNLENBQUNMLE1BQU0sQ0FBQ1MsTUFBTSxDQUFDLENBQUM7RUFDN0UsT0FBT1QsTUFBTSxDQUFDVSxNQUFNO0FBQ3hCO0FBRUEsU0FBU0MsUUFBUUEsQ0FBQ2IsSUFBSSxFQUFFO0VBQ3BCLElBQUljLE1BQU0sR0FBRyxDQUFDO0VBQUMsSUFBQUMsU0FBQSxHQUFBQywwQkFBQSxDQUVGeEIsRUFBRSxDQUFDeUIsV0FBVyxDQUFDYixTQUFTLENBQUM7SUFBQWMsS0FBQTtFQUFBO0lBQXRDLEtBQUFILFNBQUEsQ0FBQUksQ0FBQSxNQUFBRCxLQUFBLEdBQUFILFNBQUEsQ0FBQUssQ0FBQSxJQUFBQyxJQUFBLEdBQXdDO01BQW5DcEIsSUFBSSxHQUFBaUIsS0FBQSxDQUFBSSxLQUFBO01BQ0wsSUFBSXJCLElBQUksQ0FBQ3NCLFFBQVEsQ0FBQyxPQUFPLENBQUMsRUFDdEI7TUFFSixRQUFRdEIsSUFBSSxDQUFDdUIsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDQyxHQUFHLEVBQUU7UUFDekIsS0FBSyxJQUFJO1FBQ1QsS0FBSyxJQUFJO1VBQ0w7UUFDSjtVQUNJO01BQVM7TUFHakJoQixPQUFPLENBQUNpQixHQUFHLENBQUN6QixJQUFJLENBQUM7TUFDakIsSUFBTVcsTUFBTSxHQUFHYixTQUFTLENBQUNDLElBQUksRUFBRUMsSUFBSSxDQUFDO01BRXBDLElBQUlXLE1BQU0sSUFBSSxDQUFDLEVBQ1hFLE1BQU0sRUFBRTtJQUNoQjtFQUFDLFNBQUFhLEdBQUE7SUFBQVosU0FBQSxDQUFBYSxDQUFBLENBQUFELEdBQUE7RUFBQTtJQUFBWixTQUFBLENBQUFjLENBQUE7RUFBQTtFQUVELElBQUksQ0FBQ2YsTUFBTSxFQUNQTCxPQUFPLENBQUNpQixHQUFHLHNCQUFzQixDQUFDLEtBRWxDakIsT0FBTyxDQUFDaUIsR0FBRyxNQUFBSSxNQUFBLENBQU1oQixNQUFNLG1CQUFnQjtFQUUzQyxPQUFPQSxNQUFNO0FBQ2pCOztBQUVBO0FBQ0EsSUFBTWlCLE1BQU0sR0FBR25DLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FDekJvQyxPQUFPLENBQUNDLElBQUksQ0FBQ3pCLE1BQU0sR0FBRyxDQUFDLEdBQ2pCd0IsT0FBTyxDQUFDQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQ2Z2QyxJQUFJLENBQUNTLElBQUksQ0FBQ0MsU0FBUyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsV0FBVyxDQUFDLENBQ3ZELENBQUM7QUFFRjJCLE1BQU0sQ0FBQ3BCLE1BQU0sQ0FBQ3VCLEVBQUUsQ0FBQyxNQUFNLEVBQUUsVUFBQUMsSUFBSSxFQUFJO0VBQzdCO0VBQ0EsSUFBTW5DLElBQUksR0FBR21DLElBQUksQ0FBQ0MsUUFBUSxFQUFFLENBQUNDLElBQUksRUFBRSxDQUFDYixLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDOztFQUVqRDtFQUNBUSxPQUFPLENBQUNNLElBQUksQ0FBQ3pCLFFBQVEsQ0FBQ2IsSUFBSSxDQUFDLENBQUM7QUFDaEMsQ0FBQyxDQUFDIn0=
