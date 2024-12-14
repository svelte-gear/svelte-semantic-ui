/**
 * Svelte action to initialize semantic checkbox component.
 * @module components/use-checkbox
 */

import type { CheckboxSettings, JQueryApi } from "../data/semantic-types";
import { jQueryElem } from "../data/common";
import { getOrAssignKey } from "../data/field-controller";

/** Svelte action to initialize Semantic UI Checkbox component.
 *
 * https://semantic-ui.com/modules/checkbox.html
 *
 * Bind directly to the input ```bind:checked```.
 *
 * Example:
```
    <div class="ui checkbox" use:checkbox>
        <input type="checkbox" id="ch" bind:checked={agree} />
        <label for="ch">Agree to terms and Conditions</label>
    </div>
```
Svelte allows to bind checkbox ands radio inputs in two different ways:
```
    <input type="checkbox" bind:checked={boolVal} />
    <input type="radio" bind:checked={boolValTwo} />

    <input type="checkbox" bind:group={arrayVal} />
    <input type="radio" bind:group={strVal} />
```
*/
export function checkbox(node: Element, settings?: CheckboxSettings): void {
    type CheckboxInitializer = JQueryApi & {
        checkbox(settings?: CheckboxSettings): void;
    };
    const elem: CheckboxInitializer = jQueryElem(node) as CheckboxInitializer;
    if (!elem.checkbox) {
        throw new Error("Semantic checkbox is not initialized");
    }
    elem.checkbox({
        // ...checkboxDefaults,
        ...settings,
    });

    // make sure the field has an id
    getOrAssignKey(elem);
}
