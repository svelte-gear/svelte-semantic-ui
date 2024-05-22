/**
 * Translations and formats for Castilian Spanish.
```text
 Number: 1.234,56 €
 Date:   1-03-2024 14.50
```
 * @module i18n/es-MX
 */

import { numberFormatDefaults, dateFormatDefaults, fmt, pad } from "../data/format";

import "./es";

numberFormatDefaults.decimal = ",";
numberFormatDefaults.thousandSeparator = ".";
numberFormatDefaults.moneyPrefix = "$";
numberFormatDefaults.moneySuffix = "";
numberFormatDefaults.listSeparator = ",";

function esDate(d: Date | undefined): string {
    if (!d || !d.getDate) {
        return "";
    }
    const day: string = pad(d.getDate(), 1);
    const month: string = pad(d.getMonth() + 1, 2);
    const year: number = d.getFullYear();
    return `${day}-${month}-${year}`;
}

dateFormatDefaults.ampm = false;
dateFormatDefaults.firstDayOfWeek = 1;
dateFormatDefaults.monthFirst = false;
dateFormatDefaults.formatter = { date: esDate, time: fmt.isoTime };
