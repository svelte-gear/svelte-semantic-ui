/**
 * Common field validation controller.
 * @module data/field-controller
 */

import type { FormController, RuleDefinition } from "../data/common";
import type { JQueryApi } from "../data/semantic-types";
import { findParentForm, getOrAssignKey, SVELTE_FORM_STORE } from "../data/common";

/** Adds validation rule to the field.
    Common class used by all Init* components to control field validation */
export class FieldController {
    key: string | undefined;
    formCtrl?: FormController;
    rules?: RuleDefinition;

    constructor(elem: JQueryApi, validationRules?: RuleDefinition, prefix?: string) {
        this.key = getOrAssignKey(elem, prefix);

        // get parent form and form controller
        if (validationRules) {
            // TODO: create function findParentForm()
            const form: JQueryApi | undefined = findParentForm(elem);
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
