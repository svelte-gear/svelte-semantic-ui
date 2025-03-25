/**
 * Svelte field validation controller, used by all Init Svelte components.
 * @module data/field-controller
 */

import type { JQueryApi, RuleDefinition, RuleObj } from "../data/semantic-types";
import type { FormController } from "../data/form-controller";
import { findParentForm, SVELTE_FORM_STORE, ensureFieldKey } from "../data/dom-jquery";

// region FieldController -------------------------------------------------------------------------

export type FieldType = "calendar" | "dropdown" | "slider" | "checkbox" | "input" | "rating";

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
            const form: JQueryApi | null = findParentForm(input);
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

    // region :  public ---------------------------------------------------------------------------

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

    /** Simpler replaceRules function, assumes that it is called only when rules change */
    /*
    replaceRules(validationRules?: RuleDefinition): void {
        if (this.rules) {
            this.formCtrl?.removeRule(this.key, this.rules);
            this.rules = undefined;
        }
        if (validationRules) {
            this.formCtrl?.addRule(this.key, validationRules);
            this.rules = validationRules;
        }
        void this.revalidate();
    }
    */

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
