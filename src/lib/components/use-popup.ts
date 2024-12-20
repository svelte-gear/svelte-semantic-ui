/**
 * Svelte action to initialize Semantic UI `Popup` component.
 * @module components/use-popup
 */

import type { PopupSettings, JQueryApi } from "../data/semantic-types";
import { jQueryElem } from "../data/common";

/** Svelte action to initialize Semantic UI `Popup` component.

https://semantic-ui.com/modules/popup.html

Supply popup parameters using a settings object or through data-* attributes.
```
    <input type="text" bind:value={name2}
        use:popup={{
            content: "Please enter given name",
            position: "bottom right"
        }}
    >
```
*/
export function popup(node: Element, settings?: PopupSettings): void {
    type PopupInitializer = JQueryApi & {
        popup(settings?: PopupSettings): void;
    };
    const elem: PopupInitializer = jQueryElem(node) as PopupInitializer;
    if (!elem.popup) {
        throw new Error("Semantic popup is not initialized");
    }
    elem.popup({
        // ...popupDefaults,
        ...settings,
    });
}
