// i18n/en-AU
// Formats for Autraliam English

import type { CalendarSettings, NumberSettings } from "../../lib/data/semantic-types";

const calendarSettings: Partial<CalendarSettings> = {
    formatter: {
        cellTime: "HH:mm",
        date: "DD/MM/YYYY",
        datetime: "DD/MM/YYYY HH:mm",
        time: "HH:mm",
    },
};

const numberSettings: NumberSettings = {
    decimal: ".",
    thousandSeparator: ",",
    moneyPrefix: "$",
    moneySuffix: "",
    listSeparator: ",",
    moneyPrecision: 2,
};

export default {
    calendar: {
        ...calendarSettings,
    },
    number: {
        ...numberSettings,
    },
};
