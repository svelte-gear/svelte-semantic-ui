/**
 * Formats for Mexican Spanish.
```text
 Number: $1,000.00
 Date:   1/03/2024 14:50
```
 * @module i18n/es-MX
 */

import type { CalendarSettings, FormText, NumberSettings } from "../data/semantic-types";

const formText: Partial<FormText> = {
    unspecifiedRule: "Por favor, ingresa un valor válido",
    leavingMessage: "Hay cambios no guardados en esta página que se perderán si continúas.",
};

const calendarSettings: CalendarSettings = {
    firstDayOfWeek: 0,
    monthFirst: false,
    formatter: {
        cellTime: "HH:mm",
        date: "D/MM/YYYY",
        datetime: "D/MM/YYYY HH:mm",
        time: "HH:mm",
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
    form: {
        text: formText,
    },
    calendar: {
        ...calendarSettings,
    },
    number: {
        ...numberSettings,
    },
};
