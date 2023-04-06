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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJvYmoiLCJmb28iLCJiYXIiLCJiYXoiLCJfb2JqJGZvbyIsIl9vYmokZm9vJGJhciIsInNhZmUiLCJfb2JqJHF1eCIsInF1eCIsIl9vYmokZm9vJGJhcjIiLCJfb2JqJGZvbzIiLCJfb2JqJGZvbzIkYmFyIl0sInNvdXJjZXMiOlsiY2hhaW5pbmcuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gaHR0cHM6Ly9iYWJlbGpzLmlvL2RvY3MvZW4vYmFiZWwtcGx1Z2luLXByb3Bvc2FsLW9wdGlvbmFsLWNoYWluaW5nXG5cbmNvbnN0IG9iaiA9IHtcbiAgICBmb286IHtcbiAgICAgICAgYmFyOiB7XG4gICAgICAgICAgICBiYXo6IDQyLFxuICAgICAgICB9LFxuICAgIH0sXG59O1xuXG5jb25zdCBiYXogPSBvYmo/LmZvbz8uYmFyPy5iYXo7IC8vIDQyXG5cbmNvbnN0IHNhZmUgPSBvYmo/LnF1eD8uYmF6OyAvLyB1bmRlZmluZWRcblxuLy8gT3B0aW9uYWwgY2hhaW5pbmcgYW5kIG5vcm1hbCBjaGFpbmluZyBjYW4gYmUgaW50ZXJtaXhlZFxub2JqPy5mb28uYmFyPy5iYXo7IC8vIE9ubHkgYWNjZXNzIGBmb29gIGlmIGBvYmpgIGV4aXN0cywgYW5kIGBiYXpgIGlmXG4vLyBgYmFyYCBleGlzdHNcblxuLy8gRXhhbXBsZSB1c2FnZSB3aXRoIGJyYWNrZXQgbm90YXRpb246XG5vYmo/LlsnZm9vJ10/LmJhcj8uYmF6IC8vIDQyXG4iXSwibWFwcGluZ3MiOiI7OztBQUFBOztBQUVBLElBQU1BLEdBQUcsR0FBRztFQUNSQyxHQUFHLEVBQUU7SUFDREMsR0FBRyxFQUFFO01BQ0RDLEdBQUcsRUFBRTtJQUNUO0VBQ0o7QUFDSixDQUFDO0FBRUQsSUFBTUEsR0FBRyxHQUFHSCxHQUFHLGFBQUhBLEdBQUcsd0JBQUFJLFFBQUEsR0FBSEosR0FBRyxDQUFFQyxHQUFHLGNBQUFHLFFBQUEsd0JBQUFDLFlBQUEsR0FBUkQsUUFBQSxDQUFVRixHQUFHLGNBQUFHLFlBQUEsdUJBQWJBLFlBQUEsQ0FBZUYsR0FBRyxDQUFDLENBQUM7O0FBRWhDLElBQU1HLElBQUksR0FBR04sR0FBRyxhQUFIQSxHQUFHLHdCQUFBTyxRQUFBLEdBQUhQLEdBQUcsQ0FBRVEsR0FBRyxjQUFBRCxRQUFBLHVCQUFSQSxRQUFBLENBQVVKLEdBQUcsQ0FBQyxDQUFDOztBQUU1QjtBQUNBSCxHQUFHLGFBQUhBLEdBQUcsd0JBQUFTLGFBQUEsR0FBSFQsR0FBRyxDQUFFQyxHQUFHLENBQUNDLEdBQUcsY0FBQU8sYUFBQSx1QkFBWkEsYUFBQSxDQUFjTixHQUFHLENBQUMsQ0FBQztBQUNuQjs7QUFFQTtBQUNBSCxHQUFHLGFBQUhBLEdBQUcsd0JBQUFVLFNBQUEsR0FBSFYsR0FBRyxDQUFHLEtBQUssQ0FBQyxjQUFBVSxTQUFBLHdCQUFBQyxhQUFBLEdBQVpELFNBQUEsQ0FBY1IsR0FBRyxjQUFBUyxhQUFBLHVCQUFqQkEsYUFBQSxDQUFtQlIsR0FBRyxFQUFDIn0=
