/**
 * Common types, jQuery API, Form and Data controllers, utility functions.
 * @module data/common
 */

import type { JQueryApi } from "../data/semantic-types";

export const SVELTE_FORM_STORE: string = "svelte_form_store";

/** Return type for a simple svelte action; with destroy(), but without update(). */
export type ActionReturnType = {
    destroy: () => void;
} | void;

//-----------------------------------------------------------------------------

/** Text format function, may be used to change case or limit charset. */
export interface TextFormatter {
    format: (val: string) => string;
}

/** Number format function, must return null if it can't parse value and doesn't want to override it. */
export interface NumberFormatter {
    format: (val: number | undefined) => string;
    parse: (val: string) => number | undefined;
}

/** Number format function, must return null if it can't parse value and doesn't want to override it. */
export interface DateFormatter {
    format: (val: Date | undefined) => string;
    parse: (val: string) => Date | undefined;
}

export interface ListFormatter {
    format: (val: string[]) => string;
    parse: (val: string) => string[];
}

//-----------------------------------------------------------------------------

/** Validation rule object: rule string and custom error prompt */
export type RuleObj = {
    type: string;
    prompt?: string;
};

/** Rule definition takes array or single instance of string or RuleObj */
export type RuleDefinition = string | string[] | RuleObj | RuleObj[]; // | BaseSchema;

//-----------------------------------------------------------------------------

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

export type ComponentInitMode = "parent" | "child" | "sibling";
const ALL_MODES: ComponentInitMode[] = ["parent", "child", "sibling"];

/** Global setting for finding corresponding Semantic UI component */
let COMPONENT_INIT_MODES: ComponentInitMode[] = ["sibling"];

/** How Init** components are looking for a Semantic UI input */
export function getComponentInitMode(): ComponentInitMode[] {
    return COMPONENT_INIT_MODES;
}

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
where the `span` Element is a parent, child, or next sibling of the component.
Search mode is usually set in setComponentInitMode(), but may be overridden by `search` parameter. */
export function findComponent(
    span: Element,
    selector: string,
    id?: string,
    search?: ComponentInitMode[]
): JQueryApi {
    let elem: JQueryApi;
    if (id) {
        // use "forId" attribute to find the element to connect to
        elem = jQueryElemById(id);
        if (elem.length && elem.is(selector)) {
            return elem;
        }
        throw new Error(`Can't find '${selector}' component with id="${id}"`);
    }
    const searchModes: ComponentInitMode[] = search ? search : COMPONENT_INIT_MODES;
    if (searchModes.includes("parent")) {
        elem = jQueryElem(span).find(selector);
        if (elem.length > 0) {
            return elem;
        }
    }
    if (searchModes.includes("child")) {
        elem = jQueryElem(span).parent(selector);
        if (elem.length > 0) {
            return elem;
        }
    }
    if (searchModes.includes("sibling")) {
        elem = jQueryElem(span).prev(selector);
        if (elem.length > 0) {
            return elem;
        }
    }
    throw new Error(`Can't find '${selector}' component as a ${searchModes.join("|")}`);
}

/*
                                                  dP   oo
                                                  88
 .d8888b. .d8888b. 88d8b.d8b. .d8888b. 88d888b. d8888P dP .d8888b.
 Y8ooooo. 88ooood8 88'`88'`88 88'  `88 88'  `88   88   88 88'  `""
       88 88.  ... 88  88  88 88.  .88 88    88   88   88 88.  ...
 `88888P' `88888P' dP  dP  dP `88888P8 dP    dP   dP   dP `88888P'

*/

/** Controls Semantic UI form element and it's data validation. */
export interface FormController {
    // formId: string;
    // mode: "sui-form" | "yup-form";
    // valid: Writable<boolean>;
    // errors: Writable<string[]>;
    // getActive(): boolean;
    // setActive(val: boolean): void;
    addRule: (key: string, rules: RuleDefinition) => void;
    removeRule: (key: string, rules: RuleDefinition) => void;
    doValidateField: (key: string) => void;
    doValidateForm: () => void;
    onFieldChange: (key: string) => void;

    validCallback?: (valid: boolean) => void;
    errorsCallback?: (errors: string[]) => void;
}

/** Semantic UI component behavior API */
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

/** Compare two Date objects or two primitives */
export function equalDates(a1: Date | undefined, a2: Date | undefined): boolean {
    if (a1 instanceof Date && a2 instanceof Date) {
        return a1.getTime() === a2.getTime();
    }
    return a1 === a2;
}

/** Compare two arrays or two primitives */
export function equalArrays(
    a1: string[] | number[] | string | number | undefined,
    a2: string[] | number[] | string | number | undefined
): boolean {
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
