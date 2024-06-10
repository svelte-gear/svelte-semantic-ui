/**
 * Imperative (procedural) function to display fomantic 'toast' component.
 * @module components/proc-toast
 */

import type { ToastSettings } from "../data/semantic-types";
import type { JQueryApi } from "../data/common";
import { SettingsHelper } from "../data/common";
import { jQueryElem } from "../data/common";

/*
   dP                                dP
   88                                88
 d8888P .d8888b. .d8888b. .d8888b. d8888P
   88   88'  `88 88'  `88 Y8ooooo.   88
   88   88.  .88 88.  .88       88   88
   dP   `88888P' `88888P8 `88888P'   dP

*/

/** Default toast settings */
export const toastDefaults: SettingsHelper<ToastSettings> = new SettingsHelper("toast");

/** Imperative function to display Semantic UI Toast component.
 *
 * https://fomantic-ui.com/modules/toast.html
 *
 * Example:
```
    <script>
        toast({
            class: 'success',
            title: 'Better?',
            message: `You're using the good framework!`,
            displayTime: 5000,
        });
    <script>
```
*/
export function toast(settings?: ToastSettings): void {
    console.debug("toast - created");
    type ToastInitializer = JQueryApi & {
        toast(settings?: ToastSettings): void;
    };
    const body: ToastInitializer = jQueryElem(document.body) as ToastInitializer;
    if (!body.toast) {
        throw new Error("Semantic toast is not initialized");
    }
    body.toast({
        // ...toastDefaults,
        ...settings,
    });
}
