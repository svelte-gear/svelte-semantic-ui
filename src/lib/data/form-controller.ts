/**
 * Svelte form validation controller, reusable field validation controller, validateForm() function.
 * @module data/form-controller
 */

import { tick } from "svelte";

import type { FormSettings, JQueryApi, RuleDefinition, RuleObj } from "../data/semantic-types";
import {
    nextUid,
    findParentForm,
    SVELTE_FORM_STORE,
    jQueryElemById,
    jQueryElem,
    ensureFieldKey,
} from "../data/dom-jquery";

const REVALIDATE: boolean = true;

/*
 oo            dP                     .8888b
               88                     88   "
 dP 88d888b. d8888P .d8888b. 88d888b. 88aaa  .d8888b. .d8888b. .d8888b.
 88 88'  `88   88   88ooood8 88'  `88 88     88'  `88 88'  `"" 88ooood8
 88 88    88   88   88.  ... 88       88     88.  .88 88.  ... 88.  ...
 dP dP    dP   dP   `88888P' dP       dP     `88888P8 `88888P' `88888P'

*/

export type FormApi = {
    form(settings?: FormSettings): void;
    form(command: "add rule", key: string, rule: RuleDefinition): void;
    form(command: "remove field", key: string): void;
    form(command: "validate field"): void;
    form(command: "validate form"): void;
    form(command: "is valid"): boolean;
    form(command: "destroy"): void;
    form(command: "get field", key: string): JQueryApi;
};

/** Controls Semantic UI form element and it's data validation.
 *  Hides implementation details of SuiFormController from the FieldController.
 *  Is accessed from both `<InitForm>` and individual `<InitField>` components. */
export interface FormController {
    /** Register the field validation rule, activate the rule if the form validation is active */
    addRule: (key: string, rules: RuleDefinition) => void;

    /** Remove the field validation rule */
    removeRule: (key: string, rules: RuleDefinition) => void;

    // /** It seems that field validation doesn't affect UI */
    // doValidateField: (key: string) => void;

    /** Check form validation rules; if necessary, update the UI with error prompts */
    doValidateForm: () => void;

    /** Flag the form as requiring validation; used to dedupe multiple validation calls */
    markForValidation(key: string): void;

    /** Perform form validation, if marked; used to dedupe multiple validation calls.
     *  Returns false if the validation has already been performed from another async call. */
    validateIfMarked(): boolean;

    /** Get validated field by the key (id, name, or data-validate) */
    getField(key: string): JQueryApi;
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

/** Form validation controller. Is accessed only from `<InitForm>` component. */
export class SuiFormController implements FormController {
    /** Form identifier for debug purposes */
    formId: string;

    /** jQuery form element */
    elem: JQueryApi & FormApi;

    /** Form validation is active */
    isActive: boolean = false;

    /** Map of field validation rules */
    rules: Record<string, RuleDefinition> = {};

    /** Form validation has been triggered by markForValidation(), but not yet performed by validateIfMarked() */
    mustValidate: boolean = false;

    constructor(elem: JQueryApi) {
        this.elem = elem;
        this.formId = `FORM_${elem.attr("id") ?? nextUid()}`;
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
            if (REVALIDATE) {
                this.markForValidation("FORM");
                setTimeout(() => {
                    this.validateIfMarked();
                }, 0);
            }
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

    // doValidateField(key: string): void {
    //     this.elem.form("validate field", key);
    //     // this.checkIfValid();
    //     this.elem.form("is valid");
    // }

    doValidateForm(): void {
        this.elem.form("validate form");
        // this.checkIfValid();
        // this.elem.form("is valid"); // FIXME: is this required? remove?
    }

    markForValidation(key: string): void {
        if (this.isActive) {
            console.log(`${this.formId} : mark (${key})`);
            this.mustValidate = true;
        }
    }

    validateIfMarked(): boolean {
        if (this.isActive && this.mustValidate) {
            console.log(`${this.formId} : validate`);
            this.doValidateForm();
            this.mustValidate = false;
            return true;
        } else {
            return false;
        }
    }

    getField(key: string): JQueryApi {
        return this.elem.form("get field", key) as unknown as JQueryApi;
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
 *  Common class used by all Init* components to control field validation */
export class FieldController {
    /** Field key used for form validation, is initialized for all fields. */
    key: string | undefined;

    /** Optional reference to form controlled, is initialized only if the field has validation rules. */
    formCtrl?: FormController;

    /** Field validation rules */
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

    replaceRules(validationRules?: RuleDefinition): void {
        function isEmpty(val?: RuleDefinition): boolean {
            return val === undefined || val === "" || (Array.isArray(val) && val.length === 0);
        }
        if (isEmpty(this.rules) && !isEmpty(validationRules)) {
            // No rules previously, now we have rules
            this.rules = validationRules!;
            this.formCtrl?.addRule(this.key!, this.rules);
            return;
        } else if (!isEmpty(this.rules) && isEmpty(validationRules)) {
            // Replace rules we had with nothing
            this.rules = validationRules;
            this.removeRules();
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
            this.formCtrl?.removeRule(this.key!, this.rules!);
            this.rules = validationRules!;
            this.formCtrl?.addRule(this.key!, this.rules);
        }
    }

    /** Validate the new field value, if the field is validated (has form controller).
     *  This method is `async` as it debounces (deduplicates) the validation event
     *  in case multiple fields are modified in a single Svelte 'tick'. */
    async revalidate(): Promise<void> {
        if (this.formCtrl) {
            if (REVALIDATE) {
                this.formCtrl.markForValidation(this.key!);
                await tick();
                this.formCtrl.validateIfMarked();
            } else {
                const input: JQueryApi = this.formCtrl.getField(this.key!);
                // input.get(0)!.dispatchEvent(new CustomEvent("input"));
                // input.get(0)!.dispatchEvent(new CustomEvent("change"));
                input.get(0)!.dispatchEvent(new CustomEvent("blur"));
            }
        }
    }

    /** Remove rules and revalidate */
    removeRules(): void {
        if (this.formCtrl && this.rules) {
            this.formCtrl.removeRule(this.key!, this.rules);
            // revalidate after the form has updated it's definition
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

/** Imperatively call form validation.
 *  The function may be passed by name in event handler from within the form -
 *  in this case it will find the parent form using event target.
 *  Alternatively it may accept form id attribute as a parameter. */
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
// FIXME: this doesn't work as error display elements are hidden if not active

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
