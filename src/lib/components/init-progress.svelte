<!--
@component
Svelte data binder and initializer for Semantic-UI `Progress` components.
(see detailed description in init-progress.svelte.d.ts )
-->
<svelte:options runes={true} />

<script lang="ts">
import type { Snippet } from "svelte";
import { onMount, onDestroy, tick } from "svelte";

import type { JQueryApi, ProgressSettings } from "../data/semantic-types";
import { arrayToString } from "../data/common";
import { findComponent } from "../data/dom-jquery";

// region props -----------------------------------------------------------------------------------

interface Props {
    /** Parameter for setting the current progress value */
    value: number | number[];

    /** Parameter for setting the bar total. Default to 100 */
    total?: number;

    /** Settings for Semantic UI component, see https://fomantic-ui.com/modules/progress.html#/settings */
    settings?: ProgressSettings;

    /** Id of the Semantic UI component, takes precedence over tag position */
    forId?: string;

    /** If InitProgress is used as a parent, render the children components */
    children?: Snippet;
}

// region data ------------------------------------------------------------------------------------

/* eslint-disable prefer-const */

let {
    value,
    total,
    settings = undefined,
    forId = undefined,
    children = undefined,
}: Props = $props();

/** Invisible dom element created by this component. */
let span: Element;

/* eslint-enable */

interface ProgressApi {
    progress(settings: ProgressSettings): void;
    progress(command: "get total"): number;
    progress(command: "set total", totalVal: number): void;
    progress(command: "set progress", progressVal: number | number[]): void;
    progress(command: "update progress", progressVal: number | number[]): void;
}
/** jQuery progress component */
let elem: JQueryApi & ProgressApi;

/** Does this progress have multiple bars */
let multiple: boolean = false;

// region svelte -> progress ----------------------------------------------------------------------

/** Propagate prop change to UI component */
function svelteToInput(newValue: number | number[], newTotal: number | undefined): void {
    const currTotal: number = elem.progress("get total");
    if (newTotal && newTotal !== currTotal) {
        elem.progress("set total", newTotal);
    }
    // compLog.log(`Progress : value -> ${arrayToString(newValue)}`);
    elem.progress("set progress", newValue);
    // TODO: compare with current if not multiple
}

/** The effect rune calls svelteToInput when prop value or total changes */
$effect(() => {
    void value;
    void total;
    // trigger effect on array element change if array wasn't assigned after init
    if (Array.isArray(value)) {
        if (value.length > 0) {
            void value[0];
        }
        for (let i: number = 0; i < value.length; i++) {
            void value[i];
        }
    }
    if (!elem) {
        return; // effect may be called before onMount
    }
    svelteToInput(value, total);
});

// region init ------------------------------------------------------------------------------------

onMount(async () => {
    // delay initialization. only to be consistent with other Init components
    await tick();

    // Initialize Semantic component and subscribe for changes
    elem = findComponent(span!, ".ui.progress", forId) as JQueryApi & ProgressApi;
    if (!elem.progress) {
        throw new Error("Semantic Progress is not initialized");
    }
    elem.progress(settings);

    // check if it is a single value or range input
    multiple = elem.hasClass("multiple");
    if (multiple && !Array.isArray(value)) {
        throw new Error(
            `Multi-bar Progress slider has a number[] 'value', got ${arrayToString(value)}`
        );
    }
    if (!multiple && Array.isArray(value)) {
        throw new Error(
            `Progress has a number 'value', got ${arrayToString(value)}, did you forget to add 'multiple' class?`
        );
    }

    // push initial value into the Semantic UI element, required for slider as it has 0 as default
    svelteToInput(value, total);
});

/** Remove the subscription */
onDestroy(() => {
    if (elem) {
        elem.progress("destroy");
    }
});
</script>

<span class="InitProgress" style:display={children ? "contents" : "none"} bind:this={span}
    >{@render children?.()}</span
>

<style>
</style>
