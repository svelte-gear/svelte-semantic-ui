/**
 * Formats for Canadian English.
```text
 Number: $1 000.00
 Date:   2024-03-01 14:50
```
 * @module i18n/en-CA
 */

import type { NumberSettings } from "../data/common";
import type { CalendarSettings } from "../data/semantic-types";

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
    decimalSeparator: ".",
    thousandSeparator: " ",
    moneyPrefix: "$",
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
