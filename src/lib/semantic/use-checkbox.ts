// use-actions.ts

import type { JQueryApi } from "./common";
import { jQueryElem } from "./common";

type CheckboxSettings = {
   [key: string]: unknown;
};

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
   type CheckboxInitializer = {
      checkbox(settings?: CheckboxSettings): void;
   };
   const elem = jQueryElem(node) as JQueryApi & CheckboxInitializer;
   if (!elem.checkbox) {
      throw new Error("Semantic checkbox is not initialized");
   }
   elem.checkbox({
      ...checkboxDefaults,
      ...settings
   });
}
