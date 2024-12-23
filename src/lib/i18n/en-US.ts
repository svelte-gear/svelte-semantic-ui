/**
 * Formats for American English.
```text
 Number: $1,000.00
 Date:   3/1/2024 2:50 PM
```
 * @module i18n/en-US
 */

import type { NumberSettings } from "../data/common";
import type { CalendarSettings } from "../data/semantic-types";

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
    decimalSeparator: ".",
    thousandSeparator: ",",
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
