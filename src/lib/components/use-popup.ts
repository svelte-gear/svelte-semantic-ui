/**
 * Svelte action to initialize Semantic UI `Popup` component.
 * @module components/use-popup
 */

import type { ActionReturn } from "svelte/action";

import type { JQueryApi } from "../data/dom-jquery";
import type { PopupSettings } from "../data/semantic-types";
import { jQueryElem } from "../data/dom-jquery";

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
export function popup(node: Element, settings?: PopupSettings): ActionReturn {
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

    return {
        destroy(): void {
            elem.popup("destroy");
        },
    };
}
