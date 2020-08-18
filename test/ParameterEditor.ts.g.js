"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _Dropdown = _interopRequireDefault(require("../controls/Dropdown"));

var _App = _interopRequireDefault(require("Native/App"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var ParametersEditor =
/*#__PURE__*/
function () {
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

      _App.default.queryEntityParameters(arg.name);
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

exports.default = ParametersEditor;

// Dynamic menu parameters
var MenuParameter =
/*#__PURE__*/
function () {
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
      this.dropdown = new _Dropdown.default(function (value) {
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

      _App.default.setEntityParameter(this.section.name, this.key, value);
    }
  }]);

  return MenuParameter;
}();

var MenuSection =
/*#__PURE__*/
function () {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlBhcmFtZXRlckVkaXRvci50cyJdLCJuYW1lcyI6WyJQYXJhbWV0ZXJzRWRpdG9yIiwiZmlsdGVyTWVudSIsInZpc2libGUiLCJzZWN0aW9ucyIsImxlbmd0aCIsInBhcmFtZXRlcnMiLCJtYXBwZWRTZWN0aW9ucyIsIm5hbWUiLCJzZWN0aW9uIiwiTWVudVNlY3Rpb24iLCJwdXNoIiwiZGV2ZWxvcGVyIiwidW5kZWZpbmVkIiwiaSIsImoiLCJoYXZlU2VsZWN0ZWQiLCJvblNlbGVjdGVkIiwic2VsZWN0ZWQiLCJhcmciLCJOYXRpdmVBcHAiLCJxdWVyeUVudGl0eVBhcmFtZXRlcnMiLCJ2YWx1ZSIsInBhcmFtZXRlciIsIm1hcHBlZFBhcmFtZXRlcnMiLCJyZXNldFZhbHVlIiwiTWVudVBhcmFtZXRlciIsInR5cGUiLCJ2aXNpYmlsaXR5IiwiZGVmYXVsdFZhbHVlIiwiZHJvcGRvd25WYWx1ZXMiLCJ1bml0cyIsImtleSIsImRyb3Bkb3duIiwiRHJvcGRvd24iLCJ2YWx1ZUNoYW5nZWQiLCJhcnJheSIsInNwbGl0IiwiaXRlbSIsInRyaW0iLCJpdGVtcyIsInRvTG93ZXJDYXNlIiwic2VsZWN0Iiwib2xkVmFsdWUiLCJkaXJ0eSIsImFwcGx5VmFsdWUiLCJzZXRFbnRpdHlQYXJhbWV0ZXIiLCJlZGl0b3IiLCJldmVuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBQ0E7Ozs7Ozs7Ozs7OztJQUVxQkEsZ0I7Ozs7OzswQ0FDTyxLOzt1Q0FDSCxLOztxQ0FDRixLOztzQ0FDTyxFOzt3Q0FDSSxFOzs0Q0FDVCxFOzs7OzsyQkFFUjtBQUNULFdBQUtDLFVBQUw7QUFDQSxXQUFLQyxPQUFMLEdBQWUsSUFBZjtBQUNIOzs7NEJBRWE7QUFDVixXQUFLQSxPQUFMLEdBQWUsS0FBZjtBQUNIOzs7NEJBRWE7QUFDVixXQUFLQyxRQUFMLENBQWNDLE1BQWQsR0FBdUIsQ0FBdkI7QUFDQSxXQUFLQyxVQUFMLENBQWdCRCxNQUFoQixHQUF5QixDQUF6QjtBQUNBLFdB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QyxLQUlnQzs7QUFBQSx3Q0FIdEIsRUFHc0I7O0FBQUEsOENBRjdCLEVBRTZCOztBQUNoRCxTQUFLdUMsTUFBTCxHQUFjQSxNQUFkO0FBQ0EsU0FBS3ZDLElBQUwsR0FBWUEsSUFBWjtBQUNIOzs7O2lDQUVZQSxJLEVBQWNtQixJLEVBQWNDLFUsRUFBb0JDLFksRUFBc0JDLGMsRUFBd0JDLEssRUFBOEI7QUFDckksVUFBSVIsU0FBUyxHQUFHLElBQUlHLGFBQUosQ0FBa0IsSUFBbEIsRUFBd0JsQixJQUF4QixFQUE4Qm1CLElBQTlCLEVBQW9DQyxVQUFwQyxFQUFnREMsWUFBaEQsRUFBOERDLGNBQTlELEVBQThFQyxLQUE5RSxDQUFoQjtBQUNBLFdBQUt6QixVQUFMLENBQWdCSyxJQUFoQixDQUFxQlksU0FBckI7QUFDQSxXQUFLQyxnQkFBTCxDQUFzQmhCLElBQXRCLElBQThCZSxTQUE5QjtBQUNBQSxNQUFBQSxTQUFTLENBQUN5QixJQUFWLEdBQWlCLEtBQUsxQyxVQUFMLENBQWdCRCxNQUFoQixHQUF5QixDQUF6QixJQUE4QixDQUEvQztBQUNBLGFBQU9rQixTQUFQO0FBQ0g7OzsrQkFFZ0I7QUFDYixXQUFLd0IsTUFBTCxDQUFZOUIsVUFBWixDQUF1QixJQUF2QjtBQUNIIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IERyb3Bkb3duIGZyb20gXCIuLi9jb250cm9scy9Ecm9wZG93blwiO1xyXG5pbXBvcnQgTmF0aXZlQXBwIGZyb20gXCJOYXRpdmUvQXBwXCI7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQYXJhbWV0ZXJzRWRpdG9yIHtcclxuICAgIGhhdmVTZWxlY3RlZDogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgZGV2ZWxvcGVyOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICB2aXNpYmxlOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICBzZWN0aW9uczogTWVudVNlY3Rpb25bXSA9IFtdO1xyXG4gICAgcGFyYW1ldGVyczogTWVudVBhcmFtZXRlcltdID0gW107XHJcbiAgICBtYXBwZWRTZWN0aW9uczoge30gPSB7fTtcclxuXHJcbiAgICBvcGVuKCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuZmlsdGVyTWVudSgpO1xyXG4gICAgICAgIHRoaXMudmlzaWJsZSA9IHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgY2xvc2UoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy52aXNpYmxlID0gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgY2xlYXIoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5zZWN0aW9ucy5sZW5ndGggPSAwO1xyXG4gICAgICAgIHRoaXMucGFyYW1ldGVycy5sZW5ndGggPSAwO1xyXG4gICAgICAgIHRoaXMubWFwcGVkU2VjdGlvbnMgPSB7fTtcclxuICAgIH1cclxuXHJcbiAgICBhZGRTZWN0aW9uKG5hbWU6IHN0cmluZyk6IE1lbnVTZWN0aW9uIHtcclxuICAgICAgICB2YXIgc2VjdGlvbiA9IG5ldyBNZW51U2VjdGlvbih0aGlzLCBuYW1lKTtcclxuICAgICAgICB0aGlzLnNlY3Rpb25zLnB1c2goc2VjdGlvbik7XHJcbiAgICAgICAgdGhpcy5tYXBwZWRTZWN0aW9uc1tuYW1lXSA9IHNlY3Rpb247XHJcbiAgICAgICAgcmV0dXJuIHNlY3Rpb247XHJcbiAgICB9XHJcblxyXG4gICAgZmlsdGVyTWVudShkZXZlbG9wZXI/OiBib29sZWFuKTogdm9pZCB7XHJcbiAgICAgICAgaWYgKGRldmVsb3BlciA9PT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICBkZXZlbG9wZXIgPSB0aGlzLmRldmVsb3BlcjtcclxuXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnNlY3Rpb25zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2VjdGlvbnNbaV0udmlzaWJsZSA9IGZhbHNlO1xyXG5cclxuICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCB0aGlzLnNlY3Rpb25zW2ldLnBhcmFtZXRlcnMubGVuZ3RoOyBqKyspIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2VjdGlvbnNbaV0ucGFyYW1ldGVyc1tqXS52aXNpYmxlID0gIXRoaXMuc2VjdGlvbnNbaV0ucGFyYW1ldGVyc1tqXS5kZXZlbG9wZXIgfHwgZGV2ZWxvcGVyO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5zZWN0aW9uc1tpXS5wYXJhbWV0ZXJzW2pdLnZpc2libGUpXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZWN0aW9uc1tpXS52aXNpYmxlID0gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCF0aGlzLmhhdmVTZWxlY3RlZCkge1xyXG4gICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IHRoaXMuc2VjdGlvbnMubGVuZ3RoOyBqKyspIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnNlY3Rpb25zW2pdLnZpc2libGUpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm9uU2VsZWN0ZWQodGhpcy5zZWN0aW9uc1tqXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIGlmICghZGV2ZWxvcGVyKSB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5zZWN0aW9ucy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuc2VjdGlvbnNbaV0uc2VsZWN0ZWQgJiYgIXRoaXMuc2VjdGlvbnNbaV0udmlzaWJsZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgdGhpcy5zZWN0aW9ucy5sZW5ndGg7IGorKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5zZWN0aW9uc1tqXS52aXNpYmxlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm9uU2VsZWN0ZWQodGhpcy5zZWN0aW9uc1tqXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgb25TZWxlY3RlZChhcmc6IE1lbnVTZWN0aW9uKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5wYXJhbWV0ZXJzID0gYXJnLnBhcmFtZXRlcnM7XHJcbiAgICAgICAgdGhpcy5oYXZlU2VsZWN0ZWQgPSB0cnVlO1xyXG5cclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuc2VjdGlvbnMubGVuZ3RoOyBpKyspXHJcbiAgICAgICAgICAgIHRoaXMuc2VjdGlvbnNbaV0uc2VsZWN0ZWQgPSB0aGlzLnNlY3Rpb25zW2ldID09PSBhcmc7XHJcblxyXG4gICAgICAgIE5hdGl2ZUFwcC5xdWVyeUVudGl0eVBhcmFtZXRlcnMoYXJnLm5hbWUpO1xyXG4gICAgfVxyXG5cclxuICAgIGRldmVsb3BlckNoYW5nZWQoYXJnOiBhbnkpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmZpbHRlck1lbnUoYXJnLnZhbHVlKTtcclxuICAgIH1cclxuXHJcbiAgICBvbkVudGl0eVBhcmFtZXRlcihzZWN0aW9uOiBzdHJpbmcsIHBhcmFtZXRlcjogc3RyaW5nLCB2YWx1ZTogc3RyaW5nKTogdm9pZCB7XHJcbiAgICAgICAgaWYgKCF0aGlzLm1hcHBlZFNlY3Rpb25zW3NlY3Rpb25dIHx8XHJcbiAgICAgICAgICAgICF0aGlzLm1hcHBlZFNlY3Rpb25zW3NlY3Rpb25dLm1hcHBlZFBhcmFtZXRlcnNbcGFyYW1ldGVyXSlcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICB0aGlzLm1hcHBlZFNlY3Rpb25zW3NlY3Rpb25dLm1hcHBlZFBhcmFtZXRlcnNbcGFyYW1ldGVyXS5yZXNldFZhbHVlKHZhbHVlKTtcclxuICAgIH1cclxufVxyXG5cclxudHlwZSBWYWx1ZSA9IHN0cmluZyB8IGJvb2xlYW47XHJcblxyXG5pbnRlcmZhY2UgRGF0YSB7XHJcbiAgICB2YWx1ZTogVmFsdWU7XHJcbn1cclxuXHJcbmludGVyZmFjZSBJdGVtIHtcclxuICAgIG5hbWU6IHN0cmluZztcclxufVxyXG5cclxuLy8gRHluYW1pYyBtZW51IHBhcmFtZXRlcnNcclxuY2xhc3MgTWVudVBhcmFtZXRlciB7XHJcbiAgICBzZWN0aW9uOiBNZW51U2VjdGlvbjtcclxuICAgIGtleTogc3RyaW5nO1xyXG4gICAgZGV2ZWxvcGVyOiBib29sZWFuO1xyXG4gICAgbmFtZTogc3RyaW5nO1xyXG4gICAgdW5pdHM6IHN0cmluZztcclxuICAgIHR5cGU6IHN0cmluZztcclxuICAgIGRyb3Bkb3duOiBEcm9wZG93bjxJdGVtPjtcclxuICAgIHZhbHVlOiBWYWx1ZTtcclxuICAgIG9sZFZhbHVlOiBWYWx1ZTtcclxuICAgIGRpcnR5OiBib29sZWFuO1xyXG4gICAgZXZlbjogYm9vbGVhbjtcclxuICAgIHZpc2libGU6IGJvb2xlYW47XHJcblxyXG4gICAgY29uc3RydWN0b3Ioc2VjdGlvbjogTWVudVNlY3Rpb24sIG5hbWU6IHN0cmluZywgdHlwZTogc3RyaW5nLCB2aXNpYmlsaXR5OiBzdHJpbmcsIGRlZmF1bHRWYWx1ZTogc3RyaW5nLCBkcm9wZG93blZhbHVlczogc3RyaW5nLCB1bml0czogc3RyaW5nKSB7XHJcbiAgICAgICAgdGhpcy5zZWN0aW9uID0gc2VjdGlvbjtcclxuICAgICAgICB0aGlzLmtleSA9IG5hbWU7XHJcbiAgICAgICAgdGhpcy5kZXZlbG9wZXIgPSB2aXNpYmlsaXR5ID09IFwiZGV2ZWxvcGVyXCI7XHJcbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcclxuICAgICAgICB0aGlzLnVuaXRzID0gdW5pdHM7XHJcblxyXG4gICAgICAgIGlmIChkcm9wZG93blZhbHVlcykge1xyXG4gICAgICAgICAgICB0aGlzLnR5cGUgPSBcImRyb3Bkb3duXCI7XHJcbiAgICAgICAgICAgIHRoaXMuZHJvcGRvd24gPSBuZXcgRHJvcGRvd24oKHZhbHVlOiBJdGVtKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy52YWx1ZSA9PT0gdmFsdWUubmFtZSlcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlLm5hbWU7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnZhbHVlQ2hhbmdlZCh7dmFsdWU6IHZhbHVlLm5hbWV9KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHZhciBhcnJheSA9IGRyb3Bkb3duVmFsdWVzLnNwbGl0KFwiLFwiKTtcclxuXHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJyYXkubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHZhciBpdGVtID0ge25hbWU6IGFycmF5W2ldLnRyaW0oKX07XHJcbiAgICAgICAgICAgICAgICB0aGlzLmRyb3Bkb3duLml0ZW1zLnB1c2goaXRlbSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2UgaWYgKHR5cGUgPT0gXCJyZWFsXCIpIHtcclxuICAgICAgICAgICAgdGhpcy50eXBlID0gXCJkZWNpbWFsXCI7XHJcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlID09IFwiaW50ZWdlclwiKSB7XHJcbiAgICAgICAgICAgIHRoaXMudHlwZSA9IFwiaW50ZWdlclwiO1xyXG4gICAgICAgIH0gZWxzZSBpZiAodHlwZSA9PSBcImJvb2xlYW5cIikge1xyXG4gICAgICAgICAgICB0aGlzLnR5cGUgPSBcInN3aXRjaFwiO1xyXG4gICAgICAgIH0gZWxzZSB7IC8vIGxpc3Q6cmVhbCB8fCBtYXRyaXggfHwgbGlzdDppbnRlZ2VyIHx8IC4uLlxyXG4gICAgICAgICAgICB0aGlzLnR5cGUgPSBcInRleHRcIjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMucmVzZXRWYWx1ZShkZWZhdWx0VmFsdWUpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlc2V0VmFsdWUodmFsdWU6IHN0cmluZyk6IHZvaWQge1xyXG4gICAgICAgIGlmICh0aGlzLnR5cGUgPT0gXCJzd2l0Y2hcIilcclxuICAgICAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlID09IFwiMVwiIHx8IHZhbHVlICYmIHZhbHVlLnRvTG93ZXJDYXNlKCkgPT0gXCJ0cnVlXCI7XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLnR5cGUgPT0gXCJkcm9wZG93blwiKVxyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuZHJvcGRvd24uaXRlbXMubGVuZ3RoOyBpKyspXHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5kcm9wZG93bi5pdGVtc1tpXS5uYW1lID09IHRoaXMudmFsdWUpXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kcm9wZG93bi5zZWxlY3QodGhpcy5kcm9wZG93bi5pdGVtc1tpXSk7XHJcblxyXG4gICAgICAgIHRoaXMub2xkVmFsdWUgPSB0aGlzLnZhbHVlO1xyXG4gICAgICAgIC8vY29uc29sZS5sb2coXCJyZXNldCBcIiArIHRoaXMuc2VjdGlvbi5uYW1lICsgXCIvXCIgKyB0aGlzLmtleSArIFwiID0gXCIgKyB0aGlzLnZhbHVlKTtcclxuICAgIH1cclxuXHJcbiAgICB2YWx1ZUNoYW5nZWQoYXJnOiBEYXRhKTogdm9pZCB7XHJcbiAgICAgICAgLy8gRGVmZXIgYXBwbHlpbmcgdGV4dCBvciBudW1iZXIgdmFsdWVzIHRvIERVTkUgdW50aWwgZm9jdXNMb3N0KCksXHJcbiAgICAgICAgLy8gYXZvaWRpbmcgc2VuZGluZyBuZXcgdmFsdWVzIGV2ZXJ5IHRpbWUgYSBuZXcgY2hhcmFjdGVyIGlzIHR5cGVkLlxyXG4gICAgICAgIGlmICh0aGlzLnR5cGUgPT0gXCJ0ZXh0XCIgfHwgdGhpcy50eXBlID09IFwibnVtYmVyXCIpXHJcbiAgICAgICAgICAgIHRoaXMuZGlydHkgPSB0cnVlO1xyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgICAgdGhpcy5hcHBseVZhbHVlKGFyZy52YWx1ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgZm9jdXNMb3N0KCk6IHZvaWQge1xyXG4gICAgICAgIGlmICh0aGlzLmRpcnR5KVxyXG4gICAgICAgICAgICB0aGlzLmFwcGx5VmFsdWUodGhpcy52YWx1ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgYXBwbHlWYWx1ZSh2YWx1ZTogVmFsdWUpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmRpcnR5ID0gZmFsc2U7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLm9sZFZhbHVlID09IHZhbHVlKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAgIHRoaXMub2xkVmFsdWUgPSB2YWx1ZTtcclxuICAgICAgICAvL2NvbnNvbGUubG9nKFwiYXBwbHkgXCIgKyB0aGlzLnNlY3Rpb24ubmFtZSArIFwiL1wiICsgdGhpcy5rZXkgKyBcIiA9IFwiICsgdmFsdWUpO1xyXG4gICAgICAgIE5hdGl2ZUFwcC5zZXRFbnRpdHlQYXJhbWV0ZXIodGhpcy5zZWN0aW9uLm5hbWUsIHRoaXMua2V5LCB2YWx1ZSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmNsYXNzIE1lbnVTZWN0aW9uIHtcclxuICAgIGVkaXRvcjogUGFyYW1ldGVyc0VkaXRvcjtcclxuICAgIG5hbWU6IHN0cmluZztcclxuICAgIHZpc2libGU6IGJvb2xlYW4gPSB0cnVlO1xyXG4gICAgc2VsZWN0ZWQ6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgIHBhcmFtZXRlcnM6IE1lbnVQYXJhbWV0ZXJbXSA9IFtdO1xyXG4gICAgbWFwcGVkUGFyYW1ldGVyczoge30gPSB7fTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihlZGl0b3I6IFBhcmFtZXRlcnNFZGl0b3IsIG5hbWU6IHN0cmluZykge1xyXG4gICAgICAgIHRoaXMuZWRpdG9yID0gZWRpdG9yO1xyXG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XHJcbiAgICB9XHJcblxyXG4gICAgYWRkUGFyYW1ldGVyKG5hbWU6IHN0cmluZywgdHlwZTogc3RyaW5nLCB2aXNpYmlsaXR5OiBzdHJpbmcsIGRlZmF1bHRWYWx1ZTogc3RyaW5nLCBkcm9wZG93blZhbHVlczogc3RyaW5nLCB1bml0czogc3RyaW5nKTogTWVudVBhcmFtZXRlciB7XHJcbiAgICAgICAgdmFyIHBhcmFtZXRlciA9IG5ldyBNZW51UGFyYW1ldGVyKHRoaXMsIG5hbWUsIHR5cGUsIHZpc2liaWxpdHksIGRlZmF1bHRWYWx1ZSwgZHJvcGRvd25WYWx1ZXMsIHVuaXRzKTtcclxuICAgICAgICB0aGlzLnBhcmFtZXRlcnMucHVzaChwYXJhbWV0ZXIpO1xyXG4gICAgICAgIHRoaXMubWFwcGVkUGFyYW1ldGVyc1tuYW1lXSA9IHBhcmFtZXRlcjtcclxuICAgICAgICBwYXJhbWV0ZXIuZXZlbiA9IHRoaXMucGFyYW1ldGVycy5sZW5ndGggJSAyID09IDA7XHJcbiAgICAgICAgcmV0dXJuIHBhcmFtZXRlcjtcclxuICAgIH1cclxuXHJcbiAgICBvblNlbGVjdCgpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmVkaXRvci5vblNlbGVjdGVkKHRoaXMpO1xyXG4gICAgfVxyXG59XHJcbiJdfQ==
