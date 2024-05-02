// i18n/en-GB.ts

// import { suiValidationDefaults } from "../data/sui-form-validation";
import { isoTime, pad } from "../data/common";
import { calendarDefaults } from "../components/use-calendar";
import { formatDefaults } from "../data/use-format";

import "./en";

type CalendarSetting = {
    text: {
        monthsShort: string[];
    };
};
function gbDate(d: Date | undefined): string {
    if (!d || !d.getDate) {
        return "";
    }
    const day = pad(d.getDate(), 2);
    const month = (calendarDefaults as CalendarSetting).text.monthsShort[d.getMonth()];
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
}

calendarDefaults.ampm = false;
calendarDefaults.firstDayOfWeek = 1;
calendarDefaults.monthFirst = false;
calendarDefaults.formatter = { date: gbDate, time: isoTime };

formatDefaults.decimal = ".";
formatDefaults.thousandSeparator = ",";
formatDefaults.moneyPrefix = "£";
formatDefaults.moneySuffix = "";
