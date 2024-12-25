/**
 * Common types, jQuery API, Form and Data controllers, utility functions.
 * @module data/common
 */

/// <reference types="jquery" />

export type JQueryApi = JQuery<HTMLElement>;

//-----------------------------------------------------------------------------

/** Name of the jQuery data attribute used to store form controller */
export const SVELTE_FORM_STORE: string = "svelte_form_store";

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

/** Global unique id sequence */
let unum: number = 100;

/** Generate an unique number */
export function nextUid(): string {
    // const num = new Date().getTime();
    // const num = Math.round(window.performance.now());
    unum = unum + 1;
    return `000000${unum % 1000}`.slice(-3);
}
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

/** If the elem doesn't have key, copy parent field identifier: id, name, data-validate */
export function copyParentKeyIfExists(
    elem: JQueryApi,
    parent: JQueryApi,
    prefix: string
): string | undefined {
    let key: string | undefined = getFieldKey(elem);
    if (!key) {
        // assign new attribute
        const parentKey: string | undefined = getFieldKey(parent);
        if (parentKey) {
            key = `${prefix}_${parentKey}`;
            elem.attr("data-validate", key);
        }
    }
    return key;
}

/** Perform lookup for known parent types, copy parent id if it can. */
export function ensureFieldKey(elem: JQueryApi): string {
    const key: string | undefined = getFieldKey(elem);
    if (key) {
        return key;
    }
    let parent: JQueryApi = elem.parent();
    while (parent && parent.length > 0) {
        // first try the component
        if (parent.is(".ui.calendar")) {
            const k: string | undefined = copyParentKeyIfExists(elem, parent, "f_calendar");
            if (k) return k;
        }
        if (parent.is(".ui.dropdown")) {
            const k: string | undefined = copyParentKeyIfExists(elem, parent, "f_dropdown");
            if (k) return k;
        }
        if (parent.is(".ui.checkbox")) {
            const k: string | undefined = copyParentKeyIfExists(elem, parent, "f_checkbox");
            if (k) return k;
        }
        if (parent.is(".ui.slider")) {
            const k: string | undefined = copyParentKeyIfExists(elem, parent, "f_slider");
            if (k) return k;
        }

        // then field
        if (parent.is(".field")) {
            const k: string | undefined = copyParentKeyIfExists(elem, parent, "f_field");
            if (k) return k;
            break;
        }

        // exit if component or field is not found in form
        if (parent.is("form")) {
            break;
        }
        parent = parent.parent();
    }

    // assign new attribute
    return getOrAssignKey(elem, "f");
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
