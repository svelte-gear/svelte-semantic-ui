/**
 * Translations and formats for Canadian French.
```text
 Number: 1 000,00 $
 Date:   2024-03-01 14:50
```
 * @module i18n/fr-CA
 */

import { numberFormatDefaults, dateFormatDefaults, fmt } from "../data/format";

import "./fr";

numberFormatDefaults.decimal = ",";
numberFormatDefaults.thousandSeparator = " ";
numberFormatDefaults.moneyPrefix = "";
numberFormatDefaults.moneySuffix = " $";

dateFormatDefaults.ampm = false;
dateFormatDefaults.firstDayOfWeek = 1;
dateFormatDefaults.monthFirst = false;
dateFormatDefaults.formatter = { date: fmt.isoDate, time: fmt.isoTime };
