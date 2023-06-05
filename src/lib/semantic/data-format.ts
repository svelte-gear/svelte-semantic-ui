// format.ts

import { get, writable } from "svelte/store";
import type { ActionReturnType, DataController, DataTypes } from "./common";
import { equalDataTypes, SVELTE_DATA_STORE, uid } from "./common";
import { jQueryElem } from "./common";

/** Format function, must return null if cannot parse value and doesn't want to override it. */
export type Formatter = {
   format: (val: DataTypes) => string | undefined;
   parse?: (val: string) => DataTypes | undefined;
};

/*
                     dP   oo
                     88
 .d8888b. .d8888b. d8888P dP .d8888b. 88d888b.
 88'  `88 88'  `""   88   88 88'  `88 88'  `88
 88.  .88 88.  ...   88   88 88.  .88 88    88
 `88888P8 `88888P'   dP   dP `88888P' dP    dP

*/

/**
 * Initializes Semantic UI input, adds Svelte store to hold the value.
 * So `<Data bind:value={...} />` works inside an `<inpit>`.
 *
 * If formatter implemnent parse(), the value is parsed, otherwise it is a formatted.
 *
 * Example:
```
   <input class="ui input" use:format={uppercaseFormatter}>
        <Data bind:value={num} />
        ...
   </select>
```
 */
export function format(node: Element, fmt: Formatter): ActionReturnType {
   const elem = jQueryElem(node);
   const tagName = elem.prop("tagName");
   if (!["INPUT", "TEXTAREA"].includes(tagName)) {
      throw new Error(`use:format may only be used on <input> or <textarea> element, but found on ${tagName}`);
   }

   // create store to push data back to the binder
   const ctrl: DataController<DataTypes> = {
      uid: uid(),
      mode: "input",
      store: writable(),

      /** Push value into the input */
      doUpdate(value: DataTypes) {
         if (value !== get(this.store)) {
            this.store.set(value);
         }
         const curValue = elem.val();
         const newValue = fmt.format(value);
         if (newValue && newValue !== curValue) {
            console.debug(`  update(${this.uid}) -> input = ${newValue}`);
            elem.val(newValue);
         }
      },

      /** Return updated value from the input */
      onChange(text: DataTypes) {
         console.debug(`  onChange(${this.uid}) = ${text}`);
         const newValue = fmt.parse ? fmt.parse(text as string) : text;
         const value = get(this.store);
         if (!equalDataTypes(newValue, value)) {
            console.debug(`  store(${this.uid}) <- input = ${newValue}`);
            this.store.set(newValue);
         }
         this.doUpdate(newValue);
      }
   };

   // onChange event handler
   function formatElement() {
      const val = elem.val();
      ctrl.onChange(val);
   }

   elem.on("change", null, formatElement);

   // Attach store holder to jQuery element
   console.debug(`  store(${ctrl.uid}) - ${ctrl.mode} created`);
   elem.data(SVELTE_DATA_STORE, ctrl);

   return {
      destroy() {
         elem.off("change", null, formatElement);
      }
   };
}

/*
 .8888b                                         dP     dP
 88   "                                         88     88
 88aaa  .d8888b. 88d888b. 88d8b.d8b. .d8888b. d8888P d8888P .d8888b. 88d888b. .d8888b.
 88     88'  `88 88'  `88 88'`88'`88 88'  `88   88     88   88ooood8 88'  `88 Y8ooooo.
 88     88.  .88 88       88  88  88 88.  .88   88     88   88.  ... 88             88
 dP     `88888P' dP       dP  dP  dP `88888P8   dP     dP   `88888P' dP       `88888P'

*/

export const blankFormatter: Formatter = {
   format(val: DataTypes): string {
      return val as string;
   }
};

const THOUSAND_SEPARATOR = ",";

function parseNumber(val: string): number | undefined {
   for (const rem of [THOUSAND_SEPARATOR, " "]) {
      val = val.replaceAll(rem, "");
   }
   const num = parseInt(val);
   if (Number.isNaN(num)) {
      return undefined;
   }
   return num;
}

export const numberFormatter: Formatter = {
   parse: parseNumber,
   format(val: DataTypes): string | undefined {
      if (typeof val !== "number") {
         throw new Error("numberFormatter expects number as data type");
      }
      if (val === undefined) {
         return undefined;
      }
      let str = `${val}`;
      const len = str.length;
      for (let n = 3; n < len; n += 3) {
         str = str.substring(0, len - n) + THOUSAND_SEPARATOR + str.substring(len - n);
      }
      return str;
   }
};

function removeDollar(val: string): string {
   return val.replaceAll(/^s*$/, "");
}

export const moneyFormatter: Formatter = {
   parse(val: string): number | undefined {
      return parseNumber(removeDollar(val));
   },
   format(val: DataTypes): string | undefined {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const fmt = numberFormatter.format(val);
      if (fmt === undefined) {
         return undefined;
      }
      return "$" + fmt;
   }
};

export const uppercaseFormatter: Formatter = {
   format(val: DataTypes): string {
      if (typeof val !== "string") {
         throw new Error("uppercaseFormatter expects string as data type");
      }
      return val.toUpperCase().trim();
   }
};

export const lowercaseFormatter: Formatter = {
   format(val: DataTypes): string {
      if (typeof val !== "string") {
         throw new Error("lowercaseFormatter expects string as data type");
      }
      return val.toLowerCase().trim();
   }
};

const LIST_SEPARATOR = ",";

export const listFormatter: Formatter = {
   parse(val: string): string[] {
      if (!val) {
         return [];
      }
      return val.split(LIST_SEPARATOR).map((item: string) => item.trim());
   },
   format(val: DataTypes): string | undefined {
      if (!Array.isArray(val)) {
         throw new Error("listFormatter expects string[] as data type");
      }
      const str = val.reduce((res: string, curr: string) => res + LIST_SEPARATOR + " " + curr, "");
      if (str === "") {
         return "";
      }
      return str.substring(LIST_SEPARATOR.length + 1);
   }
};
