/**
 * Common types, jQuery API, Form and Data controllers, utility functions.
 * @module data/common
 */

import type { JQueryApi } from "../data/semantic-types";

/** Name of the jQuery data attribute used to store form controller */
export const SVELTE_FORM_STORE: string = "svelte_form_store";

//-----------------------------------------------------------------------------

/*
 oo          oo   dP                                dP
                  88                                88
 dP 88d888b. dP d8888P    88d8b.d8b. .d8888b. .d888b88 .d8888b.
 88 88'  `88 88   88      88'`88'`88 88'  `88 88'  `88 88ooood8
 88 88    88 88   88      88  88  88 88.  .88 88.  .88 88.  ...
 dP dP    dP dP   dP      dP  dP  dP `88888P' `88888P8 `88888P'

*/

/** Determines how <InitComponent> is positioned related to the input to control */
export type ComponentInitMode = "parent" | "child" | "sibling";

/** List of all init modes, used for runtime check */
const ALL_MODES: ComponentInitMode[] = ["parent", "child", "sibling"];

/** Global setting for finding corresponding Semantic UI component */
let COMPONENT_INIT_MODES: ComponentInitMode[] = ["sibling"];

/** How Init* components are looking for a Semantic UI input */
export function getComponentInitMode(): ComponentInitMode[] {
    return COMPONENT_INIT_MODES;
}

/** Change component finding algorithm.
Setting to all modes will find component in any of the 3 locations.
Setting to empty array makes Init* component work only using forId param. */
export function setComponentInitMode(modes: ComponentInitMode[]): void {
    modes.forEach((mode: ComponentInitMode) => {
        if (!ALL_MODES.includes(mode)) {
            throw new Error(`Invalid component init mode: ${mode}`);
        }
    });
    COMPONENT_INIT_MODES = modes;
}

//-----------------------------------------------------------------------------

/*
   dP
   88
 d8888P dP    dP 88d888b. .d8888b. .d8888b.
   88   88    88 88'  `88 88ooood8 Y8ooooo.
   88   88.  .88 88.  .88 88.  ...       88
   dP   `8888P88 88Y888P' `88888P' `88888P'
             .88 88
         d8888P  dP
*/

/** Validation rule object: rule string and custom error prompt */
export type RuleObj = {
    type: string;
    prompt?: string;
};

/** Rule definition takes array or single instance of string or RuleObj */
export type RuleDefinition = string | string[] | RuleObj | RuleObj[]; // | BaseSchema;

/** Controls Semantic UI form element and it's data validation. */
export interface FormController {
    addRule: (key: string, rules: RuleDefinition) => void;
    removeRule: (key: string, rules: RuleDefinition) => void;
    doValidateField: (key: string) => void;
    doValidateForm: () => void;
    onFieldChange: (key: string) => void;
}

// /** Semantic UI component behavior API */
// export type SemanticCommand = (
//     command: string,
//     v1?: unknown,
//     v2?: unknown,
//     v3?: unknown
// ) => unknown;

// /** Return type for a simple svelte action; with destroy(), but without update(). */
// export type ActionReturnType = {
//     destroy: () => void;
// } | void;

//-----------------------------------------------------------------------------

/*
            dP   oo dP
            88      88
 dP    dP d8888P dP 88
 88    88   88   88 88
 88.  .88   88   88 88
 `88888P'   dP   dP dP

*/

/** Global unique id sequence */
let unum: number = 100;

/** Generate an unique number */
export function nextUid(): string {
    // const num = new Date().getTime();
    // const num = Math.round(window.performance.now());
    unum = unum + 1;
    return `000000${unum % 1000}`.slice(-3);
}

/** Compare two Date objects */
export function equalDates(a1: Date | undefined, a2: Date | undefined): boolean {
    if (a1 instanceof Date && a2 instanceof Date) {
        return a1.getTime() === a2.getTime();
    }
    return a1 === a2;
}

/** Compare two string arrays or strings */
export function equalStringArrays(
    a1: string[] | string | undefined,
    a2: string[] | string | undefined
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

/** Compare two number arrays or numbers */
export function equalNumberArrays(
    a1: number[] | number | undefined,
    a2: number[] | number | undefined
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

/** Format a number, padded with "0" to the minimum length */
export function pad(n: number, size: number): string {
    let str: string = n.toString();
    while (str.length < size) {
        str = `0${str}`;
    }
    return str;
}

/** Format Date using YYYY-MM-DD format */
export function isoDate(d: Date | undefined): string {
    if (!d || !d.getDate) {
        return "";
    }
    const day: string = pad(d.getDate(), 2);
    const month: string = pad(d.getMonth() + 1, 2);
    const year: string = pad(d.getFullYear(), 4);
    return `${year}-${month}-${day}`;
}

/** Format Date as time using HH:mm format (24 hours) */
export function isoTime(d: Date | undefined): string {
    if (!d || !d.getDate) {
        return "";
    }
    const hour: string = pad(d.getHours(), 2);
    const minute: string = pad(d.getMinutes(), 2);
    return `${hour}:${minute}`;
}

//-----------------------------------------------------------------------------

/*
 oo  .88888.
    d8'   `8b
 dP 88     88  dP    dP .d8888b. 88d888b. dP    dP
 88 88  db 88  88    88 88ooood8 88'  `88 88    88
 88 Y8.  Y88P  88.  .88 88.  ... 88       88.  .88
 88  `8888PY8b `88888P' `88888P' dP       `8888P88
 88                                            .88
 dP                                        d8888P
*/

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

/** Get field identifier: id, name, data-validate */
export function getFieldKey(elem: JQueryApi): string | undefined {
    return elem.attr("id") ?? elem.attr("name") ?? elem.attr("data-validate");
}

/** Get or assign sequential field identifier: id, name, data-validate */
export function getOrAssignKey(elem: JQueryApi, prefix: string): string {
    let key: string | undefined = getFieldKey(elem);
    if (!key) {
        // assign new attribute
        key = `${prefix}_${nextUid()}`;
        elem.attr("data-validate", key);
    }
    return key;
}

/** If the elem doesn't have key, copy parent field identifier: id, name, data-validate */
export function copyParentKey(elem: JQueryApi, parent: JQueryApi, prefix: string): string {
    let key: string | undefined = getFieldKey(elem);
    if (!key) {
        // assign new attribute
        const parentKey: string | undefined = getFieldKey(parent);
        key = `${prefix}_${parentKey ?? nextUid()}`;
        elem.attr("data-validate", key);
    }
    return key;
}

/** Search DOM tree for a parent form element  */
export function findParentForm(elem: JQueryApi): JQueryApi | undefined {
    let node: JQueryApi = elem;
    do {
        node = node.parent();
    } while (node && !node.is("form.ui.form"));

    if (node.is("form.ui.form")) {
        return node;
    } else {
        return undefined;
    }
}

/** Find the label in the the same .ui.field with for="_" */
export function findLabelWithBlank(node: JQueryApi): JQueryApi | undefined {
    const field: JQueryApi = node.parent().filter(".field");
    const label: JQueryApi = field.find("label");
    if (label.attr("for") === "_") {
        return label;
    } else {
        return undefined;
    }
}
