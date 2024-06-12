/**
 * 'fmt', 'parse', and 'rile' utility object.
 * @module data/helpers
 */

import type { DateFormatFn, DateParseFn } from "./semantic-types";
import { DateFmt } from "./input-formatter";

// TODO: Global fmt and parse objects with default formatting settings.
// Lazily initialized, to give user the chance to change defaults.

/*
 .8888b              dP
 88   "              88
 88aaa  88d8b.d8b. d8888P
 88     88'`88'`88   88
 88     88  88  88   88
 dP     dP  dP  dP   dP

*/

let defaultDateFmt: DateFmt | null = null;
function getDefaultDateFmt(): DateFmt {
    if (defaultDateFmt === null) {
        defaultDateFmt = new DateFmt({ type: "date" });
    }
    return defaultDateFmt;
}

let defaultTimeFmt: DateFmt | null = null;
function getDefaultTimeFmt(): DateFmt {
    if (defaultTimeFmt === null) {
        defaultTimeFmt = new DateFmt({ type: "time" });
    }
    return defaultTimeFmt;
}

export const fmt: {
    date: DateFormatFn;
    time: DateFormatFn;
    // TODO: implement number, etc
    // number: (val: number | undefined, prec?: number) => string;
    // money:  (val: number | undefined) => string;
    // list: (val: string[] | undefined) => string;
} = {
    date: (d: Date | undefined): string => {
        return getDefaultDateFmt().format(d);
    },

    time: (d: Date | undefined): string => {
        return getDefaultTimeFmt().format(d);
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

// TODO: review null/undefined, decide which one should be used
export const parse: {
    date: DateParseFn;
    time: DateParseFn;
    // TODO: implement number, etc
    // number: (val: string | undefined) => number | undefined;
    // money: (val: string | undefined) => number | undefined;
    // list: (val: string | undefined) => string[];
} = {
    date: (value: string | undefined): Date | undefined => {
        if (!value) {
            return undefined;
        }
        return getDefaultDateFmt().parse(value);
    },
    time: (value: string | undefined): Date | undefined => {
        if (!value) {
            return undefined;
        }
        return getDefaultTimeFmt().parse(value);
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

/* prettier-ignore */
// eslint-disable-next-line @typescript-eslint/typedef
export const rule = {
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

    is:             (val: string): string => `is[${val}]`,
    isExactly:      (val: string): string => `isExactly[${val}]`,
    not:            (val: string): string => `not[${val}]`,
    notExactly:     (val: string): string => `notExactly[${val}]`,
    contain:        (val: string): string => `contain[${val}]`,
    containExactly: (val: string): string => `containExactly[${val}]`,
    doesntContain:  (val: string): string => `doesntContain[${val}]`,
    doesntContainExactly: (val: string): string => `doesntContainExactly[${val}]`,

    match:          (fld: string): string => `match[${fld}]`,
    different:      (fld: string): string => `different[${fld}]`,

    minLength:   (n: number): string => `minLength[${n}]`,
    exactLength: (n: number): string => `exactLength[${n}]`,
    maxLength:   (n: number): string => `maxLength[${n}]`,
    minCount:    (n: number): string => `minCount[${n}]`,
    exactCount:  (n: number): string => `exactCount[${n}]`,
    maxCount:    (n: number): string => `maxCount[${n}]`,

    // TODO: add custom rules
};

/*
          dP                                             dP
          88                                             88
 .d8888b. 88d888b. .d8888b. 88d888b. .d8888b. .d8888b. d8888P
 88'  `"" 88'  `88 88'  `88 88'  `88 Y8ooooo. 88ooood8   88
 88.  ... 88    88 88.  .88 88             88 88.  ...   88
 `88888P' dP    dP `88888P8 dP       `88888P' `88888P'   dP

*/

// type Range = [number, number];
// type Charset = Array<Range>;

// function ch(s: string): number {
//     return s.codePointAt(0) ?? 0;
// }
// function chRng(s: string): Range {
//     return [ch(s), ch(s)];
// }

// export const NUMER: Charset = [[ch("0"), ch("9")]];
// export const ALPHA: Charset = [
//     [ch("A"), ch("Z")],
//     [ch("a"), ch("z")],
// ];
// export const ALPNU: Charset = [...NUMER, ...ALPHA];
// export const IDENT: Charset = [...ALPNU, chRng("_")];
// export const ASCII: Charset = [[ch(" "), ch("~")]];

// void new CharsetList({ base: IDENTIFIER, inclide: "-.", exclude: "_" });
