// format.ts

import type { DataTypes, Formatter } from "./_common";
// import { jQueryElem } from "./_common";

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

// TODO: Global fmt and parse objects with default formatting settings.
// Lazily initialized, to give user the chance to change defaults.

export const fmt = {};

export const parse = {};
