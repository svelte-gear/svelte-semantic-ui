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
} from "../data/dom-jquery";
// import { formDefaults } from "../data/settings";

interface Props {
    /** Determines if any field change will cause form re-validation. */
    active: boolean;

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
    active,
    valid = $bindable(undefined),
    errors = $bindable([]),
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

let formCtrl: SuiFormController | undefined = undefined;

// fix CSS for Init as a parent wrapper
if (getComponentInitMode().includes("parent")) {
    void import("../init-wrapper-fix.css");
}

// FUNCTIONS ------------------------------------------------------------------

/** When 'active' prop changes, update the Semantic UI form controller */
$effect(() => {
    void active;
    if (formCtrl && active !== formCtrl.isActive) {
        formCtrl.setActive(active);
    }
});

/** When form validation result changes, modify the corresponding prop. */
function onValidChange(ctrlValue: boolean): void {
    if (ctrlValue !== valid) {
        console.debug(`${formCtrl!.formId} : valid <- ${ctrlValue}`);
        valid = ctrlValue;
    }
}

/** When form validation messages change, modify the corresponding prop. */
function onErrorsChange(ctrlValue: string[]): void {
    if (!equalStringArrays(ctrlValue, errors)) {
        console.debug(`${formCtrl!.formId} : errors <- [ ${ctrlValue.join(" | ")} ]`);
        errors = ctrlValue;
    }
}

/** Validation callback */
function onSuccessCallback(this: JQueryApi, event: Event, fields: object[]): void {
    console.log("SUCCESS");
    // user-specified handler for this component
    // if default handler is present, user handler may call it before, after, or not call at all
    if (settings && settings.onSuccess) {
        settings.onSuccess.call(this, event, fields);
    }
    onValidChange(true);
    onErrorsChange([]);
}

/** Validation callback */
function onFailureCallback(this: JQueryApi, formErrors: object[], fields: object[]): void {
    console.log("FAILURE");
    // user-specified handler for this component
    // if default handler is present, user handler may call it before, after, or not call at all
    if (settings && settings.onFailure) {
        settings.onFailure.call(this, formErrors, fields);
    }
    onValidChange(false);
    onErrorsChange(formErrors as unknown as string[]);
}

//-----------------------------------------------------------------------------

onMount(async () => {
    // DOM is ready, initialize the form immediately, field will wait a tick to ensure that the form is ready

    // Initialize Semantic component and subscribe for changes, always allow to be a child
    elem = findComponent(span!, ".ui.form", forId, [...getComponentInitMode(), "child"]);
    if (!elem.form) {
        throw new Error("Semantic UI form is not initialized");
    }
    elem.form({
        ...settings,
        onSuccess: onSuccessCallback,
        onFailure: onFailureCallback,
    });

    formCtrl = new SuiFormController(elem /* , onValidChange, onErrorsChange */);
    // store controller in jQuery data for fields to access
    elem.data(SVELTE_FORM_STORE, formCtrl);

    // make sure all inputs have ids, so form validation doesn't show warnings
    elem.find("input,select").each((_idx: number, input: Element): void => {
        ensureFieldKey(jQueryElem(input));
    });

    // no need for delay as revalidate is already deduped
    formCtrl.setActive(active);
});

onDestroy(() => {
    if (formCtrl) {
        // stop validation
        formCtrl.isActive = false;
    }
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
