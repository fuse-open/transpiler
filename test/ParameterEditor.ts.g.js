"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _Dropdown = _interopRequireDefault(require("../controls/Dropdown"));

var _App = _interopRequireDefault(require("Native/App"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var ParametersEditor = /*#__PURE__*/function () {
  function ParametersEditor() {
    _classCallCheck(this, ParametersEditor);

    _defineProperty(this, "haveSelected", false);

    _defineProperty(this, "developer", false);

    _defineProperty(this, "visible", false);

    _defineProperty(this, "sections", []);

    _defineProperty(this, "parameters", []);

    _defineProperty(this, "mappedSections", {});
  }

  _createClass(ParametersEditor, [{
    key: "open",
    value: function open() {
      this.filterMenu();
      this.visible = true;
    }
  }, {
    key: "close",
    value: function close() {
      this.visible = false;
    }
  }, {
    key: "clear",
    value: function clear() {
      this.sections.length = 0;
      this.parameters.length = 0;
      this.mappedSections = {};
    }
  }, {
    key: "addSection",
    value: function addSection(name) {
      var section = new MenuSection(this, name);
      this.sections.push(section);
      this.mappedSections[name] = section;
      return section;
    }
  }, {
    key: "filterMenu",
    value: function filterMenu(developer) {
      if (developer === undefined) developer = this.developer;

      for (var i = 0; i < this.sections.length; i++) {
        this.sections[i].visible = false;

        for (var j = 0; j < this.sections[i].parameters.length; j++) {
          this.sections[i].parameters[j].visible = !this.sections[i].parameters[j].developer || developer;
          if (this.sections[i].parameters[j].visible) this.sections[i].visible = true;
        }
      }

      if (!this.haveSelected) {
        for (var j = 0; j < this.sections.length; j++) {
          if (this.sections[j].visible) {
            this.onSelected(this.sections[j]);
            return;
          }
        }
      } else if (!developer) {
        for (var i = 0; i < this.sections.length; i++) {
          if (this.sections[i].selected && !this.sections[i].visible) {
            for (var j = 0; j < this.sections.length; j++) {
              if (this.sections[j].visible) {
                this.onSelected(this.sections[j]);
                return;
              }
            }
          }
        }
      }
    }
  }, {
    key: "onSelected",
    value: function onSelected(arg) {
      this.parameters = arg.parameters;
      this.haveSelected = true;

      for (var i = 0; i < this.sections.length; i++) {
        this.sections[i].selected = this.sections[i] === arg;
      }

      _App["default"].queryEntityParameters(arg.name);
    }
  }, {
    key: "developerChanged",
    value: function developerChanged(arg) {
      this.filterMenu(arg.value);
    }
  }, {
    key: "onEntityParameter",
    value: function onEntityParameter(section, parameter, value) {
      if (!this.mappedSections[section] || !this.mappedSections[section].mappedParameters[parameter]) return;
      this.mappedSections[section].mappedParameters[parameter].resetValue(value);
    }
  }]);

  return ParametersEditor;
}();

exports["default"] = ParametersEditor;

// Dynamic menu parameters
var MenuParameter = /*#__PURE__*/function () {
  function MenuParameter(section, name, type, visibility, defaultValue, dropdownValues, units) {
    var _this = this;

    _classCallCheck(this, MenuParameter);

    _defineProperty(this, "section", void 0);

    _defineProperty(this, "key", void 0);

    _defineProperty(this, "developer", void 0);

    _defineProperty(this, "name", void 0);

    _defineProperty(this, "units", void 0);

    _defineProperty(this, "type", void 0);

    _defineProperty(this, "dropdown", void 0);

    _defineProperty(this, "value", void 0);

    _defineProperty(this, "oldValue", void 0);

    _defineProperty(this, "dirty", void 0);

    _defineProperty(this, "even", void 0);

    _defineProperty(this, "visible", void 0);

    this.section = section;
    this.key = name;
    this.developer = visibility == "developer";
    this.name = name;
    this.units = units;

    if (dropdownValues) {
      this.type = "dropdown";
      this.dropdown = new _Dropdown["default"](function (value) {
        if (_this.value === value.name) return;
        _this.value = value.name;

        _this.valueChanged({
          value: value.name
        });
      });
      var array = dropdownValues.split(",");

      for (var i = 0; i < array.length; i++) {
        var item = {
          name: array[i].trim()
        };
        this.dropdown.items.push(item);
      }
    } else if (type == "real") {
      this.type = "decimal";
    } else if (type == "integer") {
      this.type = "integer";
    } else if (type == "boolean") {
      this.type = "switch";
    } else {
      // list:real || matrix || list:integer || ...
      this.type = "text";
    }

    this.resetValue(defaultValue);
  }

  _createClass(MenuParameter, [{
    key: "resetValue",
    value: function resetValue(value) {
      if (this.type == "switch") this.value = value == "1" || value && value.toLowerCase() == "true";else this.value = value;
      if (this.type == "dropdown") for (var i = 0; i < this.dropdown.items.length; i++) {
        if (this.dropdown.items[i].name == this.value) this.dropdown.select(this.dropdown.items[i]);
      }
      this.oldValue = this.value; //console.log("reset " + this.section.name + "/" + this.key + " = " + this.value);
    }
  }, {
    key: "valueChanged",
    value: function valueChanged(arg) {
      // Defer applying text or number values to DUNE until focusLost(),
      // avoiding sending new values every time a new character is typed.
      if (this.type == "text" || this.type == "number") this.dirty = true;else this.applyValue(arg.value);
    }
  }, {
    key: "focusLost",
    value: function focusLost() {
      if (this.dirty) this.applyValue(this.value);
    }
  }, {
    key: "applyValue",
    value: function applyValue(value) {
      this.dirty = false;
      if (this.oldValue == value) return;
      this.oldValue = value; //console.log("apply " + this.section.name + "/" + this.key + " = " + value);

      _App["default"].setEntityParameter(this.section.name, this.key, value);
    }
  }]);

  return MenuParameter;
}();

var MenuSection = /*#__PURE__*/function () {
  function MenuSection(editor, name) {
    _classCallCheck(this, MenuSection);

    _defineProperty(this, "editor", void 0);

    _defineProperty(this, "name", void 0);

    _defineProperty(this, "visible", true);

    _defineProperty(this, "selected", false);

    _defineProperty(this, "parameters", []);

    _defineProperty(this, "mappedParameters", {});

    this.editor = editor;
    this.name = name;
  }

  _createClass(MenuSection, [{
    key: "addParameter",
    value: function addParameter(name, type, visibility, defaultValue, dropdownValues, units) {
      var parameter = new MenuParameter(this, name, type, visibility, defaultValue, dropdownValues, units);
      this.parameters.push(parameter);
      this.mappedParameters[name] = parameter;
      parameter.even = this.parameters.length % 2 == 0;
      return parameter;
    }
  }, {
    key: "onSelect",
    value: function onSelect() {
      this.editor.onSelected(this);
    }
  }]);

  return MenuSection;
}();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlBhcmFtZXRlckVkaXRvci50cyJdLCJuYW1lcyI6WyJQYXJhbWV0ZXJzRWRpdG9yIiwiZmlsdGVyTWVudSIsInZpc2libGUiLCJzZWN0aW9ucyIsImxlbmd0aCIsInBhcmFtZXRlcnMiLCJtYXBwZWRTZWN0aW9ucyIsIm5hbWUiLCJzZWN0aW9uIiwiTWVudVNlY3Rpb24iLCJwdXNoIiwiZGV2ZWxvcGVyIiwidW5kZWZpbmVkIiwiaSIsImoiLCJoYXZlU2VsZWN0ZWQiLCJvblNlbGVjdGVkIiwic2VsZWN0ZWQiLCJhcmciLCJOYXRpdmVBcHAiLCJxdWVyeUVudGl0eVBhcmFtZXRlcnMiLCJ2YWx1ZSIsInBhcmFtZXRlciIsIm1hcHBlZFBhcmFtZXRlcnMiLCJyZXNldFZhbHVlIiwiTWVudVBhcmFtZXRlciIsInR5cGUiLCJ2aXNpYmlsaXR5IiwiZGVmYXVsdFZhbHVlIiwiZHJvcGRvd25WYWx1ZXMiLCJ1bml0cyIsImtleSIsImRyb3Bkb3duIiwiRHJvcGRvd24iLCJ2YWx1ZUNoYW5nZWQiLCJhcnJheSIsInNwbGl0IiwiaXRlbSIsInRyaW0iLCJpdGVtcyIsInRvTG93ZXJDYXNlIiwic2VsZWN0Iiwib2xkVmFsdWUiLCJkaXJ0eSIsImFwcGx5VmFsdWUiLCJzZXRFbnRpdHlQYXJhbWV0ZXIiLCJlZGl0b3IiLCJldmVuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBQ0E7Ozs7Ozs7Ozs7OztJQUVxQkEsZ0I7Ozs7MENBQ08sSzs7dUNBQ0gsSzs7cUNBQ0YsSzs7c0NBQ08sRTs7d0NBQ0ksRTs7NENBQ1QsRTs7Ozs7MkJBRVI7QUFDVCxXQUFLQyxVQUFMO0FBQ0EsV0FBS0MsT0FBTCxHQUFlLElBQWY7QUFDSDs7OzRCQUVhO0FBQ1YsV0FBS0EsT0FBTCxHQUFlLEtBQWY7QUFDSDs7OzRCQUVhO0FBQ1YsV0FBS0MsUUFBTCxDQUFjQyxNQUFkLEdBQXVCLENBQXZCO0FBQ0EsV0FBS0MsVUFBTCxDQUFnQkQsTUFBaEIsR0FBeUIsQ0FBekI7QUFDQSxXQUFLRSxjQUFMLEdBQXNCLEVBQXRCO0FBQ0g7OzsrQkFFVUMsSSxFQUEyQjtBQUNsQyxVQUFJQyxPQUFPLEdBQUcsSUFBSUMsV0FBSixDQUFnQixJQUFoQixFQUFzQkYsSUFBdEIsQ0FBZDtBQUNBLFdBQUtKLFFBQUwsQ0FBY08sSUFBZCxDQUFtQkYsT0FBbkI7QUFDQSxXQUFLRixjQUFMLENBQW9CQyxJQUFwQixJQUE0QkMsT0FBNUI7QUFDQSxhQUFPQSxPQUFQO0FBQ0g7OzsrQkFFVUcsUyxFQUEyQjtBQUNsQyxVQUFJQSxTQUFTLEtBQUtDLFNBQWxCLEVBQ0lELFNBQVMsR0FBRyxLQUFLQSxTQUFqQjs7QUFFSixXQUFLLElBQUlFLENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLEdBQUcsS0FBS1YsUUFBTCxDQUFjQyxNQUFsQyxFQUEwQ1MsQ0FBQyxFQUEzQyxFQUErQztBQUMzQyxhQUFLVixRQUFMLENBQWNVLENBQWQsRUFBaUJYLE9BQWpCLEdBQTJCLEtBQTNCOztBQUVBLGFBQUssSUFBSVksQ0FBQyxHQUFHLENBQWIsRUFBZ0JBLENBQUMsR0FBRyxLQUFLWCxRQUFMLENBQWNVLENBQWQsRUFBaUJSLFVBQWpCLENBQTRCRCxNQUFoRCxFQUF3RFUsQ0FBQyxFQUF6RCxFQUE2RDtBQUN6RCxlQUFLWCxRQUFMLENBQWNVLENBQWQsRUFBaUJSLFVBQWpCLENBQTRCUyxDQUE1QixFQUErQlosT0FBL0IsR0FBeUMsQ0FBQyxLQUFLQyxRQUFMLENBQWNVLENBQWQsRUFBaUJSLFVBQWpCLENBQTRCUyxDQUE1QixFQUErQkgsU0FBaEMsSUFBNkNBLFNBQXRGO0FBRUEsY0FBSSxLQUFLUixRQUFMLENBQWNVLENBQWQsRUFBaUJSLFVBQWpCLENBQTRCUyxDQUE1QixFQUErQlosT0FBbkMsRUFDSSxLQUFLQyxRQUFMLENBQWNVLENBQWQsRUFBaUJYLE9BQWpCLEdBQTJCLElBQTNCO0FBQ1A7QUFDSjs7QUFFRCxVQUFJLENBQUMsS0FBS2EsWUFBVixFQUF3QjtBQUNwQixhQUFLLElBQUlELENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLEdBQUcsS0FBS1gsUUFBTCxDQUFjQyxNQUFsQyxFQUEwQ1UsQ0FBQyxFQUEzQyxFQUErQztBQUMzQyxjQUFJLEtBQUtYLFFBQUwsQ0FBY1csQ0FBZCxFQUFpQlosT0FBckIsRUFBOEI7QUFDMUIsaUJBQUtjLFVBQUwsQ0FBZ0IsS0FBS2IsUUFBTCxDQUFjVyxDQUFkLENBQWhCO0FBQ0E7QUFDSDtBQUNKO0FBQ0osT0FQRCxNQU9PLElBQUksQ0FBQ0gsU0FBTCxFQUFnQjtBQUNuQixhQUFLLElBQUlFLENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLEdBQUcsS0FBS1YsUUFBTCxDQUFjQyxNQUFsQyxFQUEwQ1MsQ0FBQyxFQUEzQyxFQUErQztBQUMzQyxjQUFJLEtBQUtWLFFBQUwsQ0FBY1UsQ0FBZCxFQUFpQkksUUFBakIsSUFBNkIsQ0FBQyxLQUFLZCxRQUFMLENBQWNVLENBQWQsRUFBaUJYLE9BQW5ELEVBQTREO0FBQ3hELGlCQUFLLElBQUlZLENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLEdBQUcsS0FBS1gsUUFBTCxDQUFjQyxNQUFsQyxFQUEwQ1UsQ0FBQyxFQUEzQyxFQUErQztBQUMzQyxrQkFBSSxLQUFLWCxRQUFMLENBQWNXLENBQWQsRUFBaUJaLE9BQXJCLEVBQThCO0FBQzFCLHFCQUFLYyxVQUFMLENBQWdCLEtBQUtiLFFBQUwsQ0FBY1csQ0FBZCxDQUFoQjtBQUNBO0FBQ0g7QUFDSjtBQUNKO0FBQ0o7QUFDSjtBQUNKOzs7K0JBRVVJLEcsRUFBd0I7QUFDL0IsV0FBS2IsVUFBTCxHQUFrQmEsR0FBRyxDQUFDYixVQUF0QjtBQUNBLFdBQUtVLFlBQUwsR0FBb0IsSUFBcEI7O0FBRUEsV0FBSyxJQUFJRixDQUFDLEdBQUcsQ0FBYixFQUFnQkEsQ0FBQyxHQUFHLEtBQUtWLFFBQUwsQ0FBY0MsTUFBbEMsRUFBMENTLENBQUMsRUFBM0M7QUFDSSxhQUFLVixRQUFMLENBQWNVLENBQWQsRUFBaUJJLFFBQWpCLEdBQTRCLEtBQUtkLFFBQUwsQ0FBY1UsQ0FBZCxNQUFxQkssR0FBakQ7QUFESjs7QUFHQUMsc0JBQVVDLHFCQUFWLENBQWdDRixHQUFHLENBQUNYLElBQXBDO0FBQ0g7OztxQ0FFZ0JXLEcsRUFBZ0I7QUFDN0IsV0FBS2pCLFVBQUwsQ0FBZ0JpQixHQUFHLENBQUNHLEtBQXBCO0FBQ0g7OztzQ0FFaUJiLE8sRUFBaUJjLFMsRUFBbUJELEssRUFBcUI7QUFDdkUsVUFBSSxDQUFDLEtBQUtmLGNBQUwsQ0FBb0JFLE9BQXBCLENBQUQsSUFDQSxDQUFDLEtBQUtGLGNBQUwsQ0FBb0JFLE9BQXBCLEVBQTZCZSxnQkFBN0IsQ0FBOENELFNBQTlDLENBREwsRUFFSTtBQUVKLFdBQUtoQixjQUFMLENBQW9CRSxPQUFwQixFQUE2QmUsZ0JBQTdCLENBQThDRCxTQUE5QyxFQUF5REUsVUFBekQsQ0FBb0VILEtBQXBFO0FBQ0g7Ozs7Ozs7O0FBYUw7SUFDTUksYTtBQWNGLHlCQUFZakIsT0FBWixFQUFrQ0QsSUFBbEMsRUFBZ0RtQixJQUFoRCxFQUE4REMsVUFBOUQsRUFBa0ZDLFlBQWxGLEVBQXdHQyxjQUF4RyxFQUFnSUMsS0FBaEksRUFBK0k7QUFBQTs7QUFBQTs7QUFBQTs7QUFBQTs7QUFBQTs7QUFBQTs7QUFBQTs7QUFBQTs7QUFBQTs7QUFBQTs7QUFBQTs7QUFBQTs7QUFBQTs7QUFBQTs7QUFDM0ksU0FBS3RCLE9BQUwsR0FBZUEsT0FBZjtBQUNBLFNBQUt1QixHQUFMLEdBQVd4QixJQUFYO0FBQ0EsU0FBS0ksU0FBTCxHQUFpQmdCLFVBQVUsSUFBSSxXQUEvQjtBQUNBLFNBQUtwQixJQUFMLEdBQVlBLElBQVo7QUFDQSxTQUFLdUIsS0FBTCxHQUFhQSxLQUFiOztBQUVBLFFBQUlELGNBQUosRUFBb0I7QUFDaEIsV0FBS0gsSUFBTCxHQUFZLFVBQVo7QUFDQSxXQUFLTSxRQUFMLEdBQWdCLElBQUlDLG9CQUFKLENBQWEsVUFBQ1osS0FBRCxFQUFpQjtBQUMxQyxZQUFJLEtBQUksQ0FBQ0EsS0FBTCxLQUFlQSxLQUFLLENBQUNkLElBQXpCLEVBQ0k7QUFFSixRQUFBLEtBQUksQ0FBQ2MsS0FBTCxHQUFhQSxLQUFLLENBQUNkLElBQW5COztBQUNBLFFBQUEsS0FBSSxDQUFDMkIsWUFBTCxDQUFrQjtBQUFDYixVQUFBQSxLQUFLLEVBQUVBLEtBQUssQ0FBQ2Q7QUFBZCxTQUFsQjtBQUNILE9BTmUsQ0FBaEI7QUFPQSxVQUFJNEIsS0FBSyxHQUFHTixjQUFjLENBQUNPLEtBQWYsQ0FBcUIsR0FBckIsQ0FBWjs7QUFFQSxXQUFLLElBQUl2QixDQUFDLEdBQUcsQ0FBYixFQUFnQkEsQ0FBQyxHQUFHc0IsS0FBSyxDQUFDL0IsTUFBMUIsRUFBa0NTLENBQUMsRUFBbkMsRUFBdUM7QUFDbkMsWUFBSXdCLElBQUksR0FBRztBQUFDOUIsVUFBQUEsSUFBSSxFQUFFNEIsS0FBSyxDQUFDdEIsQ0FBRCxDQUFMLENBQVN5QixJQUFUO0FBQVAsU0FBWDtBQUNBLGFBQUtOLFFBQUwsQ0FBY08sS0FBZCxDQUFvQjdCLElBQXBCLENBQXlCMkIsSUFBekI7QUFDSDtBQUNKLEtBZkQsTUFlTyxJQUFJWCxJQUFJLElBQUksTUFBWixFQUFvQjtBQUN2QixXQUFLQSxJQUFMLEdBQVksU0FBWjtBQUNILEtBRk0sTUFFQSxJQUFJQSxJQUFJLElBQUksU0FBWixFQUF1QjtBQUMxQixXQUFLQSxJQUFMLEdBQVksU0FBWjtBQUNILEtBRk0sTUFFQSxJQUFJQSxJQUFJLElBQUksU0FBWixFQUF1QjtBQUMxQixXQUFLQSxJQUFMLEdBQVksUUFBWjtBQUNILEtBRk0sTUFFQTtBQUFFO0FBQ0wsV0FBS0EsSUFBTCxHQUFZLE1BQVo7QUFDSDs7QUFFRCxTQUFLRixVQUFMLENBQWdCSSxZQUFoQjtBQUNIOzs7OytCQUVVUCxLLEVBQXFCO0FBQzVCLFVBQUksS0FBS0ssSUFBTCxJQUFhLFFBQWpCLEVBQ0ksS0FBS0wsS0FBTCxHQUFhQSxLQUFLLElBQUksR0FBVCxJQUFnQkEsS0FBSyxJQUFJQSxLQUFLLENBQUNtQixXQUFOLE1BQXVCLE1BQTdELENBREosS0FHSSxLQUFLbkIsS0FBTCxHQUFhQSxLQUFiO0FBRUosVUFBSSxLQUFLSyxJQUFMLElBQWEsVUFBakIsRUFDSSxLQUFLLElBQUliLENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLEdBQUcsS0FBS21CLFFBQUwsQ0FBY08sS0FBZCxDQUFvQm5DLE1BQXhDLEVBQWdEUyxDQUFDLEVBQWpEO0FBQ0ksWUFBSSxLQUFLbUIsUUFBTCxDQUFjTyxLQUFkLENBQW9CMUIsQ0FBcEIsRUFBdUJOLElBQXZCLElBQStCLEtBQUtjLEtBQXhDLEVBQ0ksS0FBS1csUUFBTCxDQUFjUyxNQUFkLENBQXFCLEtBQUtULFFBQUwsQ0FBY08sS0FBZCxDQUFvQjFCLENBQXBCLENBQXJCO0FBRlI7QUFJSixXQUFLNkIsUUFBTCxHQUFnQixLQUFLckIsS0FBckIsQ0FYNEIsQ0FZNUI7QUFDSDs7O2lDQUVZSCxHLEVBQWlCO0FBQzFCO0FBQ0E7QUFDQSxVQUFJLEtBQUtRLElBQUwsSUFBYSxNQUFiLElBQXVCLEtBQUtBLElBQUwsSUFBYSxRQUF4QyxFQUNJLEtBQUtpQixLQUFMLEdBQWEsSUFBYixDQURKLEtBR0ksS0FBS0MsVUFBTCxDQUFnQjFCLEdBQUcsQ0FBQ0csS0FBcEI7QUFDUDs7O2dDQUVpQjtBQUNkLFVBQUksS0FBS3NCLEtBQVQsRUFDSSxLQUFLQyxVQUFMLENBQWdCLEtBQUt2QixLQUFyQjtBQUNQOzs7K0JBRVVBLEssRUFBb0I7QUFDM0IsV0FBS3NCLEtBQUwsR0FBYSxLQUFiO0FBRUEsVUFBSSxLQUFLRCxRQUFMLElBQWlCckIsS0FBckIsRUFDSTtBQUVKLFdBQUtxQixRQUFMLEdBQWdCckIsS0FBaEIsQ0FOMkIsQ0FPM0I7O0FBQ0FGLHNCQUFVMEIsa0JBQVYsQ0FBNkIsS0FBS3JDLE9BQUwsQ0FBYUQsSUFBMUMsRUFBZ0QsS0FBS3dCLEdBQXJELEVBQTBEVixLQUExRDtBQUNIOzs7Ozs7SUFHQ1osVztBQVFGLHVCQUFZcUMsTUFBWixFQUFzQ3ZDLElBQXRDLEVBQW9EO0FBQUE7O0FBQUE7O0FBQUE7O0FBQUEscUNBTGpDLElBS2lDOztBQUFBLHNDQUpoQyxLQUlnQzs7QUFBQSx3Q0FIdEIsRUFHc0I7O0FBQUEsOENBRjdCLEVBRTZCOztBQUNoRCxTQUFLdUMsTUFBTCxHQUFjQSxNQUFkO0FBQ0EsU0FBS3ZDLElBQUwsR0FBWUEsSUFBWjtBQUNIOzs7O2lDQUVZQSxJLEVBQWNtQixJLEVBQWNDLFUsRUFBb0JDLFksRUFBc0JDLGMsRUFBd0JDLEssRUFBOEI7QUFDckksVUFBSVIsU0FBUyxHQUFHLElBQUlHLGFBQUosQ0FBa0IsSUFBbEIsRUFBd0JsQixJQUF4QixFQUE4Qm1CLElBQTlCLEVBQW9DQyxVQUFwQyxFQUFnREMsWUFBaEQsRUFBOERDLGNBQTlELEVBQThFQyxLQUE5RSxDQUFoQjtBQUNBLFdBQUt6QixVQUFMLENBQWdCSyxJQUFoQixDQUFxQlksU0FBckI7QUFDQSxXQUFLQyxnQkFBTCxDQUFzQmhCLElBQXRCLElBQThCZSxTQUE5QjtBQUNBQSxNQUFBQSxTQUFTLENBQUN5QixJQUFWLEdBQWlCLEtBQUsxQyxVQUFMLENBQWdCRCxNQUFoQixHQUF5QixDQUF6QixJQUE4QixDQUEvQztBQUNBLGFBQU9rQixTQUFQO0FBQ0g7OzsrQkFFZ0I7QUFDYixXQUFLd0IsTUFBTCxDQUFZOUIsVUFBWixDQUF1QixJQUF2QjtBQUNIIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IERyb3Bkb3duIGZyb20gXCIuLi9jb250cm9scy9Ecm9wZG93blwiO1xuaW1wb3J0IE5hdGl2ZUFwcCBmcm9tIFwiTmF0aXZlL0FwcFwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQYXJhbWV0ZXJzRWRpdG9yIHtcbiAgICBoYXZlU2VsZWN0ZWQ6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICBkZXZlbG9wZXI6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICB2aXNpYmxlOiBib29sZWFuID0gZmFsc2U7XG4gICAgc2VjdGlvbnM6IE1lbnVTZWN0aW9uW10gPSBbXTtcbiAgICBwYXJhbWV0ZXJzOiBNZW51UGFyYW1ldGVyW10gPSBbXTtcbiAgICBtYXBwZWRTZWN0aW9uczoge30gPSB7fTtcblxuICAgIG9wZW4oKTogdm9pZCB7XG4gICAgICAgIHRoaXMuZmlsdGVyTWVudSgpO1xuICAgICAgICB0aGlzLnZpc2libGUgPSB0cnVlO1xuICAgIH1cblxuICAgIGNsb3NlKCk6IHZvaWQge1xuICAgICAgICB0aGlzLnZpc2libGUgPSBmYWxzZTtcbiAgICB9XG5cbiAgICBjbGVhcigpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5zZWN0aW9ucy5sZW5ndGggPSAwO1xuICAgICAgICB0aGlzLnBhcmFtZXRlcnMubGVuZ3RoID0gMDtcbiAgICAgICAgdGhpcy5tYXBwZWRTZWN0aW9ucyA9IHt9O1xuICAgIH1cblxuICAgIGFkZFNlY3Rpb24obmFtZTogc3RyaW5nKTogTWVudVNlY3Rpb24ge1xuICAgICAgICB2YXIgc2VjdGlvbiA9IG5ldyBNZW51U2VjdGlvbih0aGlzLCBuYW1lKTtcbiAgICAgICAgdGhpcy5zZWN0aW9ucy5wdXNoKHNlY3Rpb24pO1xuICAgICAgICB0aGlzLm1hcHBlZFNlY3Rpb25zW25hbWVdID0gc2VjdGlvbjtcbiAgICAgICAgcmV0dXJuIHNlY3Rpb247XG4gICAgfVxuXG4gICAgZmlsdGVyTWVudShkZXZlbG9wZXI/OiBib29sZWFuKTogdm9pZCB7XG4gICAgICAgIGlmIChkZXZlbG9wZXIgPT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgIGRldmVsb3BlciA9IHRoaXMuZGV2ZWxvcGVyO1xuXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5zZWN0aW9ucy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdGhpcy5zZWN0aW9uc1tpXS52aXNpYmxlID0gZmFsc2U7XG5cbiAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgdGhpcy5zZWN0aW9uc1tpXS5wYXJhbWV0ZXJzLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZWN0aW9uc1tpXS5wYXJhbWV0ZXJzW2pdLnZpc2libGUgPSAhdGhpcy5zZWN0aW9uc1tpXS5wYXJhbWV0ZXJzW2pdLmRldmVsb3BlciB8fCBkZXZlbG9wZXI7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuc2VjdGlvbnNbaV0ucGFyYW1ldGVyc1tqXS52aXNpYmxlKVxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNlY3Rpb25zW2ldLnZpc2libGUgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCF0aGlzLmhhdmVTZWxlY3RlZCkge1xuICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCB0aGlzLnNlY3Rpb25zLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuc2VjdGlvbnNbal0udmlzaWJsZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm9uU2VsZWN0ZWQodGhpcy5zZWN0aW9uc1tqXSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoIWRldmVsb3Blcikge1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnNlY3Rpb25zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuc2VjdGlvbnNbaV0uc2VsZWN0ZWQgJiYgIXRoaXMuc2VjdGlvbnNbaV0udmlzaWJsZSkge1xuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IHRoaXMuc2VjdGlvbnMubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnNlY3Rpb25zW2pdLnZpc2libGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm9uU2VsZWN0ZWQodGhpcy5zZWN0aW9uc1tqXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgb25TZWxlY3RlZChhcmc6IE1lbnVTZWN0aW9uKTogdm9pZCB7XG4gICAgICAgIHRoaXMucGFyYW1ldGVycyA9IGFyZy5wYXJhbWV0ZXJzO1xuICAgICAgICB0aGlzLmhhdmVTZWxlY3RlZCA9IHRydWU7XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnNlY3Rpb25zLmxlbmd0aDsgaSsrKVxuICAgICAgICAgICAgdGhpcy5zZWN0aW9uc1tpXS5zZWxlY3RlZCA9IHRoaXMuc2VjdGlvbnNbaV0gPT09IGFyZztcblxuICAgICAgICBOYXRpdmVBcHAucXVlcnlFbnRpdHlQYXJhbWV0ZXJzKGFyZy5uYW1lKTtcbiAgICB9XG5cbiAgICBkZXZlbG9wZXJDaGFuZ2VkKGFyZzogYW55KTogdm9pZCB7XG4gICAgICAgIHRoaXMuZmlsdGVyTWVudShhcmcudmFsdWUpO1xuICAgIH1cblxuICAgIG9uRW50aXR5UGFyYW1ldGVyKHNlY3Rpb246IHN0cmluZywgcGFyYW1ldGVyOiBzdHJpbmcsIHZhbHVlOiBzdHJpbmcpOiB2b2lkIHtcbiAgICAgICAgaWYgKCF0aGlzLm1hcHBlZFNlY3Rpb25zW3NlY3Rpb25dIHx8XG4gICAgICAgICAgICAhdGhpcy5tYXBwZWRTZWN0aW9uc1tzZWN0aW9uXS5tYXBwZWRQYXJhbWV0ZXJzW3BhcmFtZXRlcl0pXG4gICAgICAgICAgICByZXR1cm47XG5cbiAgICAgICAgdGhpcy5tYXBwZWRTZWN0aW9uc1tzZWN0aW9uXS5tYXBwZWRQYXJhbWV0ZXJzW3BhcmFtZXRlcl0ucmVzZXRWYWx1ZSh2YWx1ZSk7XG4gICAgfVxufVxuXG50eXBlIFZhbHVlID0gc3RyaW5nIHwgYm9vbGVhbjtcblxuaW50ZXJmYWNlIERhdGEge1xuICAgIHZhbHVlOiBWYWx1ZTtcbn1cblxuaW50ZXJmYWNlIEl0ZW0ge1xuICAgIG5hbWU6IHN0cmluZztcbn1cblxuLy8gRHluYW1pYyBtZW51IHBhcmFtZXRlcnNcbmNsYXNzIE1lbnVQYXJhbWV0ZXIge1xuICAgIHNlY3Rpb246IE1lbnVTZWN0aW9uO1xuICAgIGtleTogc3RyaW5nO1xuICAgIGRldmVsb3BlcjogYm9vbGVhbjtcbiAgICBuYW1lOiBzdHJpbmc7XG4gICAgdW5pdHM6IHN0cmluZztcbiAgICB0eXBlOiBzdHJpbmc7XG4gICAgZHJvcGRvd246IERyb3Bkb3duPEl0ZW0+O1xuICAgIHZhbHVlOiBWYWx1ZTtcbiAgICBvbGRWYWx1ZTogVmFsdWU7XG4gICAgZGlydHk6IGJvb2xlYW47XG4gICAgZXZlbjogYm9vbGVhbjtcbiAgICB2aXNpYmxlOiBib29sZWFuO1xuXG4gICAgY29uc3RydWN0b3Ioc2VjdGlvbjogTWVudVNlY3Rpb24sIG5hbWU6IHN0cmluZywgdHlwZTogc3RyaW5nLCB2aXNpYmlsaXR5OiBzdHJpbmcsIGRlZmF1bHRWYWx1ZTogc3RyaW5nLCBkcm9wZG93blZhbHVlczogc3RyaW5nLCB1bml0czogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMuc2VjdGlvbiA9IHNlY3Rpb247XG4gICAgICAgIHRoaXMua2V5ID0gbmFtZTtcbiAgICAgICAgdGhpcy5kZXZlbG9wZXIgPSB2aXNpYmlsaXR5ID09IFwiZGV2ZWxvcGVyXCI7XG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgICAgIHRoaXMudW5pdHMgPSB1bml0cztcblxuICAgICAgICBpZiAoZHJvcGRvd25WYWx1ZXMpIHtcbiAgICAgICAgICAgIHRoaXMudHlwZSA9IFwiZHJvcGRvd25cIjtcbiAgICAgICAgICAgIHRoaXMuZHJvcGRvd24gPSBuZXcgRHJvcGRvd24oKHZhbHVlOiBJdGVtKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMudmFsdWUgPT09IHZhbHVlLm5hbWUpXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcblxuICAgICAgICAgICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZS5uYW1lO1xuICAgICAgICAgICAgICAgIHRoaXMudmFsdWVDaGFuZ2VkKHt2YWx1ZTogdmFsdWUubmFtZX0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB2YXIgYXJyYXkgPSBkcm9wZG93blZhbHVlcy5zcGxpdChcIixcIik7XG5cbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgaXRlbSA9IHtuYW1lOiBhcnJheVtpXS50cmltKCl9O1xuICAgICAgICAgICAgICAgIHRoaXMuZHJvcGRvd24uaXRlbXMucHVzaChpdGVtKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmICh0eXBlID09IFwicmVhbFwiKSB7XG4gICAgICAgICAgICB0aGlzLnR5cGUgPSBcImRlY2ltYWxcIjtcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlID09IFwiaW50ZWdlclwiKSB7XG4gICAgICAgICAgICB0aGlzLnR5cGUgPSBcImludGVnZXJcIjtcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlID09IFwiYm9vbGVhblwiKSB7XG4gICAgICAgICAgICB0aGlzLnR5cGUgPSBcInN3aXRjaFwiO1xuICAgICAgICB9IGVsc2UgeyAvLyBsaXN0OnJlYWwgfHwgbWF0cml4IHx8IGxpc3Q6aW50ZWdlciB8fCAuLi5cbiAgICAgICAgICAgIHRoaXMudHlwZSA9IFwidGV4dFwiO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5yZXNldFZhbHVlKGRlZmF1bHRWYWx1ZSk7XG4gICAgfVxuXG4gICAgcmVzZXRWYWx1ZSh2YWx1ZTogc3RyaW5nKTogdm9pZCB7XG4gICAgICAgIGlmICh0aGlzLnR5cGUgPT0gXCJzd2l0Y2hcIilcbiAgICAgICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZSA9PSBcIjFcIiB8fCB2YWx1ZSAmJiB2YWx1ZS50b0xvd2VyQ2FzZSgpID09IFwidHJ1ZVwiO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG5cbiAgICAgICAgaWYgKHRoaXMudHlwZSA9PSBcImRyb3Bkb3duXCIpXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuZHJvcGRvd24uaXRlbXMubGVuZ3RoOyBpKyspXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZHJvcGRvd24uaXRlbXNbaV0ubmFtZSA9PSB0aGlzLnZhbHVlKVxuICAgICAgICAgICAgICAgICAgICB0aGlzLmRyb3Bkb3duLnNlbGVjdCh0aGlzLmRyb3Bkb3duLml0ZW1zW2ldKTtcblxuICAgICAgICB0aGlzLm9sZFZhbHVlID0gdGhpcy52YWx1ZTtcbiAgICAgICAgLy9jb25zb2xlLmxvZyhcInJlc2V0IFwiICsgdGhpcy5zZWN0aW9uLm5hbWUgKyBcIi9cIiArIHRoaXMua2V5ICsgXCIgPSBcIiArIHRoaXMudmFsdWUpO1xuICAgIH1cblxuICAgIHZhbHVlQ2hhbmdlZChhcmc6IERhdGEpOiB2b2lkIHtcbiAgICAgICAgLy8gRGVmZXIgYXBwbHlpbmcgdGV4dCBvciBudW1iZXIgdmFsdWVzIHRvIERVTkUgdW50aWwgZm9jdXNMb3N0KCksXG4gICAgICAgIC8vIGF2b2lkaW5nIHNlbmRpbmcgbmV3IHZhbHVlcyBldmVyeSB0aW1lIGEgbmV3IGNoYXJhY3RlciBpcyB0eXBlZC5cbiAgICAgICAgaWYgKHRoaXMudHlwZSA9PSBcInRleHRcIiB8fCB0aGlzLnR5cGUgPT0gXCJudW1iZXJcIilcbiAgICAgICAgICAgIHRoaXMuZGlydHkgPSB0cnVlO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgICB0aGlzLmFwcGx5VmFsdWUoYXJnLnZhbHVlKTtcbiAgICB9XG5cbiAgICBmb2N1c0xvc3QoKTogdm9pZCB7XG4gICAgICAgIGlmICh0aGlzLmRpcnR5KVxuICAgICAgICAgICAgdGhpcy5hcHBseVZhbHVlKHRoaXMudmFsdWUpO1xuICAgIH1cblxuICAgIGFwcGx5VmFsdWUodmFsdWU6IFZhbHVlKTogdm9pZCB7XG4gICAgICAgIHRoaXMuZGlydHkgPSBmYWxzZTtcblxuICAgICAgICBpZiAodGhpcy5vbGRWYWx1ZSA9PSB2YWx1ZSlcbiAgICAgICAgICAgIHJldHVybjtcblxuICAgICAgICB0aGlzLm9sZFZhbHVlID0gdmFsdWU7XG4gICAgICAgIC8vY29uc29sZS5sb2coXCJhcHBseSBcIiArIHRoaXMuc2VjdGlvbi5uYW1lICsgXCIvXCIgKyB0aGlzLmtleSArIFwiID0gXCIgKyB2YWx1ZSk7XG4gICAgICAgIE5hdGl2ZUFwcC5zZXRFbnRpdHlQYXJhbWV0ZXIodGhpcy5zZWN0aW9uLm5hbWUsIHRoaXMua2V5LCB2YWx1ZSk7XG4gICAgfVxufVxuXG5jbGFzcyBNZW51U2VjdGlvbiB7XG4gICAgZWRpdG9yOiBQYXJhbWV0ZXJzRWRpdG9yO1xuICAgIG5hbWU6IHN0cmluZztcbiAgICB2aXNpYmxlOiBib29sZWFuID0gdHJ1ZTtcbiAgICBzZWxlY3RlZDogYm9vbGVhbiA9IGZhbHNlO1xuICAgIHBhcmFtZXRlcnM6IE1lbnVQYXJhbWV0ZXJbXSA9IFtdO1xuICAgIG1hcHBlZFBhcmFtZXRlcnM6IHt9ID0ge307XG5cbiAgICBjb25zdHJ1Y3RvcihlZGl0b3I6IFBhcmFtZXRlcnNFZGl0b3IsIG5hbWU6IHN0cmluZykge1xuICAgICAgICB0aGlzLmVkaXRvciA9IGVkaXRvcjtcbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICB9XG5cbiAgICBhZGRQYXJhbWV0ZXIobmFtZTogc3RyaW5nLCB0eXBlOiBzdHJpbmcsIHZpc2liaWxpdHk6IHN0cmluZywgZGVmYXVsdFZhbHVlOiBzdHJpbmcsIGRyb3Bkb3duVmFsdWVzOiBzdHJpbmcsIHVuaXRzOiBzdHJpbmcpOiBNZW51UGFyYW1ldGVyIHtcbiAgICAgICAgdmFyIHBhcmFtZXRlciA9IG5ldyBNZW51UGFyYW1ldGVyKHRoaXMsIG5hbWUsIHR5cGUsIHZpc2liaWxpdHksIGRlZmF1bHRWYWx1ZSwgZHJvcGRvd25WYWx1ZXMsIHVuaXRzKTtcbiAgICAgICAgdGhpcy5wYXJhbWV0ZXJzLnB1c2gocGFyYW1ldGVyKTtcbiAgICAgICAgdGhpcy5tYXBwZWRQYXJhbWV0ZXJzW25hbWVdID0gcGFyYW1ldGVyO1xuICAgICAgICBwYXJhbWV0ZXIuZXZlbiA9IHRoaXMucGFyYW1ldGVycy5sZW5ndGggJSAyID09IDA7XG4gICAgICAgIHJldHVybiBwYXJhbWV0ZXI7XG4gICAgfVxuXG4gICAgb25TZWxlY3QoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuZWRpdG9yLm9uU2VsZWN0ZWQodGhpcyk7XG4gICAgfVxufVxuIl19
