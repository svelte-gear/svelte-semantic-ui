// validate-field.ts

import type { Unsubscriber } from "svelte/store";

// import type { BaseSchema } from "yup";

import type { RuleDefinition } from "./_validation-rules";
import type {
    DataController,
    DataTypes,
    FormController,
    JQueryApi,
    SemanticCommand,
} from "./_common";
import { jQueryElem, uid, SVELTE_DATA_STORE, SVELTE_FORM_STORE } from "./_common";

/** Iterate through ancestors till `form` if found. */
function getParentForm(elem: JQueryApi): JQueryApi {
    let form = elem;
    do {
        form = form.parent();
    } while (form && !form.hasClass("form"));

    if (!form) {
        throw new Error("use:validator must be called from a child of a 'form' component");
    }
    return form;
}

/** Get or assign field identifier: id, name, data-validate. */
function getFieldKey(elem: JQueryApi): string {
    // get or assign field identifier: id, name, data-validate
    let key = elem.prop("id");
    if (!key) {
        key = elem.prop("name");
    }
    if (!key) {
        key = elem.attr("data-validate");
    }
    if (!key) {
        // assign new attribute
        key = `f_${uid()}`;
        elem.attr("data-validate", key);
    }
    return key;
}

/*
                   dP oo       dP            dP
                   88          88            88
 dP   .dP .d8888b. 88 dP .d888b88 .d8888b. d8888P .d8888b.
 88   d8' 88'  `88 88 88 88'  `88 88'  `88   88   88ooood8
 88 .88'  88.  .88 88 88 88.  .88 88.  .88   88   88.  ...
 8888P'   `88888P8 dP dP `88888P8 `88888P8   dP   `88888P'

*/

/** Adds validation rule to the field.
 * For Dropdown, use id of the select or the inner input.
 * For Calendar, use id of the innermost input.
 */
export function validateField(node: Element, rules: RuleDefinition) {
    const elem = jQueryElem(node);
    const form = getParentForm(elem) as JQueryApi & { form: SemanticCommand };

    let key: string;
    let formCtrl: FormController;
    let subscribed: Unsubscriber | null;

    // onChange event handler
    function revalidate() {
        // wait for data change to propagate
        setTimeout(() => {
            // console.log("REVALIDATE ->");
            formCtrl.onFieldChange(key);
        }, 0);
    }

    // wait for form to be created, then add the rule
    setTimeout(() => {
        const input = ["INPUT", "SELECT", "TEXTAREA"].includes(elem.prop("tagName"))
            ? elem
            : elem.find("input, select, textarea");
        if (!input.length) {
            throw new Error(`Can't validate component without input : ${elem.prop("outerHTML")}`);
        }
        key = getFieldKey(input);

        formCtrl = form.data(SVELTE_FORM_STORE) as FormController;
        if (!formCtrl) {
            throw new Error("Form controller is not initalized");
        }
        formCtrl.addRule(key, rules);

        const dataCtrl = elem.data(SVELTE_DATA_STORE) as DataController<DataTypes>;
        // console.log("CTRL", dataCtrl);
        if (dataCtrl) {
            subscribed = dataCtrl.store.subscribe(revalidate);
        } else {
            if (elem.prop("tagName") === "INPUT") {
                elem.on("change", null, revalidate);
                // console.log("ON", (elem as unknown as Array<Element>)[0]);
            }
        }
    }, 0);

    return {
        // FIXME: move to field destroy!!!
        destroy() {
            const dataCtrl = elem.data(SVELTE_DATA_STORE) as DataController<DataTypes>;
            if (dataCtrl) {
                if (subscribed) {
                    // unsubscribe
                    console.debug(`data : ${dataCtrl.mode} - unsubscribe(${dataCtrl.uid})`);
                    subscribed();
                }
            } else {
                if (elem.prop("tagName") === "INPUT") {
                    elem.off("change", null, revalidate);
                }
            }
            // TODO: formCtrl.removeRule()
        },
    };
}
