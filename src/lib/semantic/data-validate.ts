// validate.ts

import type { Unsubscriber } from "svelte/store";
// import type { BaseSchema } from "yup";
import type { DataController, DataTypes, FormController, JQueryApi, SemanticCommand } from "./common";
import { jQueryElem, uid, SVELTE_DATA_STORE, SVELTE_FORM_STORE } from "./common";

/** Shortform validation rule */
type RuleName =
   // empty
   | "empty"
   | "checked"
   // content type
   | "email"
   | "url"
   | "integer"
   | "integer[1..10]"
   | "decimal"
   | "number"
   | "regExp[//^[a-z]{2,3}$//]"
   | "creditCard"
   // content
   | "is[foo]"
   | "isExactly[foo]"
   | "not[foo]"
   | "notExactly[foo]"
   | "contain[foo]"
   | "containExactly[foo]"
   | "doesntContain[foo]"
   | "doesntContainExactly[foo]"
   | "match[field]"
   | "different[field]"
   // length
   | "minLength[8]"
   | "exactLength[16]"
   | "maxLength[32]"
   | "minCount[3]"
   | "exactCount[3]"
   | "maxCount[3]"
   // allow any string, force the first character to be lowercase
   // keeps autocomplete working by preventing flattening RuleType to string
   | Uncapitalize<string>;

/** Validation rule object */
type RuleObj = {
   type: RuleName;
   prompt?: string;
};

export type RuleDefinition = RuleName | RuleName[] | RuleObj | RuleObj[]; // | BaseSchema;

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

/** Adds validation rule to the field.
 * For Dropdown, use id of the select or the inner input.
 * For Calendar, use id of the innermost input.
 */
export function validate(node: Element, rules: RuleDefinition) {
   const elem = jQueryElem(node);
   const form = getParentForm(elem) as JQueryApi & { form: SemanticCommand };

   let key: string;
   let formCtrl: FormController;
   let subscribed: Unsubscriber | null;

   // onChange event handler
   function revalidate() {
      // wait for data change to propsgate
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
      }
   };
}
