// use-format.ts

import { get, writable } from "svelte/store";

import type { ActionReturnType, DataController, DataTypes } from "../data/_common";
import { equalDataTypes, SVELTE_DATA_STORE, uid } from "../data/_common";
import { jQueryElem } from "../data/_common";
import { parseDate, formatDate } from "../components/use-calendar";

/** Format function, must return null if cannot parse value and doesn't want to override it. */
export type Formatter = {
    format: (val: DataTypes) => string;
    parse?: (val: string) => DataTypes | undefined; // FIXME: use null instead?
};

type FormatSettings = {
    decimal: string;
    thousandSeparator: string;
    listSeparator: string;
    moneyPrefix: string;
    moneySuffix: string;
    moneyPrecision: number;
};

export const formatDefaults: FormatSettings = {
    decimal: ".", //                   TODO: implement decimal
    thousandSeparator: " ",
    listSeparator: ", ",
    moneyPrefix: "$",
    moneySuffix: "",
    moneyPrecision: 2,
};

/*
 .8888b                                         dP
 88   "                                         88
 88aaa  .d8888b. 88d888b. 88d8b.d8b. .d8888b. d8888P
 88     88'  `88 88'  `88 88'`88'`88 88'  `88   88
 88     88.  .88 88       88  88  88 88.  .88   88
 dP     `88888P' dP       dP  dP  dP `88888P8   dP

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
        throw new Error(
            `use:format may only be used on <input> or <textarea> element, but found on ${tagName}`
        );
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
            if (/*newValue &&*/ newValue !== curValue) {
                console.debug(`  update(${this.uid}) -> input = ${newValue}`);
                elem.val(newValue ?? "");
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
        },
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
        },
    };
}

/*
                              dP
                              88
 88d888b. dP    dP 88d8b.d8b. 88d888b. .d8888b. 88d888b.
 88'  `88 88    88 88'`88'`88 88'  `88 88ooood8 88'  `88
 88    88 88.  .88 88  88  88 88.  .88 88.  ... 88
 dP    dP `88888P' dP  dP  dP 88Y8888' `88888P' dP

*/

export class NumberFormatter implements Formatter {
    precision: number;

    separator: string;

    constructor(prec?: number, sep?: string) {
        if (!prec) {
            this.precision = 0;
        } else {
            if (Math.abs(prec) > 6) {
                throw new Error(`Unsupported precision number ${prec}`);
            }
            this.precision = prec;
        }
        this.separator = sep !== undefined ? sep : formatDefaults.thousandSeparator;
    }

    parse(val: string): number | undefined {
        val = val.replace(/\s/g, ""); // remove whitespace
        val = val.split(this.separator).join(""); // replace all
        const num = parseFloat(val);
        if (Number.isNaN(num)) {
            return undefined;
        }
        const pwr = 10.0 ** -this.precision;
        console.log("PWR", pwr, val, num, Math.round(num / pwr) * pwr);
        return Math.round(num / pwr) * pwr;
    }

    format(val: DataTypes): string {
        if (val === undefined) {
            return "";
        }
        if (typeof val !== "number") {
            throw new Error("numberFormatter expects number as data type, got " + typeof val);
        }
        let str = val.toFixed(Math.max(this.precision, 0)); // `${val}`;
        const len = str.length;
        const firstPos = this.precision > 0 ? this.precision + 1 : 0;
        for (let n = 3 + firstPos; n < len; n += 3) {
            str = str.substring(0, len - n) + this.separator + str.substring(len - n);
        }
        return str;
    }
}

/*

 88d8b.d8b. .d8888b. 88d888b. .d8888b. dP    dP
 88'`88'`88 88'  `88 88'  `88 88ooood8 88    88
 88  88  88 88.  .88 88    88 88.  ... 88.  .88
 dP  dP  dP `88888P' dP    dP `88888P' `8888P88
                                            .88
                                        d8888P
*/

/** Encode . * + ? ^ $ { } ( ) | [ ] \ to do litral match in regex */
function escapeRegExp(val: string): string {
    return val.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").trim();
}

export class MoneyFormatter implements Formatter {
    numFormatter: NumberFormatter;

    /** For exmaple: '$' */
    prefix: string;

    /** For example 'CAD' */
    suffix: string;

    prefixRegex: RegExp;

    suffixRegex: RegExp;

    constructor(prec?: number, pref?: string, suff?: string) {
        const moneyPrec = prec !== undefined ? prec : formatDefaults.moneyPrecision;
        this.numFormatter = new NumberFormatter(moneyPrec);
        this.prefix = pref !== undefined ? pref : formatDefaults.moneyPrefix;
        this.suffix = suff !== undefined ? suff : formatDefaults.moneySuffix;
        this.prefixRegex = new RegExp("^\\s*" + escapeRegExp(this.prefix) + "\\s*");
        this.suffixRegex = new RegExp("\\s*" + escapeRegExp(this.suffix) + "\\s*$");
    }

    // TODO: add precision
    parse(val: string): number | undefined {
        const numStr = val.replace(this.prefixRegex, "").replace(this.suffixRegex, "");
        return this.numFormatter.parse(numStr);
    }

    format(val: DataTypes): string {
        const fmt = this.numFormatter.format(val);
        console.log("fmt", fmt);
        if (!fmt) {
            return "";
        }
        return this.prefix + fmt + this.suffix;
    }
}

/*

.d8888b. .d8888b. .d8888b. .d8888b.
 88'  `"" 88'  `88 Y8ooooo. 88ooood8
 88.  ... 88.  .88       88 88.  ...
 `88888P' `88888P8 `88888P' `88888P'

*/

type CaseMode = "upper" | "lower" | "title";

export class CaseFormatter implements Formatter {
    mode: CaseMode;

    constructor(mode: CaseMode) {
        this.mode = mode;
    }

    format(val: DataTypes): string {
        if (typeof val !== "string") {
            throw new Error("CaseFormatter expects string as data type");
        }
        switch (this.mode) {
            case "upper":
                return val.trim().toUpperCase();
            case "lower":
                return val.trim().toLowerCase();
            case "title":
                return val
                    .trim()
                    .split(" ")
                    .map((s: string) => s.charAt(0).toUpperCase() + s.substring(1).toLowerCase())
                    .join(" ");
        }
    }
}

/*
 dP oo            dP
 88               88
 88 dP .d8888b. d8888P
 88 88 Y8ooooo.   88
 88 88       88   88
 dP dP `88888P'   dP

*/

export class ListFormatter implements Formatter {
    separator: string;

    constructor(sep?: string) {
        if (sep === "") {
            throw new Error("List separator can't be empty");
        }
        this.separator = sep !== undefined ? sep : formatDefaults.listSeparator;
    }

    parse(val: string): string[] {
        if (!val) {
            return [];
        }
        let sep = this.separator.trim();
        if (sep === "") {
            sep = " ";
        }
        return val.split(this.separator).map((item: string) => item.trim());
    }

    format(val: DataTypes): string {
        if (!Array.isArray(val)) {
            throw new Error("listFormatter expects string[] as data type, got " + typeof val);
        }
        const str = val.reduce((res: string, curr: string) => res + this.separator + curr, "");
        if (str === "") {
            return "";
        }
        return str.substring(this.separator.length);
    }
}

/*
       dP            dP
       88            88
 .d888b88 .d8888b. d8888P .d8888b.
 88'  `88 88'  `88   88   88ooood8
 88.  .88 88.  .88   88   88.  ...
 `88888P8 `88888P8   dP   `88888P'

*/

export class DateFormatter implements Formatter {
    parse(val: string): Date | undefined {
        return parseDate(val);
    }

    format(val: DataTypes): string {
        return formatDate(val);
    }
}
