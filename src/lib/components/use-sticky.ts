/**
 * Svelte action to initialize semantic sticky component.
 * @module components/use-sticky
 */

import type { JQueryApi } from "../data/common";
import { jQueryElem } from "../data/common";

export interface StickySettings {
    [key: string]: unknown;
}

export const stickyDefaults: StickySettings = {};

/** Svelte action to initialize Semantic UI Sticky component.
 *
 * https://semantic-ui.com/modules/sticky.html
 *
 * By defult attaches itself to the parent component.
 *
 * Example:
```
    <form class="ui form">
        <div class="ui right rail">
            <div class="ui segment sticky" use:sticky={{ offset: 10 }}>
                <div class="ui message">...</div>
                <button class="ui button red" on:click={reset}>Reset</button>
            </div>
        </div>
        ...
    </form>
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
        ...stickyDefaults,
        ...settings,
    });
}
