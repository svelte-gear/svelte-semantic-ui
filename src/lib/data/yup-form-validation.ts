// yup-form-validation.ts

import { get, writable } from "svelte/store";
import type { RuleDefinition } from "./_common";
// import { BaseSchema } from "yup";

import type { FormController, JQueryApi } from "./_common";
import { jQueryElem, uid, equalDataTypes, SVELTE_FORM_STORE } from "./_common";

export type YupValidationSettings = {
    schema?: unknown;
    // TODO: desing, implement
    on?: "submit" | "blur" | "change";
    revalidate?: boolean;
    delay?: boolean;
    inline?: boolean;
};

export const yupValidationDefaults: YupValidationSettings = {
    schema: {},
};

// how to use yup for form validation?
// can i validate only one field in the yup schema?
// how to add new field to the schema?

/*
 .8888b
 88   "
 88aaa  .d8888b. 88d888b. 88d8b.d8b.
 88     88'  `88 88'  `88 88'`88'`88
 88     88.  .88 88       88  88  88
 dP     `88888P' dP       dP  dP  dP

 */

/** Svelte action to initialize Semantic UI Form component with validation.
 *
 * https://semantic-ui.com/behaviors/form.html
 *
 * Example:
```
    <form class="ui form" use:suiFormValidation={{ inline: true }} />
        <input class="ui input"  />
        <Data
            bind:value={name}
            validate={yup.string().email('Invalid email').required('Email is required')}
        />
        ...
        <div class="ui message error" />
    </div>
```
 * Fields are matched by 'id', 'name', or 'data-validate' attribute.
 * Create `<div class="ui message error" />` to display the messages.
 *
 * For Dropdown, use id of the select or inner input.
 * For Calendar, use id of the innermost input.
*/
export function formValidation(node: Element, settings?: YupValidationSettings): void {
    type FormApi = {
        form(settings?: YupValidationSettings): void;
        form(command: string, arg1?: unknown, arg2?: unknown): unknown;
    };
    const elem = jQueryElem(node) as JQueryApi & FormApi;
    if (!elem.form) {
        throw new Error("Semantic form is not initialized");
    }
    const msg = elem.find(".ui.message.error");

    function getFormErrors(): string[] {
        const errors: string[] = [];
        msg.find("ul li").each((_idx, item) => {
            errors.push(jQueryElem(item).text());
        });
        return errors;
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

    /*
            dP
            88
 .d8888b. d8888P .d8888b. 88d888b. .d8888b.
 Y8ooooo.   88   88'  `88 88'  `88 88ooood8
       88   88   88.  .88 88       88.  ...
 `88888P'   dP   `88888P' dP       `88888P'

    */

    /**
     * `fieldChange()` function is called by `validator` action when any of the fileds changes.
     * `validateForm()` function is performs form validation.
     */
    const ctrl: FormController & { active: boolean } = {
        uid: uid(),
        mode: "sui-form",
        valid: writable<boolean>(),
        errors: writable<string[]>([]),

        active: true,

        getActive(): boolean {
            return this.active;
        },
        setActive(newValue: boolean): void {
            console.log("SET ACTIVE", this.active, "->", newValue);
            if (this.active == false && newValue == true) {
                // start validating
                this.doValidateForm();
            }
            if (this.active == true && newValue == false) {
                // remove validation highlights
                elem.find(".field.error").removeClass("error");
                elem.find(".message.error").html("");
                elem.find(".prompt").remove();
            }
            this.active = newValue;
        },

        addRule(key: string, rules: RuleDefinition): void {
            // if (rules instanceof BaseSchema) {
            //     throw new Error(`Got yup rule in SUI validator ${key}`);
            // }
            console.log(`ADD_RULE ${key} : ${rules}`);
            elem.form("add rule", key, rules);
        },

        doValidateField(key: string): void {
            elem.form("validate field", key);
        },

        doValidateForm(): void {
            elem.form("validate form");
            const res = elem.form("is valid") as boolean;
            // update 'valid' binding
            if (get(this.valid) !== res) {
                this.valid.set(res);
            }
            // get errors from message and update 'errors' binding
            if (msg.length) {
                const curr = get(this.errors);
                const errors = getFormErrors();
                if (!equalDataTypes(curr, errors)) {
                    this.errors.set(errors);
                }
            }
        },

        onFieldChange(key: string): void {
            void key;
            // console.log("ON", key);

            if (this.active) {
                // console.log("IF", this.active);
                this.doValidateForm();
            }
        },
    };

    // Initialize Semantic compponent
    elem.form({
        ...yupValidationDefaults,
        ...settings,
    });

    // Attach store holder to jQuery element
    console.debug(`  store(${ctrl.uid}) - ${ctrl.mode} created`);
    elem.data(SVELTE_FORM_STORE, ctrl);
}
