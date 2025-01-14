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
import { equalDates, isoDate, isoTime } from "../data/common";
import { findComponent, findLabelWithBlank, copyParentKey } from "../data/dom-jquery";
import { FieldController } from "../data/form-controller";

const FIELD_PREFIX: string = "f_calendar";

interface Props {
    value: Date | undefined;
    settings?: CalendarSettings;
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

type CalendarApi = {
    calendar(settings: CalendarSettings): void;
    calendar(command: "get date"): Date | Date[];
    calendar(command: "set date", val: Date | undefined): void;
    calendar(command: "focus"): void;
    calendar(command: "destroy"): void;
};
/** jQuery calendar component */
let elem: (JQueryApi & CalendarApi) | undefined = undefined;

/** Inner input for form validation */
let input: JQueryApi | undefined = undefined;

/** Field descriptor and validator */
let fieldCtrl: FieldController | undefined = undefined;

// FUNCTIONS ------------------------------------------------------------------

/** Textual presentation of the value. */
function toStr(val: Date | Date[] | undefined): string {
    if (val instanceof Date) {
        return `${isoDate(val)} ${isoTime(val)}`;
    }
    if (Array.isArray(val)) {
        return `[${val.map((d: Date) => `${isoDate(d)} ${isoTime(d)}`).toString()}]`;
    }
    return `${val}`;
}

//-----------------------------------------------------------------------------

/** Propagate prop change to UI component */
function svelteToInput(newValue: Date | undefined): void {
    if (!elem) {
        // effect and svelteToInput may be called before onMount()
        return;
    }
    let val: Date | Date[] = elem.calendar("get date") as Date | Date[];
    if (Array.isArray(val)) {
        console.log(`Calendar(${fieldCtrl?.key}) : GOT ARRAY`, val);
        val = val[0];
    }
    if (!equalDates(newValue, val)) {
        console.debug(`Calendar(${fieldCtrl?.key}) value -> ${toStr(newValue)}`);
        elem.calendar("set date", newValue);
    }
    void fieldCtrl?.revalidate();
}

/** The effect rune calls svelteToInput when prop value changes */
$effect(() => {
    void value;
    svelteToInput(value);
});

//-----------------------------------------------------------------------------

/** When input value changes, modify the svelte prop */
function inputToSvelte(inputValue: Date): void {
    // store in the prop only if the value is different
    if (!equalDates(value, inputValue)) {
        console.debug(`Calendar(${fieldCtrl?.key}) : value <- ${toStr(inputValue)}`);
        value = inputValue;
    }
    void fieldCtrl?.revalidate();
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

    // const calendarValue: Date | Date[] = this.calendar("get date") as Date | Date[];
    // if (Array.isArray(calendarValue)) {
    //     console.log("GOT ARRAY", calendarValue);
    //     inputToSvelte(calendarValue[0]); // [0] = new, [1] = old
    // } else {
    //     inputToSvelte(calendarValue);
    // }
}

//-----------------------------------------------------------------------------

function labelClick(): void {
    elem?.calendar("focus");
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
    const label: JQueryApi | undefined = findLabelWithBlank(elem);
    if (label) {
        label.on("click", labelClick);
    }

    // apply validation rule if the rule is supplied in <InitCalendar >
    fieldCtrl = new FieldController(input, validate);

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

        const label: JQueryApi | undefined = findLabelWithBlank(elem);
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
