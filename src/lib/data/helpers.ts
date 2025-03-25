/**
 * Global `fmt` and `parse` objects with default formatting settings, autocomplete helper for validation rules.
 * @module data/helpers
 */

import { DateFmt } from "../data/format-date";
import { isoDate } from "./common";
import { NumberFmt } from "./format-number";

// region fmt -------------------------------------------------------------------------------------

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
    date: (d: Date | null) => string;
    time: (d: Date | null) => string;
    int: (n: number | null) => string;
    num: (n: number | null) => string;
    num2: (n: number | null) => string;
    num6: (n: number | null) => string;
    money: (n: number | null) => string;
} = {
    date: (d: Date | null): string => {
        dateFmt ??= new DateFmt({ type: "date" });
        return dateFmt.format(d);
    },
    time: (d: Date | null): string => {
        timeFmt ??= new DateFmt({ type: "time" });
        return timeFmt.format(d);
    },
    int: (n: number | null): string => {
        intFmt ??= new NumberFmt({ type: "integer" });
        return intFmt.format(n);
    },
    num: (n: number | null): string => {
        numFmt ??= new NumberFmt({ type: "decimal" });
        return numFmt.format(n);
    },
    num2: (n: number | null): string => {
        num2Fmt ??= new NumberFmt({ type: "decimal", precision: 2 });
        return num2Fmt.format(n);
    },
    num6: (n: number | null): string => {
        num6Fmt ??= new NumberFmt({ type: "decimal", precision: 6 });
        return num6Fmt.format(n);
    },
    money: (n: number | null): string => {
        moneyFmt ??= new NumberFmt({ type: "money" });
        return moneyFmt.format(n);
    },
};

// region parse -----------------------------------------------------------------------------------

/** Default parser helper. Intended to be used from code. */
export const parse: {
    date: (s: string) => Date | null;
    time: (s: string) => Date | null;
    int: (s: string) => number | null;
    num: (s: string) => number | null;
    num2: (s: string) => number | null;
    num6: (s: string) => number | null;
    money: (s: string) => number | null;
} = {
    date: (s: string): Date | null => {
        dateFmt ??= new DateFmt({ type: "date" });
        return dateFmt.parse(s);
    },
    time: (s: string): Date | null => {
        timeFmt ??= new DateFmt({ type: "time" });
        return timeFmt.parse(s);
    },
    int: (s: string): number | null => {
        intFmt ??= new NumberFmt({ type: "integer" });
        return intFmt.parse(s);
    },
    num: (s: string): number | null => {
        numFmt ??= new NumberFmt({ type: "decimal" });
        return numFmt.parse(s);
    },
    num2: (s: string): number | null => {
        num2Fmt ??= new NumberFmt({ type: "decimal", precision: 2 });
        return num2Fmt.parse(s);
    },
    num6: (s: string): number | null => {
        num6Fmt ??= new NumberFmt({ type: "decimal", precision: 6 });
        return num6Fmt.parse(s);
    },
    money: (s: string): number | null => {
        moneyFmt ??= new NumberFmt({ type: "money" });
        return moneyFmt.parse(s);
    },
};

// region rule ------------------------------------------------------------------------------------

/** Autocomplete helper for validation rules. */
/* prettier-ignore */
// eslint-disable-next-line @typescript-eslint/typedef
export const rule = {
/* eslint-disable key-spacing */
    empty:      (): string => "empty",
    notEmpty:   (): string => "notEmpty",
    checked:    (): string => "checked",

    email:      (): string => "email",
    url:        (): string => "url",
    integer:    (): string => "integer",
    decimal:    (): string => "decimal",
    number:     (): string => "number",
    creditCard: (): string => "creditCard",
    regex:      (reg: string): string => `regExp[//${reg}//]`,

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
