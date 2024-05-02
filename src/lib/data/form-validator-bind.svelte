<!--
@component
Provides Svelte bindings for Semantic-UI Form validator or Yup validator.
In both cases the <FormValidationData> tag must be a child of the Semantic UI form component.

https://semantic-ui.com/behaviors/form.html

https://github.com/jquense/yup

Example:
```
    <form calss="ui form" use:formValidation={{ inline: true }}>
        <FormValidationData // TODO FormValidator
            active={isActive}
            bind:valid={isValid}
            bind:errors={errors}
        />
        ...
    </form>
    <p>This form {#if isValid} is good {:else} has errors {/if} </p>
```
-->
<!--
                            oo            dP
                                          88
 .d8888b. .d8888b. 88d888b. dP 88d888b. d8888P
 Y8ooooo. 88'  `"" 88'  `88 88 88'  `88   88
       88 88.  ... 88       88 88.  .88   88
 `88888P' `88888P' dP       dP 88Y888P'   dP
                               88
                               dP
-->
<script lang="ts">
import type { Unsubscriber } from "svelte/store";
import { onMount, afterUpdate, onDestroy } from "svelte";

import type { FormController } from "./common";
import { equalDataTypes, jQueryElem, SVELTE_FORM_STORE } from "./common";

/** Determines if any field change will cause form re-validation. */
export let active: boolean;

/** Read-only binding indicating validation result. */
export let valid: boolean | undefined = undefined;

/** Read-only binding for validation error messages. */
export let errors: string[] | undefined = undefined;

/** Invisible dom element created by this component. */
let span: Element;

/** Object containing svelte store and update function. */
let watcher: FormController;

/** Unsubscriber function */
let subscribed: Unsubscriber[] = [];

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
onMount(() => {
    // extract the value watcher (store and controller) from the parent's jQuery data
    const elem = jQueryElem(span).parent();
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
});

/*
                   dP
                   88
 .d8888b. dP    dP 88d888b. .d8888b. .d8888b. 88d888b.
 Y8ooooo. 88    88 88'  `88 Y8ooooo. 88'  `"" 88'  `88
       88 88.  .88 88.  .88       88 88.  ... 88
 `88888P' `88888P' 88Y8888' `88888P' `88888P' dP

    */

/** When store value changes, modify the corresponding prop.*/
function onValidChange(storeValue: boolean) {
    if (storeValue !== valid) {
        console.debug(`form : ${watcher.mode} <- store(${watcher.uid}).valid = ${storeValue}`);
        valid = storeValue;
    }
}

/** When store value changes, modify the corresponding prop.*/
function onErrorsChange(storeValue: string[]) {
    if (!equalDataTypes(storeValue, errors)) {
        console.debug(`form : ${watcher.mode} <- store(${watcher.uid}).errs = [${storeValue}]`);
        errors = storeValue;
    }
}

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

/** When 'value' prop changes, update the element and start listening to store changes. */
afterUpdate(() => {
    // update Semantic component
    if (watcher.getActive() !== active) {
        console.debug(`form : ${watcher.mode} -> update(${watcher.uid}).active = ${active}`);
        watcher.setActive(active);
    }

    // subsribe after the update to avoid initial 'undefined' push from the store
    if (!subscribed.length) {
        console.debug(`form : ${watcher.mode} - subscribe(${watcher.uid})`);
        subscribed.push(watcher.valid.subscribe(onValidChange));
        subscribed.push(watcher.errors.subscribe(onErrorsChange));
    }
});

/*
       dP                     dP
       88                     88
 .d888b88 .d8888b. .d8888b. d8888P 88d888b. .d8888b. dP    dP
 88'  `88 88ooood8 Y8ooooo.   88   88'  `88 88'  `88 88    88
 88.  .88 88.  ...       88   88   88       88.  .88 88.  .88
 `88888P8 `88888P' `88888P'   dP   dP       `88888P' `8888P88
                                                          .88
                                                      d8888P
    */

/** Remove the subscripion */
onDestroy(() => {
    if (subscribed.length > 0) {
        // unsubscribe
        console.debug(`data : ${watcher.mode} - unsubscribe(${watcher.uid})`);
        subscribed.forEach((unsubscribe) => {
            unsubscribe();
        });
    }
    subscribed = [];
});
</script>

<!--
 dP         dP              dP
 88         88              88
 88d888b. d8888P 88d8b.d8b. 88
 88'  `88   88   88'`88'`88 88
 88    88   88   88  88  88 88
 dP    dP   dP   dP  dP  dP dP

-->

<span class="data-binder" bind:this={span} />

<style>
.data-binder {
    display: none;
}
</style>
