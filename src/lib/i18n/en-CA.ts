/**
 * Translations and formats for Canadian English.
```text
 Number: $1 000.00
 Date:   2024-03-01 14:50
```
 * @module i18n/en-CA
 */

import { numberFormatDefaults, dateFormatDefaults, fmt } from "../data/format";

import "./en";

numberFormatDefaults.decimal = ".";
numberFormatDefaults.thousandSeparator = " ";
numberFormatDefaults.moneyPrefix = "$";
numberFormatDefaults.moneySuffix = "";
numberFormatDefaults.listSeparator = ",";

dateFormatDefaults.ampm = false;
dateFormatDefaults.firstDayOfWeek = 0;
dateFormatDefaults.monthFirst = false;
dateFormatDefaults.formatter = { date: fmt.isoDate, time: fmt.isoTime };
console.info("///en-CA.dateFormatDefaults.formatter");
