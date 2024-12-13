/**
 * Formats for Canadian French.
```text
 Number: 1 000,00 $
 Date:   2024-03-01 14:50
```
 * @module i18n/fr-CA
 */

import type { CalendarSettings, FormPropmt, NumberSettings } from "../data/semantic-types";

const formPrompt: Partial<FormPropmt> = {
    checked: "{name} doit être coché.",
    email: "{name} doit être une adresse courriel valide.",
};

const calendarSettings: CalendarSettings = {
    firstDayOfWeek: 1,
    monthFirst: false,
    formatter: {
        cellTime: "HH:mm",
        date: "YYYY-MM-DD",
        datetime: "YYYY-MM-DD HH:mm",
        time: "HH:mm",
    },
};

const numberSettings: NumberSettings = {
    decimalSeparator: ",",
    thousandSeparator: " ",
    moneyPrefix: "",
    moneySuffix: " $",
    moneyPrecision: 2,
    listSeparator: ";",
};

export default {
    form: {
        prompt: formPrompt,
    },
    calendar: {
        ...calendarSettings,
    },
    number: {
        ...numberSettings,
    },
};
