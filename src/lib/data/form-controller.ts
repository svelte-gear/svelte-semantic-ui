/**
 * Svelte action to activate validation framework for the form.
 * @module data/use-form-validation
 */

import type { FormController, RuleDefinition } from "../data/common";
import type { FormSettings, JQueryApi } from "../data/semantic-types";
import { jQueryElem, uid, equalDataTypes } from "../data/common";

export type FormApi = {
    form(settings?: FormSettings): void;
    form(command: string, arg1?: unknown, arg2?: unknown): unknown;
};

/**
 * Form validation controller. Is accessed by both `<FormValidation>` and individual `<InitField>`.
 * */

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

export class SuiFormController implements FormController {
    uid: string;

    elem: JQueryApi & FormApi;

    msg: JQueryApi;

    isActive: boolean = true;

    rules: Record<string, RuleDefinition> = {};

    isValid: boolean = true;

    errors: string[] = [];

    validCallback?: (valid: boolean) => void;

    errorsCallback?: (errors: string[]) => void;

    constructor(
        elem: JQueryApi,
        validCallback?: (valid: boolean) => void,
        errorsCallback?: (errors: string[]) => void
    ) {
        this.elem = elem;
        this.uid = `FORM_${elem.attr("id") ?? uid()}`;
        this.msg = elem.find(".ui.message.error");
        if (this.msg.length === 0) {
            throw new Error("Semantic form is not initialized");
        }
        this.validCallback = validCallback ?? undefined;
        this.errorsCallback = errorsCallback ?? undefined;
    }

    private activateRule(key: string, rule: RuleDefinition): void {
        const isObject: boolean = Array.isArray(rule) || typeof rule === "object";
        const ruleStr: string = isObject ? JSON.stringify(rule) : String(rule);
        console.log(`${this.uid} : add_rule ( ${key} : ${ruleStr} )`);
        this.elem.form("add rule", key, rule);
    }

    addRule(key: string, rule: RuleDefinition): void {
        this.rules[key] = rule;
        if (this.isActive) {
            this.activateRule(key, rule);
        }
    }

    private deactivateRule(key: string, rule: RuleDefinition): void {
        const isObject: boolean = Array.isArray(rule) || typeof rule === "object";
        const ruleStr: string = isObject ? JSON.stringify(rule) : String(rule);
        console.log(`${this.uid} : remove_rule ( ${key} : ${ruleStr} )`);
        // must use 'remove field', not 'remove rule' if all the rules are removed
        this.elem.form("remove field", key);
    }

    removeRule(key: string, rule: RuleDefinition): void {
        delete this.rules[key];
        if (this.isActive) {
            this.deactivateRule(key, rule);
        }
    }

    setActive(newValue: boolean): void {
        console.log(`${this.uid} : set_active ( ${this.isActive} -> ${newValue} )`);
        // eslint-disable-next-line eqeqeq
        if (this.isActive == false && newValue == true) {
            // start validating
            Object.keys(this.rules).forEach((key: string) => {
                this.activateRule(key, this.rules[key]);
            });
            setTimeout(() => {
                this.doValidateForm();
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
        }
        this.isActive = newValue;
    }

    private checkIfValid(): void {
        const res: boolean = this.elem.form("is valid");
        // update 'valid' binding
        if (this.isValid !== res) {
            this.isValid = res;
            if (this.validCallback) {
                this.validCallback(res);
            }
        }
        // get errors from message and update 'errors' binding
        if (this.msg.length) {
            // const newErrors: string[] = [];
            // msg.find("ul li").each((_idx: number, item: Element) => {
            //     newErrors.push(jQueryElem(item).text());
            // });
            const newErrors: string[] = this.msg
                .find("ul li")
                .map((_ind: number, el: Element) => jQueryElem(el).text())
                .get();
            if (!equalDataTypes(newErrors, this.errors)) {
                this.errors = newErrors;
                if (this.errorsCallback) {
                    this.errorsCallback(newErrors);
                }
            }
        }
    }

    doValidateField(key: string): void {
        this.elem.form("validate field", key);
        this.checkIfValid();
    }

    doValidateForm(): void {
        this.elem.form("validate form");
        this.checkIfValid();
    }

    onFieldChange(key: string): void {
        void key;
        if (this.isActive) {
            this.doValidateForm();
            // FIXME: try to use this.doValidateField()
        }
    }
}
