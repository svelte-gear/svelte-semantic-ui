<!--
@component
Svelte data binder and formatter for text input.
(see detailed description in init-text-input.svelte.d.ts )
-->
<svelte:options runes={true} />

<script lang="ts">
import type { Snippet } from "svelte";
import { onMount, onDestroy, tick } from "svelte";

import type { RuleDefinition, TextFormatter } from "../data/common";
import type { JQueryApi } from "../data/semantic-types";
import { findComponent } from "../data/common";
import { FieldController } from "../data/field-controller";
import { TextFmt, type TextFormatSettings } from "../data/input-formatter";

const FIELD_PREFIX: string = "f_input";

interface Props {
    value?: string;
    settings?: TextFormatSettings;
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

function valueToInput(newValue: string): void {
    if (!elem || !formatter) {
        // effect and svelteToInput may be called before onMount()
        return;
    }
    const formattedStr: string = formatter.format(newValue);
    const inputText: string = `${elem?.val()}`;
    if (formattedStr !== inputText) {
        console.debug(`InitTextInput -> value = ${newValue}`);
        elem.val(formattedStr);
        elem.get(0)!.dispatchEvent(new CustomEvent("input"));
    }
    // push back the value if it got chenged
    if (formattedStr !== value) {
        value = formattedStr;
    }
}

$effect(() => {
    void value;
    valueToInput(value);
});

//-----------------------------------------------------------------------------

/** When input value changes, modify the svelte prop */
function inputToSvelte(inputText: string): void {
    // store in the prop only if the value is different
    const formattedStr: string = formatter!.format(inputText);
    if (formattedStr !== value) {
        console.debug(`InitTextInput <- input = ${inputText}`);
        value = formattedStr;
    }
    // update input if the formatted text is different
    if (formattedStr !== inputText) {
        elem?.val(formattedStr);
        elem?.get(0)!.dispatchEvent(new CustomEvent("input"));
    }
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

    // Initialize Semantic component and subscibe for changes
    elem = findComponent(span!, "input,textarea", forId);
    elem.on("change", onInputChange);

    // focus on label click, if for="_"
    const field: JQueryApi = elem.parent().filter(".field");
    const labelFor: string | undefined = field.find("label").attr("for");
    if (labelFor === "_") {
        field.on("click", "label", labelClick);
    }

    if (settings && formatter) {
        throw new Error("Custom formatter will override settings, don't use both at the same time");
    }
    // create a default formatter based on settings, or use supplied custom formatter
    if (!formatter) {
        formatter = new TextFmt(settings);
    }

    // apply validation rule if the rule is supplied in <InitTextInput >
    fieldCtrl = new FieldController(elem, validate, FIELD_PREFIX);

    // push initial value into the Semantic UI element
    if (value) {
        valueToInput(value);
    }
});

/** Remove the subscripion */
onDestroy(() => {
    if (fieldCtrl) {
        fieldCtrl.removeRules();
    }
    if (elem) {
        elem.off("change", onInputChange);

        const field: JQueryApi = elem.parent().filter(".field");
        const labelFor: string | undefined = field.find("label").attr("for");
        if (labelFor === "_") {
            field.off("click", "label", labelClick);
        }
    }
});
</script>

<span class="InitNumberInput" class:hidden={!children} bind:this={span}>{@render children?.()}</span
>

<style>
.hidden {
    display: none;
}
</style>
