/**
 * Svelte action to initialize fomantic calendar component.
 *
 * - https://fomantic-ui.com/modules/calendar.html
 *
 * @module components/use-calendar
 */

import { get, writable } from "svelte/store";

import type { ActionReturnType, JQueryApi, DataController } from "../data/common";
import { jQueryElem, equalDataTypes, uid, SVELTE_DATA_STORE } from "../data/common";
import type { DateFormatSettings } from "../data/format";
import { dateFormatDefaults, fmt } from "../data/format";

export type CalendarType = "datetime" | "date" | "time";
export type OnCalendarChangeFn = (newValue: Date) => void;
export type OnCalendarHiddenFn = () => void;

/** Calendar component parameters.
    @extends DateFormatSettings */
export interface CalendarSettings extends DateFormatSettings {
    type?: CalendarType;
    touchReadonly?: boolean;
    maxDate?: Date;
    startMode?: string;
    onChange?: OnCalendarChangeFn;
    onHidden?: OnCalendarHiddenFn;
    // [key: string]: unknown;
}
// TODO: fix all settings

/** Calendar default settings. May be overriden by settings parameter in use:calendar() */
export const calendarDefaults: CalendarSettings = {
    type: "date",
    touchReadonly: false,
};

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
export function calendar(node: Element, settings?: CalendarSettings): ActionReturnType {
    const elem = jQueryElem(node) as JQueryApi & CalendarApi;
    if (!elem.calendar) {
        throw new Error("Semantic UI is not initialized");
    }

    /** Format as date, time, or datetime depending on type */
    function format(d: Date | undefined): string {
        const cType = settings && settings.type ? settings.type : "date";
        switch (cType) {
            case "date":
                return fmt.isoDate(d);
            case "time":
                return fmt.isoTime(d);
            case "datetime":
                return `${fmt.isoDate(d)} ${fmt.isoTime(d)}`;
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
            const curValue = elem.calendar("get date") as Date;
            if (!equalDataTypes(curValue, value)) {
                console.debug(`  update(${this.uid}) -> calendar = ${format(value)}`);
                elem.calendar("set date", value);
            }
        },

        /** Return updated value from the calendar */
        onChange(newValue: Date) {
            console.debug(`  onChange(${this.uid}) = ${format(newValue)}`);
            const value = get(this.store);
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

    function onCalendarChange(newValue: Date): void {
        if (calendarDefaults.onChange) {
            calendarDefaults.onChange(newValue);
        }
        if (settings && settings.onChange) {
            settings.onChange(newValue);
        }
        ctrl.onChange(newValue);
    }

    function onCalendarHidden(): void {
        if (calendarDefaults.onHidden) {
            calendarDefaults.onHidden();
        }
        if (settings && settings.onHidden) {
            settings.onHidden();
        }
        const value = elem.calendar("get date") as Date;
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

    console.log("calendarDefaults", calendarDefaults);

    // Initialize Semantic component
    elem.calendar({
        ...dateFormatDefaults,
        ...calendarDefaults,
        ...settings,
        onChange: onCalendarChange,
        onHidden: onCalendarHidden,
    });

    // Attach store holder to jQuery element
    console.debug(`  store(${ctrl.uid}) - ${ctrl.mode} created`);
    elem.data(SVELTE_DATA_STORE, ctrl);

    // show calendar on label click, if for="_"
    function handleClick(): void {
        elem.calendar("focus");
    }
    const field = elem.parent().filter(".field");
    const labelFor = field.find("label").prop("for");
    if (labelFor === "_") {
        field.on("click", "label", handleClick);
        return {
            destroy(): void {
                field.off("click", "label", handleClick);
            },
        };
    }
    // return {
    //     destroy() {
    //         console.debug("  action - destroy");
    //         const field = elem.parent().filter(".field");
    //         const labelFor = field.find("label").prop("for");
    //         if (labelFor === "_") {
    //             field.off("click", "label", handleClick);
    //         }
    //     },
    // };
}
