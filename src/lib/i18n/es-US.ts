/**
 * Translations and formats for American Spanish.
```text
 Number: $1.000,00
 Date:   3/1/2024 2:50 PM
```
 * @module i18n/es-MX
 */

import { numberFormatDefaults, dateFormatDefaults, pad } from "../data/format";

import "./es";

numberFormatDefaults.decimal = ",";
numberFormatDefaults.thousandSeparator = ".";
numberFormatDefaults.moneyPrefix = "$";
numberFormatDefaults.moneySuffix = "";
numberFormatDefaults.listSeparator = ",";

function usDate(d: Date | undefined): string {
    if (!d || !d.getDate) {
        return "";
    }
    const day: string = pad(d.getDate(), 1);
    const month: string = pad(d.getMonth() + 1, 1);
    const year: number = d.getFullYear();
    return `${month}/${day}/${year}`;
}

dateFormatDefaults.ampm = false;
dateFormatDefaults.firstDayOfWeek = 0;
dateFormatDefaults.monthFirst = false;
dateFormatDefaults.formatter = { date: usDate };
