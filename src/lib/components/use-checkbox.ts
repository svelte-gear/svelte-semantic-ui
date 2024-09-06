/**
 * Svelte action to initialize semantic checkbox component.
 * @module components/use-checkbox
 */

import type { CheckboxSettings } from "../data/semantic-types";
import type { JQueryApi } from "../data/common";
import { SettingsHelper } from "../data/settings";
import { jQueryElem } from "../data/common";

export const checkboxDefaults: SettingsHelper<CheckboxSettings> = new SettingsHelper("checkbox");

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
        // ...checkboxDefaults,
        ...settings,
    });
}
