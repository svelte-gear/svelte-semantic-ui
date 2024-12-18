/**
 * Common field validation controller.
 * @module data/field-controller
 */

import type { FormController, RuleDefinition } from "../data/common";
import type { JQueryApi } from "../data/semantic-types";
import { uid, SVELTE_FORM_STORE } from "../data/common";

/** Iterate through ancestors till `form` if found. */
export function getParentForm(elem: JQueryApi): JQueryApi {
    let form: JQueryApi = elem;
    do {
        form = form.parent();
    } while (form && !form.hasClass("form"));

    if (!form) {
        throw new Error("use:validator must be called from a child of a 'form' component");
    }
    return form;
}

/* Adds validation rule to the field.
 * For Dropdown, use id of the select or the inner input.
 * For Calendar, use id of the innermost input.
 */

/** Get or assign field identifier: id, name, data-validate */
export function getOrAssignKey(elem: JQueryApi, prefix?: string): string {
    let key: string | undefined = elem.attr("id");
    if (!key) {
        key = elem.attr("name");
    }
    if (!key) {
        key = elem.attr("data-validate");
    }
    if (!key) {
        // assign new attribute
        key = `${prefix ?? "f"}_${uid()}`;
        elem.attr("data-validate", key);
    }
    return key;
}

// TODO: rename the file to field-controller.ts

export class FieldController {
    key: string | undefined;
    formCtrl?: FormController;
    rules?: RuleDefinition;

    constructor(elem: JQueryApi, validationRules?: RuleDefinition, prefix?: string) {
        this.key = getOrAssignKey(elem, prefix);

        // get parent form and form controller
        if (validationRules) {
            let form: JQueryApi = elem;
            do {
                form = form.parent();
            } while (form && !form.hasClass("form"));
            if (!form) {
                throw new Error(`Validated field ${this.key} must be a child of a Form component`);
            }
            this.formCtrl = form.data(SVELTE_FORM_STORE) as FormController;
            if (!this.formCtrl) {
                throw new Error(`Form controller for ${this.key} is not initialized`);
            }

            this.formCtrl.addRule(this.key, validationRules);
            this.rules = validationRules;
        }
    }

    /** Validate the new field value, if the field is validated */
    revalidate(): void {
        if (this.formCtrl) {
            this.formCtrl.onFieldChange(this.key!);
        }
    }

    /** Remove rules and revalidate */
    removeRules(): void {
        if (this.formCtrl && this.rules) {
            this.formCtrl.removeRule(this.key!, this.rules);
            // revalidate after the form has updated it's definition after the field is hidden
            setTimeout(() => {
                this.revalidate();
            }, 0);
        }
    }
}
