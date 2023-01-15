"use strict";

function _decorate(decorators, factory, superClass, mixins) { var api = _getDecoratorsApi(); if (mixins) { for (var i = 0; i < mixins.length; i++) { api = mixins[i](api); } } var r = factory(function initialize(O) { api.initializeInstanceElements(O, decorated.elements); }, superClass); var decorated = api.decorateClass(_coalesceClassElements(r.d.map(_createElementDescriptor)), decorators); api.initializeClassElements(r.F, decorated.elements); return api.runClassFinishers(r.F, decorated.finishers); }

function _getDecoratorsApi() { _getDecoratorsApi = function () { return api; }; var api = { elementsDefinitionOrder: [["method"], ["field"]], initializeInstanceElements: function (O, elements) { ["method", "field"].forEach(function (kind) { elements.forEach(function (element) { if (element.kind === kind && element.placement === "own") { this.defineClassElement(O, element); } }, this); }, this); }, initializeClassElements: function (F, elements) { var proto = F.prototype; ["method", "field"].forEach(function (kind) { elements.forEach(function (element) { var placement = element.placement; if (element.kind === kind && (placement === "static" || placement === "prototype")) { var receiver = placement === "static" ? F : proto; this.defineClassElement(receiver, element); } }, this); }, this); }, defineClassElement: function (receiver, element) { var descriptor = element.descriptor; if (element.kind === "field") { var initializer = element.initializer; descriptor = { enumerable: descriptor.enumerable, writable: descriptor.writable, configurable: descriptor.configurable, value: initializer === void 0 ? void 0 : initializer.call(receiver) }; } Object.defineProperty(receiver, element.key, descriptor); }, decorateClass: function (elements, decorators) { var newElements = []; var finishers = []; var placements = { static: [], prototype: [], own: [] }; elements.forEach(function (element) { this.addElementPlacement(element, placements); }, this); elements.forEach(function (element) { if (!_hasDecorators(element)) return newElements.push(element); var elementFinishersExtras = this.decorateElement(element, placements); newElements.push(elementFinishersExtras.element); newElements.push.apply(newElements, elementFinishersExtras.extras); finishers.push.apply(finishers, elementFinishersExtras.finishers); }, this); if (!decorators) { return { elements: newElements, finishers: finishers }; } var result = this.decorateConstructor(newElements, decorators); finishers.push.apply(finishers, result.finishers); result.finishers = finishers; return result; }, addElementPlacement: function (element, placements, silent) { var keys = placements[element.placement]; if (!silent && keys.indexOf(element.key) !== -1) { throw new TypeError("Duplicated element (" + element.key + ")"); } keys.push(element.key); }, decorateElement: function (element, placements) { var extras = []; var finishers = []; for (var decorators = element.decorators, i = decorators.length - 1; i >= 0; i--) { var keys = placements[element.placement]; keys.splice(keys.indexOf(element.key), 1); var elementObject = this.fromElementDescriptor(element); var elementFinisherExtras = this.toElementFinisherExtras((0, decorators[i])(elementObject) || elementObject); element = elementFinisherExtras.element; this.addElementPlacement(element, placements); if (elementFinisherExtras.finisher) { finishers.push(elementFinisherExtras.finisher); } var newExtras = elementFinisherExtras.extras; if (newExtras) { for (var j = 0; j < newExtras.length; j++) { this.addElementPlacement(newExtras[j], placements); } extras.push.apply(extras, newExtras); } } return { element: element, finishers: finishers, extras: extras }; }, decorateConstructor: function (elements, decorators) { var finishers = []; for (var i = decorators.length - 1; i >= 0; i--) { var obj = this.fromClassDescriptor(elements); var elementsAndFinisher = this.toClassDescriptor((0, decorators[i])(obj) || obj); if (elementsAndFinisher.finisher !== undefined) { finishers.push(elementsAndFinisher.finisher); } if (elementsAndFinisher.elements !== undefined) { elements = elementsAndFinisher.elements; for (var j = 0; j < elements.length - 1; j++) { for (var k = j + 1; k < elements.length; k++) { if (elements[j].key === elements[k].key && elements[j].placement === elements[k].placement) { throw new TypeError("Duplicated element (" + elements[j].key + ")"); } } } } } return { elements: elements, finishers: finishers }; }, fromElementDescriptor: function (element) { var obj = { kind: element.kind, key: element.key, placement: element.placement, descriptor: element.descriptor }; var desc = { value: "Descriptor", configurable: true }; Object.defineProperty(obj, Symbol.toStringTag, desc); if (element.kind === "field") obj.initializer = element.initializer; return obj; }, toElementDescriptors: function (elementObjects) { if (elementObjects === undefined) return; return _toArray(elementObjects).map(function (elementObject) { var element = this.toElementDescriptor(elementObject); this.disallowProperty(elementObject, "finisher", "An element descriptor"); this.disallowProperty(elementObject, "extras", "An element descriptor"); return element; }, this); }, toElementDescriptor: function (elementObject) { var kind = String(elementObject.kind); if (kind !== "method" && kind !== "field") { throw new TypeError('An element descriptor\'s .kind property must be either "method" or' + ' "field", but a decorator created an element descriptor with' + ' .kind "' + kind + '"'); } var key = _toPropertyKey(elementObject.key); var placement = String(elementObject.placement); if (placement !== "static" && placement !== "prototype" && placement !== "own") { throw new TypeError('An element descriptor\'s .placement property must be one of "static",' + ' "prototype" or "own", but a decorator created an element descriptor' + ' with .placement "' + placement + '"'); } var descriptor = elementObject.descriptor; this.disallowProperty(elementObject, "elements", "An element descriptor"); var element = { kind: kind, key: key, placement: placement, descriptor: Object.assign({}, descriptor) }; if (kind !== "field") { this.disallowProperty(elementObject, "initializer", "A method descriptor"); } else { this.disallowProperty(descriptor, "get", "The property descriptor of a field descriptor"); this.disallowProperty(descriptor, "set", "The property descriptor of a field descriptor"); this.disallowProperty(descriptor, "value", "The property descriptor of a field descriptor"); element.initializer = elementObject.initializer; } return element; }, toElementFinisherExtras: function (elementObject) { var element = this.toElementDescriptor(elementObject); var finisher = _optionalCallableProperty(elementObject, "finisher"); var extras = this.toElementDescriptors(elementObject.extras); return { element: element, finisher: finisher, extras: extras }; }, fromClassDescriptor: function (elements) { var obj = { kind: "class", elements: elements.map(this.fromElementDescriptor, this) }; var desc = { value: "Descriptor", configurable: true }; Object.defineProperty(obj, Symbol.toStringTag, desc); return obj; }, toClassDescriptor: function (obj) { var kind = String(obj.kind); if (kind !== "class") { throw new TypeError('A class descriptor\'s .kind property must be "class", but a decorator' + ' created a class descriptor with .kind "' + kind + '"'); } this.disallowProperty(obj, "key", "A class descriptor"); this.disallowProperty(obj, "placement", "A class descriptor"); this.disallowProperty(obj, "descriptor", "A class descriptor"); this.disallowProperty(obj, "initializer", "A class descriptor"); this.disallowProperty(obj, "extras", "A class descriptor"); var finisher = _optionalCallableProperty(obj, "finisher"); var elements = this.toElementDescriptors(obj.elements); return { elements: elements, finisher: finisher }; }, runClassFinishers: function (constructor, finishers) { for (var i = 0; i < finishers.length; i++) { var newConstructor = (0, finishers[i])(constructor); if (newConstructor !== undefined) { if (typeof newConstructor !== "function") { throw new TypeError("Finishers must return a constructor."); } constructor = newConstructor; } } return constructor; }, disallowProperty: function (obj, name, objectType) { if (obj[name] !== undefined) { throw new TypeError(objectType + " can't have a ." + name + " property."); } } }; return api; }

function _createElementDescriptor(def) { var key = _toPropertyKey(def.key); var descriptor; if (def.kind === "method") { descriptor = { value: def.value, writable: true, configurable: true, enumerable: false }; } else if (def.kind === "get") { descriptor = { get: def.value, configurable: true, enumerable: false }; } else if (def.kind === "set") { descriptor = { set: def.value, configurable: true, enumerable: false }; } else if (def.kind === "field") { descriptor = { configurable: true, writable: true, enumerable: true }; } var element = { kind: def.kind === "field" ? "field" : "method", key: key, placement: def.static ? "static" : def.kind === "field" ? "own" : "prototype", descriptor: descriptor }; if (def.decorators) element.decorators = def.decorators; if (def.kind === "field") element.initializer = def.value; return element; }

function _coalesceGetterSetter(element, other) { if (element.descriptor.get !== undefined) { other.descriptor.get = element.descriptor.get; } else { other.descriptor.set = element.descriptor.set; } }

function _coalesceClassElements(elements) { var newElements = []; var isSameElement = function (other) { return other.kind === "method" && other.key === element.key && other.placement === element.placement; }; for (var i = 0; i < elements.length; i++) { var element = elements[i]; var other; if (element.kind === "method" && (other = newElements.find(isSameElement))) { if (_isDataDescriptor(element.descriptor) || _isDataDescriptor(other.descriptor)) { if (_hasDecorators(element) || _hasDecorators(other)) { throw new ReferenceError("Duplicated methods (" + element.key + ") can't be decorated."); } other.descriptor = element.descriptor; } else { if (_hasDecorators(element)) { if (_hasDecorators(other)) { throw new ReferenceError("Decorators can't be placed on different accessors with for " + "the same property (" + element.key + ")."); } other.decorators = element.decorators; } _coalesceGetterSetter(element, other); } } else { newElements.push(element); } } return newElements; }

function _hasDecorators(element) { return element.decorators && element.decorators.length; }

function _isDataDescriptor(desc) { return desc !== undefined && !(desc.value === undefined && desc.writable === undefined); }

function _optionalCallableProperty(obj, name) { var value = obj[name]; if (value !== undefined && typeof value !== "function") { throw new TypeError("Expected '" + name + "' to be a function"); } return value; }

function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }

function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }

function _toArray(arr) { return _arrayWithHoles(arr) || _iterableToArray(arr) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

// https://babeljs.io/docs/en/babel-plugin-proposal-decorators
let MyClass = _decorate([annotation], function (_initialize) {
  class MyClass {
    constructor() {
      _initialize(this);
    }

  }

  return {
    F: MyClass,
    d: []
  };
});

function annotation(target) {
  target.annotated = true;
}

let MyClass2 = _decorate([isTestable(true)], function (_initialize2) {
  class MyClass2 {
    constructor() {
      _initialize2(this);
    }

  }

  return {
    F: MyClass2,
    d: []
  };
});

function isTestable(value) {
  return function decorator(target) {
    target.isTestable = value;
  };
}

let C = _decorate(null, function (_initialize3) {
  class C {
    constructor() {
      _initialize3(this);
    }

  }

  return {
    F: C,
    d: [{
      kind: "method",
      decorators: [enumerable(false), Reflect.metadata("design:type", Function), Reflect.metadata("design:paramtypes", [])],
      key: "method",
      value: function method() {}
    }]
  };
});

function enumerable(value) {
  return function (target, key, descriptor) {
    descriptor.enumerable = value;
    return descriptor;
  };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRlY29yYXRvcnMuanMiXSwibmFtZXMiOlsiTXlDbGFzcyIsImFubm90YXRpb24iLCJ0YXJnZXQiLCJhbm5vdGF0ZWQiLCJNeUNsYXNzMiIsImlzVGVzdGFibGUiLCJ2YWx1ZSIsImRlY29yYXRvciIsIkMiLCJlbnVtZXJhYmxlIiwia2V5IiwiZGVzY3JpcHRvciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7SUFHTUEsTyxjQURMQyxVO0FBQUQsUUFDTUQsT0FETixDQUNjO0FBQUE7QUFBQTtBQUFBOztBQUFBOzs7T0FBUkEsTzs7Ozs7QUFFTixTQUFTQyxVQUFULENBQW9CQyxNQUFwQixFQUE0QjtBQUN6QkEsRUFBQUEsTUFBTSxDQUFDQyxTQUFQLEdBQW1CLElBQW5CO0FBQ0Y7O0lBR0tDLFEsY0FETEMsVUFBVSxDQUFDLElBQUQsQztBQUFYLFFBQ01ELFFBRE4sQ0FDZTtBQUFBO0FBQUE7QUFBQTs7QUFBQTs7O09BQVRBLFE7Ozs7O0FBRU4sU0FBU0MsVUFBVCxDQUFvQkMsS0FBcEIsRUFBMkI7QUFDeEIsU0FBTyxTQUFTQyxTQUFULENBQW1CTCxNQUFuQixFQUEyQjtBQUMvQkEsSUFBQUEsTUFBTSxDQUFDRyxVQUFQLEdBQW9CQyxLQUFwQjtBQUNGLEdBRkQ7QUFHRjs7SUFFS0UsQztBQUFOLFFBQU1BLENBQU4sQ0FBUTtBQUFBO0FBQUE7QUFBQTs7QUFBQTs7O09BQUZBLEM7OzttQkFDSEMsVUFBVSxDQUFDLEtBQUQsQzs7YUFBWCxrQkFDUyxDQUFHOzs7OztBQUdkLFNBQVNBLFVBQVQsQ0FBb0JILEtBQXBCLEVBQTJCO0FBQ3pCLFNBQU8sVUFBVUosTUFBVixFQUFrQlEsR0FBbEIsRUFBdUJDLFVBQXZCLEVBQW1DO0FBQ3ZDQSxJQUFBQSxVQUFVLENBQUNGLFVBQVgsR0FBd0JILEtBQXhCO0FBQ0EsV0FBT0ssVUFBUDtBQUNGLEdBSEQ7QUFJRCIsInNvdXJjZXNDb250ZW50IjpbIi8vIGh0dHBzOi8vYmFiZWxqcy5pby9kb2NzL2VuL2JhYmVsLXBsdWdpbi1wcm9wb3NhbC1kZWNvcmF0b3JzXG5cbkBhbm5vdGF0aW9uXG5jbGFzcyBNeUNsYXNzIHsgfVxuXG5mdW5jdGlvbiBhbm5vdGF0aW9uKHRhcmdldCkge1xuICAgdGFyZ2V0LmFubm90YXRlZCA9IHRydWU7XG59XG5cbkBpc1Rlc3RhYmxlKHRydWUpXG5jbGFzcyBNeUNsYXNzMiB7IH1cblxuZnVuY3Rpb24gaXNUZXN0YWJsZSh2YWx1ZSkge1xuICAgcmV0dXJuIGZ1bmN0aW9uIGRlY29yYXRvcih0YXJnZXQpIHtcbiAgICAgIHRhcmdldC5pc1Rlc3RhYmxlID0gdmFsdWU7XG4gICB9XG59XG5cbmNsYXNzIEMge1xuICBAZW51bWVyYWJsZShmYWxzZSlcbiAgbWV0aG9kKCkgeyB9XG59XG5cbmZ1bmN0aW9uIGVudW1lcmFibGUodmFsdWUpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uICh0YXJnZXQsIGtleSwgZGVzY3JpcHRvcikge1xuICAgICBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSB2YWx1ZTtcbiAgICAgcmV0dXJuIGRlc2NyaXB0b3I7XG4gIH1cbn1cbiJdfQ==
