<!--
@component
Svelte data binder for Semantic-UI `Calendar`, `Dropdown`, `Modal`, `Slider` components;
as well as `input` and `textarea` elements.
The <Data> tag must be a child of the corresponding Semantic UI component
or immeditely follow the `input` or `textarea`.

### calendar
Takes `date` binding of Date type, which may represent calendar date,
time, or date-and-time.
```
<div class="ui calendar" use:calendar>
        <Data bind:date={alarm} />
        <div class="ui input right icon">
            <i class="clock outline icon" />
            <input type="text" placeholder="Time" />
        </div>
    </div>
```

### dropdown
Type of `selected` binding is `string` for a select, or `string[]` for a multi-select.
If an invalid value is provided, select is reset, multi-select values are removed.
```
<select class="ui selection dropdown" use:dropdown>
    <Data bind:selected={gender} />
    <option value="M">Male</option>
    <option value="F">Female</option>
</select>
```

### modal
Changing the boolean variable bound to `active` will show or hide the dialogue.
```
<div id="md" class="ui modal page" use:modal>
    <Data bind:active={show} />
    ...
</div>
```

### slider
Takes `position` binding of type number.
```
<div class="ui labeled ticked slider" use:slider>
    <Data bind:position={num} />
</div>
```

### input / textarea
Input and textarea have two different ways to bind data`:` <br />
`value` binding in the `<input>` / textarea gets raw text value and is updated immediately. <br />
🔥 `parsed` binding in `<Data>` gets parsed typed data and is updated on blur.
```
<input bind:value={text} />
<input /><Data bind:parsed={typed} />
```

### checkbox / radio
Svelte allows to bind checkbox ands radio inputs in two different ways:
```
<input type="checkbox" bind:checked={boolVal} />
<input type="radio" bind:checked={boolValTwo} />

<input type="checkbox" bind:group={arrayVal} />
<input type="radio" bind:group={strVal} />
```

### validation
`validate` param in `<Data>` validates the formatted text (not typed data).<br />
For `<input>` / textarea / select `use:validate` on the element will produce the same result.
```
<input bind:value={text} use:validate={...} />
<input /><Data bind:parsed={val} validate={...}>
```
-->
<!-- <svelte:options runes={false} /> -->

<script lang="ts">
/**
The line below is for typedoc.sh
@module data/Svelte::Data
*/

import { onMount, onDestroy, tick, afterUpdate } from "svelte";
import type { Unsubscriber } from "svelte/store";

import { format as formatAction } from "../components/use-format";
import { validate as validateAction } from "../components/use-validate";
import type {
    ActionReturnType,
    DataController,
    DataTypes,
    Formatter,
    JQueryApi,
    RuleDefinition,
} from "./common";
import {
    equalDataTypes,
    isoDate,
    isoTime,
    jQueryElem,
    jQueryElemById,
    SVELTE_DATA_STORE,
} from "./common";

// // DON'T USE $props yet
// interface Props {
//     /** Two-way binding for controlling and reading the Dropdown selection
//     - see {@link components/use-dropdown} */
//     selected?: string | string[];

//     /** Two-way binding for controlling and reading the Modal state
//     - see {@link components/use-modal} */
//     active?: boolean;

//     /** Two-way binding for controlling and reading the Calendar date, time, or datetime
//     - see {@link components/use-calendar} */
//     date?: Date;

//     /** Two-way binding for controlling and reading the Slider value
//     - see {@link components/use-slider} */
//     position?: number;

//     /** Two-way binding for controlling and reading input / textarea value.
//     May be used together with {@link components/use-format}. */
//     value?: DataTypes; // TODO: Explain the diffrence with bind:value on the input e;ement

//     /** Optional value validator. Uses Semantic UI validator syntax.
//     The same as {@link components/use-validate}.
//     Ususally takes the value generated with {@link data/helpers.rule}. */
//     validate?: RuleDefinition;

//     /** Id of the input element, takes precendence over tag position */
//     forId?: string;
// }

// REACTIVE -------------------------------------------------------------------
/* eslint-disable prefer-const */

// let {
//     selected = $bindable(undefined),
//     active = $bindable(undefined),
//     date = $bindable(undefined),
//     position = $bindable(undefined),
//     value = $bindable(undefined),
//     validate = undefined,
//     forId = undefined,
// }: Props = $props();

/** Two-way binding for controlling and reading the Dropdown selection
    - see {@link components/use-dropdown} */
export let selected: string | string[] | undefined = undefined;

/** Two-way binding for controlling and reading the Modal state
    - see {@link components/use-modal} */
export let active: boolean | undefined = undefined;

/** Two-way binding for controlling and reading the Calendar date, time, or datetime
    - see {@link components/use-calendar} */
export let date: Date | undefined = undefined;

/** Two-way binding for controlling and reading the Slider value
    - see {@link components/use-slider} */
export let position: number | undefined = undefined;

/** Two-way binding for controlling and reading input / textarea value.
May be used together with {@link components/use-format}. */
export let value: DataTypes | undefined = undefined; // TODO: Explain the diffrence with bind:value on the input element

/** Optional value validator. Uses Semantic UI validator syntax.
The same as {@link components/use-validate}.
Ususally takes the value generated with {@link data/helpers.rule}. */
export let validate: RuleDefinition | undefined = undefined;

/** Id of the input element, takes precendence over tag position */
export let forId: string | undefined = undefined;

/** Invisible dom element created by this component. */
let span: Element | undefined = undefined; // $state();

/* eslint-enable */

// DATA -----------------------------------------------------------------------

/** Object containing svelte store and update function. */
let watcher: DataController<DataTypes> | null = null;

/** Unsubscriber function. */
let subscribed: Unsubscriber | null = null;

/** Desctroys jQuery data with the store, is created from this component. */
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

const trimFormatter: Formatter = {
    format(val: DataTypes): string {
        return (val as string).trim();
    },
};

/** Secelt one of the props depending on the watchjer type. */
function getPropValue(): DataTypes {
    switch (watcher!.mode) {
        case "dropdown":
            return selected;
        case "modal":
            return active;
        case "calendar":
            return date;
        case "slider":
            return position;
        case "input":
            return value;
        default:
            throw new Error(`Unrecognized watcher mode: '${watcher!.mode}'`);
    }
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
    switch (watcher!.mode) {
        case "dropdown":
            if (selected !== storeValue && !equalDataTypes(selected, storeValue)) {
                selected = storeValue as string | string[];
            }
            break;
        case "modal":
            if (active !== storeValue) {
                active = storeValue as boolean;
            }
            break;
        case "calendar":
            if (!equalDataTypes(date, storeValue)) {
                date = storeValue as Date;
            }
            break;
        case "slider":
            if (position !== storeValue) {
                position = storeValue as number;
            }
            break;
        case "input":
            if (value !== storeValue) {
                // FIXME: contradicts value: DataTypes ?!
                value = storeValue as string | string[];
            }
            break;
        default:
            throw new Error(`Unrecognized watcher mode: '${watcher!.mode}'`);
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

function validatePropsAndStoreMatch(): void {
    if (!watcher) {
        throw new Error("Watcher is not initialized");
    }
    if (!["dropdown", "modal", "calendar", "slider", "input"].includes(watcher.mode)) {
        throw new Error(`Unrecognized store type: ${watcher.mode}`);
    }
    if (selected !== undefined && watcher.mode !== "dropdown") {
        throw new Error(`Invalid 'selected' prop in <Data> for '${watcher.mode}'`);
    }
    if (active !== undefined && watcher.mode !== "modal") {
        throw new Error(`Invalid 'active' prop in <Data> for '${watcher.mode}'`);
    }
    if (date !== undefined && watcher.mode !== "calendar") {
        throw new Error(`Invalid 'date' prop in <Data> for '${watcher.mode}'`);
    }
    if (position !== undefined && watcher.mode !== "slider") {
        throw new Error(`Invalid 'position' prop in <Data> for '${watcher.mode}'`);
    }
    if (value !== undefined && watcher.mode !== "input") {
        throw new Error(`Invalid 'value' prop in <Data> for '${watcher.mode}'`);
    }
}

onMount(async () => {
    // delay initialization till use:action is run on Semantic UI element
    await tick();

    // extract the value watcher (store and controller) from the parent's jQuery data
    let elem: JQueryApi;
    if (forId) {
        // use "forId" attribute to find the element to connect to
        elem = jQueryElemById(forId);
        if (!elem.length) {
            throw new Error(`Invalid 'forId' prop in <Data> for '${forId}'`);
        }
    } else {
        // get parent element in DOM
        elem = jQueryElem(span!).parent();
    }
    watcher = elem.data(SVELTE_DATA_STORE) as DataController<DataTypes>;
    if (!watcher) {
        // attempt find preceding input or textarea
        elem = jQueryElem(span!).prev("input, textarea");
        if (elem.length === 0) {
            throw new Error(
                "Can't find Semantic UI element for <Data> tag: " +
                    "a) Parent element of <Data> can 'use:dropdown', 'use:modal', 'use:calendar', or 'use:slider'; " +
                    "b) <Data> can immediately follow <input> or <textarea>; " +
                    "c) 'forId' attribute can be used to directly point to the element."
            );
        }
        watcher = elem.data(SVELTE_DATA_STORE) as DataController<DataTypes>;
        if (!watcher) {
            // create new input watcher with a blank formatter
            const actRes: ActionReturnType = formatAction(elem.get(0), trimFormatter);
            watcher = elem.data(SVELTE_DATA_STORE) as DataController<DataTypes>;
            destroyFormat = actRes?.destroy ?? null;
        }
    }
    validatePropsAndStoreMatch();
    console.debug(`data : ${watcher.mode} - found watcher(${watcher.uid})`);

    // push initial value into the Semantic UI element
    const propValue: DataTypes = getPropValue();
    console.debug(`data : ${watcher.mode} -> update(${watcher.uid}) = ${toStr(propValue)}`);
    watcher.doUpdate(propValue);

    // subsribe for further changes
    console.debug(`data : ${watcher.mode} - subscribe(${watcher.uid})`);
    subscribed = watcher.store.subscribe(onSubscriptionChange);

    await tick();

    // apply validation rule if the rule is supplied in <Data>
    if (validate) {
        // const inputElem: JQueryApi = ["input", "textarea", "select"].includes(elem.prop("tagName"))
        //     ? elem
        //     : elem.find("input");
        const actRes: ActionReturnType = validateAction(elem.get(0), validate);
        console.log(">>>", validate, elem.get(0));
        destroyValidate = actRes?.destroy ?? null;
    } else {
        // FIXME: this makes the console warning go away, but why ?!
        if (["calendar", "slider"].includes(watcher.mode)) {
            const actRes: ActionReturnType = validateAction(elem.get(0), []);
            console.log(">>>", [], elem.get(0));
            destroyValidate = actRes?.destroy ?? null;
        }
    }

    // TODO: Remove, or create a hidden input for the parsed (formatted) value
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
afterUpdate(() => {
    // $effect(() => {
    // listen to prop changes
    void value;
    void selected;
    void active;
    void date;
    void position;

    // skip the initial prop update, as semntic component is not ready yet
    if (!watcher) {
        return;
    }
    // update Semantic component
    const propValue: DataTypes = getPropValue();
    console.debug(`data : ${watcher.mode} -> update(${watcher.uid}) = ${toStr(propValue)}`);
    watcher.doUpdate(propValue);
});

/** Remove the subscripion */
onDestroy(() => {
    if (subscribed) {
        // unsubscribe
        console.debug(`data : ${watcher?.mode} - unsubscribe(${watcher?.uid})`);
        subscribed();
        subscribed = null;
    }

    // release the controlled memory
    if (destroyFormat) {
        destroyFormat();
        destroyFormat = null;
    }

    if (destroyValidate) {
        destroyValidate();
        destroyValidate = null;
    }
});
</script>

<span class="data-binder" bind:this={span}></span>

<style>
.data-binder {
    display: none;
}
</style>
