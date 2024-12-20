/**
 * 'fmt' and 'parse' utility object, input formatter classes.
 * @module data/input-formatter
 */

import type {
    CalendarSettings,
    DateFormatFn,
    DateParseFn,
    NumberSettings,
    NumberInputSettings,
    TextInputSettings,
} from "../data/semantic-types";
import { calendarDefaults, numberDefaults } from "../data/settings";

/*
   dP
   88
 d8888P dP    dP 88d888b. .d8888b. .d8888b.
   88   88    88 88'  `88 88ooood8 Y8ooooo.
   88   88.  .88 88.  .88 88.  ...       88
   dP   `8888P88 88Y888P' `88888P' `88888P'
             .88 88
         d8888P  dP
*/

/** Text format function, may be used to change case or limit charset. */
export interface TextFormatter {
    format: (val: string) => string;
}

/** Number format function, must return null if it can't parse value and doesn't want to override it. */
export interface NumberFormatter {
    format: (val: number | undefined) => string;
    parse: (val: string) => number | undefined;
}

/** Number format function, must return null if it can't parse value and doesn't want to override it. */
export interface DateFormatter {
    format: (val: Date | undefined) => string;
    parse: (val: string) => Date | undefined;
}

export interface ListFormatter {
    format: (val: string[]) => string;
    parse: (val: string) => string[];
}

/*
                              dP
                              88
 88d888b. dP    dP 88d8b.d8b. 88d888b. .d8888b. 88d888b.
 88'  `88 88    88 88'`88'`88 88'  `88 88ooood8 88'  `88
 88    88 88.  .88 88  88  88 88.  .88 88.  ... 88
 dP    dP `88888P' dP  dP  dP 88Y8888' `88888P' dP

*/

/** Encode . * + ? ^ $ { } ( ) | [ ] \ to do literal match in regex */
function escapeRegExp(val: string): string {
    return val.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").trim();
}

export class NumberFmt implements NumberFormatter {
    type: "integer" | "decimal" | "money";

    precision: number;

    settings: NumberSettings;

    prefixRegex: RegExp | undefined;

    suffixRegex: RegExp | undefined;

    constructor(inputSettings: NumberInputSettings) {
        if (inputSettings.type && !["integer", "decimal", "money"].includes(inputSettings.type)) {
            throw new Error(`Unsupported number type: ${inputSettings.type}`);
        }
        if (inputSettings.precision && Math.abs(inputSettings.precision) > 6) {
            throw new Error(`Unsupported precision number ${inputSettings.precision}`);
        }

        this.settings = {
            ...numberDefaults.read(),
            ...inputSettings,
        };

        this.type = inputSettings.type ?? "integer";

        this.precision =
            inputSettings.precision ?? (this.type === "money" ? this.settings.moneyPrecision : 0);

        if (this.type === "money") {
            this.prefixRegex = new RegExp(`^\\s*${escapeRegExp(this.settings.moneyPrefix)}\\s*`);
            this.suffixRegex = new RegExp(`\\s*${escapeRegExp(this.settings.moneySuffix)}\\s*$`);
        }
    }

    parse(value: string): number | undefined {
        let val: string = value;
        if (this.type === "money") {
            val = val.replace(this.prefixRegex!, "").replace(this.suffixRegex!, "");
        }
        val = val.replace(/\s/g, ""); // remove whitespace
        val = val.split(this.settings.thousandSeparator).join(""); // replace all
        val = val.replace(this.settings.decimalSeparator, ".");
        const num: number = parseFloat(val);
        if (Number.isNaN(num)) {
            return undefined;
        }
        const pwr: number = 10.0 ** -this.precision;
        // console.log("PWR", pwr, val, num, Math.round(num / pwr) * pwr);
        const res: number = Math.round(num / pwr) * pwr;
        return Number(res.toFixed(6));
    }

    format(val: number | undefined): string {
        if (val === undefined) {
            return "";
        }
        if (typeof val !== "number") {
            throw new Error(`numberFormatter expects number as data type, got ${typeof val}`);
        }
        let str: string = val.toFixed(Math.max(this.precision, 0));
        str = str.replace(".", this.settings.decimalSeparator);
        const len: number = str.length;
        const firstPos: number = this.precision > 0 ? this.precision + 1 : 0;
        for (let n: number = 3 + firstPos; n < len; n += 3) {
            str =
                str.substring(0, len - n) +
                this.settings.thousandSeparator +
                str.substring(len - n);
        }
        if (this.type === "money") {
            str = this.settings.moneyPrefix + str + this.settings.moneySuffix;
        }
        return str;
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

function escapeRegex(input: string): string {
    return input.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export class TextFmt implements TextFormatter {
    settings: TextInputSettings;

    constructor(settings?: TextInputSettings) {
        this.settings = settings ?? {};
        if (!this.settings.case) {
            this.settings.case = "none";
        }
        if (!this.settings.charset) {
            this.settings.charset = "any";
        }
        if (this.settings.blockEmoji && this.settings.charset !== "any") {
            console.error(
                `TextFmt: invalid settings - blockEmoji doesn't effect charset: "${this.settings.charset}"`
            );
        }
        if (this.settings.idAllowChars && this.settings.charset !== "id") {
            console.error(
                `TextFmt: invalid settings - idAllowChars doesn't effect charset: "${this.settings.charset}"`
            );
        }
        if (this.settings.idBlockChars && this.settings.charset !== "id") {
            console.error(
                `TextFmt: invalid settings - idBlockChars doesn't effect charset: "${this.settings.charset}"`
            );
        }
    }

    private fixCase(val: string): string {
        switch (this.settings.case) {
            case "none":
                return val;
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
                throw new Error(`Unrecognized case directive ${this.settings.case}`);
        }
    }

    private filterCharset(val: string): string {
        switch (this.settings.charset) {
            case "any":
                return val;
            case "ascii":
                return val.replace(/[^\x20-\x7F]/g, "");
            case "latin":
                //                     ascii    latin-1      latin ext    symbols
                return val.replace(/[^\x20-\x7F\u00C0-\u024F\u1E00-\u1EFF\u2000-\u22FF]/g, "");
            case "euro":
                return val.replace(
                    //  ascii    latin-1      latin ext    greek        cyrillic     symbols
                    /[^\x20-\x7F\u00C0-\u024F\u1E00-\u1EFF\u0370-\u03FF\u0400-\u04FF\u2000-\u22FF]/g,
                    ""
                );
            default:
                throw new Error(`Unrecognized charset directive ${this.settings.charset}`);
        }
    }

    format(val: string): string {
        if (typeof val !== "string") {
            throw new Error("textFormatter expects string as data type");
        }
        let res: string = this.fixCase(val);
        if (this.settings.charset === "id") {
            let regexStr: string = "a-zA-Z0-9";
            this.settings.idAllowChars?.forEach((char: string) => {
                regexStr = regexStr + escapeRegex(char);
            });
            res = res.replace(new RegExp(`[^${regexStr}]`, "g"), "");
            this.settings.idBlockChars?.forEach((char: string) => {
                res = res.replace(char, "");
            });
        } else {
            if (this.settings.charset === "ascii") {
                if (this.settings.blockDoubleQuotes) {
                    res = res.replace('"', "`");
                }
                if (this.settings.blockSingleQuotes) {
                    res = res.replace("'", "`");
                }
                if (!this.settings.allowHtmlTags) {
                    res = res.replace("<", "_").replace(">", "_");
                }
            } else {
                if (this.settings.blockDoubleQuotes) {
                    res = res.replace('"', "\u201D"); // right double quote
                }
                if (this.settings.blockSingleQuotes) {
                    res = res.replace("'", "\u2019"); // right single quote
                }
                if (!this.settings.allowHtmlTags) {
                    res = res.replace("<", "\u2039").replace(">", "\u203A");
                }
            }
            if (this.settings.blockEmoji) {
                // res = res.replace(/[\u1F000-\u1FFFF]/g, "");
                res = res.replace(/[\p{Extended_Pictographic}]/gu, "");
            }
            res = this.filterCharset(res);
        }
        return res.trim();
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

type ListSettings = {
    listSeparator?: string;
};

export class ListFmt implements ListFormatter {
    separator: string;

    constructor(settings?: ListSettings) {
        if (settings && settings.listSeparator === "") {
            throw new Error("List separator can't be empty");
        }
        this.separator =
            settings && settings.listSeparator
                ? settings.listSeparator
                : numberDefaults.read().listSeparator;
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

    format(val: string[]): string {
        if (!Array.isArray(val)) {
            throw new Error(`listFormatter expects string[] as data type, got ${typeof val}`);
        }
        return val.join(this.separator);
    }
}

// TODO: init-input-list.svelte

/*
       dP            dP
       88            88
 .d888b88 .d8888b. d8888P .d8888b.
 88'  `88 88'  `88   88   88ooood8
 88.  .88 88.  .88   88   88.  ...
 `88888P8 `88888P8   dP   `88888P'

 */

export class DateFmt implements DateFormatter {
    private settings: CalendarSettings;

    constructor(settings?: CalendarSettings) {
        this.settings = {
            ...calendarDefaults.read(),
            ...settings,
            // TODO: should we use clone and copyFields()? here and for number. test what happens with partial overrides
            // FIXME: settings are ignored when formatting, defaults are used instead
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
            // TODO: test if it works with formatter function
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

    format(val: Date | undefined): string {
        if (val === undefined || val === null) {
            return "";
        }
        if (!(val instanceof Date)) {
            throw new Error(`dateFormatter expects Date as data type, got ${typeof val} = ${val}`);
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
