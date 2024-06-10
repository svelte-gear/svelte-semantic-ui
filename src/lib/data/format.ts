/**
 * 'fmt' and 'parse' utility object, input formatter classes.
 * @module data/format
 */

import { SettingsHelper, pad } from "./common";
import type { DateFormatFn, DateParseFn, NumberSettings } from "./semantic-types";
import { DateFmt } from "./input-formatter";

export const numberDefaults: SettingsHelper<NumberSettings> = new SettingsHelper("number");
// TODO: move to input-formatter ?

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
    isoDate: DateFormatFn;
    isoTime: DateFormatFn;
    date: DateFormatFn;
    time: DateFormatFn;
    // TODO: implement number, etc
    // number: (val: number | undefined, prec?: number) => string;
    // money:  (val: number | undefined) => string;
    // list: (val: string[] | undefined) => string;
} = {
    isoDate: (d: Date | undefined): string => {
        if (!d || !d.getDate) {
            return "";
        }
        const day: string = pad(d.getDate(), 2);
        const month: string = pad(d.getMonth() + 1, 2);
        const year: string = pad(d.getFullYear(), 4);
        return `${year}-${month}-${day}`;
    },

    isoTime: (d: Date | undefined): string => {
        if (!d || !d.getDate) {
            return "";
        }
        const hour: string = pad(d.getHours(), 2);
        const minute: string = pad(d.getMinutes(), 2);
        return `${hour}:${minute}`;
    },

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
    isoDate: DateParseFn;
    isoTime: DateParseFn;
    date: DateParseFn;
    time: DateParseFn;
    // TODO: implement number, etc
    // number: (val: string | undefined) => number | undefined;
    // money: (val: string | undefined) => number | undefined;
    // list: (val: string | undefined) => string[];
} = {
    isoDate: (value: string | undefined): Date | undefined => {
        if (!value) {
            return undefined;
        }
        const d: Date = new Date(value);
        return d;
    },
    isoTime: (value: string | undefined): Date | undefined => {
        if (!value) {
            return undefined;
        }
        const d: Date = new Date("2000-01-01 " + value);
        return d;
    },
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
