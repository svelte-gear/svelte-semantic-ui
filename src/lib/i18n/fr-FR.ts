/**
 * Translations and formats for Metropolitan French.
 *
 * Number: `1 000,00 €`
 *
 * Date: `31.01.2024 14:50`
 * @module i18n/fr-FR
 */

import { numberFormatDefaults, dateFormatDefaults, fmt, pad } from "../data/format";

import "./fr";

function frDate(d: Date | undefined): string {
    if (!d || !d.getDate) {
        return "";
    }
    const day = pad(d.getDate(), 2);
    const month = pad(d.getMonth() + 1, 2);
    const year = d.getFullYear();
    return `${day}.${month}.${year}`;
}

numberFormatDefaults.decimal = ",";
numberFormatDefaults.thousandSeparator = " ";
numberFormatDefaults.moneyPrefix = "";
numberFormatDefaults.moneySuffix = " €";

dateFormatDefaults.ampm = false;
dateFormatDefaults.firstDayOfWeek = 1;
dateFormatDefaults.monthFirst = false;
dateFormatDefaults.formatter = { date: frDate, time: fmt.isoTime };
