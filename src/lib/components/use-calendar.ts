// use-calendar.ts

import { get, writable } from "svelte/store";

import type {
    ActionReturnType,
    JQueryApi,
    DataController,
    DataTypes,
    Formatter,
} from "../data/_common";
import {
    jQueryElem,
    equalDataTypes,
    uid,
    SVELTE_DATA_STORE,
    isoDate,
    isoTime,
    isoDatetime,
} from "../data/_common";

export type CalendarTranslation = {
    days: string[];
    months: string[];
    monthsShort: string[];
    today: string;
    now: string;
    am: string;
    pm: string;
};

type DateFormatFunction = (val: Date | undefined) => string;
type OnChangeFn = (newValue: Date) => void;
type OnHiddenFn = () => void;

export type CalendarSettings = {
    type?: string;
    touchReadonly?: boolean;
    ampm?: boolean;
    firstDayOfWeek?: number;
    monthFirst?: boolean;

    maxDate?: Date;
    startMode?: string;

    formatter?: {
        date?: DateFormatFunction;
        time?: DateFormatFunction;
    };
    text?: CalendarTranslation;
    onChange?: OnChangeFn;
    onHidden?: OnHiddenFn;
    // [key: string]: unknown;
};
// TODO: fix all settings

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
                return isoDate(d);
            case "time":
                return isoTime(d);
            case "datetime":
                return isoDatetime(d);
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

    function onCalendarChange(newValue: Date) {
        if (calendarDefaults.onChange) {
            calendarDefaults.onChange(newValue);
        }
        if (settings && settings.onChange) {
            settings.onChange(newValue);
        }
        ctrl.onChange(newValue);
    }

    function onCalendarHidden() {
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
        ...calendarDefaults,
        ...settings,
        onChange: onCalendarChange,
        onHidden: onCalendarHidden,
    });

    // Attach store holder to jQuery element
    console.debug(`  store(${ctrl.uid}) - ${ctrl.mode} created`);
    elem.data(SVELTE_DATA_STORE, ctrl);

    // show calendar on label click, if for="_"
    function handleClick() {
        elem.calendar("focus");
    }
    const field = elem.parent().filter(".field");
    const labelFor = field.find("label").prop("for");
    if (labelFor === "_") {
        field.on("click", "label", handleClick);
        return {
            destroy() {
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

/*
 .8888b                                         dP
 88   "                                         88
 88aaa  .d8888b. 88d888b. 88d8b.d8b. .d8888b. d8888P
 88     88'  `88 88'  `88 88'`88'`88 88'  `88   88
 88     88.  .88 88       88  88  88 88.  .88   88
 dP     `88888P' dP       dP  dP  dP `88888P8   dP

*/

// TODO: move to use-format.ts - try calendar, try date formatter, default to ISO date

export function parseDate(val: string): Date | undefined {
    if (!val) {
        return undefined;
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
    const jQuery = (window as any).jQuery;
    if (!jQuery) {
        throw new Error("jQuery in not initialized");
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const dateParser = jQuery.fn.calendar.settings.parser.date as (
        val: string,
        opt: object
    ) => Date;
    if (!dateParser) {
        throw new Error("Semantic UI calendar in not initialized");
    }
    return dateParser(val, { type: "date" });
}

export function formatDate(val: DataTypes): string {
    if (val === undefined) {
        return "";
    }
    if (!(val instanceof Date)) {
        throw new Error("numberFormatter expects Date as data type, got " + typeof val);
    }
    if (calendarDefaults.formatter?.date) {
        return calendarDefaults.formatter?.date(val);
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
    const jQuery = (window as any).jQuery;
    if (!jQuery) {
        throw new Error("jQuery in not initialized");
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const dateFormatter = jQuery.fn.calendar.settings.formatter.date as (
        val: Date | undefined,
        opt: object
    ) => string;
    if (!dateFormatter) {
        throw new Error("Semantic UI calendar in not initialized");
    }
    return dateFormatter(val, { type: "date" });
}

export class DateFormatter implements Formatter {
    parse(val: string): Date | undefined {
        return parseDate(val);
    }

    format(val: DataTypes): string {
        return formatDate(val);
    }
}
