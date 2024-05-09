/**
 * Svelte action to attach fomatter to an input.
 * @module components/use-format
 */

import { get, writable } from "svelte/store";

import type { ActionReturnType, DataController, DataTypes, Formatter } from "../data/common";
import { equalDataTypes, SVELTE_DATA_STORE, uid, jQueryElem } from "../data/common";

/*
 .8888b                                         dP
 88   "                                         88
 88aaa  .d8888b. 88d888b. 88d8b.d8b. .d8888b. d8888P
 88     88'  `88 88'  `88 88'`88'`88 88'  `88   88
 88     88.  .88 88       88  88  88 88.  .88   88
 dP     `88888P' dP       dP  dP  dP `88888P8   dP

*/

/**
 * Initializes Semantic UI input, adds Svelte store to hold the value.
 * So `<Data bind:value={...} />` works inside an `<inpit>`.
 *
 * If formatter implemnent parse(), the value is parsed, otherwise it is a formatted.
 *
 * Example:
```
   <input class="ui input" use:format={uppercaseFormatter}>
        <Data bind:value={num} />
        ...
   </select>
```
 */
export function format(node: Element, fmt: Formatter): ActionReturnType {
    const elem = jQueryElem(node);
    const tagName = elem.prop("tagName");
    if (!["INPUT", "TEXTAREA"].includes(tagName)) {
        throw new Error(
            `use:format may only be used on <input> or <textarea> element, but found on ${tagName}`
        );
    }

    // create store to push data back to the binder
    const ctrl: DataController<DataTypes> = {
        uid: uid(),
        mode: "input",
        store: writable(),

        /** Push value into the input */
        doUpdate(value: DataTypes) {
            if (value !== get(this.store)) {
                this.store.set(value);
            }
            const curValue = elem.val();
            const newValue = fmt.format(value);
            if (/*newValue &&*/ newValue !== curValue) {
                console.debug(`  update(${this.uid}) -> input = ${newValue}`);
                elem.val(newValue ?? "");
            }
        },

        /** Return updated value from the input */
        onChange(text: DataTypes) {
            console.debug(`  onChange(${this.uid}) = ${text}`);
            const newValue = fmt.parse ? fmt.parse(text as string) : text;
            const value = get(this.store);
            if (!equalDataTypes(newValue, value)) {
                console.debug(`  store(${this.uid}) <- input = ${newValue}`);
                this.store.set(newValue);
            }
            this.doUpdate(newValue);
        },
    };

    // onChange event handler
    function formatElement() {
        const val = elem.val();
        ctrl.onChange(val);
    }

    elem.on("change", null, formatElement);

    // Attach store holder to jQuery element
    console.debug(`  store(${ctrl.uid}) - ${ctrl.mode} created`);
    elem.data(SVELTE_DATA_STORE, ctrl);

    return {
        destroy() {
            elem.off("change", null, formatElement);
        },
    };
}
