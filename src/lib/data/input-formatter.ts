/**
 * 'fmt' and 'parse' utility object, input formatter classes.
 * @module data/input-formatter
 */

import { calendarDefaults } from "../components/use-calendar";
import type { CalendarSettings, DateFormatFn, DateParseFn, NumberSettings } from "./semantic-types";
import type { DataTypes, Formatter } from "./common";
import { SettingsHelper } from "./settings";

export const numberDefaults: SettingsHelper<NumberSettings> = new SettingsHelper("number");

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
        this.separator = sep !== undefined ? sep : numberDefaults.read().thousandSeparator ?? " ";
    }

    // TODO: move format / parse number into format.ts
    parse(value: string): number | undefined {
        let val: string = value;
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
            throw new Error(`numberFormatter expects number as data type, got ${typeof val}`);
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
        const def: NumberSettings = numberDefaults.read();
        const moneyPrec: number = prec !== undefined ? prec : def.moneyPrecision ?? 2;
        this.numFormatter = new NumberFmt(moneyPrec);
        this.prefix = pref !== undefined ? pref : def.moneyPrefix ?? "$";
        this.suffix = suff !== undefined ? suff : def.moneySuffix ?? "";
        this.prefixRegex = new RegExp(`^\\s*${escapeRegExp(this.prefix)}\\s*`);
        this.suffixRegex = new RegExp(`\\s*${escapeRegExp(this.suffix)}\\s*$`);
    }

    // TODO: add precision
    parse(val: string): number | undefined {
        const numStr: string = val.replace(this.prefixRegex, "").replace(this.suffixRegex, "");
        return this.numFormatter.parse(numStr);
    }

    format(val: DataTypes): string {
        const str: string = this.numFormatter.format(val);
        console.log("fmt", str);
        if (!str) {
            return "";
        }
        return this.prefix + str + this.suffix;
    }
}

/*
   dP                       dP
   88                       88
 d8888P .d8888b. dP.  .dP d8888P
   88   88ooood8  `8bd8'    88
   88   88.  ...  .d88b.    88
   dP   `88888P' dP'  `dP   dP

*/

/** How to upper-case the text */
export type CaseMode = "upper" | "lower" | "title";

export class TextFmt implements Formatter {
    caseMode: CaseMode;
    // TODO: ascii only, id, id_, id_-, no tags, no-sq, no-dq, max-len

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
            default:
                throw new Error(`Unrecognized case ${this.caseMode}`);
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
        this.separator = sep !== undefined ? sep : numberDefaults.read().listSeparator;
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
            throw new Error(`listFormatter expects string[] as data type, got ${typeof val}`);
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

export class DateFmt implements Formatter {
    private settings: CalendarSettings;

    constructor(settings?: CalendarSettings) {
        this.settings = {
            ...calendarDefaults.read(),
            ...settings,
            // TODO: do i need to use deep copy?
        };
    }

    /* eslint-disable one-var */
    /* eslint-disable prefer-template */
    /* eslint-disable no-nested-ternary */
    /* eslint-disable @typescript-eslint/typedef */

    // this function is copied from fomantic-ui calendar component v2.9.3
    protected weekOfYear(weekYear: number, weekMonth: number, weekDay: number): number {
        void this;
        // adapted from http://www.merlyn.demon.co.uk/weekcalc.htm
        const ms1d = 24 * 3600 * 1000,
            ms7d = 7 * ms1d,
            DC3 = Date.UTC(weekYear, weekMonth, weekDay + 3) / ms1d, // an absolute day number
            AWN = Math.floor(DC3 / 7), // an absolute week number
            WYR = new Date(AWN * ms7d).getUTCFullYear();
        return AWN - Math.floor(Date.UTC(WYR, 0, 7) / ms7d) + 1;
    }

    // this function is copied from fomantic-ui calendar component v2.9.3
    protected helperDateFormat(
        format: string | DateFormatFn,
        date: Date,
        sett?: CalendarSettings
    ): string {
        const settings: Required<CalendarSettings> =
            (sett as Required<CalendarSettings>) ?? calendarDefaults.read();

        if (!(date instanceof Date)) {
            return "";
        }
        if (typeof format === "function") {
            return format.call(this, date, settings);
            // TODO: sest if it works with formatter function
        }
        const D = date.getDate(),
            M = date.getMonth(),
            Y = date.getFullYear(),
            d = date.getDay(),
            H = date.getHours(),
            m = date.getMinutes(),
            s = date.getSeconds(),
            w = /* module.get. */ this.weekOfYear(Y, M, D + 1 - settings.firstDayOfWeek),
            h = H % 12 || 12,
            a = H < 12 ? settings.text.am!.toLowerCase() : settings.text.pm!.toLowerCase(),
            tokens = {
                D: D,
                DD: ("0" + D).slice(-2),
                M: M + 1,
                MM: ("0" + (M + 1)).slice(-2),
                MMM: settings.text.monthsShort![M],
                MMMM: settings.text.months![M],
                Y: Y,
                YY: String(Y).slice(2),
                YYYY: Y,
                d: d,
                dd: settings.text.days![d],
                ddd: settings.text.days![d],
                dddd: settings.text.days![d],
                // dd: settings.text.dayNamesShort[d].slice(0, 2),
                // ddd: settings.text.dayNamesShort[d],
                // dddd: settings.text.dayNames[d],
                h: h,
                hh: ("0" + h).slice(-2),
                H: H,
                HH: ("0" + H).slice(-2),
                m: m,
                mm: ("0" + m).slice(-2),
                s: s,
                ss: ("0" + s).slice(-2),
                a: a,
                A: a.toUpperCase(),
                S: ["th", "st", "nd", "rd"][
                    D % 10 > 3 ? 0 : (D % 100) - (D % 10) === 10 ? 0 : D % 10
                ],
                w: w,
                ww: ("0" + w).slice(-2),
            };

        // eslint-disable-next-line func-names, prefer-arrow-callback
        return format.replace(settings.regExp.token!, function (match: string): string {
            if (match in tokens) {
                return (
                    tokens as unknown as {
                        [key: string]: string;
                    }
                )[match];
            }

            return match.slice(1, -1);
        });
    }

    /* eslint-enable */

    parse(val: string): Date | undefined {
        if (!val) {
            return undefined;
        }
        const dateParser: DateParseFn = this.settings.parser!.date!;
        return dateParser(val, this.settings) ?? undefined;
    }

    format(val: DataTypes): string {
        if (val === undefined) {
            return "";
        }
        if (!(val instanceof Date)) {
            throw new Error(`dateFormatter expects Date as data type, got ${typeof val}`);
        }
        const type: string = this.settings.type!;
        type SettingsFormatter = {
            [key: string]: string | DateFormatFn;
        };
        return this.helperDateFormat(
            (this.settings.formatter! as SettingsFormatter)[type],
            val,
            this.settings
        );
    }
}
