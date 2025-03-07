<!--
@component
Svelte action to initialize semantic UI `Modal` dialogue component.
(see detailed description in init-modal.svelte.d.ts )
-->
<svelte:options runes={true} />

<script lang="ts">
import type { Snippet } from "svelte";
import { onDestroy, onMount } from "svelte";

import type { ModalSettings, JQueryApi } from "../data/semantic-types";
import { compLog } from "../data/common";
import { findComponent, jQueryBySelector, nextUid } from "../data/dom-jquery";

const MODAL_PREFIX: string = "modal";

// region props -----------------------------------------------------------------------------------

interface Props {
    /** Two-way binding for setting and reading back modal dialog visibility */
    show: boolean;

    /** Settings for Semantic UI component, see https://fomantic-ui.com/modules/modal.html#/settings */
    settings?: ModalSettings;

    /** Id of the Semantic UI component, takes precedence over tag position */
    forId?: string;

    /** If InitModal is used as a parent, render the children components */
    children?: Snippet;
}

// region data ------------------------------------------------------------------------------------

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

interface ModalApi {
    modal(settings?: ModalSettings): void;
    modal(command: "is active"): boolean;
    modal(command: "show"): void;
    modal(command: "hide"): void;
    modal(command: "destroy"): void;
}
/** jQuery modal component */
let elem: (JQueryApi & ModalApi) | undefined = undefined;

// region svelte -> modal -------------------------------------------------------------------------

/** Propagate prop change to UI component */
function svelteToInput(value: boolean): void {
    if (!elem) {
        // effect and svelteToInput may be called before onMount()
        return;
    }
    if (value) {
        if (!elem.modal("is active")) {
            compLog.debug(`InitModal : show -> ${value}`);
            elem.modal("show");
        }
    } else {
        if (elem.modal("is active")) {
            compLog.debug(`InitModal : show -> ${value}`);
            elem.modal("hide");
        }
    }
}

$effect(() => {
    void show;
    svelteToInput(show);
});

// region modal -> svelte -------------------------------------------------------------------------

/** When modal is opened or closed by the user */
function inputToSvelte(newValue: boolean): void {
    if (newValue !== show) {
        compLog.debug(`InitModal : show <- ${newValue}`);
        show = newValue;
    }
}

// eslint-disable-next-line no-undef
function onModalShow(this: JQuery<HTMLElement>): void {
    // const def: ModalSettings = modalDefaults.read();
    // if (def.onShow) {
    //     def.onShow.call(this);
    // }
    if (settings && settings.onShow) {
        settings.onShow.call(this);
    }
    inputToSvelte(true);
}

// eslint-disable-next-line no-undef
function onModalHidden(this: JQuery<HTMLElement>): void {
    // const def: ModalSettings = modalDefaults.read();
    // if (def.onHidden) {
    //     def.onHidden.call(this);
    // }
    if (settings && settings.onHidden) {
        settings.onHidden.call(this);
    }
    inputToSvelte(false);
}

// region init ------------------------------------------------------------------------------------

onMount(async () => {
    // Initialize Semantic component and subscribe for changes
    elem = findComponent(span!, ".ui.modal", forId);
    if (!elem.modal) {
        throw new Error("Semantic UI modal is not initialized");
    }
    // ensure modal has an id
    let modalId: string | undefined = elem.attr("id");
    if (!modalId) {
        modalId = `${MODAL_PREFIX}_${nextUid()}`;
        elem.attr("id", modalId);
    }
    elem.modal({
        ...settings,
        onShow: onModalShow,
        onHidden: onModalHidden,
    });

    // IMPORTANT: the element has been moved in dom, find i't new location
    elem = jQueryBySelector(`#${modalId}`);

    svelteToInput(show);
});

onDestroy(() => {
    if (elem) {
        elem.modal("hide");
        elem.modal("destroy");

        // IMPORTANT: elem must be removed from DOM using jQuery, as svelte has lost track of it
        elem.remove();
    }
});
</script>

<span class="InitModal" style:display={children ? "contents" : "none"} bind:this={span}
    >{@render children?.()}</span
>

<style>
</style>
