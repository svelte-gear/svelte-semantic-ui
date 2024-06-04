/**
 * Formats for American English.
```text
 Number: $1,000.00
 Date:   3/1/2024 2:50 PM
```
 * @module i18n/en-US
 */

import type { CalendarSettings, NumberSettings } from "../data/semantic-types";

const calendarSettings: CalendarSettings = {
    firstDayOfWeek: 0,
    monthFirst: true,
    formatter: {
        cellTime: "h:mm A",
        date: "M/D/YYYY",
        datetime: "M/D/YYYY h:mm A",
        time: "h:mm A",
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
