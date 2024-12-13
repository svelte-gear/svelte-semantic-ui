/**
 * Castilian Spanish translations and formats.
```text
 Number: 1.234,56 €
 Date:   1-03-2024 14.50
```
 * @module i18n/es-ES
 */

import type { CalendarSettings, NumberSettings } from "../data/semantic-types";

const calendarSettings: CalendarSettings = {
    firstDayOfWeek: 1,
    monthFirst: false,
    formatter: {
        cellTime: "HH.mm",
        date: "D-MM-YYYY",
        datetime: "D-MM-YYYY HH.mm",
        time: "HH.mm",
    },
};

const numberSettings: NumberSettings = {
    decimalSeparator: ",",
    thousandSeparator: ".",
    moneyPrefix: "",
    moneySuffix: " €",
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
