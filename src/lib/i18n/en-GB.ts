/**
 * Translations and formats for British English.
 *
 * Number: `£1,000.00`
 *
 * Date: `31-Jan-2024 14:50`
 * @module i18n/en-GB
 */

import { numberFormatDefaults, dateFormatDefaults, fmt, pad } from "../data/format";

import "./en";

function gbDate(d: Date | undefined): string {
    if (!d || !d.getDate) {
        return "";
    }
    const day = pad(d.getDate(), 2);
    const month = dateFormatDefaults.text!.monthsShort[d.getMonth()];
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
}

numberFormatDefaults.decimal = ".";
numberFormatDefaults.thousandSeparator = ",";
numberFormatDefaults.moneyPrefix = "£";
numberFormatDefaults.moneySuffix = "";

dateFormatDefaults.ampm = false;
dateFormatDefaults.firstDayOfWeek = 1;
dateFormatDefaults.monthFirst = false;
dateFormatDefaults.formatter = { date: gbDate, time: fmt.isoTime };
