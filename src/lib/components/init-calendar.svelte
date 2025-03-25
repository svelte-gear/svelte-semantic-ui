<!--
@component
Svelte data binder and initializer for Semantic-UI `Calendar` components.
(see detailed description in init-calendar.svelte.d.ts )
-->
<svelte:options runes={true} />

<script lang="ts">
import type { Snippet } from "svelte";
import { onMount, onDestroy, tick } from "svelte";

import type { CalendarSettings, JQueryApi, RuleDefinition } from "../data/semantic-types";
import { equalDates, compLog, dateToStr } from "../data/common";
import { findComponent, findLabelWithBlank, copyParentKey } from "../data/dom-jquery";
import { FieldController } from "../data/field-controller";

const FIELD_PREFIX: string = "f_calendar";

// region props -----------------------------------------------------------------------------------

interface Props {
    /** Two-way binding for setting and reading back the Calendar date, time, or datetime */
    value: Date | null;

    /** Settings for Semantic UI component, see https://fomantic-ui.com/modules/calendar.html#/settings */
    settings?: CalendarSettings;

    /** Optional field value validator. Uses Semantic UI form validation syntax.
    See https://fomantic-ui.com/behaviors/form.html#/examples.
    To avoid typos, use `rules` helper from `data/helpers.ts` {@link data/helpers.rule}. */
    validate?: RuleDefinition;

    /** Id of the Semantic UI component, takes precedence over tag position */
    forId?: string;

    /** If InitCalendar is used as a parent, render the children components */
    children?: Snippet;
}

// region data ------------------------------------------------------------------------------------

/* eslint-disable prefer-const */

let {
    value = $bindable(),
    settings = undefined,
    validate = undefined,
    forId = undefined,
    children = undefined,
}: Props = $props();

/** Invisible dom element created by this component. */
let span: Element;

/* eslint-enable */

interface CalendarApi {
    calendar(settings: CalendarSettings): void;
    calendar(command: "get date"): Date | Date[];
    calendar(command: "set date", val: Date | null): void;
    calendar(command: "focus"): void;
    calendar(command: "destroy"): void;
}
/** jQuery calendar component */
let elem: JQueryApi & CalendarApi;

/** Inner input for form validation */
let input: JQueryApi;

/** Field descriptor and validator */
let fieldCtrl: FieldController;

// region svelte -> calendar ----------------------------------------------------------------------

/** Propagate prop change to UI component */
function svelteToInput(newValue: Date | null): void {
    let val: Date | Date[] = elem.calendar("get date") as Date | Date[];
    if (Array.isArray(val)) {
        compLog.warn(`Calendar (${fieldCtrl.key}) : GOT ARRAY`, val);
        val = val[0];
    }
    if (!equalDates(newValue, val)) {
        compLog.log(`Calendar (${fieldCtrl.key}) value -> ${dateToStr(newValue)}`);
        elem.calendar("set date", newValue);
    }
    void fieldCtrl.revalidate();
}

/** The effect rune calls svelteToInput when prop value changes */
$effect(() => {
    void value;
    if (!elem) {
        return; // the first 'effect' call happens before 'onMount' local variables may be not initialized
    }
    svelteToInput(value);
});

/** Update rules when the validate value changes */
$effect(() => {
    void validate;
    if (!elem) {
        return; // the first 'effect' call happens before 'onMount' local variables may be not initialized
    }
    fieldCtrl.replaceRules(validate);
});

// region calendar -> svelte ----------------------------------------------------------------------

/** When input value changes, modify the svelte prop */
function inputToSvelte(inputValue: Date): void {
    // store in the prop only if the value is different
    if (!equalDates(value, inputValue)) {
        compLog.log(`Calendar (${fieldCtrl.key}) : value <- ${dateToStr(inputValue)}`);
        value = inputValue;
    }
    void fieldCtrl.revalidate();
}

/** The callback function is calls inputToSvelte when calendar value is changed by user. */
function onCalendarChange(this: JQueryApi, newValue: Date, text: string, mode: string): void {
    // user-specified handler for this component
    if (settings && settings.onChange) {
        settings.onChange.call(this, newValue, text, mode);
    }
    // update data binding
    inputToSvelte(newValue);
}

/** Callback for calendar closed before the final selection - restore the original value */
function onCalendarHidden(this: JQueryApi): void {
    // user-specified handler for this component
    if (settings && settings.onHidden) {
        settings.onHidden.call(this);
    }
    // restore the value
    svelteToInput(value);
}

// region init ------------------------------------------------------------------------------------

function labelClick(): void {
    elem.calendar("focus");
}

onMount(async () => {
    // delay initialization till form controller is ready
    await tick();

    // Initialize Semantic component and subscribe for changes
    elem = findComponent(span!, ".ui.calendar", forId) as JQueryApi & CalendarApi;
    if (!elem.calendar) {
        throw new Error("Semantic calendar is not initialized");
    }
    elem.calendar({
        ...settings,
        onChange: onCalendarChange,
        onHidden: onCalendarHidden,
    });

    // Add attribute to inner input to enable calendar value validation
    input = elem.find("input");
    copyParentKey(input, elem, FIELD_PREFIX);

    // show calendar on label click, if label for="_"
    const label: JQueryApi | null = findLabelWithBlank(elem);
    if (label) {
        label.on("click", labelClick);
    }

    // apply validation rule if the rule is supplied in <InitCalendar >
    fieldCtrl = new FieldController("calendar", input, validate);

    // push initial value into the Semantic UI element
    svelteToInput(value);
});

/** Remove the subscription */
onDestroy(() => {
    if (fieldCtrl) {
        fieldCtrl.removeRules();
    }
    if (elem) {
        elem.calendar("destroy");

        const label: JQueryApi | null = findLabelWithBlank(elem);
        if (label) {
            label.off("click", labelClick);
        }
    }
});
</script>

<span class="InitCalendar" style:display={children ? "contents" : "none"} bind:this={span}
    >{@render children?.()}</span
>

<style>
</style>
