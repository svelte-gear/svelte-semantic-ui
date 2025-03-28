/**
 * Formats for British English.
```text
 Number: £1,000.00
 Date:   01/03/2024 14:50
```
 * @module i18n/en-GB
 */

import type { NumberSettings } from "../data/common";
import type { CalendarSettings } from "../data/semantic-types";

const calendarSettings: CalendarSettings = {
    firstDayOfWeek: 0,
    monthFirst: false,
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
    moneyPrefix: "£",
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
