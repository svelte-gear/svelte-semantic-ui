/**
 * Translations and formats for Canadian French.
 *
 * Number: `1 000,00 $ CA`
 *
 * Date: `2024-01-31 14:50`
 * @module i18n/fr-CA
 */

import { numberFormatDefaults, dateFormatDefaults, fmt } from "../data/format";

import "./fr";

numberFormatDefaults.decimal = ",";
numberFormatDefaults.thousandSeparator = " ";
numberFormatDefaults.moneyPrefix = "";
numberFormatDefaults.moneySuffix = " $ CA";

dateFormatDefaults.ampm = false;
dateFormatDefaults.firstDayOfWeek = 1;
dateFormatDefaults.monthFirst = false;
dateFormatDefaults.formatter = { date: fmt.isoDate, time: fmt.isoTime };
