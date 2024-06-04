/**
 * Formats for Canadian English.
```text
 Number: $1 000.00
 Date:   2024-03-01 14:50
```
 * @module i18n/en-CA
 */

import type { CalendarSettings, NumberSettings } from "../data/semantic-types";

const calendarSettings: CalendarSettings = {
    firstDayOfWeek: 0,
    monthFirst: false,
    formatter: {
        cellTime: "HH:mm",
        date: "YYYY-MM-DD",
        datetime: "YYYY-MM-DD HH:mm",
        time: "HH:mm",
    },
};

const numberSettings: NumberSettings = {
    decimal: ".",
    thousandSeparator: " ",
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
