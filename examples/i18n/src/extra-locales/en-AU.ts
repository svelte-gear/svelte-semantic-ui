// i18n/en-AU
// Formats for Autraliam English

import type { CalendarSettings, NumberSettings } from "@svelte-gear/svelte-semantic-ui";

const calendarSettings: Partial<CalendarSettings> = {
    formatter: {
        cellTime: "HH:mm",
        date: "DD/MM/YYYY",
        datetime: "DD/MM/YYYY HH:mm",
        time: "HH:mm",
    },
};

const numberSettings: NumberSettings = {
    decimalSeparator: ".",
    thousandSeparator: ",",
    moneyPrefix: "$",
    moneySuffix: "",
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
