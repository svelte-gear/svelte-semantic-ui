<!--
@component
Provides Svelte bindings for Semantic-UI Form validator or Yup validator.
In both cases the <FormValidationData> tag must be a child of the Semantic UI form component.

https://semantic-ui.com/behaviors/form.html

https://github.com/jquense/yup

Example:
```
    <form clsss="ui form" use:formValidation={{ inline: true }}>
        <FormValidationData
            active={isActive}
            bind:valid={isValid}
            bind:errors={errors}
        />
        ...
    </form>
    <p>This form {#if isValid} is good {:else} has errors {/if} </p>
```
-->
<svelte:options runes={true} />

<script lang="ts">
/**
The line below is for typedoc.sh
@module data/Svelte::FormValidator
*/

import type { Unsubscriber } from "svelte/store";
import { onMount, onDestroy, tick } from "svelte";

import type { FormController, JQueryApi } from "./common";
import { equalDataTypes, jQueryElem, SVELTE_FORM_STORE } from "./common";

interface Props {
    /** Determines if any field change will cause form re-validation. */
    active: boolean;

    /** Read-only binding indicating validation result. */
    valid?: boolean;

    /** Read-only binding for validation error messages. */
    errors?: string[];
}

// REACTIVE -------------------------------------------------------------------
/* eslint-disable prefer-const */

let {
    active = $bindable(),
    valid = $bindable(undefined),
    errors = $bindable([]),
}: Props = $props();

/** Invisible dom element created by this component. */
let span: Element;

/* eslint-enable */

// DATA -----------------------------------------------------------------------

/** Object containing svelte store and update function. */
let watcher: FormController;

/** Unsubscriber function */
let subscribed: Unsubscriber[] = [];

/*
                   dP
                   88
 .d8888b. dP    dP 88d888b. .d8888b. .d8888b. 88d888b.
 Y8ooooo. 88    88 88'  `88 Y8ooooo. 88'  `"" 88'  `88
       88 88.  .88 88.  .88       88 88.  ... 88
 `88888P' `88888P' 88Y8888' `88888P' `88888P' dP

    */

/** When store value changes, modify the corresponding prop. */
function onValidChange(storeValue: boolean): void {
    if (storeValue !== valid) {
        console.debug(`form : ${watcher.mode} <- store(${watcher.uid}).valid = ${storeValue}`);
        valid = storeValue;
    }
}

/** When store value changes, modify the corresponding prop. */
function onErrorsChange(storeValue: string[]): void {
    if (!equalDataTypes(storeValue, errors)) {
        console.debug(`form : ${watcher.mode} <- store(${watcher.uid}).errs = [${storeValue}]`);
        errors = storeValue;
    }
}

/*
                                         dP
                                         88
 88d8b.d8b. .d8888b. dP    dP 88d888b. d8888P
 88'`88'`88 88'  `88 88    88 88'  `88   88
 88  88  88 88.  .88 88.  .88 88    88   88
 dP  dP  dP `88888P' `88888P' dP    dP   dP

    */

/** Validate that component's parent is a ```dropdown```.
 * extract ```elem``` and ```holder```. */
onMount(async () => {
    // delay initialization till use:action is run on Semantic UI form
    await tick();

    // extract the value watcher (store and controller) from the parent's jQuery data
    const elem: JQueryApi = jQueryElem(span).parent();

    watcher = elem.data(SVELTE_FORM_STORE) as FormController;
    if (!watcher) {
        throw new Error(
            "Parent element of 'FormValidationData' must be a form " +
                "initalized with 'use:formValidation'"
        );
    }
    // validate the store type
    if (!["sui-form", "yup-form"].includes(watcher.mode)) {
        throw new Error(`Unrecognized parent for 'FormValidationData' component: ${watcher.mode}`);
    }
    console.debug(`form : ${watcher.mode} - mount(${watcher.uid})`);

    if (watcher.getActive() !== active) {
        console.debug(`form : ${watcher.mode} -> update(${watcher.uid}).active = ${active}`);
        watcher.setActive(active);
    }

    // subsribe for changes
    console.debug(`form : ${watcher.mode} - subscribe(${watcher.uid})`);
    subscribed.push(watcher.valid.subscribe(onValidChange));
    subscribed.push(watcher.errors.subscribe(onErrorsChange));
});

/** Remove the subscripion */
onDestroy(() => {
    if (subscribed.length > 0) {
        // unsubscribe
        console.debug(`data : ${watcher.mode} - unsubscribe(${watcher.uid})`);
        subscribed.forEach((unsubscribe: Unsubscriber) => {
            unsubscribe();
        });
    }
    subscribed = [];
});

/*
                         dP            dP
                         88            88
 dP    dP 88d888b. .d888b88 .d8888b. d8888P .d8888b.
 88    88 88'  `88 88'  `88 88'  `88   88   88ooood8
 88.  .88 88.  .88 88.  .88 88.  .88   88   88.  ...
 `88888P' 88Y888P' `88888P8 `88888P8   dP   `88888P'
          88
          dP
    */

/** When 'active' prop changes, update the Semantic UI form watcher. */
$effect(() => {
    // listen to prop change
    void active;

    // skip the initial prop update, as semntic component is not ready yet
    if (!watcher) {
        return;
    }

    if (watcher.getActive() !== active) {
        console.debug(`form : ${watcher.mode} -> update(${watcher.uid}).active = ${active}`);
        watcher.setActive(active);
    }
});
</script>

<span class="data-binder" bind:this={span}></span>

<style>
.data-binder {
    display: none;
}
</style>
