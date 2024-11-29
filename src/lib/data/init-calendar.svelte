<!--
@component
Svelte data binder and initializer for Semantic-UI `Calendar` components.

Takes `value` binding of Date type,
which may represent calendar date, time, or date-and-time.
```
<div class="ui calendar">
    <div class="ui input right icon">
        <i class="clock outline icon" />
        <input type="text" placeholder="Time" />
    </div>
</div>
<InitCalendar bind:value={alarm} options={{ type: "time" }} />
```
NOTE: `validate` param in `<InitCalendar>` validates the formatted text (not Date object).
-->
<svelte:options runes={true} />

<script lang="ts">
/**
The line below is for typedoc.sh
@module data/Svelte::InitCalendar
*/

import type { Snippet } from "svelte";
import { onMount, onDestroy, tick } from "svelte";

import { validate as validateAction } from "../components/use-validate";
import type { ActionReturnType, DataTypes, JQueryApi, RuleDefinition } from "./common";
import { equalDataTypes, isoDate, isoTime, findComponent } from "./common";
import type { CalendarSettings } from "./semantic-types";
import { calendarDefaults } from "./settings";

interface Props {
    /** Two-way binding for controlling and reading the Calendar date, time, or datetime */
    value: Date | undefined;

    /** Settings for Semantic UI component */
    settings?: CalendarSettings;

    /** Optional value validator. Uses Semantic UI validator syntax.
    Can take the value generated with {@link data/helpers.rule}. */
    validate?: RuleDefinition;

    /** Id of the input element, takes precendence over tag position */
    forId?: string;

    /** If InitCalendar is used as a parent, render the children components */
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
let span: Element | undefined = undefined; // $state();

/* eslint-enable */

// DATA -----------------------------------------------------------------------

type CalendarApi = {
    calendar(settings: CalendarSettings): void;
    calendar(command: string, arg1?: unknown): unknown;
};
/** jQuery calendar component */
let elem: JQueryApi & CalendarApi;

/** Remove validation logic from the form. */
let destroyValidate: (() => void) | null = null;

// FUNCTIONS ------------------------------------------------------------------

/** Textual presentation of the value. */
function toStr(val: DataTypes): string {
    if (val instanceof Date) {
        return `${isoDate(val)} ${isoTime(val)}`;
    }
    if (val instanceof Array) {
        return `[${val.toString()}]`;
    }
    return `${val}`;
}

//-----------------------------------------------------------------------------

function svelteToInput(newValue: Date | undefined): void {
    if (elem) {
        const val: Date = elem!.calendar("get date") as Date;
        if (!equalDataTypes(newValue, val)) {
            console.debug(`InitCalendar -> prop change = ${toStr(value)}`);
            elem.calendar("set date", value);
        }
    }
}

$effect(() => {
    svelteToInput(value);
});

//-----------------------------------------------------------------------------

/** When input value changes, modify the svelte prop */
function inputToSvelte(val: Date): void {
    // store in the prop only if the value is different
    if (!equalDataTypes(value, val)) {
        console.debug(`InitCalendar <- input = ${toStr(val)}`);
        value = val;
    }
}

/** New calendar value is selected - push the value into the svelte component */
function onCalendarChange(
    // eslint-disable-next-line no-undef
    this: JQuery<HTMLElement>,
    newValue: Date,
    text: string,
    mode: string
): void {
    // global calendar settings
    const def: CalendarSettings = calendarDefaults.read();
    if (def.onChange) {
        def.onChange.call(this, newValue, text, mode);
    }
    // user-specifed handler for this component
    if (settings && settings.onChange) {
        settings.onChange.call(this, newValue, text, mode);
    }
    // data binding
    inputToSvelte(newValue);
}

/** Calendar is closed before the final selection - restore the original value */
// eslint-disable-next-line no-undef
function onCalendarHidden(this: JQuery<HTMLElement>): void {
    const def: CalendarSettings = calendarDefaults.read();
    if (def.onHidden) {
        def.onHidden.call(this);
    }
    if (settings && settings.onHidden) {
        settings.onHidden.call(this);
    }
    svelteToInput(value);
    // // FIXME: can i sue 'this' instead of elem ?
    // const calendarValue: Date | Date[] = this.calendar("get date") as Date | Date[];
    // if (Array.isArray(calendarValue)) {
    //     console.log("GOT ARRAY", calendarValue);
    //     inputToSvelte(calendarValue[0]); // [0] = new, [1] = old
    // } else {
    //     inputToSvelte(calendarValue);
    // }
}

//-----------------------------------------------------------------------------

onMount(async () => {
    // delay initialization till all DOM UI elements are ready
    await tick();

    // find Seamtic UI component using id or as parent, child, or sibling
    elem = findComponent(span!, ".ui.calendar", forId) as JQueryApi & CalendarApi;

    // Initialize Semantic component and subscibe for changes
    elem.calendar({
        ...settings,
        onChange: onCalendarChange,
        onHidden: onCalendarHidden,
    } as CalendarSettings);

    // push initial value into the Semantic UI element
    svelteToInput(value);

    // wait for form to initialize
    await tick();

    // apply validation rule if the rule is supplied in <Init** >
    if (validate) {
        const valRes: ActionReturnType = validateAction(elem.get(0), validate);
        // console.log(">>>", validate, elem.get(0));
        if (valRes) {
            destroyValidate = valRes.destroy ?? null;
        }
    }

    // TODO: Remove, or create a hidden input for the parsed (formatted) value
});

/** Remove the subscripion */
onDestroy(() => {
    // remove onChange and onHidden
    if (elem) {
        elem!.calendar("destroy");
    }

    if (destroyValidate) {
        destroyValidate();
        destroyValidate = null;
    }
});
</script>

<span class="data-binder" class:hidden={!children} bind:this={span}>{@render children?.()}</span>

<style>
.hidden {
    display: none;
}
</style>
