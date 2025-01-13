/**
 * Imperative (procedural) function to display Semantic UI `Toast` component.
 * @module components/proc-toast
 */

import type { ToastSettings, JQueryApi } from "../data/semantic-types";
import { jQueryElem } from "../data/dom-jquery";

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
