"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _Dropdown = _interopRequireDefault(require("../controls/Dropdown"));
var _App = _interopRequireDefault(require("Native/App"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
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
      for (var i = 0; i < this.sections.length; i++) this.sections[i].selected = this.sections[i] === arg;
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
      if (this.type == "dropdown") for (var i = 0; i < this.dropdown.items.length; i++) if (this.dropdown.items[i].name == this.value) this.dropdown.select(this.dropdown.items[i]);
      this.oldValue = this.value;
      //console.log("reset " + this.section.name + "/" + this.key + " = " + this.value);
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
      this.oldValue = value;
      //console.log("apply " + this.section.name + "/" + this.key + " = " + value);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJQYXJhbWV0ZXJzRWRpdG9yIiwiZmlsdGVyTWVudSIsInZpc2libGUiLCJzZWN0aW9ucyIsImxlbmd0aCIsInBhcmFtZXRlcnMiLCJtYXBwZWRTZWN0aW9ucyIsIm5hbWUiLCJzZWN0aW9uIiwiTWVudVNlY3Rpb24iLCJwdXNoIiwiZGV2ZWxvcGVyIiwidW5kZWZpbmVkIiwiaSIsImoiLCJoYXZlU2VsZWN0ZWQiLCJvblNlbGVjdGVkIiwic2VsZWN0ZWQiLCJhcmciLCJOYXRpdmVBcHAiLCJxdWVyeUVudGl0eVBhcmFtZXRlcnMiLCJ2YWx1ZSIsInBhcmFtZXRlciIsIm1hcHBlZFBhcmFtZXRlcnMiLCJyZXNldFZhbHVlIiwiTWVudVBhcmFtZXRlciIsInR5cGUiLCJ2aXNpYmlsaXR5IiwiZGVmYXVsdFZhbHVlIiwiZHJvcGRvd25WYWx1ZXMiLCJ1bml0cyIsImtleSIsImRyb3Bkb3duIiwiRHJvcGRvd24iLCJ2YWx1ZUNoYW5nZWQiLCJhcnJheSIsInNwbGl0IiwiaXRlbSIsInRyaW0iLCJpdGVtcyIsInRvTG93ZXJDYXNlIiwic2VsZWN0Iiwib2xkVmFsdWUiLCJkaXJ0eSIsImFwcGx5VmFsdWUiLCJzZXRFbnRpdHlQYXJhbWV0ZXIiLCJlZGl0b3IiLCJldmVuIl0sInNvdXJjZXMiOlsiUGFyYW1ldGVyRWRpdG9yLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBEcm9wZG93biBmcm9tIFwiLi4vY29udHJvbHMvRHJvcGRvd25cIjtcbmltcG9ydCBOYXRpdmVBcHAgZnJvbSBcIk5hdGl2ZS9BcHBcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUGFyYW1ldGVyc0VkaXRvciB7XG4gICAgaGF2ZVNlbGVjdGVkOiBib29sZWFuID0gZmFsc2U7XG4gICAgZGV2ZWxvcGVyOiBib29sZWFuID0gZmFsc2U7XG4gICAgdmlzaWJsZTogYm9vbGVhbiA9IGZhbHNlO1xuICAgIHNlY3Rpb25zOiBNZW51U2VjdGlvbltdID0gW107XG4gICAgcGFyYW1ldGVyczogTWVudVBhcmFtZXRlcltdID0gW107XG4gICAgbWFwcGVkU2VjdGlvbnM6IHt9ID0ge307XG5cbiAgICBvcGVuKCk6IHZvaWQge1xuICAgICAgICB0aGlzLmZpbHRlck1lbnUoKTtcbiAgICAgICAgdGhpcy52aXNpYmxlID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBjbG9zZSgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy52aXNpYmxlID0gZmFsc2U7XG4gICAgfVxuXG4gICAgY2xlYXIoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuc2VjdGlvbnMubGVuZ3RoID0gMDtcbiAgICAgICAgdGhpcy5wYXJhbWV0ZXJzLmxlbmd0aCA9IDA7XG4gICAgICAgIHRoaXMubWFwcGVkU2VjdGlvbnMgPSB7fTtcbiAgICB9XG5cbiAgICBhZGRTZWN0aW9uKG5hbWU6IHN0cmluZyk6IE1lbnVTZWN0aW9uIHtcbiAgICAgICAgdmFyIHNlY3Rpb24gPSBuZXcgTWVudVNlY3Rpb24odGhpcywgbmFtZSk7XG4gICAgICAgIHRoaXMuc2VjdGlvbnMucHVzaChzZWN0aW9uKTtcbiAgICAgICAgdGhpcy5tYXBwZWRTZWN0aW9uc1tuYW1lXSA9IHNlY3Rpb247XG4gICAgICAgIHJldHVybiBzZWN0aW9uO1xuICAgIH1cblxuICAgIGZpbHRlck1lbnUoZGV2ZWxvcGVyPzogYm9vbGVhbik6IHZvaWQge1xuICAgICAgICBpZiAoZGV2ZWxvcGVyID09PSB1bmRlZmluZWQpXG4gICAgICAgICAgICBkZXZlbG9wZXIgPSB0aGlzLmRldmVsb3BlcjtcblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuc2VjdGlvbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHRoaXMuc2VjdGlvbnNbaV0udmlzaWJsZSA9IGZhbHNlO1xuXG4gICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IHRoaXMuc2VjdGlvbnNbaV0ucGFyYW1ldGVycy5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgICAgIHRoaXMuc2VjdGlvbnNbaV0ucGFyYW1ldGVyc1tqXS52aXNpYmxlID0gIXRoaXMuc2VjdGlvbnNbaV0ucGFyYW1ldGVyc1tqXS5kZXZlbG9wZXIgfHwgZGV2ZWxvcGVyO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnNlY3Rpb25zW2ldLnBhcmFtZXRlcnNbal0udmlzaWJsZSlcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZWN0aW9uc1tpXS52aXNpYmxlID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghdGhpcy5oYXZlU2VsZWN0ZWQpIHtcbiAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgdGhpcy5zZWN0aW9ucy5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLnNlY3Rpb25zW2pdLnZpc2libGUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vblNlbGVjdGVkKHRoaXMuc2VjdGlvbnNbal0pO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKCFkZXZlbG9wZXIpIHtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5zZWN0aW9ucy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLnNlY3Rpb25zW2ldLnNlbGVjdGVkICYmICF0aGlzLnNlY3Rpb25zW2ldLnZpc2libGUpIHtcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCB0aGlzLnNlY3Rpb25zLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5zZWN0aW9uc1tqXS52aXNpYmxlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5vblNlbGVjdGVkKHRoaXMuc2VjdGlvbnNbal0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIG9uU2VsZWN0ZWQoYXJnOiBNZW51U2VjdGlvbik6IHZvaWQge1xuICAgICAgICB0aGlzLnBhcmFtZXRlcnMgPSBhcmcucGFyYW1ldGVycztcbiAgICAgICAgdGhpcy5oYXZlU2VsZWN0ZWQgPSB0cnVlO1xuXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5zZWN0aW9ucy5sZW5ndGg7IGkrKylcbiAgICAgICAgICAgIHRoaXMuc2VjdGlvbnNbaV0uc2VsZWN0ZWQgPSB0aGlzLnNlY3Rpb25zW2ldID09PSBhcmc7XG5cbiAgICAgICAgTmF0aXZlQXBwLnF1ZXJ5RW50aXR5UGFyYW1ldGVycyhhcmcubmFtZSk7XG4gICAgfVxuXG4gICAgZGV2ZWxvcGVyQ2hhbmdlZChhcmc6IGFueSk6IHZvaWQge1xuICAgICAgICB0aGlzLmZpbHRlck1lbnUoYXJnLnZhbHVlKTtcbiAgICB9XG5cbiAgICBvbkVudGl0eVBhcmFtZXRlcihzZWN0aW9uOiBzdHJpbmcsIHBhcmFtZXRlcjogc3RyaW5nLCB2YWx1ZTogc3RyaW5nKTogdm9pZCB7XG4gICAgICAgIGlmICghdGhpcy5tYXBwZWRTZWN0aW9uc1tzZWN0aW9uXSB8fFxuICAgICAgICAgICAgIXRoaXMubWFwcGVkU2VjdGlvbnNbc2VjdGlvbl0ubWFwcGVkUGFyYW1ldGVyc1twYXJhbWV0ZXJdKVxuICAgICAgICAgICAgcmV0dXJuO1xuXG4gICAgICAgIHRoaXMubWFwcGVkU2VjdGlvbnNbc2VjdGlvbl0ubWFwcGVkUGFyYW1ldGVyc1twYXJhbWV0ZXJdLnJlc2V0VmFsdWUodmFsdWUpO1xuICAgIH1cbn1cblxudHlwZSBWYWx1ZSA9IHN0cmluZyB8IGJvb2xlYW47XG5cbmludGVyZmFjZSBEYXRhIHtcbiAgICB2YWx1ZTogVmFsdWU7XG59XG5cbmludGVyZmFjZSBJdGVtIHtcbiAgICBuYW1lOiBzdHJpbmc7XG59XG5cbi8vIER5bmFtaWMgbWVudSBwYXJhbWV0ZXJzXG5jbGFzcyBNZW51UGFyYW1ldGVyIHtcbiAgICBzZWN0aW9uOiBNZW51U2VjdGlvbjtcbiAgICBrZXk6IHN0cmluZztcbiAgICBkZXZlbG9wZXI6IGJvb2xlYW47XG4gICAgbmFtZTogc3RyaW5nO1xuICAgIHVuaXRzOiBzdHJpbmc7XG4gICAgdHlwZTogc3RyaW5nO1xuICAgIGRyb3Bkb3duOiBEcm9wZG93bjxJdGVtPjtcbiAgICB2YWx1ZTogVmFsdWU7XG4gICAgb2xkVmFsdWU6IFZhbHVlO1xuICAgIGRpcnR5OiBib29sZWFuO1xuICAgIGV2ZW46IGJvb2xlYW47XG4gICAgdmlzaWJsZTogYm9vbGVhbjtcblxuICAgIGNvbnN0cnVjdG9yKHNlY3Rpb246IE1lbnVTZWN0aW9uLCBuYW1lOiBzdHJpbmcsIHR5cGU6IHN0cmluZywgdmlzaWJpbGl0eTogc3RyaW5nLCBkZWZhdWx0VmFsdWU6IHN0cmluZywgZHJvcGRvd25WYWx1ZXM6IHN0cmluZywgdW5pdHM6IHN0cmluZykge1xuICAgICAgICB0aGlzLnNlY3Rpb24gPSBzZWN0aW9uO1xuICAgICAgICB0aGlzLmtleSA9IG5hbWU7XG4gICAgICAgIHRoaXMuZGV2ZWxvcGVyID0gdmlzaWJpbGl0eSA9PSBcImRldmVsb3BlclwiO1xuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgICAgICB0aGlzLnVuaXRzID0gdW5pdHM7XG5cbiAgICAgICAgaWYgKGRyb3Bkb3duVmFsdWVzKSB7XG4gICAgICAgICAgICB0aGlzLnR5cGUgPSBcImRyb3Bkb3duXCI7XG4gICAgICAgICAgICB0aGlzLmRyb3Bkb3duID0gbmV3IERyb3Bkb3duKCh2YWx1ZTogSXRlbSkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLnZhbHVlID09PSB2YWx1ZS5uYW1lKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG5cbiAgICAgICAgICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWUubmFtZTtcbiAgICAgICAgICAgICAgICB0aGlzLnZhbHVlQ2hhbmdlZCh7dmFsdWU6IHZhbHVlLm5hbWV9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdmFyIGFycmF5ID0gZHJvcGRvd25WYWx1ZXMuc3BsaXQoXCIsXCIpO1xuXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFycmF5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdmFyIGl0ZW0gPSB7bmFtZTogYXJyYXlbaV0udHJpbSgpfTtcbiAgICAgICAgICAgICAgICB0aGlzLmRyb3Bkb3duLml0ZW1zLnB1c2goaXRlbSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZSA9PSBcInJlYWxcIikge1xuICAgICAgICAgICAgdGhpcy50eXBlID0gXCJkZWNpbWFsXCI7XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZSA9PSBcImludGVnZXJcIikge1xuICAgICAgICAgICAgdGhpcy50eXBlID0gXCJpbnRlZ2VyXCI7XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZSA9PSBcImJvb2xlYW5cIikge1xuICAgICAgICAgICAgdGhpcy50eXBlID0gXCJzd2l0Y2hcIjtcbiAgICAgICAgfSBlbHNlIHsgLy8gbGlzdDpyZWFsIHx8IG1hdHJpeCB8fCBsaXN0OmludGVnZXIgfHwgLi4uXG4gICAgICAgICAgICB0aGlzLnR5cGUgPSBcInRleHRcIjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMucmVzZXRWYWx1ZShkZWZhdWx0VmFsdWUpO1xuICAgIH1cblxuICAgIHJlc2V0VmFsdWUodmFsdWU6IHN0cmluZyk6IHZvaWQge1xuICAgICAgICBpZiAodGhpcy50eXBlID09IFwic3dpdGNoXCIpXG4gICAgICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWUgPT0gXCIxXCIgfHwgdmFsdWUgJiYgdmFsdWUudG9Mb3dlckNhc2UoKSA9PSBcInRydWVcIjtcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuXG4gICAgICAgIGlmICh0aGlzLnR5cGUgPT0gXCJkcm9wZG93blwiKVxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmRyb3Bkb3duLml0ZW1zLmxlbmd0aDsgaSsrKVxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmRyb3Bkb3duLml0ZW1zW2ldLm5hbWUgPT0gdGhpcy52YWx1ZSlcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kcm9wZG93bi5zZWxlY3QodGhpcy5kcm9wZG93bi5pdGVtc1tpXSk7XG5cbiAgICAgICAgdGhpcy5vbGRWYWx1ZSA9IHRoaXMudmFsdWU7XG4gICAgICAgIC8vY29uc29sZS5sb2coXCJyZXNldCBcIiArIHRoaXMuc2VjdGlvbi5uYW1lICsgXCIvXCIgKyB0aGlzLmtleSArIFwiID0gXCIgKyB0aGlzLnZhbHVlKTtcbiAgICB9XG5cbiAgICB2YWx1ZUNoYW5nZWQoYXJnOiBEYXRhKTogdm9pZCB7XG4gICAgICAgIC8vIERlZmVyIGFwcGx5aW5nIHRleHQgb3IgbnVtYmVyIHZhbHVlcyB0byBEVU5FIHVudGlsIGZvY3VzTG9zdCgpLFxuICAgICAgICAvLyBhdm9pZGluZyBzZW5kaW5nIG5ldyB2YWx1ZXMgZXZlcnkgdGltZSBhIG5ldyBjaGFyYWN0ZXIgaXMgdHlwZWQuXG4gICAgICAgIGlmICh0aGlzLnR5cGUgPT0gXCJ0ZXh0XCIgfHwgdGhpcy50eXBlID09IFwibnVtYmVyXCIpXG4gICAgICAgICAgICB0aGlzLmRpcnR5ID0gdHJ1ZTtcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgdGhpcy5hcHBseVZhbHVlKGFyZy52YWx1ZSk7XG4gICAgfVxuXG4gICAgZm9jdXNMb3N0KCk6IHZvaWQge1xuICAgICAgICBpZiAodGhpcy5kaXJ0eSlcbiAgICAgICAgICAgIHRoaXMuYXBwbHlWYWx1ZSh0aGlzLnZhbHVlKTtcbiAgICB9XG5cbiAgICBhcHBseVZhbHVlKHZhbHVlOiBWYWx1ZSk6IHZvaWQge1xuICAgICAgICB0aGlzLmRpcnR5ID0gZmFsc2U7XG5cbiAgICAgICAgaWYgKHRoaXMub2xkVmFsdWUgPT0gdmFsdWUpXG4gICAgICAgICAgICByZXR1cm47XG5cbiAgICAgICAgdGhpcy5vbGRWYWx1ZSA9IHZhbHVlO1xuICAgICAgICAvL2NvbnNvbGUubG9nKFwiYXBwbHkgXCIgKyB0aGlzLnNlY3Rpb24ubmFtZSArIFwiL1wiICsgdGhpcy5rZXkgKyBcIiA9IFwiICsgdmFsdWUpO1xuICAgICAgICBOYXRpdmVBcHAuc2V0RW50aXR5UGFyYW1ldGVyKHRoaXMuc2VjdGlvbi5uYW1lLCB0aGlzLmtleSwgdmFsdWUpO1xuICAgIH1cbn1cblxuY2xhc3MgTWVudVNlY3Rpb24ge1xuICAgIGVkaXRvcjogUGFyYW1ldGVyc0VkaXRvcjtcbiAgICBuYW1lOiBzdHJpbmc7XG4gICAgdmlzaWJsZTogYm9vbGVhbiA9IHRydWU7XG4gICAgc2VsZWN0ZWQ6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICBwYXJhbWV0ZXJzOiBNZW51UGFyYW1ldGVyW10gPSBbXTtcbiAgICBtYXBwZWRQYXJhbWV0ZXJzOiB7fSA9IHt9O1xuXG4gICAgY29uc3RydWN0b3IoZWRpdG9yOiBQYXJhbWV0ZXJzRWRpdG9yLCBuYW1lOiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5lZGl0b3IgPSBlZGl0b3I7XG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgfVxuXG4gICAgYWRkUGFyYW1ldGVyKG5hbWU6IHN0cmluZywgdHlwZTogc3RyaW5nLCB2aXNpYmlsaXR5OiBzdHJpbmcsIGRlZmF1bHRWYWx1ZTogc3RyaW5nLCBkcm9wZG93blZhbHVlczogc3RyaW5nLCB1bml0czogc3RyaW5nKTogTWVudVBhcmFtZXRlciB7XG4gICAgICAgIHZhciBwYXJhbWV0ZXIgPSBuZXcgTWVudVBhcmFtZXRlcih0aGlzLCBuYW1lLCB0eXBlLCB2aXNpYmlsaXR5LCBkZWZhdWx0VmFsdWUsIGRyb3Bkb3duVmFsdWVzLCB1bml0cyk7XG4gICAgICAgIHRoaXMucGFyYW1ldGVycy5wdXNoKHBhcmFtZXRlcik7XG4gICAgICAgIHRoaXMubWFwcGVkUGFyYW1ldGVyc1tuYW1lXSA9IHBhcmFtZXRlcjtcbiAgICAgICAgcGFyYW1ldGVyLmV2ZW4gPSB0aGlzLnBhcmFtZXRlcnMubGVuZ3RoICUgMiA9PSAwO1xuICAgICAgICByZXR1cm4gcGFyYW1ldGVyO1xuICAgIH1cblxuICAgIG9uU2VsZWN0KCk6IHZvaWQge1xuICAgICAgICB0aGlzLmVkaXRvci5vblNlbGVjdGVkKHRoaXMpO1xuICAgIH1cbn1cbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7QUFDQTtBQUFtQztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsSUFFZEEsZ0JBQWdCO0VBQUE7SUFBQTtJQUFBLHNDQUNULEtBQUs7SUFBQSxtQ0FDUixLQUFLO0lBQUEsaUNBQ1AsS0FBSztJQUFBLGtDQUNFLEVBQUU7SUFBQSxvQ0FDRSxFQUFFO0lBQUEsd0NBQ1gsQ0FBQyxDQUFDO0VBQUE7RUFBQTtJQUFBO0lBQUEsT0FFdkIsZ0JBQWE7TUFDVCxJQUFJLENBQUNDLFVBQVUsRUFBRTtNQUNqQixJQUFJLENBQUNDLE9BQU8sR0FBRyxJQUFJO0lBQ3ZCO0VBQUM7SUFBQTtJQUFBLE9BRUQsaUJBQWM7TUFDVixJQUFJLENBQUNBLE9BQU8sR0FBRyxLQUFLO0lBQ3hCO0VBQUM7SUFBQTtJQUFBLE9BRUQsaUJBQWM7TUFDVixJQUFJLENBQUNDLFFBQVEsQ0FBQ0MsTUFBTSxHQUFHLENBQUM7TUFDeEIsSUFBSSxDQUFDQyxVQUFVLENBQUNELE1BQU0sR0FBRyxDQUFDO01BQzFCLElBQUksQ0FBQ0UsY0FBYyxHQUFHLENBQUMsQ0FBQztJQUM1QjtFQUFDO0lBQUE7SUFBQSxPQUVELG9CQUFXQyxJQUFZLEVBQWU7TUFDbEMsSUFBSUMsT0FBTyxHQUFHLElBQUlDLFdBQVcsQ0FBQyxJQUFJLEVBQUVGLElBQUksQ0FBQztNQUN6QyxJQUFJLENBQUNKLFFBQVEs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
