/**
 * Common types, jQuery API, Form and Data controllers, utility functions.
 * @module data/common
 */

// NOTE: getting jQuery element by dom node has a strange effect inside a Svelte action:
// it doesn't see existing elements, and changes done to the element are not visible to the app.
// Getting element by id seems to fix the problem.
// This maybe caused by 'modal' component moving the element up in dom...

export const SVELTE_DATA_STORE: string = "svelte_data_store";
export const SVELTE_FORM_STORE: string = "svelte_form_store";

import type { Writable } from "svelte/store";

/** Return type for a simple svelte action; with destroy(), but without update(). */
export type ActionReturnType = {
    destroy: () => void;
} | void;

/** Format function, must return null if it can't parse value and doesn't want to override it. */
export interface Formatter {
    format: (val: DataTypes) => string;
    parse?: (val: string) => DataTypes | undefined; // FIXME: use null instead?
}

/** Validation rule object: rule string and custom error prompt */
export type RuleObj = { type: string; prompt?: string };

/** Rule definition takes array or single instance of string or RuleObj */
export type RuleDefinition = string | string[] | RuleObj | RuleObj[]; // | BaseSchema;

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
export interface JQueryApi {
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
}

/** Gets jQuery element by id attribute. */
export function jQueryElemById(id: string): JQueryApi {
    type WithJQuerySelector = { jQuery(selector: string): JQueryApi };
    // eslint-disable-next-line @typescript-eslint/unbound-method, @typescript-eslint/typedef
    const jQuery = (window as unknown as WithJQuerySelector).jQuery;
    if (!jQuery) {
        throw new Error("jQuery is not initialized");
    }
    return jQuery(`#${id}`);
}

/** Gets jQuery element by dom node. */
export function jQueryElem(node: Element): JQueryApi {
    type WithJQueryNode = { jQuery(node: Element): JQueryApi };
    // eslint-disable-next-line @typescript-eslint/unbound-method, @typescript-eslint/typedef
    const jQuery = (window as unknown as WithJQueryNode).jQuery;
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

/** Possible data types for the store */
export type DataTypes = string | string[] | boolean | Date | number | undefined;

/** Controls Semantic UI form element and it's data validation. */
export interface FormController {
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
}

/** Holds Svelte `store` allowing the `Data` component to subscribe to data changes */
export interface DataController<T extends DataTypes> {
    /** Is used for debugging. */
    uid: string;

    /** Describes the type of the controlled component. */
    mode: "dropdown" | "modal" | "calendar" | "slider" | "input";

    /** Svelte store */
    store: Writable<T>;

    /** Imperatively updates Semantic component. */
    doUpdate: (val: T) => void;

    /** Called after user data entry or interaction. */
    onChange: (value: T) => void;

    // // Yup integration
    // setValid?: (value: boolean) => void;
    // setPrompt?: (value: string | null) => void;
}

/** Semantic UI component behaviour API */
export type SemanticCommand = (
    command: string,
    v1?: unknown,
    v2?: unknown,
    v3?: unknown
) => unknown;

/*
            dP   oo dP
            88      88
 dP    dP d8888P dP 88
 88    88   88   88 88
 88.  .88   88   88 88
 `88888P'   dP   dP dP

*/

let unum: number = 100;

/** Generate an unique number */
export function uid(): string {
    // const num = new Date().getTime();
    // const num = Math.round(window.performance.now());
    unum = unum + 1;
    return `000000${unum % 1000}`.slice(-3);
}

/** Compare two arrays, two Date objects, or two primitives */
export function equalDataTypes(a1: DataTypes | undefined, a2: DataTypes | undefined): boolean {
    if (Array.isArray(a1) && Array.isArray(a2)) {
        if (a1.length != a2.length) {
            return false;
        }
        for (let i: number = 0; i < a1.length; i++) {
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

export function pad(n: number, size: number): string {
    let str: string = n.toString();
    while (str.length < size) {
        str = "0" + str;
    }
    return str;
}

/*
                     dP     dP   oo
                     88     88
 .d8888b. .d8888b. d8888P d8888P dP 88d888b. .d8888b. .d8888b.
 Y8ooooo. 88ooood8   88     88   88 88'  `88 88'  `88 Y8ooooo.
       88 88.  ...   88     88   88 88    88 88.  .88       88
 `88888P' `88888P'   dP     dP   dP dP    dP `8888P88 `88888P'
                                                  .88
                                              d8888P
*/

export type SettingsObject = {
    [key: string]: unknown;
};

export type AllSettingsJson = {
    [key: string]: SettingsObject;
};

/* prettier-ignore */
type WithJQuery = {
    jQuery?: {
        fn: {
            [key: string]: SettingsObject | undefined;
        };
    };
};

type JQuerySettings = Required<WithJQuery>["jQuery"];

/** Determine if the argument is object; not primitive, Array, of function */
function isObject(value: unknown): boolean {
    return value !== null && typeof value === "object" && !Array.isArray(value);
}

/** Recursive function to copy only matching fields. */
function copyFields(target: SettingsObject, source: SettingsObject, logName: string): void {
    for (const key in source) {
        if (Object.prototype.hasOwnProperty.call(target, key)) {
            const to: boolean = isObject(target[key]);
            const so: boolean = isObject(source[key]);
            if (to) {
                if (so) {
                    // obj <- obj
                    copyFields(
                        target[key] as SettingsObject,
                        source[key] as SettingsObject,
                        `${logName}.${key}`
                    );
                } else {
                    // obj <- prim|fn|arr
                    console.log(`Setting: '${key}' in ${logName} must be an Object.`);
                }
            } else {
                if (so) {
                    // prim|fn|arr <- obj
                    console.log(`Setting: '${key}' in ${logName} can't be an Object.`);
                } else {
                    // prim|fn|arr <- prim|fn|arr
                    target[key] = source[key];
                }
            }
        } else {
            console.log(`Unrecognized setting: '${key}' in ${logName}.`);
        }
    }
}

// /** Utility type to mark all fields and sub-objects Readonly. */
// export type DeepReadonly<T> = T extends unknown
//     ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
//     : T;

function ensureNumberSettings(jQuery: JQuerySettings): void {
    if (!jQuery.fn.number) {
        jQuery.fn.number = {
            settings: {
                decimal: ".", // TODO: implement decimal
                thousandSeparator: " ",
                listSeparator: ", ",
                moneyPrefix: "$",
                moneySuffix: "",
                moneyPrecision: 2,
            },
        };
    }
}

/** Provides acces to Sematic UI settings for different components. */
export class SettingsHelper<T> {
    compName: string;

    constructor(compName: string) {
        this.compName = compName;
    }

    /** Returns settings object. */
    read(): Required<T> {
        const jQuery: JQuerySettings | undefined = (window as unknown as WithJQuery).jQuery;
        if (!jQuery) {
            throw new Error("jQuery is not initialized.");
        }
        ensureNumberSettings(jQuery);
        const settings: T | undefined = jQuery.fn[this.compName]?.settings as T | undefined;
        if (!settings) {
            throw new Error(`Semantic UI ${this.compName} is not initialized.`);
        }
        return settings as Required<T>;
    }

    /** Copy settings into the global SUI components in jQuery. */
    apply(val: T): void {
        const jQuery: JQuerySettings | undefined = (window as unknown as WithJQuery).jQuery;
        if (!jQuery) {
            throw new Error("jQuery is not initialized.");
        }
        ensureNumberSettings(jQuery);
        const settings: T | undefined = jQuery.fn[this.compName]?.settings as T | undefined;
        if (!settings) {
            throw new Error(`Semantic UI ${this.compName} is not initialized.`);
        }
        copyFields(settings, val as SettingsObject, this.compName);
    }
}

/** Copy settings into the global SUI components and number object in jQuery. */
export function applyAllSettings(json: AllSettingsJson): void {
    const jQuery: JQuerySettings | undefined = (window as unknown as WithJQuery).jQuery;
    if (!jQuery) {
        throw new Error("jQuery is not initialized.");
    }
    ensureNumberSettings(jQuery);
    for (const name in json) {
        const settings: SettingsObject | undefined = jQuery.fn[name]?.settings as SettingsObject;
        if (!settings) {
            console.log("Ignoring unrecognized Semantic UI component: ${name}");
        } else {
            copyFields(settings, json[name], name);
        }
    }
}
// function applyAllSettings<T extends SettingsObject>(json: { [key: string]: T }): void {
