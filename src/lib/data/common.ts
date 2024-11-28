/**
 * Common types, jQuery API, Form and Data controllers, utility functions.
 * @module data/common
 */

// NOTE: getting jQuery element by dom node has a strange effect inside a Svelte action:
// it doesn't see existing elements, and changes done to the element are not visible to the app.
// Getting element by id seems to fix the problem.
// This maybe caused by 'modal' component moving the element up in dom...

import type { Writable } from "svelte/store";

export const SVELTE_DATA_STORE: string = "svelte_data_store";
export const SVELTE_FORM_STORE: string = "svelte_form_store";

/** Return type for a simple svelte action; with destroy(), but without update(). */
export type ActionReturnType = {
    destroy: () => void;
} | void;

/** Format function, must return null if it can't parse value and doesn't want to override it. */
export interface Formatter {
    format: (val: DataTypes) => string;
    parse?: (val: string) => DataTypes;
}

/** Validation rule object: rule string and custom error prompt */
export type RuleObj = {
    type: string;
    prompt?: string;
};

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

/** Small subset of jQuery functions used by this library. */
export interface JQueryApi {
    parent(selector?: string): JQueryApi;
    filter(selector: string): JQueryApi;
    find(selector: string): JQueryApi;
    prev(selector: string): JQueryApi;
    is(selector: string): boolean;
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
    removeData(key: string): void;

    each(fn: (idx: number, elem: Element) => void): void;
    text(): string;
    html(val: string): void;
    append(html: string): void;

    get(inx: number): Element;
    val(): string;
    val(val: string): void;

    trigger(event: string): void;
}

/** Gets jQuery element by id attribute. */
export function jQueryElemById(id: string): JQueryApi {
    type SelectorFn = (selector: string) => JQueryApi;
    type WithJQuerySelector = {
        jQuery: SelectorFn;
    };
    const jQuery: SelectorFn = (window as unknown as WithJQuerySelector).jQuery;
    if (!jQuery) {
        throw new Error("jQuery is not initialized");
    }
    return jQuery(`#${id}`);
}

/** Gets jQuery element by dom node. */
export function jQueryElem(node: Element): JQueryApi {
    type NodeFn = (node: Element) => JQueryApi;
    type WithJQueryNode = {
        jQuery: NodeFn;
    };
    const jQuery: NodeFn = (window as unknown as WithJQueryNode).jQuery;
    if (!jQuery) {
        throw new Error("jQuery is not initialized");
    }
    return jQuery(node);
}

//-----------------------------------------------------------------------------

type ComponentInitMode = "parent" | "child" | "sibling";
const ALL_MODES: ComponentInitMode[] = ["parent", "child", "sibling"];

/** Global setting for finding corresponding Semantic UI component */
let COMPONENT_INIT_MODES: ComponentInitMode[] = ["sibling"];

/** Change component finding algorithm.
Setting to all modes will find component in any of the 3 locations.
Setting to empty array make <InitComp work only using forId. */
export function setComponentInitMode(modes: ComponentInitMode[]): void {
    modes.forEach((mode: ComponentInitMode) => {
        if (!ALL_MODES.includes(mode)) {
            throw new Error(`Invalid component init mode: ${mode}`);
        }
    });
    COMPONENT_INIT_MODES = modes;
}

/** Find corresponding Semantic UI component,
where the 'span' Element is a parent, child, or next sibling of the component */
export function findComponent(span: Element, selector: string, id?: string): JQueryApi {
    let elem: JQueryApi;
    if (id) {
        // use "forId" attribute to find the element to connect to
        elem = jQueryElemById(id);
        if (elem.length && elem.is(selector)) {
            return elem;
        }
        throw new Error(`Can't find '${selector}' component with id="${id}"`);
    }
    if (COMPONENT_INIT_MODES.includes("parent")) {
        elem = jQueryElem(span).find(selector);
        if (elem.length) {
            return elem;
        }
    }
    if (COMPONENT_INIT_MODES.includes("child")) {
        elem = jQueryElem(span).parent(selector);
        if (elem.length) {
            return elem;
        }
    }
    if (COMPONENT_INIT_MODES.includes("sibling")) {
        elem = jQueryElem(span).prev(selector);
        if (elem.length) {
            return elem;
        }
    }
    throw new Error(`Can't find '${selector}' component as a ${COMPONENT_INIT_MODES.join(", ")}`);
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
        if (a1.length !== a2.length) {
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
        return a1.getTime() === a2.getTime();
    }
    return a1 === a2;
}

export function pad(n: number, size: number): string {
    let str: string = n.toString();
    while (str.length < size) {
        str = `0${str}`;
    }
    return str;
}

export function isoDate(d: Date | undefined): string {
    if (!d || !d.getDate) {
        return "";
    }
    const day: string = pad(d.getDate(), 2);
    const month: string = pad(d.getMonth() + 1, 2);
    const year: string = pad(d.getFullYear(), 4);
    return `${year}-${month}-${day}`;
}

export function isoTime(d: Date | undefined): string {
    if (!d || !d.getDate) {
        return "";
    }
    const hour: string = pad(d.getHours(), 2);
    const minute: string = pad(d.getMinutes(), 2);
    return `${hour}:${minute}`;
}
