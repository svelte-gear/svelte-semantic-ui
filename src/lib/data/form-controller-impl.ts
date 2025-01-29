/**
 * Svelte form validation controller, used by InitForm, implements FormController interface.
 * @module data/form-controller-impl
 */

import { tick } from "svelte";

import type { FormSettings, JQueryApi, RuleDefinition } from "./semantic-types";
import type { FormController } from "./form-controller";
import { formLog } from "./common";

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
    form(command: "reset"): void;
};

function ruleToStr(rule: RuleDefinition): string {
    const isObject: boolean = Array.isArray(rule) || typeof rule === "object";
    return isObject ? JSON.stringify(rule) : String(rule);
}

/** Form validation controller. Is accessed only from `<InitForm>` component. */
export class FormControllerImpl implements FormController {
    /** Form identifier for debug purposes */
    private formId: string;

    /** jQuery form element */
    private elem: FormApi;

    /** Validate form on each field change */
    private active: boolean;

    /** Form doesn't validate empty fields */
    private ignoreEmpty: boolean;

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
    88'  `88 88'  `88 88 88   d8' 88'  `88   88   88ooood8
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
        formLog.log(`(${this.formId}) : add_rule - ${key} : ${ruleToStr(rule)}`);
        this.elem.form("add rule", key, rule);
    }
    // TODO: prevent duplicate rules ?

    /** Make the rule inactive in Semantic UI */
    private deactivateRule(key: string, rule: RuleDefinition): void {
        formLog.log(`(${this.formId}) : remove_rule - ${key} : ${ruleToStr(rule)}`);
        // must use 'remove field', not 'remove rule' if all the rules are removed
        this.elem.form("remove field", key);
    }
    // TODO: can't remove one rule ?

    /** Check if the field value is empty */
    private fieldIsEmpty(key: string): boolean {
        const field: JQueryApi = this.elem.form("get field", key) as unknown as JQueryApi;
        const value: unknown = field.val();
        return !value;
    }

    /** Perform (deduped) form validation */
    private async revalidateForm(): Promise<void> {
        if (this.active) {
            this.markForValidation("_form_");
            await tick();
            this.validateIfMarked();
        } else {
            formLog.info(`(${this.formId}) : skip form revalidation`);
        }
    }

    /** Flag the form as requiring validation; used to dedupe multiple form validation calls */
    private markForValidation(key: string): void {
        formLog.debug(`(${this.formId}) : mark (${key})`);
        this.mustValidate = true;
    }

    /** Perform form validation, if marked; used to dedupe multiple validation calls.
     *  Returns false if the validation has already been performed from another async call. */
    private validateIfMarked(): boolean {
        if (this.mustValidate) {
            formLog.debug(`(${this.formId}) : validate`);
            this.doValidateForm();
            this.mustValidate = false;
            return true;
        } else {
            return false;
        }
    }

    /*

    oo                     dP
                           88
    dP 88d8b.d8b. 88d888b. 88
    88 88'`88'`88 88'  `88 88
    88 88  88  88 88.  .88 88
    dP dP  dP  dP 88Y888P' dP
                    88
                    dP
    */

    // used from InitForm.svelte

    /** Returns true if the form is revalidated on each field change */
    isActive(): boolean {
        return this.active;
    }

    /** Set active flag, ensure that form is validated or reset according to the flag */
    setActive(newValue: boolean): void {
        formLog.log(`(${this.formId}) : validate -> ${newValue}`);
        if (newValue === true) {
            // live form validation, updating read-only `valid` and `error` bindings
            this.active = true;
            void this.revalidateForm();
        } else {
            // remove validation prompts and switch into validate-as-touched mode
            this.active = false;
            this.doResetForm();
        }
    }

    /** Returns true if validation rules are deactivated for empty fields */
    isIgnoreEmpty(): boolean {
        return this.ignoreEmpty;
    }

    /** If field is empty, deactivate the filed rules and store in ignoredFields.
     *  Changing 'ignoreEmpty' causes one-time form validation, similar to doValidateForm().
     *  To avoid side effects call setIgnoreEmpty() before calling setActive(false). */
    setIgnoreEmpty(newValue: boolean): void {
        formLog.log(`(${this.formId}) : ignore -> ${newValue}`);
        if (newValue === true) {
            // remove rules from empty fields
            Object.keys(this.rules).forEach((key: string) => {
                if (this.fieldIsEmpty(key)) {
                    this.deactivateRule(key, this.rules[key]);
                    this.ignoredFields[key] = true;
                }
            });
            this.ignoreEmpty = true;
            if (this.active) {
                void this.revalidateForm();
            } else {
                formLog.info("ignoring empty");
            }
        } else {
            // reactivate all validation rules
            Object.keys(this.ignoredFields).forEach((key: string) => {
                this.activateRule(key, this.rules[key]);
            });
            this.ignoredFields = {};
            this.ignoreEmpty = false;
            if (this.active) {
                void this.revalidateForm();
            } else {
                formLog.info("validating empty");
            }
        }
    }
    // FIXME: changing 'ignoreEmpty' forces inactive form to revalidate, why ?
    // Dynamic rules don't have this effect...

    /*
                      dP       dP oo
                      88       88
    88d888b. dP    dP 88d888b. 88 dP .d8888b.
    88'  `88 88    88 88'  `88 88 88 88'  `""
    88.  .88 88.  .88 88.  .88 88 88 88.  ...
    88Y888P' `88888P' 88Y8888' dP dP `88888P'
    88
    dP

    */

    // accessible from Field Controller and static functions

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

    //-------------------------------------------------------------------------

    /** Trigger validation of the field */
    doValidateField(key: string): void {
        this.elem.form("validate field", key);
    }

    /** Check form validation rules; if necessary, update the UI with error prompts */
    doValidateForm(): void {
        this.elem.form("validate form");
    }

    /** Clear 'dirty' flag and sets current values as defaults.
     *  If active == false, removes error messages, which may have appeared when form rules were added or changed. */
    doResetForm(): void {
        this.elem.form("set as clean");
        if (!this.active) {
            this.elem.form("reset");
        }
    }
}
