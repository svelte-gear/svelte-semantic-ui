<!--
@component
Svelte data binder and formatter for text input.
(see detailed description in init-text-input.svelte.d.ts )
-->
<svelte:options runes={true} />

<script lang="ts">
import type { Snippet } from "svelte";
import { onMount, onDestroy, tick } from "svelte";

import type { RuleDefinition } from "../data/common";
import type { TextFormatter } from "../data/format";
import type { JQueryApi, TextInputSettings } from "../data/semantic-types";

import { findComponent, findLabelWithBlank, getOrAssignKey } from "../data/common";
import { FieldController } from "../data/field-controller";
import { TextFmt } from "../data/format";

const FIELD_PREFIX: string = "f_input";

interface Props {
    value?: string;
    settings?: TextInputSettings;
    validate?: RuleDefinition;
    formatter?: TextFormatter;
    forId?: string;
    children?: Snippet;
}

// REACTIVE -------------------------------------------------------------------
/* eslint-disable prefer-const */

let {
    value = $bindable(""),
    settings = undefined,
    validate = undefined,
    formatter = undefined,
    forId = undefined,
    children = undefined,
}: Props = $props();

/** Invisible dom element created by this component. */
let span: Element | undefined = undefined; // $state();

/* eslint-enable */

// DATA -----------------------------------------------------------------------

/** jQuery calendar component */
let elem: JQueryApi | undefined = undefined;

/** Field descriptor and validator */
let fieldCtrl: FieldController | undefined = undefined;

// FUNCTIONS ------------------------------------------------------------------

function svelteToInput(newValue: string): void {
    if (!elem || !formatter) {
        // effect and svelteToInput may be called before onMount()
        return;
    }
    const formattedStr: string = formatter.format(newValue);
    const inputText: string = `${elem?.val()}`;
    if (formattedStr !== inputText) {
        console.debug(`TextInput(${fieldCtrl?.key}) : value -> ${newValue}`);
        elem.val(formattedStr);
        elem.get(0)!.dispatchEvent(new CustomEvent("input"));
    }
    // push back the value if it got changed
    if (formattedStr !== value) {
        value = formattedStr;
    }
    fieldCtrl?.revalidate(); // AK 01
}

$effect(() => {
    void value;
    svelteToInput(value);
});

//-----------------------------------------------------------------------------

/** When input value changes, modify the svelte prop */
function inputToSvelte(inputText: string): void {
    // store in the prop only if the value is different
    const formattedStr: string = formatter!.format(inputText);
    if (formattedStr !== value) {
        console.debug(`TextInput(${fieldCtrl?.key}) : value <- ${inputText}`);
        value = formattedStr;
    }
    // update input if the formatted text is different
    if (formattedStr !== inputText) {
        elem?.val(formattedStr);
        elem?.get(0)!.dispatchEvent(new CustomEvent("input"));
    }
    fieldCtrl?.revalidate(); // AK 01
}

/** The callback function is calls inputToSvelte when input value is changed by user. */
function onInputChange(this: JQueryApi): void {
    const inputText: string = `${elem?.val()}`;
    inputToSvelte(inputText);
}

//-----------------------------------------------------------------------------

function labelClick(): void {
    elem?.trigger("focus");
}

onMount(async () => {
    // delay initialization till all DOM UI elements are ready
    await tick();

    // Initialize Semantic component and subscribe for changes
    elem = findComponent(span!, "input,textarea", forId);
    elem.on("change", onInputChange);

    // focus on label click, if label for="_"
    const label: JQueryApi | undefined = findLabelWithBlank(elem);
    if (label) {
        label.on("click", labelClick);
    }

    // create a default formatter based on settings, or use supplied custom formatter
    if (settings && formatter) {
        throw new Error(
            `TextInput(${fieldCtrl?.key}) : 'formatter' will override 'settings', don't use both at the same time`
        );
    }
    if (!formatter) {
        formatter = new TextFmt(settings);
    }

    // apply validation rule if the rule is supplied in <InitTextInput >
    getOrAssignKey(elem, FIELD_PREFIX);
    fieldCtrl = new FieldController(elem, validate);

    // push initial value into the Semantic UI element
    if (value) {
        svelteToInput(value);
    }
});

/** Remove the subscription */
onDestroy(() => {
    if (fieldCtrl) {
        fieldCtrl.removeRules();
    }
    if (elem) {
        elem.off("change", onInputChange);

        const label: JQueryApi | undefined = findLabelWithBlank(elem);
        if (label) {
            label.off("click", labelClick);
        }
    }
});
</script>

<span class="InitInput" style:display={children ? "contents" : "none"} bind:this={span}
    >{@render children?.()}</span
>

<style>
</style>
