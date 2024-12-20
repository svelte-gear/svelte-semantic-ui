/**
 * This function is copied from fomantic-ui calendar component v2.9.3 (calendar.js:1071)
 * @module data/semantic-date-format
 */

/* eslint-disable one-var */
/* eslint-disable prefer-template */
/* eslint-disable no-nested-ternary */
/* eslint-disable @typescript-eslint/typedef */

import type { CalendarSettings, DateFormatFn } from "../data/semantic-types";

function weekOfYear(weekYear: number, weekMonth: number, weekDay: number): number {
    // adapted from http://www.merlyn.demon.co.uk/weekcalc.htm
    const ms1d = 24 * 3600 * 1000,
        ms7d = 7 * ms1d,
        DC3 = Date.UTC(weekYear, weekMonth, weekDay + 3) / ms1d, // an absolute day number
        AWN = Math.floor(DC3 / 7), // an absolute week number
        WYR = new Date(AWN * ms7d).getUTCFullYear();
    return AWN - Math.floor(Date.UTC(WYR, 0, 7) / ms7d) + 1;
}

/** This function is copied from fomantic-ui calendar component v2.9.3 */
export function helperDateFormat(
    format: string | DateFormatFn,
    date: Date,
    settings: Required<CalendarSettings>
): string {
    if (!(date instanceof Date)) {
        return "";
    }
    if (typeof format === "function") {
        return format(date, settings);
        // TODO: test if the function works with formatter function as argument
    }
    const D = date.getDate(),
        M = date.getMonth(),
        Y = date.getFullYear(),
        d = date.getDay(),
        H = date.getHours(),
        m = date.getMinutes(),
        s = date.getSeconds(),
        w = /* module.get. */ weekOfYear(Y, M, D + 1 - settings.firstDayOfWeek),
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
            S: ["th", "st", "nd", "rd"][D % 10 > 3 ? 0 : (D % 100) - (D % 10) === 10 ? 0 : D % 10],
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
