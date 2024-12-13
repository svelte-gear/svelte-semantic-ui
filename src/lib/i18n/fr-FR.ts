/**
 * Metropolitan French translations and formats.
```text
 Number: 1 000,00 €
 Date:   01/03/2024 14:50
```
 * @module i18n/fr-FR
 */

import type { CalendarSettings, NumberSettings } from "../data/semantic-types";

const calendarSettings: CalendarSettings = {
    firstDayOfWeek: 1,
    monthFirst: false,
    formatter: {
        cellTime: "HH:mm",
        date: "DD/MM/YYYY",
        datetime: "DD/MM/YYYY HH:mm",
        time: "HH:mm",
    },
};

const numberSettings: NumberSettings = {
    decimalSeparator: ",",
    thousandSeparator: " ",
    moneyPrefix: "",
    moneySuffix: " €",
    moneyPrecision: 2,
    listSeparator: ";",
};

export default {
    calendar: {
        ...calendarSettings,
    },
    number: {
        ...numberSettings,
    },
};
