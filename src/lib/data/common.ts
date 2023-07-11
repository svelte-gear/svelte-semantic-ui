// common.ts
// Commonly used types and functions.

/***
 * @module jQuery API, get element, Value Watcher.
 */

export const SVELTE_DATA_STORE = "svelte_data_store";
export const SVELTE_FORM_STORE = "svelte_form_store";

// NOTE: getting jQuery element by dom node has a strange effect inside a Svelte action:
// it doesn't see existing elements, and changes done to the element are not visible to the app.
// Getting element by id seems to fix the problem.
// This maybe because 'modal' component moves the element up in dom...

import type { Writable } from "svelte/store";
import type { RuleDefinition } from "./use-validate";

/** Return type for actions without update. */
export type ActionReturnType = {
    destroy: () => void;
} | void;

/*
oo
dP .d8888b. dP    dP .d8888b. 88d888b. dP    dP
88 88'  `88 88    88 88ooood8 88'  `88 88    88
88 88.  .88 88.  .88 88.  ... 88       88.  .88
88 `8888P88 `88888P' `88888P' dP       `8888P88
88       88                                 .88
dP       dP                             d8888P
*/

/** Small subset of jQuery functions used in this library. */
export type JQueryApi = {
    parent(): JQueryApi;
    filter(selector: string): JQueryApi;
    find(selector: string): JQueryApi;
    prev(selector: string): JQueryApi;
    remove(): void;

    prop(name: string): string;
    attr(name: string): string;
    attr(name: string, value: string): void;
    hasClass(className: string): boolean;
    removeClass(className: string): void;
    length: number;

    on(event: string, selector: string | null, handler: () => void): void;
    off(event: string, selector: string | null, handler: () => void): void;
    data(key: string, value: unknown): void;
    data(key: string): unknown;

    each(fn: (idx: number, elem: Element) => void): void;
    text(): string;
    html(val: string): void;
    append(html: string): void;

    get(inx: number): Element;
    val(): string;
    val(val: string): void;
};

// /** Returns jQuery element by id attribute. */
// export function jQueryElemById(id: string): JqueryApi {
//     // eslint-disable-next-line @typescript-eslint/unbound-method
//     const jQuery = (window as unknown as WithJQuery).$;
//     if (!jQuery) {
//         throw new Error("jQuery is not initialized");
//     }
//     return jQuery(`#${id}`);
// }

/** Returns jQuery element by dom node. */
export function jQueryElem(node: Element): JQueryApi {
    type WithJQuery = { jQuery(node: Element): JQueryApi };

    // eslint-disable-next-line @typescript-eslint/unbound-method
    const jQuery = (window as unknown as WithJQuery).jQuery;
    if (!jQuery) {
        throw new Error("jQuery is not initialized");
    }
    return jQuery(node);
}

/*
                                                  dP   oo
                                                  88
 .d8888b. .d8888b. 88d8b.d8b. .d8888b. 88d888b. d8888P dP .d8888b.
 Y8ooooo. 88ooood8 88'`88'`88 88'  `88 88'  `88   88   88 88'  `""
       88 88.  ... 88  88  88 88.  .88 88    88   88   88 88.  ...
 `88888P' `88888P' dP  dP  dP `88888P8 dP    dP   dP   dP `88888P'

*/

/** Possible types for the store */
export type DataTypes = string | string[] | boolean | Date | number | undefined;

/** Holds Svelte `store` allowing the `Data` comppnent to subscribe to data changes,
 *
 * `doUpdate()` function to imperatively update Semantic component,
 *
 * event handlers, and `uid` for debuggin purposes.
 */
export type DataController<T extends DataTypes> = {
    uid: string;
    mode: "dropdown" | "modal" | "calendar" | "slider" | "input";
    store: Writable<T>;
    doUpdate: (val: T) => void;
    onChange: (value: T) => void;

    // Yup integration
    setValid?: (value: boolean) => void;
    setPrompt?: (value: string | null) => void;
};

/** Semantic UI component behaviour API */
export type SemanticCommand = (
    command: string,
    v1?: unknown,
    v2?: unknown,
    v3?: unknown
) => unknown;

export type FormController = {
    uid: string;
    mode: "sui-form" | "yup-form";
    valid: Writable<boolean>;
    errors: Writable<string[]>;
    getActive(): boolean;
    setActive(val: boolean): void;
    addRule: (key: string, rules: RuleDefinition) => void;
    doValidateField: (key: string) => void;
    doValidateForm: () => void;
    onFieldChange: (key: string) => void;
};

/*
            dP   oo dP
            88      88
 dP    dP d8888P dP 88
 88    88   88   88 88
 88.  .88   88   88 88
 `88888P'   dP   dP dP

*/

let unum = 100;

/** Three random numbers based on curretn time */
export function uid() {
    // const num = new Date().getTime();
    // const num = Math.round(window.performance.now());
    unum = unum + 1;
    return `000000${unum % 1000}`.slice(-3);
}

// /** Compare two Date values */
// export function equalDates(d1: Date | undefined, d2: Date | undefined): boolean {
//     if ((d1 && !(d1 instanceof Date)) || (d2 && !(d2 instanceof Date))) {
//         return false;
//     }
//     return d1?.getTime() == d2?.getTime();
// }

// /** Compare two arrays element-by-element */
// export function equalArrays(
//     a1: string | string[] | undefined,
//     a2: string | string[] | undefined
// ): boolean {
//     if (!Array.isArray(a1) || !Array.isArray(a2)) {
//         return false;
//     }
//     if (a1.length != a2.length) {
//         return false;
//     }
//     for (let i = 0; i < a1.length; i++) {
//         if (a1[i] !== a2[i]) {
//             return false;
//         }
//     }
//     return true;
// }

/** Compare two arrays element-by-element */
export function equalDataTypes(a1: DataTypes | undefined, a2: DataTypes | undefined): boolean {
    if (Array.isArray(a1) && Array.isArray(a2)) {
        if (a1.length != a2.length) {
            return false;
        }
        for (let i = 0; i < a1.length; i++) {
            if (a1[i] !== a2[i]) {
                return false;
            }
        }
        return true;
    }
    if (a1 instanceof Date && a2 instanceof Date) {
        return a1.getTime() == a2.getTime();
    }
    return a1 === a2;
}

/*
 .8888b                                         dP
 88   "                                         88
 88aaa  .d8888b. 88d888b. 88d8b.d8b. .d8888b. d8888P
 88     88'  `88 88'  `88 88'`88'`88 88'  `88   88
 88     88.  .88 88       88  88  88 88.  .88   88
 dP     `88888P' dP       dP  dP  dP `88888P8   dP

*/

function pad(n: number, size: number): string {
    let str = n.toString();
    while (str.length < size) {
        str = "0" + str;
    }
    return str;
}

type CalendarFmt = {
    [key: string]: (d: Date | undefined) => string;
};

/** Display date and/or time differently depeding on type */
export const calendarIsoFmt: CalendarFmt = {
    date(d: Date | undefined) {
        if (!d || !d.getDate) {
            return "";
        }
        const day = pad(d.getDate(), 2);
        const month = pad(d.getMonth() + 1, 2);
        const year = pad(d.getFullYear(), 4);
        return `${year}-${month}-${day}`;
    },
    time(d: Date | undefined) {
        if (!d || !d.getDate) {
            return "";
        }
        const hour = pad(d.getHours(), 2);
        const minute = pad(d.getMinutes(), 2);
        return `${hour}:${minute}`;
    },
    datetime(d: Date | undefined) {
        if (!d || !d.getDate) {
            return "";
        }
        return `${this.date(d)} ${this.time(d)}`;
    },
};
