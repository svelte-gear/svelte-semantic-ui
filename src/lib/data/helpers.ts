/**
 * Global `fmt` and `parse` objects with default formatting settings, autocomplete helper for validation rules.
 * @module data/helpers
 */

import { DateFmt } from "../data/format-date";
import { isoDate } from "./common";
import { NumberFmt } from "./format-number";

/*
 .8888b              dP
 88   "              88
 88aaa  88d8b.d8b. d8888P
 88     88'`88'`88   88
 88     88  88  88   88
 dP     dP  dP  dP   dP

*/

// The formatter objects are lazily initialized, to give user the chance to change defaults.
// 'int' differs from 'num' by not using thousand separator.

let dateFmt: DateFmt | null = null;
let timeFmt: DateFmt | null = null;
let intFmt: NumberFmt | null = null;
let numFmt: NumberFmt | null = null;
let num2Fmt: NumberFmt | null = null;
let num6Fmt: NumberFmt | null = null;
let moneyFmt: NumberFmt | null = null;

/** Default formatter helper. Intended to be used from code of svelte components:
 * ```
 * Total: {fmt.money(value)}
 * ``` */
export const fmt: {
    date: (d: Date | undefined) => string;
    time: (d: Date | undefined) => string;
    int: (n: number | undefined) => string;
    num: (n: number | undefined) => string;
    num2: (n: number | undefined) => string;
    num6: (n: number | undefined) => string;
    money: (n: number | undefined) => string;
} = {
    date: (d: Date | undefined): string => {
        dateFmt ??= new DateFmt({ type: "date" });
        return dateFmt.format(d);
    },
    time: (d: Date | undefined): string => {
        timeFmt ??= new DateFmt({ type: "time" });
        return timeFmt.format(d);
    },
    int: (n: number | undefined): string => {
        intFmt ??= new NumberFmt({ type: "integer" });
        return intFmt.format(n);
    },
    num: (n: number | undefined): string => {
        numFmt ??= new NumberFmt({ type: "decimal" });
        return numFmt.format(n);
    },
    num2: (n: number | undefined): string => {
        num2Fmt ??= new NumberFmt({ type: "decimal", precision: 2 });
        return num2Fmt.format(n);
    },
    num6: (n: number | undefined): string => {
        num6Fmt ??= new NumberFmt({ type: "decimal", precision: 6 });
        return num6Fmt.format(n);
    },
    money: (n: number | undefined): string => {
        moneyFmt ??= new NumberFmt({ type: "money" });
        return moneyFmt.format(n);
    },
};

/*

 88d888b. .d8888b. 88d888b. .d8888b. .d8888b.
 88'  `88 88'  `88 88'  `88 Y8ooooo. 88ooood8
 88.  .88 88.  .88 88             88 88.  ...
 88Y888P' `88888P8 dP       `88888P' `88888P'
 88
 dP
*/

/** Default parser helper. Intended to be used from code. */
export const parse: {
    date: (s: string) => Date | undefined;
    time: (s: string) => Date | undefined;
    int: (s: string) => number | undefined;
    num: (s: string) => number | undefined;
    num2: (s: string) => number | undefined;
    num6: (s: string) => number | undefined;
    money: (s: string) => number | undefined;
} = {
    date: (s: string): Date | undefined => {
        dateFmt ??= new DateFmt({ type: "date" });
        return dateFmt.parse(s);
    },
    time: (s: string): Date | undefined => {
        timeFmt ??= new DateFmt({ type: "time" });
        return timeFmt.parse(s);
    },
    int: (s: string): number | undefined => {
        intFmt ??= new NumberFmt({ type: "integer" });
        return intFmt.parse(s);
    },
    num: (s: string): number | undefined => {
        numFmt ??= new NumberFmt({ type: "decimal" });
        return numFmt.parse(s);
    },
    num2: (s: string): number | undefined => {
        num2Fmt ??= new NumberFmt({ type: "decimal", precision: 2 });
        return num2Fmt.parse(s);
    },
    num6: (s: string): number | undefined => {
        num6Fmt ??= new NumberFmt({ type: "decimal", precision: 6 });
        return num6Fmt.parse(s);
    },
    money: (s: string): number | undefined => {
        moneyFmt ??= new NumberFmt({ type: "money" });
        return moneyFmt.parse(s);
    },
};

/*
                   dP             dP                dP
                   88             88                88
 88d888b. dP    dP 88 .d8888b.    88d888b. .d8888b. 88 88d888b. .d8888b. 88d888b.
 88'  `88 88    88 88 88ooood8    88'  `88 88ooood8 88 88'  `88 88ooood8 88'  `88
 88       88.  .88 88 88.  ...    88    88 88.  ... 88 88.  .88 88.  ... 88
 dP       `88888P' dP `88888P'    dP    dP `88888P' dP 88Y888P' `88888P' dP
                                                       88
                                                       dP
*/

/** Autocomplete helper for validation rules. */
/* prettier-ignore */
// eslint-disable-next-line @typescript-eslint/typedef
export const rule = {
/* eslint-disable key-spacing */
    empty:      (): string => "empty",
    checked:    (): string => "checked",

    email:      (): string => "email",
    url:        (): string => "url",
    integer:    (): string => "integer",
    decimal:    (): string => "decimal",
    number:     (): string => "number",
    creditCard: (): string => "creditCard",
    regex:      (reg: string): string => `regExp[//${reg}//]`,

    // integer:    (min?: number, max?: number): string =>
    //     min == undefined && max == undefined ? "integer" : `integer[${min}..${max}]`,

    is:              (val: string): string => `is[${val}]`,
    isExactly:       (val: string): string => `isExactly[${val}]`,
    not:             (val: string): string => `not[${val}]`,
    notExactly:      (val: string): string => `notExactly[${val}]`,
    contains:        (val: string): string => `contains[${val}]`,
    containsExactly: (val: string): string => `containsExactly[${val}]`,
    doesntContain:   (val: string): string => `doesntContain[${val}]`,
    doesntContainExactly: (val: string): string => `doesntContainExactly[${val}]`,

    match:          (fld: string): string => `match[${fld}]`,
    different:      (fld: string): string => `different[${fld}]`,

    minLength:   (n: number): string => `minLength[${n}]`,
    exactLength: (n: number): string => `exactLength[${n}]`,
    maxLength:   (n: number): string => `maxLength[${n}]`,
    minCount:    (n: number): string => `minCount[${n}]`,
    exactCount:  (n: number): string => `exactCount[${n}]`,
    maxCount:    (n: number): string => `maxCount[${n}]`,

    // helpers for custom rules, would be better in validation-rules.ts, but are left here for auto-completion
    start:     (val: string): string => `start[${val}]`,
    isoDate:              (): string => "isoDate",
    wrappedIn: (val: string): string => `wrappedIn[${val}]`,

    range:    (min: number, max:number): string => `range[${min}..${max}]`,
    size:     (min: number, max: number): string => `size[${min}..${max}]`,

    maxValue: (val: Date | number | string): string => (
        (val instanceof Date) ? `maxValue[${isoDate(val)}]` : `maxValue[${val}]`
    ),
    minValue: (val: Date | number | string): string => (
        (val instanceof Date) ? `minValue[${isoDate(val)}]` : `minValue[${val}]`
    ),
    /* eslint-enable */
};
