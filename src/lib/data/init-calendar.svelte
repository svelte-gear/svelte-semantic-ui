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
@module data/Svelte::CalendarData
*/

import type { Snippet } from "svelte";
import { onMount, onDestroy, tick } from "svelte";
import type { Unsubscriber } from "svelte/store";

import { calendar as calendarAction } from "../components/use-calendar";
import { validate as validateAction } from "../components/use-validate";
import type {
    ActionReturnType,
    DataController,
    DataTypes,
    JQueryApi,
    RuleDefinition,
} from "./common";
import { equalDataTypes, isoDate, isoTime, findComponent, SVELTE_DATA_STORE } from "./common";
import type { CalendarSettings } from "./semantic-types";

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

/** Object containing svelte store and update function. */
let watcher: DataController<DataTypes> | null = null;

/** Unsubscriber function. */
let subscribed: Unsubscriber | null = null;

/** Desctroys jQuery data with the store, is created from this component. */
let destroyAction: (() => void) | null = null;
let destroyFormat: (() => void) | null = null;
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

/*
                   dP
                   88
 .d8888b. dP    dP 88d888b. .d8888b. .d8888b. 88d888b.
 Y8ooooo. 88    88 88'  `88 Y8ooooo. 88'  `"" 88'  `88
       88 88.  .88 88.  .88       88 88.  ... 88
 `88888P' `88888P' 88Y8888' `88888P' `88888P' dP

    */

/** When store value changes, modify the corresponding prop. */
function onSubscriptionChange(storeValue: DataTypes): void {
    console.debug(`data : ${watcher!.mode} <- store(${watcher!.uid}) = ${toStr(storeValue)}`);

    // store in appropriate prop, if the value is different
    if (!equalDataTypes(value, storeValue)) {
        value = storeValue as Date;
    }
}

/*
                                         dP
                                         88
 88d8b.d8b. .d8888b. dP    dP 88d888b. d8888P
 88'`88'`88 88'  `88 88    88 88'  `88   88
 88  88  88 88.  .88 88.  .88 88    88   88
 dP  dP  dP `88888P' `88888P' dP    dP   dP

    */

onMount(async () => {
    // delay initialization till use:action is run on Semantic UI element
    await tick();

    const elem: JQueryApi = findComponent(span!, ".ui.calendar", forId);
    const actRes: ActionReturnType = calendarAction(elem.get(0), settings);
    if (actRes) {
        destroyAction = actRes.destroy ?? null;
    }
    // await tick();

    // extract the value watcher (store and controller) from the parent's jQuery data
    watcher = elem.data(SVELTE_DATA_STORE) as DataController<DataTypes>;
    if (watcher.mode !== "calendar") {
        throw new Error(`Invalid 'date' prop in <Data> for '${watcher.mode}'`);
    }
    console.debug(`data : ${watcher.mode} - found watcher(${watcher.uid})`);

    // push initial value into the Semantic UI element
    console.debug(`data : ${watcher.mode} -> prop init(${watcher.uid}) = ${toStr(value)}`);
    watcher.doUpdate(value);

    // subsribe for further changes
    console.debug(`data : ${watcher.mode} - subscribe(${watcher.uid})`);
    subscribed = watcher.store.subscribe(onSubscriptionChange);

    await tick();

    // apply validation rule if the rule is supplied in <Data>
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
    if (subscribed) {
        // unsubscribe
        console.debug(`data : ${watcher?.mode} - unsubscribe(${watcher?.uid})`);
        subscribed();
        subscribed = null;
    }

    if (destroyAction) {
        destroyAction();
        destroyAction = null;
    }

    if (destroyFormat) {
        destroyFormat();
        destroyFormat = null;
    }

    if (destroyValidate) {
        destroyValidate();
        destroyValidate = null;
    }
});

/*
                         dP            dP
                         88            88
 dP    dP 88d888b. .d888b88 .d8888b. d8888P .d8888b.
 88    88 88'  `88 88'  `88 88'  `88   88   88ooood8
 88.  .88 88.  .88 88.  .88 88.  .88   88   88.  ...
 `88888P' 88Y888P' `88888P8 `88888P8   dP   `88888P'
          88
          dP
    */

/** When a prop value changes, update the Semantic UI element. */
// afterUpdate(() => {
$effect(() => {
    // listen to prop changes
    void value;

    // skip the initial prop update, as semntic component is not ready yet
    if (!watcher) {
        return;
    }
    // update Semantic component
    console.debug(`data : ${watcher.mode} -> prop effect(${watcher.uid}) = ${toStr(value)}`);
    watcher.doUpdate(value);
});
</script>

<span class="data-binder" class:hidden={!children} bind:this={span}>{@render children?.()}</span>

<style>
.hidden {
    display: none;
}
</style>
