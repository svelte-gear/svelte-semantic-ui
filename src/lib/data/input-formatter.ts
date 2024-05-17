/**
 * 'fmt' and 'parse' utility object, input formatter classes.
 * @module data/input-formatter
 */

import type { DataTypes, Formatter } from "./common";
import { dateFormatDefaults, numberFormatDefaults } from "./format";

/*
                              dP
                              88
 88d888b. dP    dP 88d8b.d8b. 88d888b. .d8888b. 88d888b.
 88'  `88 88    88 88'`88'`88 88'  `88 88ooood8 88'  `88
 88    88 88.  .88 88  88  88 88.  .88 88.  ... 88
 dP    dP `88888P' dP  dP  dP 88Y8888' `88888P' dP

*/

export class NumberFmt implements Formatter {
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
        this.separator = sep !== undefined ? sep : numberFormatDefaults.thousandSeparator;
    }

    parse(val: string): number | undefined {
        val = val.replace(/\s/g, ""); // remove whitespace
        val = val.split(this.separator).join(""); // replace all
        const num: number = parseFloat(val);
        if (Number.isNaN(num)) {
            return undefined;
        }
        const pwr: number = 10.0 ** -this.precision;
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
        let str: string = val.toFixed(Math.max(this.precision, 0)); // `${val}`;
        const len: number = str.length;
        const firstPos: number = this.precision > 0 ? this.precision + 1 : 0;
        for (let n: number = 3 + firstPos; n < len; n += 3) {
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

export class MoneyFmt implements Formatter {
    numFormatter: NumberFmt;

    /** For exmaple: '$' */
    prefix: string;

    /** For example 'CAD' */
    suffix: string;

    prefixRegex: RegExp;

    suffixRegex: RegExp;

    constructor(prec?: number, pref?: string, suff?: string) {
        const moneyPrec: number = prec !== undefined ? prec : numberFormatDefaults.moneyPrecision;
        this.numFormatter = new NumberFmt(moneyPrec);
        this.prefix = pref !== undefined ? pref : numberFormatDefaults.moneyPrefix;
        this.suffix = suff !== undefined ? suff : numberFormatDefaults.moneySuffix;
        this.prefixRegex = new RegExp("^\\s*" + escapeRegExp(this.prefix) + "\\s*");
        this.suffixRegex = new RegExp("\\s*" + escapeRegExp(this.suffix) + "\\s*$");
    }

    // TODO: add precision
    parse(val: string): number | undefined {
        const numStr: string = val.replace(this.prefixRegex, "").replace(this.suffixRegex, "");
        return this.numFormatter.parse(numStr);
    }

    format(val: DataTypes): string {
        const fmt: string = this.numFormatter.format(val);
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

/** How to upper-case the text */
export type CaseMode = "upper" | "lower" | "title";

export class TextFmt implements Formatter {
    caseMode: CaseMode;
    //TODO: ascii only, id, id_, id_-, no tags, no-sq, no-dq, max-len

    constructor(caseMode: CaseMode) {
        this.caseMode = caseMode;
    }

    format(val: DataTypes): string {
        if (typeof val !== "string") {
            throw new Error("CaseFormatter expects string as data type");
        }
        switch (this.caseMode) {
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

export class ListFmt implements Formatter {
    separator: string;

    constructor(sep?: string) {
        if (sep === "") {
            throw new Error("List separator can't be empty");
        }
        this.separator = sep !== undefined ? sep : numberFormatDefaults.listSeparator;
    }

    parse(val: string): string[] {
        if (!val) {
            return [];
        }
        let sep: string = this.separator.trim();
        if (sep === "") {
            sep = " ";
        }
        return val.split(this.separator).map((item: string) => item.trim());
    }

    format(val: DataTypes): string {
        if (!Array.isArray(val)) {
            throw new Error("listFormatter expects string[] as data type, got " + typeof val);
        }
        const str: string = val.reduce(
            (res: string, curr: string) => res + this.separator + curr,
            ""
        );
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

export function parseDate(val: string): Date | undefined {
    if (!val) {
        return undefined;
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any, @typescript-eslint/typedef
    const jQuery = (window as any).jQuery;
    if (!jQuery) {
        throw new Error("jQuery in not initialized");
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/typedef
    const dateParser = jQuery.fn.calendar.settings.parser.date as (
        val: string,
        opt: object
    ) => Date;
    if (!dateParser) {
        throw new Error("Semantic UI calendar in not initialized");
    }
    return dateParser(val, { type: "date" });
}

export function formatDate(val: DataTypes): string {
    if (val === undefined) {
        return "";
    }
    if (!(val instanceof Date)) {
        throw new Error("dateFormatter expects Date as data type, got " + typeof val);
    }
    if (dateFormatDefaults.formatter?.date) {
        return dateFormatDefaults.formatter?.date(val);
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any, @typescript-eslint/typedef
    const jQuery = (window as any).jQuery;
    if (!jQuery) {
        throw new Error("jQuery in not initialized");
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/typedef
    const dateFormatter = jQuery.fn.calendar.settings.formatter.date as (
        val: Date | undefined,
        opt: object
    ) => string;
    if (!dateFormatter) {
        throw new Error("Semantic UI calendar in not initialized");
    }
    return dateFormatter(val, { type: "date" });
}

export class DateFmt implements Formatter {
    //TODO: add constructor withs ettings
    //TODO: default formatter (copy)
    //TODO: defaukt formatter (live)

    parse(val: string): Date | undefined {
        return parseDate(val);
    }

    format(val: DataTypes): string {
        return dateFormatDefaults.formatter?.date!(val as Date) ?? "";
        // return formatDate(val);
    }
}
