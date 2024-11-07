/**
 * Svelte action to initialize fomantic calendar component.
 *
 * - https://fomantic-ui.com/modules/calendar.html
 *
 * @module components/use-calendar
 */

import { get, writable } from "svelte/store";

import type { ActionReturnType, JQueryApi, DataController } from "../data/common";
import type { CalendarSettings } from "../data/semantic-types";
import {
    jQueryElem,
    equalDataTypes,
    uid,
    SVELTE_DATA_STORE,
    isoDate,
    isoTime,
} from "../data/common";
import { SettingsHelper } from "../data/settings";

type CalendarType = CalendarSettings["type"]; // "datetime" | "date" | "time" | "month" | "year";

/** Calendar default settings. May be overriden by settings parameter in use:calendar() */
export const calendarDefaults: SettingsHelper<CalendarSettings> = new SettingsHelper("calendar");

type CalendarApi = {
    calendar(settings: CalendarSettings): void;
    calendar(command: string, arg1?: unknown): unknown;
};

/**
 * Initializes Fomantic UI Calendar componenet. Takes settings object as argument.
 *
 * https://fomantic-ui.com/modules/calendar.html
 *
 * Bing using `<Data bind:date` inside the component tag.
 *
 * Example:
```
    <div class="ui calendar" use:calendar={{ maxDate: new Date() }}>
        <Data bind:date={myDate} >
        <div class="ui input right icon">
            <i class="dropdown icon" />
            <input type="text" placeholder="Date" />
        </div>
    </div>
```
*/
export function calendar(
    node: Element,
    settings?: CalendarSettings /* & DateFormatSettings */
): ActionReturnType {
    const elem: JQueryApi & CalendarApi = jQueryElem(node) as JQueryApi & CalendarApi;
    if (!elem.calendar) {
        throw new Error("Semantic UI is not initialized");
    }

    // TODO: review this function scope, can it be simpyfied ?
    /** Format as date, time, or datetime depending on type */
    function format(d: Date | undefined): string {
        const cType: CalendarType | undefined =
            (settings && settings.type) ?? calendarDefaults.read().type;
        switch (cType) {
            case "date":
                return isoDate(d);
            case "time":
                return isoTime(d);
            case "datetime":
                return `${isoDate(d)} ${isoTime(d)}`;
            default:
                throw new Error(`Unrecognized calendar type setting: ${cType}`);
        }
    }

    /*
            dP
            88
 .d8888b. d8888P .d8888b. 88d888b. .d8888b.
 Y8ooooo.   88   88'  `88 88'  `88 88ooood8
       88   88   88.  .88 88       88.  ...
 `88888P'   dP   `88888P' dP       `88888P'

    */

    // create store to push data back to the binder
    const ctrl: DataController<Date> = {
        uid: uid(),
        mode: "calendar",
        store: writable(),

        /** Push value into the calendar */
        doUpdate(value: Date) {
            const curValue: Date = elem.calendar("get date") as Date;
            if (!equalDataTypes(curValue, value)) {
                console.debug(`  update(${this.uid}) -> calendar = ${format(value)}`);
                elem.calendar("set date", value);
            }
        },

        /** Return updated value from the calendar */
        onChange(newValue: Date) {
            console.debug(`  onChange(${this.uid}) = ${format(newValue)}`);
            const value: Date = get(this.store);
            if (!equalDataTypes(value, newValue)) {
                console.debug(`  store(${this.uid}) <- calendar = ${format(newValue)}`);
                this.store.set(newValue);
            }
        },
    };

    /*
                                       dP
                                       88
 .d8888b. dP   .dP .d8888b. 88d888b. d8888P
 88ooood8 88   d8' 88ooood8 88'  `88   88
 88.  ... 88 .88'  88.  ... 88    88   88
 `88888P' 8888P'   `88888P' dP    dP   dP

    */

    function onCalendarChange(
        this: JQuery<HTMLElement>,
        newValue: Date,
        text: string,
        mode: string
    ): void {
        const def: CalendarSettings = calendarDefaults.read();
        if (def.onChange) {
            def.onChange.call(this, newValue, text, mode);
        }
        // FIXME: would def.onChange be called twice?
        if (settings && settings.onChange) {
            settings.onChange.call(this, newValue, text, mode);
        }
        ctrl.onChange(newValue);
    }

    // TODO: check other component's onChange methods

    function onCalendarHidden(this: JQuery<HTMLElement>): void {
        const def: CalendarSettings = calendarDefaults.read();
        if (def.onHidden) {
            def.onHidden.call(this);
        }
        if (settings && settings.onHidden) {
            settings.onHidden.call(this);
        }
        const value: Date = elem.calendar("get date") as Date;
        ctrl.onChange(value);
    }

    /*
 oo          oo   dP
                  88
 dP 88d888b. dP d8888P
 88 88'  `88 88   88
 88 88    88 88   88
 dP dP    dP dP   dP

    */

    // Initialize Semantic component
    elem.calendar({
        // ...dateFormatDefaults,
        // ...calendarDefaults,
        ...settings,
        onChange: onCalendarChange,
        onHidden: onCalendarHidden,
    } as CalendarSettings);

    // Attach store holder to jQuery element
    console.debug(`  store(${ctrl.uid}) - ${ctrl.mode} created`);
    elem.data(SVELTE_DATA_STORE, ctrl);

    // show calendar on label click, if for="_"
    function handleClick(): void {
        elem.calendar("focus");
    }
    const field: JQueryApi = elem.parent().filter(".field");
    const labelFor: string = field.find("label").prop("for");
    if (labelFor === "_") {
        field.on("click", "label", handleClick);
    }

    return {
        destroy(): void {
            // console.debug("  >>>>>> calendar - destroy");
            if (labelFor === "_") {
                field.off("click", "label", handleClick);
            }
            // release the controlled memory
            elem.removeData(SVELTE_DATA_STORE);
        },
    };
    // const field = elem.parent().filter(".field");
    // const labelFor = field.find("label").prop("for");
}
