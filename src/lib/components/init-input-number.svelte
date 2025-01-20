<!--
@component
Svelte data binder and formatter for number input.
(see detailed description in init-number-input.svelte.d.ts )
-->
<svelte:options runes={true} />

<script lang="ts">
import type { Snippet } from "svelte";
import { onMount, onDestroy, tick } from "svelte";

import type { NumberInputSettings } from "../data/common";
import type { NumberFormatter } from "../data/format-number";
import type { JQueryApi, RuleDefinition } from "../data/semantic-types";

import { findComponent, findLabelWithBlank, getOrAssignKey } from "../data/dom-jquery";
import { FieldController } from "../data/form-controller";
import { NumberFmt } from "../data/format-number";

const FIELD_PREFIX: string = "f_input";

interface Props {
    value?: number | undefined;
    settings?: NumberInputSettings;
    validate?: RuleDefinition;
    formatter?: NumberFormatter;
    forId?: string;
    children?: Snippet;
}

// REACTIVE -------------------------------------------------------------------
/* eslint-disable prefer-const */

let {
    value = $bindable(),
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

function svelteToInput(newValue: number | undefined): void {
    if (!elem || !formatter) {
        // effect and svelteToInput may be called before onMount()
        return;
    }
    const formattedStr: string = formatter.format(newValue);
    const inputText: string = `${elem?.val()}`;
    if (formattedStr !== inputText) {
        console.debug(`NumberInput(${fieldCtrl?.key}) : value -> ${newValue}`);
        elem.val(formattedStr);
        elem.get(0)!.dispatchEvent(new CustomEvent("input"));
    }
    // push back the value if it got rounded
    const roundedValue: number | undefined = formatter.parse(formattedStr);
    if (roundedValue !== value) {
        value = roundedValue;
    }
    void fieldCtrl?.revalidate();
}

$effect(() => {
    void value;
    svelteToInput(value);
});
/** Update rules when the validate value changes. Fire a change event to trigger revalidation if deemed appropriate. */
$effect(() => {
    void validate;
    fieldCtrl?.replaceRules(validate);
    elem?.get(0)!.dispatchEvent(new CustomEvent("change"));
});

//-----------------------------------------------------------------------------

/** When input value changes, modify the svelte prop */
function inputToSvelte(inputText: string): void {
    // store in the prop only if the value is different
    const numValue: number | undefined = formatter!.parse(inputText);
    if (numValue !== value) {
        console.debug(`NumberInput(${fieldCtrl?.key}) : value <- ${inputText}`);
        value = numValue;
    }
    // update input if the formatted text is different
    const formattedStr: string = formatter!.format(numValue);
    if (formattedStr !== inputText) {
        elem?.val(formattedStr);
        elem?.get(0)!.dispatchEvent(new CustomEvent("input"));
    }
    void fieldCtrl?.revalidate();
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
    // delay initialization till form controller is ready
    await tick();

    // Initialize Semantic component and subscribe for changes
    elem = findComponent(span!, "input,textarea", forId);
    elem.on("change", onInputChange);

    // focus on label click, if label for="_"
    const label: JQueryApi | undefined = findLabelWithBlank(elem);
    if (label) {
        label.on("click", labelClick);
    }

    // create locale-aware number formatter based on settings, or use supplied custom formatter
    if (settings && formatter) {
        throw new Error(
            `NumberInput(${fieldCtrl?.key}) : 'formatter' will override 'settings', don't use both at the same time`
        );
    }
    if (!formatter) {
        formatter = new NumberFmt(settings ?? {});
    }

    // apply validation rule if the rule is supplied in <InitNumberInput >
    getOrAssignKey(elem, FIELD_PREFIX);
    fieldCtrl = new FieldController(elem, validate);

    // push initial value into the Semantic UI element
    svelteToInput(value);
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
