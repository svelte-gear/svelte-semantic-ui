/**
 * Svelte action to activate validation framework for the form.
 * @module data/use-form-validation
 */

import type { FormController, RuleDefinition } from "../data/common";
import type { FormSettings, JQueryApi } from "../data/semantic-types";
import { uid } from "../data/common";

export type FormApi = {
    form(settings?: FormSettings): void;
    form(command: string, arg1?: unknown, arg2?: unknown): unknown;
};

function ruleToStr(rule: RuleDefinition): string {
    const isObject: boolean = Array.isArray(rule) || typeof rule === "object";
    return isObject ? JSON.stringify(rule) : String(rule);
}

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
    formId: string;

    elem: JQueryApi & FormApi;

    // errMsg: JQueryApi;

    isActive: boolean = false;

    rules: Record<string, RuleDefinition> = {};

    validCallback: (valid: boolean) => void;

    errorsCallback: (errors: string[]) => void;

    constructor(
        elem: JQueryApi,
        validCallback: (valid: boolean) => void,
        errorsCallback: (errors: string[]) => void
    ) {
        this.elem = elem;
        this.formId = `FORM_${elem.attr("id") ?? uid()}`;
        // this.errMsg = elem.find(".ui.message.error");
        // if (this.errMsg.length === 0) {
        //     throw new Error("Semantic form is not initialized");
        // }
        this.validCallback = validCallback;
        this.errorsCallback = errorsCallback;
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

    onFieldChange(key: string): void {
        if (this.isActive) {
            console.log(`${this.formId} : revalidate (${key})`);
            this.doValidateForm();
            // doValidateField(key) can't be used, as it doesn't cause onSuccess / on Failure event
        }
    }
}
