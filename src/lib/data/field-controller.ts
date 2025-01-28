/**
 * Svelte form validation controller, reusable field validation controller, validateForm() function.
 * @module data/form-controller
 */

import type { JQueryApi, RuleDefinition, RuleObj } from "./semantic-types";
import { stringify } from "./common";
import {
    findParentForm,
    SVELTE_FORM_STORE,
    jQueryElem,
    ensureFieldKey,
    jQueryBySelector,
} from "./dom-jquery";

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

    /** Trigger validation of the field */
    doValidateField: (key: string) => void;

    /** Check form validation rules; if necessary, update the UI with error prompts */
    doValidateForm: () => void;

    /** Set the state of the form to clean and set current values as default */
    setAsClean(): void;

    /** If form controller is `active` - perform deduped form validation, otherwise - validate one field.
     *  Modify the rules if `ignoreEmpty` and field value has changed from or to 'empty'. */
    revalidateField: (key: string) => Promise<void>;
}

/*
 .8888b oo          dP       dP
 88   "             88       88
 88aaa  dP .d8888b. 88 .d888b88
 88     88 88ooood8 88 88'  `88
 88     88 88.  ... 88 88.  .88
 dP     dP `88888P' dP `88888P8

*/

export type FieldType = "calendar" | "dropdown" | "slider" | "checkbox" | "input";

/** Adds validation rule to the field.
 *  Common class used by all Init* components to control field validation */
export class FieldController {
    /** Field key used for form validation, is initialized for all fields. */
    key: string;

    type: FieldType;

    /** Optional reference to form controlled, is initialized only if the field has validation rules. */
    formCtrl?: FormController;

    /** Field validation rules */
    rules?: RuleDefinition;

    /** Create ne field controller for the input. If it is validated, find and store form controller */
    constructor(type: FieldType, input: JQueryApi, validationRules?: RuleDefinition) {
        this.type = type;
        this.key = ensureFieldKey(input);

        // get parent form and form controller
        if (validationRules) {
            const form: JQueryApi | undefined = findParentForm(input);
            if (!form) {
                throw new Error(
                    `Validated field ${this.key} must be a child of a <form class="ui form">`
                );
            }
            this.formCtrl = form.data(SVELTE_FORM_STORE) as FormController;
            if (!this.formCtrl) {
                throw new Error(
                    `Form controller for ${this.key} is not initialized, use <InitForm> on the parent form element`
                );
            }
            this.formCtrl.addRule(this.key, validationRules);
            this.rules = validationRules;
            // revalidate after the form has updated it's definition
            void this.revalidate(); // NEW
        }
    }

    /** Update filed validation rules if they are changed at runtime */
    replaceRules(validationRules?: RuleDefinition): void {
        function isEmpty(val?: RuleDefinition): boolean {
            return val === undefined || val === "" || (Array.isArray(val) && val.length === 0);
        }
        if (isEmpty(this.rules) && !isEmpty(validationRules)) {
            // No rules previously, now we have rules
            this.rules = validationRules!;
            this.formCtrl?.addRule(this.key, this.rules);
            void this.revalidate();
            return;
        } else if (!isEmpty(this.rules) && isEmpty(validationRules)) {
            // Replace rules we had with nothing
            this.rules = validationRules;
            this.removeRules();
            void this.revalidate();
            return;
        }
        function isRuleObj(val?: RuleDefinition): val is RuleObj {
            return typeof val === "object" && "type" in val;
        }
        function isEqual(lhs?: RuleDefinition, rhs?: RuleDefinition): boolean {
            if (lhs === rhs) {
                return true;
            } else if (isRuleObj(lhs) && isRuleObj(rhs)) {
                return lhs.type === rhs.type && lhs.prompt === rhs.prompt;
            } else if (Array.isArray(lhs) && Array.isArray(rhs)) {
                if (lhs.length === rhs.length) {
                    for (let i: number = 0, len: number = lhs.length; i !== len; ++i) {
                        if (!isEqual(lhs[i], rhs[i])) {
                            return false;
                        }
                    }
                    return true;
                }
                return false;
            }
            return false;
        }
        if (!isEqual(this.rules, validationRules)) {
            this.formCtrl?.removeRule(this.key, this.rules!);
            this.rules = validationRules!;
            this.formCtrl?.addRule(this.key, this.rules);
            void this.revalidate();
        }
    }

    // /** Simpler replaceRules function, assumes that it is called only when rules change */
    // replaceRules(validationRules?: RuleDefinition): void {
    //     if (this.rules) {
    //         this.formCtrl?.removeRule(this.key, this.rules);
    //         this.rules = undefined;
    //     }
    //     if (validationRules) {
    //         this.formCtrl?.addRule(this.key, validationRules);
    //         this.rules = validationRules;
    //     }
    //     void this.revalidate();
    // }

    /** Validate the new field value, if the field is validated (has form controller).
     *  This method is `async` as it debounces (deduplicates) the validation event
     *  in case multiple fields are modified in a single Svelte 'tick'. */
    async revalidate(): Promise<void> {
        if (this.formCtrl) {
            await this.formCtrl.revalidateField(this.key);
        }
    }

    /** Remove rules and revalidate */
    removeRules(): void {
        if (this.formCtrl && this.rules) {
            this.formCtrl.removeRule(this.key, this.rules);
            // revalidate after the form has updated it's definition
            void this.revalidate();
        }
    }
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
export function getFormController(e: Event | string | Element): FormController {
    if (!e) {
        throw new Error("Form not found: the function requires a parameter");
    }
    let elem: JQueryApi | undefined = undefined;
    if (typeof e === "string") {
        elem = jQueryBySelector(e);
    } else if (e instanceof Event) {
        elem = jQueryElem(e.target as Element);
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
 *  The function may be passed by name in event handler from within the form -
 *  in this case it will find the parent form using event target.
 *  Alternatively it may accept jQuery selector or DOM Element as a parameter. */
export function validateForm(e: Event | string | Element): void {
    if (!e) {
        throw new Error("validateForm() requires a parameter: event, selector, or Element");
    }
    const ctrl: FormController = getFormController(e);
    ctrl.doValidateForm();
}

/** Remember current form values as its 'clean' state. */
export function setFormAsClean(e: Event | string | Element): void {
    if (!e) {
        throw new Error("setFormAsClean() requires a parameter: event, selector, or Element");
    }
    const ctrl: FormController = getFormController(e);
    ctrl.setAsClean();
}
