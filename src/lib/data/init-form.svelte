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
import type { FormApi } from "./form-controller-impl";
import { FormControllerImpl } from "./form-controller-impl";
import { equalStringArrays, formLog } from "../data/common";
import {
    findComponent,
    jQueryElem,
    SVELTE_FORM_STORE,
    getComponentInitMode,
    ensureFieldKey,
    nextUid,
} from "../data/dom-jquery";

// region props -----------------------------------------------------------------------------------

interface Props {
    /** Determines if a field change will cause form re-validation.
     *
     *  If validateForm == true (default),
     *  all fields are validated live; `valid` and `errors` bindings are updated reactively.
     *
     *  If validateForm == false,
     *  field are validated as they are touched by the user; `valid` and `errors` bindings are undefined.
     *  For smooth validate-on-touch experience we recommend form settings: inline == true, on == "submit" (default). */
    validateForm?: boolean;

    /** Determines if empty fields are validated or not; optional, defaults to true.
     *  May be set to false to hide required fields warnings,
     *  and set back to true when user tries to submit the form. */
    validateEmpty?: boolean;

    /** Read-only binding indicating form data changes.
     *  In most cases it should be set to false by calling doResetForm(), after form data is initialized. */
    dirty?: boolean;

    /** Read-only binding indicating validation result. Is null if `validateForm` == false */
    valid?: boolean | null;

    /** Read-only binding for validation error messages. Is null if `validateForm` == false */
    errors?: string[] | null;

    /** Form validation settings, see https://fomantic-ui.com/behaviors/form.html#/settings */
    settings?: FormSettings;

    /** Id of the Semantic UI form element, takes precedence over tag position */
    forId?: string;

    /** If InitForm is used as a parent, render the children components */
    children?: Snippet;
}

// region data ------------------------------------------------------------------------------------

/* eslint-disable prefer-const */

let {
    validateForm = true,
    validateEmpty = true,
    dirty = $bindable(undefined),
    valid = $bindable(undefined),
    errors = $bindable(undefined),
    settings = undefined,
    forId = undefined,
    children = undefined,
}: Props = $props();

/** Invisible dom element created by this component. */
let span: Element;

/* eslint-enable */

/** jQuery form component */
let elem: JQueryApi & FormApi;

/** identifier used for debugging */
let formId: string;

/** Form controller */
let formCtrl: FormControllerImpl;

// amend CSS if Init is allowed as a parent wrapper
if (getComponentInitMode().includes("parent")) {
    void import("../init-wrapper-fix.css");
}

// region svelte -> form --------------------------------------------------------------------------

/** When 'active' prop changes, update the Semantic UI form controller */
$effect(() => {
    void validateForm;
    if (!formCtrl) {
        // the first 'effect' call happens before the component is initialized
        return;
    }
    // eslint-disable-next-line eqeqeq
    if (formCtrl.isActive() == false && validateForm == true) {
        formCtrl.setActive(true);
        return;
    }
    // eslint-disable-next-line eqeqeq
    if (formCtrl.isActive() == true && validateForm == false) {
        formCtrl.setActive(false);
        // reset read-only bindings
        valid = null;
        errors = null;
    }
});

/** When 'validateEmpty' prop changes, update the Semantic UI form controller.ignoreEmpty */
$effect(() => {
    void validateEmpty;
    if (!formCtrl) {
        // the first 'effect' call happens before the component is initialized
        return;
    }
    // eslint-disable-next-line eqeqeq
    if (formCtrl.isIgnoreEmpty() == true && validateEmpty == true) {
        formCtrl.setIgnoreEmpty(false);
        return;
    }
    // eslint-disable-next-line eqeqeq
    if (formCtrl.isIgnoreEmpty() == false && validateEmpty == false) {
        formCtrl.setIgnoreEmpty(true);
    }
});

// region form -> svelte --------------------------------------------------------------------------

/** When form validation result changes, modify the corresponding prop. */
function changeValid(ctrlValue: boolean): void {
    if (ctrlValue !== valid) {
        formLog.log(`(${formId}) : valid <- ${ctrlValue}`);
        valid = ctrlValue;
    }
}

/** When form validation messages change, modify the corresponding prop. */
function changeErrors(ctrlValue: string[]): void {
    if (errors !== undefined && !equalStringArrays(ctrlValue, errors)) {
        formLog.log(`(${formId}) : errors <- [ ${ctrlValue.join(" | ")} ]`);
        errors = ctrlValue;
    }
}

function onSuccessCallback(this: JQueryApi, event: Event, fields: object[]): void {
    // formLog.debug(`(${formId}) : SUCCESS`);
    // user-specified handler for this component
    // if form defaults handler is present, user handler may call it before, after, or not call at all
    if (settings && settings.onSuccess) {
        settings.onSuccess.call(this, event, fields);
    }
    if (formCtrl.isActive()) {
        changeValid(true);
        changeErrors([]);
    }
}

function onFailureCallback(this: JQueryApi, formErrors: object[], fields: object[]): void {
    // formLog.debug(`(${formId}) : FAILURE`, formErrors);
    // user-specified handler for this component
    // if default handler is present, user handler may call it before, after, or not call at all
    if (settings && settings.onFailure) {
        settings.onFailure.call(this, formErrors, fields);
    }
    if (formCtrl.isActive()) {
        changeValid(false);
        changeErrors(formErrors as unknown[] as string[]);
    }
}

function onDirtyCallback(this: JQueryApi): void {
    // user-specified handler for this component
    if (settings && settings.onDirty) {
        settings.onDirty.call(this);
    }
    dirty = true;
    formLog.debug("DIRTY:", dirty);
}

function onCleanCallback(this: JQueryApi): void {
    if (settings && settings.onClean) {
        settings.onClean.call(this);
    }
    dirty = false;
    formLog.debug("DIRTY:", dirty);
}

// region init ------------------------------------------------------------------------------------

onMount(async () => {
    // DOM is ready, initialize the form immediately
    // field will wait a tick to ensure that the form initialization is complete, no matter were InitForm is placed

    // Initialize Semantic component and subscribe for changes, always allow InitForm to be a child of form
    elem = findComponent(span, ".ui.form", forId, [...getComponentInitMode(), "child"]);
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
    formCtrl = new FormControllerImpl(elem, formId, validateForm, !validateEmpty);

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
