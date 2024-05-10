/**
 * Svelte action to initialize semantic dropdown component.
 * @module components/use-dropdown
 */

import { get, writable } from "svelte/store";

import type { ActionReturnType, JQueryApi, DataController } from "../data/common";
import { jQueryElem, equalDataTypes, uid, SVELTE_DATA_STORE } from "../data/common";

const DROPDOWN_PREVENT_CLEARING_BAD_DATA = false;

export interface DropdownSettings {
    [key: string]: unknown;
}

export const dropdownDefaults: DropdownSettings = {};

type DropdownApi = {
    dropdown(options?: DropdownSettings): void;
    dropdown(command: string, arg1?: unknown): unknown;
};

/**
 * Initializes Semantic UI Dropdown component. Takes settings object as argument.
 *
 * https://semantic-ui.com/modules/dropdown.html#/settings
 *
 * Bind using `<Data bind:selected` inside the component tag.
 *
 * Example:
```
   <select class="ui selection dropdown" use:dropdown={{ clearable: true }}>
        <Data bind:selected={num} />
        ...
   </select>
```
 * For select-based component use standard labels.
 * For div-based dropdowns use `<label for="_"` inside the parent `<div class="field"`.
 *
 * NOTE: For multi-select, options will be removed and added one at a time,
 * causing multiple updates.
 * Though Svelte reaction is able to join consequitive updates into one, an additional update from
 * the component will be registered anyway. 'Confirming' values back, even if they didn't change.
 * If value is not in the list, it will be removed (not added).
*/
export function dropdown(node: Element, settings?: DropdownSettings): ActionReturnType {
    const elem = jQueryElem(node) as JQueryApi & DropdownApi;
    if (!elem.dropdown) {
        throw new Error("Semantic UI is not initialized");
    }

    /*
            dP
            88
 .d8888b. d8888P .d8888b. 88d888b. .d8888b.
 Y8ooooo.   88   88'  `88 88'  `88 88ooood8
       88   88   88.  .88 88       88.  ...
 `88888P'   dP   `88888P' dP       `88888P'

    */

    // create store to push data back to the binder
    const holder: DataController<string | string[]> = {
        uid: uid(),
        mode: "dropdown",
        store: writable(),

        /** Push value into the dropdown. */
        doUpdate(value: string | string[]) {
            const curValue = elem.dropdown("get value") as string | string[];
            if (Array.isArray(value)) {
                // multi-select
                if (value && !equalDataTypes(value, curValue)) {
                    console.debug(`  update(${this.uid}) -> dropdown = ${value}`);
                    // use 'set exactly' instead of 'set selected'!!!
                    elem.dropdown("set exactly", value);
                }
            } else {
                //single-select
                if (curValue !== value) {
                    console.debug(`  update(${this.uid}) -> dropdown = ${value}`);
                    // elem.dropdown("set selected", value);
                    const exists = elem.dropdown("get item", value);
                    if (exists) {
                        elem.dropdown("set selected", value);
                    } else {
                        // if value is invalid - clear the dropdown
                        elem.dropdown("clear");
                    }
                }
            }
        },

        /** Return updated value from the dropdown */
        onChange(newValue: string | string[]) {
            console.debug(`  onChange(${this.uid}) = ${newValue}`);
            if (Array.isArray(newValue)) {
                // multi-select
                const value = get(this.store) as string[];
                if (!value || !equalDataTypes(value, newValue)) {
                    console.debug(`  store(${this.uid}) <- dropdown = [${newValue}]`);
                    this.store.set(newValue);
                }
            } else {
                // single-select
                const value = get(this.store) as string;
                if (value !== newValue) {
                    console.debug(`  store(${this.uid}) <- dropdown = ${newValue}`);
                    if (DROPDOWN_PREVENT_CLEARING_BAD_DATA) {
                        const exists = elem.dropdown("get item", newValue);
                        if (exists) {
                            this.store.set(newValue);
                        }
                    } else {
                        this.store.set(newValue);
                    }
                }
            }
        },
    };

    /*
                                       dP
                                       88
 .d8888b. dP   .dP .d8888b. 88d888b. d8888P
 88ooood8 88   d8' 88ooood8 88'  `88   88
 88.  ... 88 .88'  88.  ... 88    88   88
 `88888P' 8888P'   `88888P' dP    dP   dP

    */

    type OnChangeFn = (newValue: string | string[], text: string, choice: string) => void;

    function onDropdownChange(newValue: string | string[], text: string, choice: string): void {
        if (dropdownDefaults.onChange) {
            (dropdownDefaults.onChange as OnChangeFn)(newValue, text, choice);
        }
        if (settings && settings.onChange) {
            (settings.onChange as OnChangeFn)(newValue, text, choice);
        }
        holder.onChange(newValue);
    }

    /*
 oo          oo   dP
                  88
 dP 88d888b. dP d8888P
 88 88'  `88 88   88
 88 88    88 88   88
 dP dP    dP dP   dP

    */

    // Initialize Semantic component
    elem.dropdown({
        ...dropdownDefaults,
        ...settings,
        onChange: onDropdownChange,
    });

    // Attach store holder to jQuery element
    console.debug(`  store(${holder.uid}) - ${holder.mode} created`);
    elem.data(SVELTE_DATA_STORE, holder);

    // show dropdown on label click, if for="_"
    function handleClick(): void {
        elem.dropdown("show");
    }
    const field = elem.parent().filter(".field");
    const labelFor = field.find("label").prop("for");
    if (labelFor === "_") {
        field.on("click", "label", handleClick);
        return {
            destroy() {
                field.off("click", "label", handleClick);
            },
        };
    }
    // return {
    //     destroy() {
    //         console.debug("  action - destroy");
    //         const field = elem.parent().filter(".field");
    //         const labelFor = field.find("label").prop("for");
    //         if (labelFor === "_") {
    //             field.off("click", "label", handleClick);
    //         }
    //     },
    // };
}
