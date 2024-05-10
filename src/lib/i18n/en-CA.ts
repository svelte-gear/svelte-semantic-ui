/**
 * Translations and formats for Canadian English.
 *
 * Number: `$1 000.00 CAD`
 *
 * Date: `2024-01-31 14:50`
 * @module i18n/en-CA
 */

import { numberFormatDefaults, dateFormatDefaults, fmt } from "../data/format";

import "./en";

numberFormatDefaults.decimal = ".";
numberFormatDefaults.thousandSeparator = " ";
numberFormatDefaults.moneyPrefix = "$";
numberFormatDefaults.moneySuffix = " CAD";

dateFormatDefaults.ampm = false;
dateFormatDefaults.firstDayOfWeek = 1;
dateFormatDefaults.monthFirst = false;
dateFormatDefaults.formatter = { date: fmt.isoDate, time: fmt.isoTime };

// formatDefaults.simpleDateFormat_monthFirst = false;
// formatDefaults.simpleDateFormat_locale = "en-CA";
