<!--
@component
Svelte data binder and formatter for date input.
(see detailed description in init-date-input.svelte.d.ts )
-->
<svelte:options runes={true} />

<script lang="ts">
import type { Snippet } from "svelte";
import { onMount, onDestroy, tick } from "svelte";

import type { DateFormatter } from "../data/format-date";
import type { CalendarSettings, JQueryApi, RuleDefinition } from "../data/semantic-types";
import { compLog } from "../data/common";
import { findComponent, findLabelWithBlank, getFieldKey, getOrAssignKey } from "../data/dom-jquery";
import { FieldController } from "../data/field-controller";
import { DateFmt } from "../data/format-date";

const FIELD_PREFIX: string = "f_input";

// region props -----------------------------------------------------------------------------------

interface Props {
    /** Two-way binding for setting and reading back the Date value */
    value: Date | null;

    /** Settings for date formatter, see https://fomantic-ui.com/modules/calendar.html#/settings */
    settings?: CalendarSettings;

    /** Optional field value validator. Uses Semantic UI form validation syntax.
    See https://fomantic-ui.com/behaviors/form.html#/examples.
    To avoid typos, use `rules` helper from `data/helpers.ts` {@link data/helpers.rule}. */
    validate?: RuleDefinition;

    /** In most cases you should use the default locale-aware formatter with `settings`.
    Optional custom formatter may be used to implement non-standard formats or additional parsing logic.
    It will override `settings`, don't use both at the same time. */
    customFormatter?: DateFormatter;

    /** Id of the Semantic UI input element, takes precedence over tag position */
    forId?: string;

    /** If InitDateInput is used as a parent, render the children components */
    children?: Snippet;
}

// region data ------------------------------------------------------------------------------------

/* eslint-disable prefer-const */

let {
    value = $bindable(),
    settings = undefined,
    validate = undefined,
    customFormatter = undefined,
    forId = undefined,
    children = undefined,
}: Props = $props();

/** Invisible dom element created by this component. */
let span: Element;

/* eslint-enable */

/** jQuery input component */
let elem: JQueryApi;

/** Formatter is supplied as prop or created based on settings */
let formatter: DateFormatter;

/** Field descriptor and validator */
let fieldCtrl: FieldController;

// region svelte -> input -------------------------------------------------------------------------

function svelteToInput(newValue: Date | null): void {
    const formattedStr: string = formatter.format(newValue);
    const inputText: string = `${elem.val()}`;
    if (formattedStr !== inputText) {
        compLog.log(`DateInput (${fieldCtrl.key}) : value -> ${newValue}`);
        elem.val(formattedStr);
        elem.get(0)!.dispatchEvent(new CustomEvent("input"));
    }
    // // DON'T push back the value if it got 'rounded', this creates infinite effect loop
    // const roundedValue: Date | null = formatter.parse(formattedStr);
    // if (roundedValue !== value) {
    //     value = roundedValue;
    // }
    void fieldCtrl.revalidate();
}

/** The effect rune calls svelteToInput when prop value changes */
$effect(() => {
    void value;
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
    const dateValue: Date | null = formatter.parse(inputText);
    if (dateValue !== value) {
        compLog.log(`DateInput (${fieldCtrl.key}) : value <- ${inputText}`);
        value = dateValue;
    }
    // update input if the formatted text is different
    const formattedStr: string = formatter.format(dateValue);
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

    // create locale-aware date formatter based on settings, or use supplied custom formatter
    if (settings && customFormatter) {
        throw new Error(
            // eslint-disable-next-line max-len
            `InitDateInput(${getFieldKey(elem)}) : 'customFormatter' will override 'settings', don't use both at the same time`
        );
    }
    formatter = customFormatter ? customFormatter : new DateFmt(settings);

    // apply validation rule if the rule is supplied in <InitDateInput >
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
