// fr-FR.ts

import { isoTime, pad } from "../data/_common";
import { calendarDefaults } from "../components/use-calendar";
import { formatDefaults } from "../data/format";

import "./fr";

function frDate(d: Date | undefined) {
    if (!d || !d.getDate) {
        return "";
    }
    const day = pad(d.getDate(), 2);
    const month = pad(d.getMonth() + 1, 2);
    const year = d.getFullYear();
    return `${day}.${month}.${year}`;
}

calendarDefaults.ampm = false;
calendarDefaults.firstDayOfWeek = 1;
calendarDefaults.monthFirst = false;
calendarDefaults.formatter = { date: frDate, time: isoTime };

formatDefaults.decimal = ",";
formatDefaults.thousandSeparator = " ";
formatDefaults.moneyPrefix = "";
formatDefaults.moneySuffix = " €";
