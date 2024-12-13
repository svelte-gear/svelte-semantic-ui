<!--
@component
Svelte data binder and initializer for Semantic-UI `Dropdowm` components.
(see detailed description in init-dropdown.svelte.d.ts )
-->
<svelte:options runes={true} />

<script lang="ts">
/// <reference types="jquery" />

import type { Snippet } from "svelte";
import { onMount, onDestroy, tick } from "svelte";

import type { RuleDefinition } from "../data/common";
import type { DropdownSettings, JQueryApi } from "../data/semantic-types";
import { equalDataTypes, findComponent, uid } from "../data/common";
import { dropdownDefaults } from "../data/settings";
import { FieldController } from "../data/field-controller";

const FIELD_PREFIX: string = "f_dropdown";
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
    dropdown(command: string, arg1?: unknown): unknown;
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
    const curValue: string | string[] = elem.dropdown("get value");
    if (multi) {
        // multi-select
        if (!Array.isArray(newValue)) {
            throw new Error(`Multi-value dropdown expects string[] value, got ${newValue}`);
        }
        if (!equalDataTypes(newValue, curValue)) {
            console.debug(`InitDropdown(${fieldCtrl?.key}) -> prop = ${toStr(newValue)}`);
            // NOTE: use 'set exactly' instead of 'set selected'!!!
            elem.dropdown("set exactly", newValue);
            fieldCtrl?.revalidate();
        }
    } else {
        // single-select
        if (Array.isArray(newValue)) {
            throw new Error(`Simple-value dropdown expects string value, got ${toStr(newValue)}`);
        }
        if (curValue !== newValue) {
            console.debug(`InitDropdown(${fieldCtrl?.key}) -> prop = ${toStr(newValue)}`);
            const exists: unknown = elem.dropdown("get item", value);
            if (exists) {
                elem.dropdown("set selected", value);
                fieldCtrl?.revalidate();
            } else {
                // if value is invalid - clear the dropdown
                elem.dropdown("clear");
                fieldCtrl?.revalidate();
            }
        }
    }
}

/** The effect rune calls svelteToInput when prop value changes */
$effect(() => {
    void value;
    // not sure if this trick will help to detect array alement changes, if array wan't assigned after init
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

//-----------------------------------------------------------------------------

/** When input value changes, modify the svelte prop */
function inputToSvelte(inputValue: string | string[] | undefined): void {
    if (!elem) {
        throw new Error("Dropdown is not initialized");
    }
    // store in the prop only if the value is different
    if (multi) {
        if (!equalDataTypes(value, inputValue)) {
            console.debug(`InitDropdown(${fieldCtrl?.key}) <- input = ${toStr(inputValue)}`);
            value = inputValue;
            fieldCtrl?.revalidate();
        }
    } else {
        if (value !== inputValue) {
            console.debug(`InitDropdown(${fieldCtrl?.key}) <- input = ${toStr(inputValue)}`);
            if (DROPDOWN_PREVENT_CLEARING_BAD_DATA) {
                const exists: unknown = elem.dropdown("get item", inputValue);
                if (exists) {
                    value = inputValue;
                    fieldCtrl?.revalidate();
                }
            } else {
                value = inputValue;
                fieldCtrl?.revalidate();
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
    // global dropdown settings
    const def: DropdownSettings = dropdownDefaults.read();
    if (def.onChange) {
        def.onChange.call(this, newValue, text, choice);
    }
    // user-specifed handler for this component
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
    // delay initialization till all DOM UI elements are ready
    await tick();

    // Initialize Semantic component and subscibe for changes
    elem = findComponent(span!, ".ui.dropdown", forId) as JQueryApi & DropdownApi;
    if (!elem.dropdown) {
        throw new Error("Semantic calendar is not initialized");
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
            `Dropdown has a string 'value', got ${toStr(value)}, did you forget to add 'multuiple' class or attr?`
        );
    }

    // Find select or inner input
    input = elem.find("input,select");
    const inputId: string | undefined =
        input.attr("id") ?? input.attr("name") ?? input.attr("data-validate");
    if (!inputId) {
        const dropdownId: string | undefined =
            elem.attr("id") ?? elem.attr("name") ?? elem.attr("data-validate");
        input.attr("data-validate", `${FIELD_PREFIX}_${dropdownId ? dropdownId : uid()}`);
    }

    // show dropdown on label click, if for="_"
    const field: JQueryApi = elem.parent().filter(".field");
    const labelFor: string | undefined = field.find("label").attr("for");
    if (labelFor === "_") {
        field.on("click", "label", labelClick);
    }

    // apply validation rule if the rule is supplied in <InitCalendar >
    fieldCtrl = new FieldController(input, validate);
    // push initial value into the Semantic UI element
    svelteToInput(value);
});

/** Remove the subscripion */
onDestroy(() => {
    if (fieldCtrl) {
        fieldCtrl.removeRules(); // FIXME: testing (AK)
    }
    if (elem) {
        elem.dropdown("destroy");

        const field: JQueryApi = elem.parent().filter(".field");
        const labelFor: string | undefined = field.find("label").attr("for");
        if (labelFor === "_") {
            field.off("click", "label", labelClick);
        }
    }
});
</script>

<span class="InitDropdown" class:hidden={!children} bind:this={span}>{@render children?.()}</span>

<style>
.hidden {
    display: none;
}

/* fix dropdown alignment for InitDropdown as a parent */
:global(.InitDropdown) {
    min-width: auto;
    width: 100%;
}
:global(.ui.form .field > .InitDropdown > .selection.dropdown:not(.compact)) {
    min-width: auto;
    width: 100%;
}
:global(.ui.form .field > .InitDropdown > .selection.dropdown > .dropdown.icon) {
    float: right;
}
:global(.ui.form .inline.field > .InitDropdown > .selection.dropdown),
:global(.ui.form .inline.fields .field > .InitDropdown > .selection.dropdown) {
    width: auto;
}
:global(.ui.form .inline.field > .InitDropdown > .selection.dropdown > .dropdown.icon),
:global(.ui.form .inline.fields .field > .InitDropdown > .selection.dropdown > .dropdown.icon) {
    float: none;
}

/*
.ui.form .required.field>.checkbox::after,
.ui.form .required.fields:not(.grouped):not(.inline)>.field>.checkbox::after {
    margin:-.2em 0 0 .2em;
    content:"*";
    color:#db2828
}
.ui.form .required.field>.checkbox::after,
.ui.form .required.fields:not(.grouped):not(.inline)>.field>.checkbox::after {
  position:absolute;
    top:0;
    left:100%
}

.ui.form .inline.field>input,
.ui.form .inline.fields .field>input {
    display:inline-block;
    width:auto;
    margin-top:0;
    margin-bottom:0;
    vertical-align:middle;
    font-size:1em
}
.ui.form .inline.fields .wide.field>input {
    width:100%
}
*/
</style>
