<!--
@component
Svelte data binder for Semantic-UI `Dropdown`, `Modal`, `Calendar`, and `Slider` components.
The <Data> tag must be a child of the corresponding Semantic UI component.

https://semantic-ui.com/modules/dropdown.html

For `Dropdown` coponent, type of `selected` binding is `string` for a select,
or `string[]` for a multi-select.
Invalid value will reset the select, or get removed from the multi-select.

For `Modal` component, changing the `boolean` variable bound to `active` will show
or hide the dialofue.

`Caledar` `date` binding takes `Date` object, which may represent calendar date,
time, or date-and-time.

`Slider` component takes `value` binding of type `number`.

Example:
```
    <select class="ui selection dropdown" use:dropdown>
        <Data bind:selected={gender} />
        <option value="M">Male</option>
        <option value="F">Female</option>
    </select>

    <div id="md" class="ui modal page" use:modal>
        <Data bind:active={show} />
        ...
    </div>

    <div class="ui calendar" use:calendar>
        <Data bind:date={alarm} />
        <div class="ui input right icon">
            <i class="clock outline icon" />
            <input type="text" placeholder="Time" />
        </div>
    </div>

    <div class="ui labeled ticked slider" use:slider>
        <Data bind:position={num} />
    </div>
```
-->
<script lang="ts">
    import type { Unsubscriber } from "svelte/store";
    import { onMount, afterUpdate, onDestroy } from "svelte";

    import type { DataController, DataTypes } from "./common";
    import { equalDataTypes, calendarIsoFmt, jQueryElem, SVELTE_DATA_STORE } from "./common";
    import type { RuleDefinition } from "./data-validate";
    import { validate as validateAction } from "./data-validate";
    import { blankFormatter, format as formatAction } from "./data-format";

    /** Two-way binding for controlling and reading the Dropdown selection. */
    export let selected: string | string[] | undefined = undefined; // dropdown

    /** Two-way binding for controlling and reading the Modal state. */
    export let active: boolean | undefined = undefined; // modal

    /** Two-way binding for controlling and reading the Calendar date, time, or datetime. */
    export let date: Date | undefined = undefined; // calendar

    /** Two-way binding for controlling and reading the Slider value. */
    export let position: number | undefined = undefined; // slider

    /** Two-way binding for controlling and reading raw input value. */
    export let value: DataTypes | undefined = undefined; // slider

    /** Optional value validator. Uses Semantic UI validator syntax. */
    export let validate: RuleDefinition | undefined = undefined;

    // export let format: FormatFunction | undefined = undefined;

    /** Invisible dom element created by this component. */
    let span: Element;

    /** Object containing svelte store and update function. */
    let watcher: DataController<DataTypes>;

    /** Unsubscriber function */
    let subscribed: Unsubscriber | null;

    function fmt(val: DataTypes): string {
        if (val instanceof Date) {
            return calendarIsoFmt.datetime(val);
        }
        if (val instanceof Array) {
            return `[${val.toString()}]`;
        }
        return `${val}`;
    }

    /*
                                         dP
                                         88
 88d8b.d8b. .d8888b. dP    dP 88d888b. d8888P
 88'`88'`88 88'  `88 88    88 88'  `88   88
 88  88  88 88.  .88 88.  .88 88    88   88
 dP  dP  dP `88888P' `88888P' dP    dP   dP

    */

    /** Validate that component's parent is a ```dropdown```.
     * extract ```elem``` and ```holder```. */
    onMount(() => {
        // extract the value watcher (store and controller) from the parent's jQuery data
        let elem = jQueryElem(span).parent();
        watcher = elem.data(SVELTE_DATA_STORE) as DataController<DataTypes>;
        if (watcher) {
            // <Data> is inside a parent component

            switch (watcher.mode) {
                case "dropdown":
                case "modal":
                case "calendar":
                case "slider":
                    if (selected !== undefined && watcher.mode !== "dropdown") {
                        throw new Error(`Invalid 'active' prop in <Data> for '${watcher.mode}'`);
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
                    if (value !== undefined) {
                        throw new Error(`Invalid 'value' prop in <Data> for '${watcher.mode}'`);
                    }
                    break;
                default:
                    throw new Error(
                        `Parent of <Data> component has unrecognized store type: ${watcher.mode}`
                    );
            }
        } else {
            // attempt find preceding input or textarea
            elem = jQueryElem(span).prev("input"); //TODO: add textarea
            if (elem.length === 0) {
                throw new Error(
                    "Parent element of <Data> component must have 'use:dropdown', 'use:modal', 'use:calendar', 'use:slider', or <Data> must follow <input> or <textarea>."
                );
            }
            watcher = elem.data(SVELTE_DATA_STORE) as DataController<DataTypes>;
            if (watcher) {
                if (watcher.mode !== "input") {
                    throw new Error(
                        `Preceding <input> of <Data> component has unrecognized store type: ${watcher.mode}`
                    );
                }
            } else {
                // create new input store with blank formatter
                formatAction(elem.get(0), blankFormatter);
                watcher = elem.data(SVELTE_DATA_STORE) as DataController<DataTypes>;
            }
            if (selected !== undefined) {
                throw new Error("Invalid 'selected' prop in <Data> for 'input'");
            }
            if (active !== undefined) {
                throw new Error("Invalid 'active' prop in <Data> for 'input'");
            }
            if (date !== undefined) {
                throw new Error("Invalid 'date' prop in <Data> for 'input'");
            }
            if (position !== undefined) {
                throw new Error("Invalid 'position' prop in <Data> for 'input'");
            }
        }

        console.debug(`data : ${watcher.mode} - mount(${watcher.uid})`);

        if (validate) {
            validateAction(elem.get(0), validate);
        }
    });

    /*
                   dP
                   88
 .d8888b. dP    dP 88d888b. .d8888b. .d8888b. 88d888b.
 Y8ooooo. 88    88 88'  `88 Y8ooooo. 88'  `"" 88'  `88
       88 88.  .88 88.  .88       88 88.  ... 88
 `88888P' `88888P' 88Y8888' `88888P' `88888P' dP

    */

    /** When store value changes, modify the corresponding prop.*/
    function onSubscriptionChange(storeValue: DataTypes) {
        console.debug(`data : ${watcher.mode} <- store(${watcher.uid}) = ${fmt(storeValue)}`);

        // store in appropriate prop, if the value is different
        switch (watcher.mode) {
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
                    value = storeValue as string | string[];
                }
                break;
            default:
                throw new Error(`Unrecognized watcher mode: '${watcher.mode}'`);
        }
    }

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

    /** When 'value' prop changes, update the element and start listening to store changes. */
    afterUpdate(() => {
        // read prop value
        let propValue: DataTypes = undefined;
        switch (watcher.mode) {
            case "dropdown":
                propValue = selected;
                break;
            case "modal":
                propValue = active;
                break;
            case "calendar":
                propValue = date;
                break;
            case "slider":
                propValue = position;
                break;
            case "input":
                propValue = value;
                break;
            default:
                throw new Error(`Unrecognized watcher mode: '${watcher.mode}'`);
        }

        // update Semantic component
        console.debug(`data : ${watcher.mode} -> update(${watcher.uid}) = ${fmt(propValue)}`);
        watcher.doUpdate(propValue);

        // subsribe after the first update to avoid initial 'undefined' push from the store
        if (!subscribed) {
            console.debug(`data : ${watcher.mode} - subscribe(${watcher.uid})`);
            subscribed = watcher.store.subscribe(onSubscriptionChange);
        }
    });

    /*
       dP                     dP
       88                     88
 .d888b88 .d8888b. .d8888b. d8888P 88d888b. .d8888b. dP    dP
 88'  `88 88ooood8 Y8ooooo.   88   88'  `88 88'  `88 88    88
 88.  .88 88.  ...       88   88   88       88.  .88 88.  .88
 `88888P8 `88888P' `88888P'   dP   dP       `88888P' `8888P88
                                                          .88
                                                      d8888P
    */

    /** Remove the subscripion */
    onDestroy(() => {
        if (subscribed) {
            // unsubscribe
            console.debug(`data : ${watcher.mode} - unsubscribe(${watcher.uid})`);
            subscribed();
        }
        subscribed = null;
    });
</script>

<!--
 dP         dP              dP
 88         88              88
 88d888b. d8888P 88d8b.d8b. 88
 88'  `88   88   88'`88'`88 88
 88    88   88   88  88  88 88
 dP    dP   dP   dP  dP  dP dP

-->

<span class="data-binder" bind:this={span} />

<style>
    .data-binder {
        display: none;
    }
</style>
