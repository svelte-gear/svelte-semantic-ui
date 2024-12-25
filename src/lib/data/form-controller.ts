/**
 * Svelte action to activate validation framework for the form.
 * @module data/form-controller
 */

import { tick } from "svelte";

import type { RuleDefinition } from "../data/common";
import type { JQueryApi } from "../data/dom-jquery";
import type { FormSettings } from "../data/semantic-types";
import {
    nextUid,
    findParentForm,
    SVELTE_FORM_STORE,
    jQueryElemById,
    jQueryElem,
    ensureFieldKey,
} from "../data/dom-jquery";

export type FormApi = {
    form(settings?: FormSettings): void;
    form(command: string, arg1?: unknown, arg2?: unknown): unknown;
};

/** Controls Semantic UI form element and it's data validation.
    Hides implementation details of SuiFormController from the FieldController. */
export interface FormController {
    addRule: (key: string, rules: RuleDefinition) => void;
    removeRule: (key: string, rules: RuleDefinition) => void;
    doValidateField: (key: string) => void;
    doValidateForm: () => void;
    markForValidation(key: string): void;
    validateIfMarked(): boolean;
}

/*
 .8888b
 88   "
 88aaa  .d8888b. 88d888b. 88d8b.d8b.
 88     88'  `88 88'  `88 88'`88'`88
 88     88.  .88 88       88  88  88
 dP     `88888P' dP       dP  dP  dP

*/

function ruleToStr(rule: RuleDefinition): string {
    const isObject: boolean = Array.isArray(rule) || typeof rule === "object";
    return isObject ? JSON.stringify(rule) : String(rule);
}

/**
 * Form validation controller. Is accessed by both `<FormValidation>` and individual `<InitField>`.
 * */

export class SuiFormController implements FormController {
    formId: string;

    elem: JQueryApi & FormApi;

    isActive: boolean = false;

    rules: Record<string, RuleDefinition> = {};

    hasToValidate: boolean = false;

    // validCallback: (valid: boolean) => void;

    // errorsCallback: (errors: string[]) => void;

    constructor(elem: JQueryApi) {
        this.elem = elem;
        this.formId = `FORM_${elem.attr("id") ?? nextUid()}`;

        // this.errMsg = elem.find(".ui.message.error");
        // if (this.errMsg.length === 0) {
        //     throw new Error("Semantic form is not initialized");
        // }
        // this.validCallback = validCallback;
        // this.errorsCallback = errorsCallback;
    }

    private activateRule(key: string, rule: RuleDefinition): void {
        console.log(`${this.formId} : add_rule - ${key} : ${ruleToStr(rule)}`);
        this.elem.form("add rule", key, rule);
    }

    private deactivateRule(key: string, rule: RuleDefinition): void {
        console.log(`${this.formId} : remove_rule - ${key} : ${ruleToStr(rule)}`);
        // must use 'remove field', not 'remove rule' if all the rules are removed
        this.elem.form("remove field", key);
    }

    addRule(key: string, rule: RuleDefinition): void {
        this.rules[key] = rule;
        if (this.isActive) {
            this.activateRule(key, rule);
        }
    }

    removeRule(key: string, rule: RuleDefinition): void {
        delete this.rules[key];
        if (this.isActive) {
            this.deactivateRule(key, rule);
        }
    }

    setActive(newValue: boolean): void {
        console.debug(`${this.formId} : active -> ${newValue}`);

        // eslint-disable-next-line eqeqeq
        if (this.isActive == false && newValue == true) {
            // start validating
            Object.keys(this.rules).forEach((key: string) => {
                this.activateRule(key, this.rules[key]);
            });
            this.isActive = true;
            this.markForValidation("FORM");
            setTimeout(() => {
                this.validateIfMarked();
                // this.doValidateForm();
            }, 0);
        }

        // eslint-disable-next-line eqeqeq
        if (this.isActive == true && newValue == false) {
            Object.keys(this.rules).forEach((key: string) => {
                this.deactivateRule(key, this.rules[key]);
            });
            // remove validation highlights
            this.elem.find(".field.error").removeClass("error");
            this.elem.find(".message.error").html("");
            this.elem.find(".prompt").remove();
            this.isActive = false;
        }
    }

    // private checkIfValid(): void {
    //     console.debug("CHECK IF VALID");

    //     // update 'valid' binding
    //     const res: boolean = this.elem.form("is valid");
    //     // this.validCallback(res);

    //     // // get errors from message and update 'errors' binding
    //     // if (this.errMsg.length) {
    //     //     // const newErrors: string[] = [];
    //     //     // msg.find("ul li").each((_idx: number, item: Element) => {
    //     //     //     newErrors.push(jQueryElem(item).text());
    //     //     // });
    //     //     const newErrors: string[] = this.errMsg
    //     //         .find("ul li")
    //     //         .map((_ind: number, el: Element) => jQueryElem(el).text())
    //     //         .get();
    //     //     console.debug("NEW ERRORS", this.errMsg, newErrors);
    //     //     this.errorsCallback(newErrors);
    //     // }
    // }

    doValidateField(key: string): void {
        this.elem.form("validate field", key);
        // this.checkIfValid();
        this.elem.form("is valid");
    }

    doValidateForm(): void {
        this.elem.form("validate form");
        // this.checkIfValid();
        this.elem.form("is valid");
    }

    markForValidation(key: string): void {
        if (this.isActive) {
            console.log(`${this.formId} : mark (${key})`);
            this.hasToValidate = true;
        }
    }

    validateIfMarked(): boolean {
        if (this.isActive && this.hasToValidate) {
            console.log(`${this.formId} : validate`);
            this.doValidateForm();
            this.hasToValidate = false;
            return true;
        } else {
            return false;
        }
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

/** Adds validation rule to the field.
    Common class used by all Init* components to control field validation */
export class FieldController {
    key: string | undefined;
    formCtrl?: FormController;
    rules?: RuleDefinition;

    constructor(elem: JQueryApi, validationRules?: RuleDefinition) {
        this.key = ensureFieldKey(elem);

        // get parent form and form controller
        if (validationRules) {
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

    /** Validate the new field value, if the field is validated (has form controller).
        This method is `async` as it debounces (deduplicates) the validation event
        in case multiple fields are modified in a single Svelte "tick". */
    async revalidate(): Promise<void> {
        if (this.formCtrl) {
            this.formCtrl.markForValidation(this.key!);
            await tick();
            this.formCtrl.validateIfMarked();
            // this.formCtrl.onFieldChange(this.key!);
        }
    }

    /** Remove rules and revalidate */
    removeRules(): void {
        if (this.formCtrl && this.rules) {
            this.formCtrl.removeRule(this.key!, this.rules);
            // revalidate after the form has updated it's definition after the field is hidden
            void this.revalidate();
        }
    }
}

/*
 .8888b                              dP   oo
 88   "                              88
 88aaa  dP    dP 88d888b. .d8888b. d8888P dP .d8888b. 88d888b.
 88     88    88 88'  `88 88'  `""   88   88 88'  `88 88'  `88
 88     88.  .88 88    88 88.  ...   88   88 88.  .88 88    88
 dP     `88888P' dP    dP `88888P'   dP   dP `88888P' dP    dP

*/

/** Imperatively call form validation, may be passed by name in event handler from within the form.
    In this case it will find the parent form using event target.
    Or may be called with form id attribute as a string. */
export function validateForm(e: MouseEvent | KeyboardEvent | string): void {
    if (!e) {
        throw new Error("validateForm() requires a parameter: event or string dom id");
    }
    let elem: JQueryApi | undefined = undefined;
    if (typeof e === "string") {
        elem = jQueryElemById(e);
    } else {
        if (!e.target) {
            throw new Error(
                `validateForm() requires a parameter: event or string dom id, got ${typeof e} ${e.type}`
            );
        }
        elem = jQueryElem(e.target as Element);
    }
    const form: JQueryApi | undefined = findParentForm(elem);
    if (!form) {
        throw new Error("Form not found");
    }
    const ctrl: FormController = form.data(SVELTE_FORM_STORE) as FormController;
    ctrl.doValidateForm();
}

// function getFieldByKey(key: string): JQueryApi {
//     let field = elem.find(`#${key}`);
//     if (field.length > 0) {
//         return field;
//     }
//     field = elem.find(`[name=${key}]`);
//     if (field.length > 0) {
//         return field;
//     }
//     field = elem.find(`[data-validate=${key}]`);
//     if (field.length > 0) {
//         return field;
//     }
//     throw new Error(`Field not found for key=${key}`);
// }

// function getFieldPrompt(key: string): string {
//     const field = getFieldByKey(key);
//     const prompt = field.parent().find(".prompt");
//     if (prompt.length > 0) {
//         return prompt.text();
//     } else {
//         return "";
//     }
// }
