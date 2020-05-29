import Dropdown from "../controls/Dropdown";
import NativeApp from "Native/App";

export default class ParametersEditor {
    haveSelected: boolean = false;
    developer: boolean = false;
    visible: boolean = false;
    sections: MenuSection[] = [];
    parameters: MenuParameter[] = [];
    mappedSections: {} = {};

    open(): void {
        this.filterMenu();
        this.visible = true;
    }

    close(): void {
        this.visible = false;
    }

    clear(): void {
        this.sections.length = 0;
        this.parameters.length = 0;
        this.mappedSections = {};
    }

    addSection(name: string): MenuSection {
        var section = new MenuSection(this, name);
        this.sections.push(section);
        this.mappedSections[name] = section;
        return section;
    }

    filterMenu(developer?: boolean): void {
        if (developer === undefined)
            developer = this.developer;

        for (var i = 0; i < this.sections.length; i++) {
            this.sections[i].visible = false;

            for (var j = 0; j < this.sections[i].parameters.length; j++) {
                this.sections[i].parameters[j].visible = !this.sections[i].parameters[j].developer || developer;
                
                if (this.sections[i].parameters[j].visible)
                    this.sections[i].visible = true;
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

    onSelected(arg: MenuSection): void {
        this.parameters = arg.parameters;
        this.haveSelected = true;

        for (var i = 0; i < this.sections.length; i++)
            this.sections[i].selected = this.sections[i] === arg;

        NativeApp.queryEntityParameters(arg.name);
    }

    developerChanged(arg: any): void {
        this.filterMenu(arg.value);
    }

    onEntityParameter(section: string, parameter: string, value: string): void {
        if (!this.mappedSections[section] ||
            !this.mappedSections[section].mappedParameters[parameter])
            return;

        this.mappedSections[section].mappedParameters[parameter].resetValue(value);
    }
}

type Value = string | boolean;

interface Data {
    value: Value;
}

interface Item {
    name: string;
}

// Dynamic menu parameters
class MenuParameter {
    section: MenuSection;
    key: string;
    developer: boolean;
    name: string;
    units: string;
    type: string;
    dropdown: Dropdown<Item>;
    value: Value;
    oldValue: Value;
    dirty: boolean;
    even: boolean;
    visible: boolean;

    constructor(section: MenuSection, name: string, type: string, visibility: string, defaultValue: string, dropdownValues: string, units: string) {
        this.section = section;
        this.key = name;
        this.developer = visibility == "developer";
        this.name = name;
        this.units = units;

        if (dropdownValues) {
            this.type = "dropdown";
            this.dropdown = new Dropdown((value: Item) => {
                if (this.value === value.name)
                    return;

                this.value = value.name;
                this.valueChanged({value: value.name});
            });
            var array = dropdownValues.split(",");

            for (var i = 0; i < array.length; i++) {
                var item = {name: array[i].trim()};
                this.dropdown.items.push(item);
            }
        } else if (type == "real") {
            this.type = "decimal";
        } else if (type == "integer") {
            this.type = "integer";
        } else if (type == "boolean") {
            this.type = "switch";
        } else { // list:real || matrix || list:integer || ...
            this.type = "text";
        }

        this.resetValue(defaultValue);
    }

    resetValue(value: string): void {
        if (this.type == "switch")
            this.value = value == "1" || value && value.toLowerCase() == "true";
        else
            this.value = value;

        if (this.type == "dropdown")
            for (var i = 0; i < this.dropdown.items.length; i++)
                if (this.dropdown.items[i].name == this.value)
                    this.dropdown.select(this.dropdown.items[i]);

        this.oldValue = this.value;
        //console.log("reset " + this.section.name + "/" + this.key + " = " + this.value);
    }

    valueChanged(arg: Data): void {
        // Defer applying text or number values to DUNE until focusLost(),
        // avoiding sending new values every time a new character is typed.
        if (this.type == "text" || this.type == "number")
            this.dirty = true;
        else
            this.applyValue(arg.value);
    }

    focusLost(): void {
        if (this.dirty)
            this.applyValue(this.value);
    }

    applyValue(value: Value): void {
        this.dirty = false;

        if (this.oldValue == value)
            return;

        this.oldValue = value;
        //console.log("apply " + this.section.name + "/" + this.key + " = " + value);
        NativeApp.setEntityParameter(this.section.name, this.key, value);
    }
}

class MenuSection {
    editor: ParametersEditor;
    name: string;
    visible: boolean = true;
    selected: boolean = false;
    parameters: MenuParameter[] = [];
    mappedParameters: {} = {};

    constructor(editor: ParametersEditor, name: string) {
        this.editor = editor;
        this.name = name;
    }

    addParameter(name: string, type: string, visibility: string, defaultValue: string, dropdownValues: string, units: string): MenuParameter {
        var parameter = new MenuParameter(this, name, type, visibility, defaultValue, dropdownValues, units);
        this.parameters.push(parameter);
        this.mappedParameters[name] = parameter;
        parameter.even = this.parameters.length % 2 == 0;
        return parameter;
    }

    onSelect(): void {
        this.editor.onSelected(this);
    }
}
