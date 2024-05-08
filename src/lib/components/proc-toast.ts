// proc-toast.ts

import type { JQueryApi } from "../data/_common";
import { jQueryElem } from "../data/_common";

/*
   dP                                dP
   88                                88
 d8888P .d8888b. .d8888b. .d8888b. d8888P
   88   88'  `88 88'  `88 Y8ooooo.   88
   88   88.  .88 88.  .88       88   88
   dP   `88888P' `88888P8 `88888P'   dP

*/

export interface ToastSettings {
    message?: string;
    [key: string]: unknown;
}

/** Default toast settings */
export const toastDefaults: ToastSettings = {};

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
    type ToastInitializer = {
        toast(settings?: ToastSettings): void;
    };
    const body = jQueryElem(document.body) as JQueryApi & ToastInitializer;
    if (!body.toast) {
        throw new Error("Semantic toast is not initialized");
    }
    body.toast({
        ...toastDefaults,
        ...settings,
    });
}
