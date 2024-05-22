/**
 * Translations and formats for British English.
```text
 Number: £1,000.00
 Date:   01/03/2024 14:50
```
 * @module i18n/en-GB
 */

import { numberFormatDefaults, dateFormatDefaults, fmt, pad } from "../data/format";

import "./en";

numberFormatDefaults.decimal = ".";
numberFormatDefaults.thousandSeparator = ",";
numberFormatDefaults.moneyPrefix = "£";
numberFormatDefaults.moneySuffix = "";
numberFormatDefaults.listSeparator = ",";

function gbDate(d: Date | undefined): string {
    if (!d || !d.getDate) {
        return "";
    }
    const day: string = pad(d.getDate(), 2);
    const month: string = pad(d.getMonth(), 2);
    const year: number = d.getFullYear();
    return `${day}/${month}/${year}`;
}

dateFormatDefaults.ampm = false;
dateFormatDefaults.firstDayOfWeek = 1;
dateFormatDefaults.monthFirst = false;
dateFormatDefaults.formatter = { date: gbDate, time: fmt.isoTime };
