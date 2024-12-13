// i18n/en-GB-ext
// Alternative date format recommended by NHS: 1-Mar-2024

import type { CalendarSettings, NumberSettings } from "@svelte-gear/svelte-semantic-ui";

const calendarSettings: Partial<CalendarSettings> = {
    firstDayOfWeek: 0,
    monthFirst: false,
    formatter: {
        cellTime: "HH:mm",
        date: "DD-MMM-YYYY",
        datetime: "DD-MMM-YYYY HH:mm",
        time: "HH:mm",
    },
};

const numberSettings: NumberSettings = {
    decimalSeparator: ".",
    thousandSeparator: ",",
    moneyPrefix: "£",
    moneySuffix: "",
    moneyPrecision: 2,
    listSeparator: ",",
};

export default {
    calendar: {
        ...calendarSettings,
    },
    number: {
        ...numberSettings,
    },
};
