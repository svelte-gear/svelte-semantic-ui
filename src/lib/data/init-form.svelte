<!--
@component
Provides Svelte bindings for Semantic-UI Form validator.

https://fomantic-ui.com/behaviors/form.html
```
    <form class="ui form" >
        ...
    </form>
    <FormValidation
        active={isActive}
        bind:valid={isValid}
        bind:errors={errors}
        settings={{ inline: true }}/>
    <p>This form {#if isValid} is good {:else} has errors {/if} </p>
```
If rules are supplied in settings, fields are matched by 'id', 'name', or 'data-validate' attribute.
Create `<div class="ui message error"/>` to display not-inline messages.
For Dropdown, use id of the select or inner input. For Calendar, use id of the innermost input.
-->
<svelte:options runes={true} />

<script lang="ts">
/**
The line below is for typedoc.sh
@module data/Svelte::InitForm
*/

import type { Snippet } from "svelte";
import { onMount, onDestroy, tick } from "svelte";

import type { FormSettings, JQueryApi } from "../data/semantic-types";
import { SuiFormController } from "../data/form-controller";
import {
    equalDataTypes,
    findComponent,
    jQueryElem,
    SVELTE_FORM_STORE,
    getComponentInitMode,
} from "../data/common";
import { getOrAssignKey } from "../data/field-controller";
import { formDefaults } from "./settings";

interface Props {
    /** Determines if any field change will cause form re-validation. */
    active: boolean;

    /** Read-only binding indicating validation result. */
    valid?: boolean;

    /** Read-only binding for validation error messages. */
    errors?: string[];

    /** Form validation settings */
    settings?: FormSettings;

    forId?: string;

    children?: Snippet;
}

// REACTIVE -------------------------------------------------------------------
/* eslint-disable prefer-const */

let {
    active = $bindable(),
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
let elem: JQueryApi | undefined = undefined;

let formCtrl: SuiFormController | undefined = undefined;

// FUNCTIONS ------------------------------------------------------------------

/** When 'active' prop changes, update the Semantic UI form controller */
$effect(() => {
    void active;
    if (formCtrl && active !== formCtrl.isActive) {
        formCtrl.setActive(active);
    }
});

/** When store value changes, modify the corresponding prop. */
function onValidChange(ctrlValue: boolean): void {
    if (ctrlValue !== valid) {
        console.debug(`${formCtrl!.formId} : valid <- ${ctrlValue}`);
        valid = ctrlValue;
    }
}

/** When store value changes, modify the corresponding prop. */
function onErrorsChange(ctrlValue: string[]): void {
    if (!equalDataTypes(ctrlValue, errors)) {
        console.debug(`${formCtrl!.formId} : errors <- [ ${ctrlValue.join(" | ")} ]`);
        errors = ctrlValue;
    }
}

function onSuccessCallback(this: JQueryApi, event: Event, fields: object[]): void {
    console.log("SUCCESS");
    const def: FormSettings = formDefaults.read();
    if (def.onSuccess) {
        def.onSuccess.call(this, event, fields);
    }
    // useformIdpecifed handler for this component
    if (settings && settings.onSuccess) {
        settings.onSuccess.call(this, event, fields);
    }
    onValidChange(true);
    onErrorsChange([]);
}

function onFailureCallback(this: JQueryApi, formErrors: object[], fields: object[]): void {
    console.log("FAILURE");
    const def: FormSettings = formDefaults.read();
    if (def.onFailure) {
        def.onFailure.call(this, formErrors, fields);
    }
    // user-specifed handler for this component
    if (settings && settings.onFailure) {
        settings.onFailure.call(this, formErrors, fields);
    }
    // TODO: call default and settings callbacks
    onValidChange(false);
    onErrorsChange(formErrors as unknown as string[]);
}

//-----------------------------------------------------------------------------

/**  */
onMount(async () => {
    // delay initialization till use:action is run on Semantic UI form
    await tick();

    // Initialize Semantic component and subscibe for changes, always allow to be a child
    elem = findComponent(span!, ".ui.form", forId, [...getComponentInitMode(), "child"]);
    if (!elem.form) {
        throw new Error("Semantic UI form is not initialized");
    }
    elem.form({
        ...settings,
        onSuccess: onSuccessCallback,
        onFailure: onFailureCallback,
    });

    formCtrl = new SuiFormController(elem, onValidChange, onErrorsChange);
    // store controller in jQuery data for fields to access
    elem.data(SVELTE_FORM_STORE, formCtrl);

    formCtrl.setActive(active);

    // make sure all inputs have ids, so form validation dpesn't shoaw warnings
    // FIXME: check if it runs AFTER all the fields are initialized, no matterip parent, child, or sibling
    await tick();
    await tick();
    elem.find("input").each((_idx: number, input: Element): void => {
        getOrAssignKey(jQueryElem(input));
    });
});

/** Remove the subscripion */
onDestroy(() => {
    if (elem) {
        elem.form("destroy");
    }
});
</script>

<span class="InitForm" class:hidden={!children} bind:this={span}>{@render children?.()}</span>

<style>
.InitForm {
    /* TODO: test how it works */
    display: contents;
}
.InitForm.hidden {
    display: none;
}
</style>
