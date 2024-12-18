<!--
@component
Svelte action to initialize semantic UI `Modal` dialogue component.
(see detailed description in init-modal.svelte.d.ts )
-->
<svelte:options runes={true} />

<script lang="ts">
import { onDestroy, onMount, tick, type Snippet } from "svelte";

import type { ModalSettings, JQueryApi } from "../data/semantic-types";
import { findComponent, jQueryElemById, uid } from "../data/common";
import { modalDefaults } from "../data/settings";

interface Props {
    show: boolean;
    settings?: ModalSettings;
    forId?: string;
    children?: Snippet;
}

// REACTIVE -------------------------------------------------------------------
/* eslint-disable prefer-const */

let {
    show = $bindable(false),
    settings = undefined,
    forId = undefined,
    children = undefined,
}: Props = $props();

/** Invisible dom element created by this component. */
let span: Element | undefined = undefined; // $state();

/* eslint-enable */

// DATA -----------------------------------------------------------------------

type ModalApi = {
    modal(settings?: ModalSettings): void;
    modal(command: string): unknown;
};
/** jQuery modal component */
let elem: (JQueryApi & ModalApi) | undefined = undefined;

// FUNCTIONS ------------------------------------------------------------------

/** Propagate prop change to UI component */
function svelteToInput(value: boolean): void {
    if (!elem) {
        // effect and svelteToInput may be called before onMount()
        return;
    }
    if (value) {
        if (!elem.modal("is active")) {
            elem.modal("show");
        }
    } else {
        if (elem.modal("is active")) {
            elem.modal("hide");
        }
    }
}

$effect(() => {
    void show;
    svelteToInput(show);
});

//-----------------------------------------------------------------------------

/** When modal is opened or closed by the user */
function inputToSvelte(newValue: boolean): void {
    if (newValue !== show) {
        console.debug(`InitModal show <- ${newValue}`);
        show = newValue;
    }
}

// eslint-disable-next-line no-undef
function onModalShow(this: JQuery<HTMLElement>): void {
    const def: ModalSettings = modalDefaults.read();
    if (def.onShow) {
        def.onShow.call(this);
    }
    if (settings && settings.onShow) {
        settings.onShow.call(this);
    }
    inputToSvelte(true);
}

// eslint-disable-next-line no-undef
function onModalHidden(this: JQuery<HTMLElement>): void {
    const def: ModalSettings = modalDefaults.read();
    if (def.onHidden) {
        def.onHidden.call(this);
    }
    if (settings && settings.onHidden) {
        settings.onHidden.call(this);
    }
    inputToSvelte(false);
}

onMount(async () => {
    // delay initialization till all DOM UI elements are ready
    await tick();

    // Initialize Semantic component and subscribe for changes
    elem = findComponent(span!, ".ui.modal", forId) as JQueryApi & ModalApi;
    if (!elem.modal) {
        throw new Error("Semantic UI modal is not initialized");
    }
    // ensure modal has an id
    let modalId: string | undefined = elem.attr("id");
    if (!modalId) {
        modalId = `modal_${uid()}`;
        elem.attr("id", modalId);
    }
    elem.modal({
        ...settings,
        onShow: onModalShow,
        onHidden: onModalHidden,
    });
    // the element has been moved in dom, find i't new location
    elem = jQueryElemById(modalId);

    svelteToInput(show);
});

onDestroy(() => {
    if (elem) {
        console.debug("InitModal - destroy", elem);
        elem.modal("hide");
        elem.modal("destroy");
        // IMPORTANT: elem must be removed from DOM using jQuery, as svelte has lost track of it
        elem.remove();
    }
});
</script>

<span class="InitModal" bind:this={span}>{@render children?.()}</span>

<style>
</style>
