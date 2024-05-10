/**
 * Translations and formats for American English.
 *
 * Number: `$1,000.00`
 *
 * Date: `01/31/2024 2:50 PM`
 * @module i18n/en-US
 */

import { numberFormatDefaults, dateFormatDefaults, pad } from "../data/format";

import "./en";

function usDate(d: Date | undefined): string {
    if (!d || !d.getDate) {
        return "";
    }
    const day = pad(d.getDate(), 2);
    const month = pad(d.getMonth() + 1, 2);
    const year = d.getFullYear();
    return `${month}/${day}/${year}`;
}

numberFormatDefaults.decimal = ".";
numberFormatDefaults.thousandSeparator = ",";
numberFormatDefaults.moneyPrefix = "$";
numberFormatDefaults.moneySuffix = "";

dateFormatDefaults.ampm = true;
dateFormatDefaults.firstDayOfWeek = 0;
dateFormatDefaults.monthFirst = true;
dateFormatDefaults.formatter = { date: usDate };
