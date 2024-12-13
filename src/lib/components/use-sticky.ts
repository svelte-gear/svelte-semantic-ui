/**
 * Svelte action to initialize semantic sticky component.
 * @module components/use-sticky
 */

import type { StickySettings, JQueryApi } from "../data/semantic-types";
import { jQueryElem } from "../data/common";

/** Svelte action to initialize Semantic UI Sticky component.

https://fomantic-ui.com/modules/sticky.html

By defult attaches itself to the parent component.
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

    // FIXME: do i need to remove it if hidden ?
}
