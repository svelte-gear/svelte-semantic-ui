/**
 * Svelte action to initialize Semantic UI `Sticky` component.
 * @module components/use-sticky
 */

import type { JQueryApi } from "../data/dom-jquery";
import type { StickySettings } from "../data/semantic-types";
import { jQueryElem } from "../data/dom-jquery";

/** Svelte action to initialize Semantic UI `Sticky` component.

https://fomantic-ui.com/modules/sticky.html

By default attaches itself to the parent component.
```
    <div class="ui right rail">
        <div class="ui segment sticky" use:sticky={{ offset: 10 }}>
            <div class="ui message">...</div>
            <button class="ui button red" on:click={reset}>Reset</button>
        </div>
    </div>
```
*/
export function sticky(node: Element, settings?: StickySettings): void {
    type StickyInitializer = JQueryApi & {
        sticky(settings?: StickySettings): void;
    };
    const elem: StickyInitializer = jQueryElem(node) as StickyInitializer;
    if (!elem.sticky) {
        throw new Error("Semantic sticky is not initialized");
    }
    elem.sticky({
        // ...stickyDefaults,
        ...settings,
    });
}
