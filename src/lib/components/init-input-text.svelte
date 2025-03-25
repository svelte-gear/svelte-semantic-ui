<!--
@component
Svelte data binder and formatter for text input.
(see detailed description in init-text-input.svelte.d.ts )
-->
<svelte:options runes={true} />

<script lang="ts">
import type { Snippet } from "svelte";
import { onMount, onDestroy, tick } from "svelte";

import type { TextInputSettings } from "../data/common";
import type { TextFormatter } from "../data/format-text";
import type { JQueryApi, RuleDefinition } from "../data/semantic-types";

import { compLog, equalStringArrays } from "../data/common";
import { findComponent, findLabelWithBlank, getFieldKey, getOrAssignKey } from "../data/dom-jquery";
import { FieldController } from "../data/field-controller";
import { TextFmt } from "../data/format-text";

const FIELD_PREFIX: string = "f_input";

// region props -----------------------------------------------------------------------------------

interface Props {
    /** Two-way binding for setting and reading back the text or array of text items */
    value: string | string[];

    /** Settings for date formatter, see https://fomantic-ui.com/modules/calendar.html#/settings */
    settings?: TextInputSettings;

    /** Optional field value validator. Uses Semantic UI form validation syntax.
    See https://fomantic-ui.com/behaviors/form.html#/examples.
    To avoid typos, use `rules` helper from `data/helpers.ts` {@link data/helpers.rule}. */
    validate?: RuleDefinition;

    /** Optional formatter is used to implement custom formats or text processing.
    It will override `settings`, don't use both at the same time. */
    customFormatter?: TextFormatter;

    /** Id of the Semantic UI input element, takes precedence over tag position */
    forId?: string;

    /** If InitTextInput is used as a parent, render the children components */
    children?: Snippet;
}

// region data ------------------------------------------------------------------------------------

/* eslint-disable prefer-const */ /* reactive */

let {
    value = $bindable(),
    settings = undefined,
    validate = undefined,
    customFormatter = undefined,
    forId = undefined,
    children = undefined,
}: Props = $props();

/** Invisible dom element created by this component. */
let span: Element; // $state();

/* eslint-enable */

/** jQuery input component */
let elem: JQueryApi;

/** Formatter is supplied as prop or created based on settings */
let formatter: TextFormatter;

/** Field descriptor and validator */
let fieldCtrl: FieldController;

// region svelte -> input -------------------------------------------------------------------------

function svelteToInput(newValue: string | string[]): void {
    const formattedStr: string = formatter.format(newValue);
    const inputText: string = `${elem.val()}`;
    if (formattedStr !== inputText) {
        compLog.log(`TextInput (${fieldCtrl.key}) : value -> ${newValue}`);
        elem.val(formattedStr);
        elem.get(0)!.dispatchEvent(new CustomEvent("input"));
    }
    // push back the value if it got changed
    const parsedValue: string | string[] = formatter.parse(formattedStr);
    if (!equalStringArrays(parsedValue, value)) {
        value = parsedValue;
    }
    void fieldCtrl.revalidate();
}

/** The effect rune calls svelteToInput when prop value changes */
$effect(() => {
    void value;
    // a hack to trigger effect on array element change
    if (Array.isArray(value)) {
        if (value.length > 0) {
            void value[0];
        }
        for (let i: number = 0; i < value.length; i++) {
            void value[i];
        }
    }
    if (!elem) {
        return; // effect may be called before onMount
    }
    svelteToInput(value);
});

/** Update rules when the validate value changes. Fire a change event to trigger revalidation if deemed appropriate. */
$effect(() => {
    void validate;
    if (!elem) {
        return; // effect may be called before onMount
    }
    fieldCtrl.replaceRules(validate);
});

// region input -> svelte -------------------------------------------------------------------------

/** When input value changes, modify the svelte prop */
function inputToSvelte(inputText: string): void {
    // store in the prop only if the value is different
    const parsedValue: string | string[] = formatter.parse(inputText);
    if (parsedValue !== value) {
        compLog.log(`TextInput (${fieldCtrl.key}) : value <- ${inputText}`);
        value = parsedValue;
    }
    // update input if the formatted text is different
    const formattedStr: string = formatter.format(parsedValue);
    if (formattedStr !== inputText) {
        elem.val(formattedStr);
        elem.get(0)!.dispatchEvent(new CustomEvent("input"));
    }
    void fieldCtrl.revalidate();
}

/** The callback function is calls inputToSvelte when input value is changed by user. */
function onInputChange(this: JQueryApi): void {
    const inputText: string = `${elem.val()}`;
    inputToSvelte(inputText);
}

// region init ------------------------------------------------------------------------------------

function labelClick(): void {
    elem.trigger("focus");
}

onMount(async () => {
    // delay initialization till form controller is ready
    await tick();

    // Initialize Semantic component and subscribe for changes
    elem = findComponent(span!, "input,textarea", forId);
    elem.on("change", onInputChange);

    // focus on label click, if label for="_"
    const label: JQueryApi | null = findLabelWithBlank(elem);
    if (label) {
        label.on("click", labelClick);
    }

    // create a default formatter based on settings, or use supplied custom formatter
    if (settings && customFormatter) {
        throw new Error(
            // eslint-disable-next-line max-len
            `TextInput(${getFieldKey(elem)}) : 'customFormatter' will override 'settings', don't use both at the same time`
        );
    }
    if (settings && settings.list && !settings.listSeparator) {
        settings.listSeparator = ",";
    }
    formatter = customFormatter ? customFormatter : new TextFmt(settings);

    // apply validation rule if the rule is supplied in <InitTextInput >
    getOrAssignKey(elem, FIELD_PREFIX);
    fieldCtrl = new FieldController("input", elem, validate);

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

        const label: JQueryApi | null = findLabelWithBlank(elem);
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
