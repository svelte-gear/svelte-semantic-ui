/**
 * 'fmt' and 'parse' utility object, input formatter classes.
 * @module data/format
 */

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

export interface CalendarTranslation {
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

export function pad(n: number, size: number): string {
    let str = n.toString();
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
export const fmt = {
    isoDate: (d: Date | undefined): string => {
        if (!d || !d.getDate) {
            return "";
        }
        const day = pad(d.getDate(), 2);
        const month = pad(d.getMonth() + 1, 2);
        const year = pad(d.getFullYear(), 4);
        return `${year}-${month}-${day}`;
    },

    isoTime: (d: Date | undefined): string => {
        if (!d || !d.getDate) {
            return "";
        }
        const hour = pad(d.getHours(), 2);
        const minute = pad(d.getMinutes(), 2);
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

export const parse = {};
