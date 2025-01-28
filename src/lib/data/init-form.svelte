<!--
@component
Provides Svelte bindings for Semantic-UI `Form` validator.
(see detailed description in init-form.svelte.d.ts )
-->
<svelte:options runes={true} />

<script lang="ts">
/**
 * Svelte Component &lt;InitForm&gt;
 * @module data/Svelte::InitForm
 */

import type { Snippet } from "svelte";
import { onMount, onDestroy } from "svelte";

import type { FormSettings, JQueryApi } from "../data/semantic-types";
import type { FormApi } from "../data/form-controller";
import { SuiFormController } from "../data/form-controller";
import { equalStringArrays } from "../data/common";
import {
    findComponent,
    jQueryElem,
    SVELTE_FORM_STORE,
    getComponentInitMode,
    ensureFieldKey,
    nextUid,
} from "../data/dom-jquery";
// import { formDefaults } from "../data/settings";

interface Props {
    /** Determines if any field change will cause form re-validation;
     *  `valid` and `errors` bindings are readable only if `active` == true */
    active?: boolean;

    /** Determines if empty fields are validated or not. */
    ignoreEmpty?: boolean;

    /** Read-only binding indicating that the form data changed after setAsClean() or reset(). */
    dirty?: boolean;

    /** Read-only binding indicating validation result. */
    valid?: boolean;

    /** Read-only binding for validation error messages. */
    errors?: string[];

    /** Form validation settings, see https://fomantic-ui.com/behaviors/form.html#/settings */
    settings?: FormSettings;

    /** Id of the Semantic UI form element, takes precedence over tag position */
    forId?: string;

    /** If InitForm is used as a parent, render the children components */
    children?: Snippet;
}

// REACTIVE -------------------------------------------------------------------
/* eslint-disable prefer-const */

let {
    active = true,
    ignoreEmpty = false,
    dirty = $bindable(undefined),
    valid = $bindable(undefined),
    errors = $bindable(undefined),
    settings = undefined,
    forId = undefined,
    children = undefined,
}: Props = $props();

/** Invisible dom element created by this component. */
let span: Element | undefined = undefined;

/* eslint-enable */

// DATA -----------------------------------------------------------------------

/** jQuery form component */
let elem: (JQueryApi & FormApi) | undefined = undefined;

let formId: string;

/** Form controller */
let formCtrl: SuiFormController | undefined = undefined;

// amend CSS if Init is allowed as a parent wrapper
if (getComponentInitMode().includes("parent")) {
    void import("../init-wrapper-fix.css");
}

// FUNCTIONS ------------------------------------------------------------------

/** When 'active' prop changes, update the Semantic UI form controller */
$effect(() => {
    void active;
    // eslint-disable-next-line eqeqeq
    if (formCtrl && formCtrl.isActive() == false && active == true) {
        formCtrl.setActive(true);
    }
    // eslint-disable-next-line eqeqeq
    if (formCtrl && formCtrl.isActive() == true && active == false) {
        formCtrl.setActive(false);
        // reset read-only bindings
        valid = undefined;
        errors = undefined;
    }
});

/** When 'ignoreEmpty' prop changes, update the Semantic UI form controller */
$effect(() => {
    void ignoreEmpty;
    // eslint-disable-next-line eqeqeq
    if (formCtrl && formCtrl.isIgnoreEmpty() == false && ignoreEmpty == true) {
        formCtrl.setIgnoreEmpty(true);
    }
    // eslint-disable-next-line eqeqeq
    if (formCtrl && formCtrl.isIgnoreEmpty() == true && ignoreEmpty == false) {
        formCtrl.setIgnoreEmpty(false);
    }
});

// ----------------------------------------------------------------------------

/** When form validation result changes, modify the corresponding prop. */
function changeValid(ctrlValue: boolean): void {
    if (ctrlValue !== valid) {
        console.debug(`FORM (${formId}) : valid <- ${ctrlValue}`);
        valid = ctrlValue;
    }
}

/** When form validation messages change, modify the corresponding prop. */
function changeErrors(ctrlValue: string[]): void {
    if (!equalStringArrays(ctrlValue, errors)) {
        console.debug(`FORM (${formId}) : errors <- [ ${ctrlValue.join(" | ")} ]`);
        errors = ctrlValue;
    }
}

function onSuccessCallback(this: JQueryApi, event: Event, fields: object[]): void {
    console.log("SUCCESS");
    // user-specified handler for this component
    // if form defaults handler is present, user handler may call it before, after, or not call at all
    if (settings && settings.onSuccess) {
        settings.onSuccess.call(this, event, fields);
    }
    changeValid(true);
    changeErrors([]);
}

function onFailureCallback(this: JQueryApi, formErrors: object[], fields: object[]): void {
    console.log("FAILURE");
    // user-specified handler for this component
    // if default handler is present, user handler may call it before, after, or not call at all
    if (settings && settings.onFailure) {
        settings.onFailure.call(this, formErrors, fields);
    }
    changeValid(false);
    changeErrors(formErrors as unknown[] as string[]);
}

function onDirtyCallback(this: JQueryApi): void {
    // user-specified handler for this component
    if (settings && settings.onDirty) {
        settings.onDirty.call(this);
    }
    dirty = true;
    console.log("DIRTY:", dirty);
}

function onCleanCallback(this: JQueryApi): void {
    if (settings && settings.onClean) {
        settings.onClean.call(this);
    }
    dirty = false;
    console.log("DIRTY:", dirty);
}

//-----------------------------------------------------------------------------

onMount(async () => {
    // DOM is ready, initialize the form immediately
    // field will wait a tick to ensure that the form initialization is complete, no matter were InitForm is placed

    // Initialize Semantic component and subscribe for changes, always allow InitForm to be a child of form
    elem = findComponent(span!, ".ui.form", forId, [...getComponentInitMode(), "child"]);
    formId = elem.attr("id") ?? `fm_${nextUid()}`;

    if (!elem.form) {
        throw new Error("Semantic UI form is not initialized");
    }
    elem.form({
        ...settings,
        onSuccess: onSuccessCallback,
        onFailure: onFailureCallback,
        onDirty: onDirtyCallback,
        onClean: onCleanCallback,
    });

    // make sure all inputs have ids, so form validation doesn't show warnings
    elem.find("input,select").each((_idx: number, input: Element): void => {
        ensureFieldKey(jQueryElem(input));
    });

    // create form controller
    formCtrl = new SuiFormController(elem, formId, active, ignoreEmpty);

    // store form controller in the jQuery 'data' for fields to access
    elem.data(SVELTE_FORM_STORE, formCtrl);
});

onDestroy(() => {
    if (elem) {
        // remove event handlers
        elem.form("destroy");
    }
});
</script>

<span class="InitForm" style:display={children ? "contents" : "none"} bind:this={span}
    >{@render children?.()}</span
>

<style>
</style>
