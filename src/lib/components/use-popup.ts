// use-popup.ts

import type { JQueryApi } from "../data/_common";
import { jQueryElem } from "../data/_common";

type PopupSettings = {
    [key: string]: unknown;
};

export const popupDefaults: PopupSettings = {};

/** Svelte action to initialize Semantic UI `Popup` component.
 *
 * https://semantic-ui.com/modules/popup.html
 *
 * Supply popup parameters using a settings object or throught data-* attributes.
 *
 * Example:
```
    <input type="text" bind:value={nm2}
        use:popup={{
            content: "Please enter given name",
            position: "bottom right"
        }}
    >
```
*/
export function popup(node: Element, settings?: PopupSettings): void {
    type PopupInitializer = {
        popup(settings?: PopupSettings): void;
    };
    const elem = jQueryElem(node) as JQueryApi & PopupInitializer;
    if (!elem.popup) {
        throw new Error("Semantic popup is not initialized");
    }
    elem.popup({
        ...popupDefaults,
        ...settings,
    });
}
