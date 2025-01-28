/**
 * Svelte form validation controller, reusable field validation controller, validateForm() function.
 * @module data/form-controller
 */

import { tick } from "svelte";

import type { FormSettings, JQueryApi, RuleDefinition } from "../data/semantic-types";
import {
    findParentForm,
    SVELTE_FORM_STORE,
    jQueryElem,
    ensureFieldKey,
    jQueryBySelector,
} from "../data/dom-jquery";
import { stringify } from "./common";

/*
 oo            dP                     .8888b
               88                     88   "
 dP 88d888b. d8888P .d8888b. 88d888b. 88aaa  .d8888b. .d8888b. .d8888b.
 88 88'  `88   88   88ooood8 88'  `88 88     88'  `88 88'  `"" 88ooood8
 88 88    88   88   88.  ... 88       88     88.  .88 88.  ... 88.  ...
 dP dP    dP   dP   `88888P' dP       dP     `88888P8 `88888P' `88888P'

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
 .8888b
 88   "
 88aaa  .d8888b. 88d888b. 88d8b.d8b.
 88     88'  `88 88'  `88 88'`88'`88
 88     88.  .88 88       88  88  88
 dP     `88888P' dP       dP  dP  dP

*/

/** Semantic UI form behavior */
export type FormApi = {
    form(settings?: FormSettings): void;
    form(command: "add rule", key: string, rule: RuleDefinition): void;
    form(command: "remove field", key: string): void;
    form(command: "validate field", key: string): void;
    form(command: "validate form"): void;
    form(command: "is valid"): boolean;
    form(command: "destroy"): void;
    form(command: "get field", key: string): JQueryApi;
    form(command: "set as clean"): void;
    form(command: "get value", key: string): unknown;
};

function ruleToStr(rule: RuleDefinition): string {
    const isObject: boolean = Array.isArray(rule) || typeof rule === "object";
    return isObject ? JSON.stringify(rule) : String(rule);
}

/** Form validation controller. Is accessed only from `<InitForm>` component. */
export class SuiFormController implements FormController {
    /** Form identifier for debug purposes */
    private formId: string;

    /** jQuery form element */
    private elem: FormApi;

    /** Validate form on each field change */
    private active: boolean = false;

    /** Form doesn't validate empty fields */
    private ignoreEmpty: boolean = false;

    /** Map of field validation rules */
    private rules: Record<string, RuleDefinition> = {};

    /** Map of field where the validation rules are currently deactivated because the field is empty.
     *  Each rule from the `rules` is either activated or listed in `ignoredFields` */
    private ignoredFields: Record<string, boolean> = {};

    /** Form validation has been triggered by markForValidation(), but not yet performed by validateIfMarked() */
    private mustValidate: boolean = false;

    /*
                                  oo                     dP
                                                         88
                88d888b. 88d888b. dP dP   .dP .d8888b. d8888P .d8888b.
    88888888    88'  `88 88'  `88 88 88   d8' 88'  `88   88   88ooood8
                88.  .88 88       88 88 .88'  88.  .88   88   88.  ...
                88Y888P' dP       dP 8888P'   `88888P8   dP   `88888P'
                88
                dP
    */

    /** Create new form controller, is used from InitForm. */
    constructor(elem: FormApi, formId: string, active: boolean, ignoreEmpty: boolean) {
        this.elem = elem;
        this.formId = formId;
        this.active = active;
        this.ignoreEmpty = ignoreEmpty;
    }

    /** Make the rule active in Semantic UI */
    private activateRule(key: string, rule: RuleDefinition): void {
        console.log(`FORM (${this.formId}) : add_rule - ${key} : ${ruleToStr(rule)}`);
        this.elem.form("add rule", key, rule);
    }
    // FIXME: prevent duplicate rules ?

    /** Make the rule inactive in Semantic UI */
    private deactivateRule(key: string, rule: RuleDefinition): void {
        console.log(`FORM (${this.formId}) : remove_rule - ${key} : ${ruleToStr(rule)}`);
        // must use 'remove field', not 'remove rule' if all the rules are removed
        this.elem.form("remove field", key);
    }
    // FIXME: can't remove one rule ?

    /** Check if the field value is empty */
    private fieldIsEmpty(key: string): boolean {
        const field: JQueryApi = this.elem.form("get field", key) as unknown as JQueryApi;
        const value: unknown = field.val();
        return !value;
    }

    /** Perform (deduped) form validation */
    private async revalidateForm(): Promise<void> {
        this.markForValidation("_form_");
        await tick();
        this.validateIfMarked();
    }

    /** Flag the form as requiring validation; used to dedupe multiple form validation calls */
    private markForValidation(key: string): void {
        console.log(`FORM (${this.formId}) : mark (${key})`);
        this.mustValidate = true;
    }

    /** Perform form validation, if marked; used to dedupe multiple validation calls.
     *  Returns false if the validation has already been performed from another async call. */
    private validateIfMarked(): boolean {
        if (this.mustValidate) {
            console.log(`FORM (${this.formId}) : validate`);
            this.doValidateForm();
            this.mustValidate = false;
            return true;
        } else {
            return false;
        }
    }

    /*
                oo          oo   dP       .8888b
                                 88       88   "
                dP 88d888b. dP d8888P     88aaa  .d8888b. 88d888b. 88d8b.d8b.
    88888888    88 88'  `88 88   88       88     88'  `88 88'  `88 88'`88'`88
                88 88    88 88   88       88     88.  .88 88       88  88  88
                dP dP    dP dP   dP       dP     `88888P' dP       dP  dP  dP

    */
    // used from InitForm.svelte

    /** Returns true if the form is revalidated on each field change */
    isActive(): boolean {
        return this.active;
    }

    setActive(newValue: boolean): void {
        console.debug(`FORM (${this.formId}) : validate -> ${newValue}`);
        if (newValue === true) {
            this.active = true;
            void this.revalidateForm();
        } else {
            this.active = false;
            // TODO: reset form UI ?
        }
    }

    isIgnoreEmpty(): boolean {
        return this.ignoreEmpty;
    }

    /** Deactivate rules and store in ignoredField, if field is empty. */
    setIgnoreEmpty(newValue: boolean): void {
        console.debug(`FORM (${this.formId}) : ignore -> ${newValue}`);
        if (newValue === true) {
            Object.keys(this.rules).forEach((key: string) => {
                if (this.fieldIsEmpty(key)) {
                    this.deactivateRule(key, this.rules[key]);
                    this.ignoredFields[key] = true;
                }
            });
            this.ignoreEmpty = true;
            if (this.active) {
                void this.revalidateForm();
            }
        } else {
            Object.keys(this.ignoredFields).forEach((key: string) => {
                this.activateRule(key, this.rules[key]);
            });
            this.ignoredFields = {};
            this.ignoreEmpty = false;
            if (this.active) {
                void this.revalidateForm();
            }
        }
    }

    /*
                                  dP       dP oo
                                  88       88
                88d888b. dP    dP 88d888b. 88 dP .d8888b.
    88888888    88'  `88 88    88 88'  `88 88 88 88'  `""
                88.  .88 88.  .88 88.  .88 88 88 88.  ...
                88Y888P' `88888P' 88Y8888' dP dP `88888P'
                88
                dP
    */
    // accessible from field controller and static function

    /** Register the field validation rule, activate the rule if the form validation is active */
    addRule(key: string, rule: RuleDefinition): void {
        this.rules[key] = rule;
        if (this.ignoreEmpty && this.fieldIsEmpty(key)) {
            this.ignoredFields[key] = true;
        } else {
            this.activateRule(key, rule);
        }
    }

    /** Remove the field validation rule */
    removeRule(key: string, rule: RuleDefinition): void {
        delete this.rules[key];
        delete this.ignoredFields[key];
        this.deactivateRule(key, rule);
    }

    /** Trigger validation of the field */
    doValidateField(key: string): void {
        this.elem.form("validate field", key);
    }

    /** Check form validation rules; if necessary, update the UI with error prompts */
    doValidateForm(): void {
        this.elem.form("validate form");
    }

    /** Set the state of the form to 'clean', store current field values as default */
    setAsClean(): void {
        this.elem.form("set as clean");
    }

    /** Modify the rules if `ignoreEmpty` and field value has changed from or to 'empty'.
     *  If `active` - perform (deduped) form validation, otherwise - validate one field. */
    async revalidateField(key: string): Promise<void> {
        if (this.ignoreEmpty && this.rules[key]) {
            // remove form rules if field became empty
            if (this.fieldIsEmpty(key) && !this.ignoredFields[key]) {
                this.deactivateRule(key, this.rules[key]);
                this.ignoredFields[key] = true;
            }
            // add form rules if field became not-empty
            if (!this.fieldIsEmpty(key) && this.ignoredFields[key]) {
                this.activateRule(key, this.rules[key]); // FIXME: must ignore duplicates
                delete this.ignoredFields[key];
            }
        }
        if (this.active) {
            this.markForValidation(key);
            await tick();
            this.doValidateField(key);
            this.validateIfMarked();
        } else {
            this.doValidateField(key);
        }
        // doValidateField looks redundant for active, but helps with updating UI after formatter,
        // looks like 'revalidate' option somehow triggers extra field validation with old (empty) rule
    }
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
