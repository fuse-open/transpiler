"use strict";

var _obj$foo, _obj$foo$bar, _obj$qux, _obj$foo$bar2, _obj$foo2, _obj$foo2$bar;

// https://babeljs.io/docs/en/babel-plugin-proposal-optional-chaining
var obj = {
  foo: {
    bar: {
      baz: 42
    }
  }
};
var baz = obj === null || obj === void 0 ? void 0 : (_obj$foo = obj.foo) === null || _obj$foo === void 0 ? void 0 : (_obj$foo$bar = _obj$foo.bar) === null || _obj$foo$bar === void 0 ? void 0 : _obj$foo$bar.baz; // 42

var safe = obj === null || obj === void 0 ? void 0 : (_obj$qux = obj.qux) === null || _obj$qux === void 0 ? void 0 : _obj$qux.baz; // undefined
// Optional chaining and normal chaining can be intermixed

obj === null || obj === void 0 ? void 0 : (_obj$foo$bar2 = obj.foo.bar) === null || _obj$foo$bar2 === void 0 ? void 0 : _obj$foo$bar2.baz; // Only access `foo` if `obj` exists, and `baz` if
// `bar` exists
// Example usage with bracket notation:

obj === null || obj === void 0 ? void 0 : (_obj$foo2 = obj['foo']) === null || _obj$foo2 === void 0 ? void 0 : (_obj$foo2$bar = _obj$foo2.bar) === null || _obj$foo2$bar === void 0 ? void 0 : _obj$foo2$bar.baz; // 42
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNoYWluaW5nLmpzIl0sIm5hbWVzIjpbIm9iaiIsImZvbyIsImJhciIsImJheiIsInNhZmUiLCJxdXgiXSwibWFwcGluZ3MiOiI7Ozs7QUFBQTtBQUVBLElBQU1BLEdBQUcsR0FBRztBQUNSQyxFQUFBQSxHQUFHLEVBQUU7QUFDREMsSUFBQUEsR0FBRyxFQUFFO0FBQ0RDLE1BQUFBLEdBQUcsRUFBRTtBQURKO0FBREo7QUFERyxDQUFaO0FBUUEsSUFBTUEsR0FBRyxHQUFHSCxHQUFILGFBQUdBLEdBQUgsbUNBQUdBLEdBQUcsQ0FBRUMsR0FBUiw2REFBRyxTQUFVQyxHQUFiLGlEQUFHLGFBQWVDLEdBQTNCLEMsQ0FBZ0M7O0FBRWhDLElBQU1DLElBQUksR0FBR0osR0FBSCxhQUFHQSxHQUFILG1DQUFHQSxHQUFHLENBQUVLLEdBQVIsNkNBQUcsU0FBVUYsR0FBdkIsQyxDQUE0QjtBQUU1Qjs7QUFDQUgsR0FBRyxTQUFILElBQUFBLEdBQUcsV0FBSCw2QkFBQUEsR0FBRyxDQUFFQyxHQUFMLENBQVNDLEdBQVQsZ0VBQWNDLEdBQWQsQyxDQUFtQjtBQUNuQjtBQUVBOztBQUNBSCxHQUFHLFNBQUgsSUFBQUEsR0FBRyxXQUFILHlCQUFBQSxHQUFHLENBQUcsS0FBSCxDQUFILHlFQUFjRSxHQUFkLGdFQUFtQkMsR0FBbkIsQyxDQUF1QiIsInNvdXJjZXNDb250ZW50IjpbIi8vIGh0dHBzOi8vYmFiZWxqcy5pby9kb2NzL2VuL2JhYmVsLXBsdWdpbi1wcm9wb3NhbC1vcHRpb25hbC1jaGFpbmluZ1xyXG5cclxuY29uc3Qgb2JqID0ge1xyXG4gICAgZm9vOiB7XHJcbiAgICAgICAgYmFyOiB7XHJcbiAgICAgICAgICAgIGJhejogNDIsXHJcbiAgICAgICAgfSxcclxuICAgIH0sXHJcbn07XHJcblxyXG5jb25zdCBiYXogPSBvYmo/LmZvbz8uYmFyPy5iYXo7IC8vIDQyXHJcblxyXG5jb25zdCBzYWZlID0gb2JqPy5xdXg/LmJhejsgLy8gdW5kZWZpbmVkXHJcblxyXG4vLyBPcHRpb25hbCBjaGFpbmluZyBhbmQgbm9ybWFsIGNoYWluaW5nIGNhbiBiZSBpbnRlcm1peGVkXHJcbm9iaj8uZm9vLmJhcj8uYmF6OyAvLyBPbmx5IGFjY2VzcyBgZm9vYCBpZiBgb2JqYCBleGlzdHMsIGFuZCBgYmF6YCBpZlxyXG4vLyBgYmFyYCBleGlzdHNcclxuXHJcbi8vIEV4YW1wbGUgdXNhZ2Ugd2l0aCBicmFja2V0IG5vdGF0aW9uOlxyXG5vYmo/LlsnZm9vJ10/LmJhcj8uYmF6IC8vIDQyXHJcbiJdfQ==
