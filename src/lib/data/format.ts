/**
 * 'fmt' and 'parse' utility object, input formatter classes.
 * @module data/format
 */

import type { DataTypes } from "./common";

export interface NumberFormatSettings {
    decimal: string;
    thousandSeparator: string;
    listSeparator: string;
    moneyPrefix: string;
    moneySuffix: string;
    moneyPrecision: number;
}

export const numberFormatDefaults: NumberFormatSettings = {
    decimal: ".", //                   TODO: implement decimal
    thousandSeparator: " ",
    listSeparator: ", ",
    moneyPrefix: "$",
    moneySuffix: "",
    moneyPrecision: 2,
};

interface CalendarTranslation {
    days: string[];
    months: string[];
    monthsShort: string[];
    today: string;
    now: string;
    am: string;
    pm: string;
}

export type DateFormatFunction = (val: Date | undefined) => string;

export interface DateFormatSettings {
    ampm?: boolean;
    firstDayOfWeek?: number;
    monthFirst?: boolean;
    formatter?: {
        date?: DateFormatFunction;
        time?: DateFormatFunction;
    };
    text?: CalendarTranslation;
}

export const dateFormatDefaults: DateFormatSettings = {};
console.info("///format.dateFormatDefaults");

export function pad(n: number, size: number): string {
    let str: string = n.toString();
    while (str.length < size) {
        str = "0" + str;
    }
    return str;
}

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
export const fmt: {
    /* eslint-disable @typescript-eslint/indent */
    [key: string]:
        | ((d: Date | undefined) => string)
        | ((n: number | undefined) => string)
        | ((s: string | undefined) => string);
    isoDate: DateFormatFunction;
    isoTime: DateFormatFunction;
    /* eslint-enable @typescript-eslint/indent */
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
};

/*

 88d888b. .d8888b. 88d888b. .d8888b. .d8888b.
 88'  `88 88'  `88 88'  `88 Y8ooooo. 88ooood8
 88.  .88 88.  .88 88             88 88.  ...
 88Y888P' `88888P8 dP       `88888P' `88888P'
 88
 dP
*/

export const parse: {
    [key: string]: (s: string) => DataTypes;
} = {
    isoDate: (value: string): Date | undefined => {
        const d: Date = new Date(value);
        return d;
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
