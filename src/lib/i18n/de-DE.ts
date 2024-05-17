/**
 * Translations and formats for German.
```text
 Number: €1.000,00
 Date:   01.03.2024 14:50
```
 * @module i18n/de-DE
 */

import { numberFormatDefaults, dateFormatDefaults, fmt, pad } from "../data/format";

import "./de";

numberFormatDefaults.decimal = ",";
numberFormatDefaults.thousandSeparator = ".";
numberFormatDefaults.moneyPrefix = "€";
numberFormatDefaults.moneySuffix = "";

function deDate(d: Date | undefined): string {
    if (!d || !d.getDate) {
        return "";
    }
    const day: string = pad(d.getDate(), 2);
    const month: string = pad(d.getMonth() + 1, 2);
    const year: number = d.getFullYear();
    return `${day}.${month}.${year}`;
}

dateFormatDefaults.ampm = false;
dateFormatDefaults.firstDayOfWeek = 1;
dateFormatDefaults.monthFirst = false;
dateFormatDefaults.formatter = { date: deDate, time: fmt.isoTime };
