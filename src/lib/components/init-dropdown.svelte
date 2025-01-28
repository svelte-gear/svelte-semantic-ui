<!--
@component
Svelte data binder and initializer for Semantic-UI `Dropdown` components.
(see detailed description in init-dropdown.svelte.d.ts )
-->
<svelte:options runes={true} />

<script lang="ts">
import type { Snippet } from "svelte";
import { onMount, onDestroy, tick } from "svelte";

import type { DropdownSettings, JQueryApi, RuleDefinition } from "../data/semantic-types";
import { compLog, equalStringArrays } from "../data/common";
import { findComponent, findLabelWithBlank } from "../data/dom-jquery";
import { FieldController } from "../data/field-controller";

// const FIELD_PREFIX: string = "f_dropdown";
const DROPDOWN_PREVENT_CLEARING_BAD_DATA: boolean = false;

interface Props {
    value: string | string[] | undefined;
    settings?: DropdownSettings;
    validate?: RuleDefinition;
    forId?: string;
    children?: Snippet;
}

// REACTIVE -------------------------------------------------------------------
/* eslint-disable prefer-const */

let {
    value = $bindable(),
    settings = undefined,
    validate = undefined,
    forId = undefined,
    children = undefined,
}: Props = $props();

/** Invisible dom element created by this component. */
let span: Element | undefined = undefined;

/* eslint-enable */

// DATA -----------------------------------------------------------------------

type DropdownApi = {
    dropdown(settings: DropdownSettings): void;
    dropdown(command: "get value"): string | string[];
    dropdown(command: "get values"): string[];
    dropdown(command: "set exactly", val: string[]): void;
    dropdown(command: "get item", val: string): Element;
    dropdown(command: "set selected", val: string): void;
    dropdown(command: "clear"): void;
    dropdown(command: "focus"): void;
    dropdown(command: "clear"): void;
    dropdown(command: "destroy"): void;
};
/** jQuery dropdown component */
let elem: (JQueryApi & DropdownApi) | undefined = undefined;

/** Inner input for form validation */
let input: JQueryApi | undefined = undefined;

/** Is this a multi-select dropdown or single-select slider */
let multi: boolean = false;

/** Field descriptor and validator */
let fieldCtrl: FieldController | undefined = undefined;

// FUNCTIONS ------------------------------------------------------------------

/** Textual presentation of the value. */
function toStr(val: string | string[] | undefined): string {
    if (Array.isArray(val)) {
        return `[${val.toString()}]`;
    }
    return `${val}`;
}

//-----------------------------------------------------------------------------

/** Propagate prop change to UI component */
function svelteToInput(newValue: string | string[] | undefined): void {
    if (!elem) {
        // effect and svelteToInput may be called before onMount()
        return;
    }
    if (multi) {
        // multi-select
        const curValue: string[] = elem.dropdown("get values");
        if (!Array.isArray(newValue)) {
            throw new Error(`Multi-value dropdown expects string[] value, got ${newValue}`);
        }
        if (!equalStringArrays(newValue, curValue)) {
            compLog.log(`Dropdown (${fieldCtrl?.key}) : value -> ${toStr(newValue)}`);
            // NOTE: use 'set exactly' instead of 'set selected'!!!
            elem.dropdown("set exactly", newValue);
            void fieldCtrl?.revalidate();
        }
    } else {
        // single-select
        const curValue: string | string[] = elem.dropdown("get value");
        if (Array.isArray(newValue)) {
            throw new Error(`Simple-value dropdown expects string value, got ${toStr(newValue)}`);
        }
        if (curValue !== newValue) {
            compLog.log(`Dropdown (${fieldCtrl?.key}) : value -> ${toStr(newValue)}`);
            const exists: unknown = elem.dropdown("get item", value as string);
            if (exists) {
                elem.dropdown("set selected", value as string);
                void fieldCtrl?.revalidate();
            } else {
                // if value is invalid - clear the dropdown
                elem.dropdown("clear");
                void fieldCtrl?.revalidate();
            }
        }
    }
}

/** The effect rune calls svelteToInput when prop value changes */
$effect(() => {
    void value;
    // not sure if this trick will help to detect array element changes, if array wan't assigned after init
    if (Array.isArray(value)) {
        if (value.length > 0) {
            void value[0];
        }
        for (let i: number = 0; i < value.length; i++) {
            void value[i];
        }
    }
    svelteToInput(value);
});

/** Update rules when the validate value changes. Fire a change event to trigger revalidation if deemed appropriate. */
$effect(() => {
    void validate;
    fieldCtrl?.replaceRules(validate);
    // elem?.get(0)!.dispatchEvent(new CustomEvent("change"));
});

//-----------------------------------------------------------------------------

/** When input value changes, modify the svelte prop */
function inputToSvelte(inputValue: string | string[] | undefined): void {
    if (!elem) {
        throw new Error("Dropdown is not initialized");
    }
    // store in the prop only if the value is different
    if (multi) {
        if (!equalStringArrays(value as string[], inputValue as string[])) {
            compLog.log(`Dropdown (${fieldCtrl?.key}) : value <- ${toStr(inputValue)}`);
            value = inputValue;
            void fieldCtrl?.revalidate();
        }
    } else {
        if (value !== inputValue) {
            compLog.log(`Dropdown (${fieldCtrl?.key}) : value <- ${toStr(inputValue)}`);
            if (DROPDOWN_PREVENT_CLEARING_BAD_DATA) {
                const exists: unknown = elem.dropdown("get item", inputValue as string);
                if (exists) {
                    value = inputValue;
                    void fieldCtrl?.revalidate();
                }
            } else {
                value = inputValue;
                void fieldCtrl?.revalidate();
            }
        }
    }
    // it is different from calendar, requires explicit call to validate
}

/** The callback function is calls inputToSvelte when dropdown value is changed by user. */
function onDropdownChange(
    this: JQueryApi,
    newValue: string | string[],
    text: string,
    choice: JQueryApi
): void {
    void choice;
    // user-specified handler for this component
    if (settings && settings.onChange) {
        settings.onChange.call(this, newValue, text, choice);
    }
    // update data binding
    inputToSvelte(newValue);
}

//-----------------------------------------------------------------------------

function labelClick(): void {
    elem?.dropdown("focus");
}

onMount(async () => {
    // delay initialization till form controller is ready
    await tick();

    // Initialize Semantic component and subscribe for changes
    elem = findComponent(span!, ".ui.dropdown", forId) as JQueryApi & DropdownApi;
    if (!elem.dropdown) {
        throw new Error("Semantic UI dropdown is not initialized");
    }
    elem.dropdown({
        ...settings,
        onChange: onDropdownChange,
    });

    // check if it is a multi-select
    multi = elem.hasClass("multiple");
    if (multi && !Array.isArray(value)) {
        throw new Error(`Multi-value dropdown has a string[] 'value', got ${toStr(value)}`);
    }
    if (!multi && Array.isArray(value)) {
        throw new Error(
            `Dropdown has a string 'value', got ${toStr(value)}, did you forget to add 'multiple' class or attr?`
        );
    }

    // Find select or inner input
    input = elem.find("input,select");

    // show dropdown on label click, if for="_"
    const label: JQueryApi | undefined = findLabelWithBlank(elem);
    if (label) {
        label.on("click", labelClick);
    }

    // apply validation rule if the rule is supplied in <InitCalendar >
    fieldCtrl = new FieldController("dropdown", input, validate);

    // push initial value into the Semantic UI element
    svelteToInput(value);
});

/** Remove the subscription */
onDestroy(() => {
    if (fieldCtrl) {
        fieldCtrl.removeRules();
    }
    if (elem) {
        elem.dropdown("destroy");

        const label: JQueryApi | undefined = findLabelWithBlank(elem);
        if (label) {
            label.off("click", labelClick);
        }
    }
});
</script>

<span class="InitDropdown" style:display={children ? "contents" : "none"} bind:this={span}
    >{@render children?.()}</span
>

<style>
</style>
