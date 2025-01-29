/**
 * Svelte form validation interface, used by FieldController and available to static functions.
 * @module data/form-controller
 */

import type { JQueryApi, RuleDefinition } from "./semantic-types";
import { stringify } from "./common";
import { findParentForm, SVELTE_FORM_STORE, jQueryElem, jQueryBySelector } from "./dom-jquery";

/*
 .8888b
 88   "
 88aaa  .d8888b. 88d888b. 88d8b.d8b.
 88     88'  `88 88'  `88 88'`88'`88
 88     88.  .88 88       88  88  88
 dP     `88888P' dP       dP  dP  dP

*/

/** FormController exposes Semantic UI form element and it's data validation.
 *  Hides implementation details of SuiFormController from the FieldController. */
export interface FormController {
    /** Register the field validation rule, activate the rule if the form validation is active */
    addRule: (key: string, rules: RuleDefinition) => void;

    /** Remove the field validation rule */
    removeRule: (key: string, rules: RuleDefinition) => void;

    /** If form validation is active - perform deduped form validation, otherwise - validate one field.
     *  Modify the rules if `ignoreEmpty` == true and field value has changed from or to 'empty'. */
    revalidateField: (key: string) => Promise<void>;

    //-------------------------------------------------------------------------

    /** Trigger validation of the individual field.
     *  Form validation is not necessary triggered at the same time. */
    doValidateField: (key: string) => void;

    /** Check form validation rules; update the UI with error prompts.
     *  If InitForm validateForm == true, doValidateForm() becomes redundant. */
    doValidateForm: () => void;

    /** Clear 'dirty' flag, and set current values as defaults.
     *  Is usually called after form data is loaded.
     *
     *  If InitForm validateForm == false,
     *  doResetForm() removes error messages and triggers "validate-on-touch" behavior. */
    doResetForm(): void;
}

/*
 .8888b                              dP   oo
 88   "                              88
 88aaa  dP    dP 88d888b. .d8888b. d8888P dP .d8888b. 88d888b. .d8888b.
 88     88    88 88'  `88 88'  `""   88   88 88'  `88 88'  `88 Y8ooooo.
 88     88.  .88 88    88 88.  ...   88   88 88.  .88 88    88       88
 dP     `88888P' dP    dP `88888P'   dP   dP `88888P' dP    dP `88888P'

*/

/** Find form controller based on event target, selector, or DOM Element of the form or its child */
export function getFormController(e: string | Element): FormController {
    if (!e) {
        throw new Error("Form not found: getFormController() function requires a parameter");
    }
    let elem: JQueryApi | undefined = undefined;
    if (typeof e === "string") {
        elem = jQueryBySelector(e);
    } else if (e instanceof Element) {
        elem = jQueryElem(e);
    }
    if (!elem) {
        throw new Error(`Form not found: can't find element for ${stringify(e)}`);
    } else if (elem.length > 1) {
        throw new Error(`Form not found: there are multiple element for ${stringify(e)}`);
    }
    const form: JQueryApi | undefined = findParentForm(elem);
    if (!form) {
        throw new Error(`Form not found for ${stringify(elem)}, ensure it has '.ui.form' class`);
    }
    const ctrl: FormController = form.data(SVELTE_FORM_STORE) as FormController;
    if (!ctrl) {
        throw new Error("Sematic UI Form is not initialized, use InitForm");
    }
    return ctrl;
}

/** Imperatively call form validation.
 *  The function may be used by name in event handler from within the form - it will find the form using event target.
 *  Alternatively it may accept jQuery selector or DOM Element as a parameter. */
export function doValidateForm(e: Event | string | Element): void {
    if (!e) {
        throw new Error("validateForm() requires a parameter: event, selector, or Element");
    }
    const e2: string | Element = e instanceof Event ? (e.target as Element) : e;
    const ctrl: FormController = getFormController(e2);
    ctrl.doValidateForm();
}

/** Imperatively initialize form state, mark it as clean and, if not active (validateForm), remove validation errors.
 *  The function may be used by name in event handler from within the form - it will find the form using event target.
 *  Alternatively it may accept jQuery selector or DOM Element as a parameter. */
export function doResetForm(e: Event | string | Element): void {
    if (!e) {
        throw new Error("setFormAsClean() requires a parameter: event, selector, or Element");
    }
    const e2: string | Element = e instanceof Event ? (e.target as Element) : e;
    const ctrl: FormController = getFormController(e2);
    ctrl.doResetForm();
}
