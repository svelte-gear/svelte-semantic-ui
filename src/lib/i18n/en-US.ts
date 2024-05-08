// en-US.ts

import { calendarDefaults } from "../components/use-calendar";
import { formatDefaults, pad } from "../data/format";

import "./en";

function usDate(d: Date | undefined) {
    if (!d || !d.getDate) {
        return "";
    }
    const day = pad(d.getDate(), 2);
    const month = pad(d.getMonth() + 1, 2);
    const year = d.getFullYear();
    return `${month}/${day}/${year}`;
}

calendarDefaults.ampm = true;
calendarDefaults.firstDayOfWeek = 0;
calendarDefaults.monthFirst = true;
calendarDefaults.formatter = { date: usDate };

formatDefaults.decimal = ".";
formatDefaults.thousandSeparator = ",";
formatDefaults.moneyPrefix = "$";
formatDefaults.moneySuffix = "";
