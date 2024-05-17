/**
 * Svelte action to initialize semantic checkbox component.
 * @module components/use-checkbox
 */

import type { JQueryApi } from "../data/common";
import { jQueryElem } from "../data/common";

export interface CheckboxSettings {
    [key: string]: unknown;
}

export const checkboxDefaults: CheckboxSettings = {};

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
        ...checkboxDefaults,
        ...settings,
    });
}
