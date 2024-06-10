/**
 * Svelte action to initialize semantic popup component.
 * @module components/use-popup
 */

import type { PopupSettings } from "$lib/data/semantic-types";
import type { JQueryApi } from "../data/common";
import { jQueryElem, SettingsHelper } from "../data/common";

export const popupDefaults: SettingsHelper<PopupSettings> = new SettingsHelper("popup");

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
