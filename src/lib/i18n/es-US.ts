/**
 * Formats for American Spanish.
```text
 Number: $1.000,00
 Date:   3/1/2024 2:50 PM
```
 * @module i18n/es-US
 */

import type {
    CalendarSettings,
    FormPropmt,
    FormText,
    NumberSettings,
} from "../data/semantic-types";

const formPrompt: Partial<FormPropmt> = {
    email: "{name} debe ser un email válido",
};

const formText: Partial<FormText> = {
    unspecifiedRule: "Por favor, ingrese un valor válido",
    leavingMessage: "Hay cambios no guardados en esta página que se perderán si continúas.",
};

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
    decimal: ",",
    thousandSeparator: ".",
    moneyPrefix: "$",
    moneySuffix: "",
    listSeparator: ",",
    moneyPrecision: 2,
};

export default {
    form: {
        prompt: formPrompt,
        text: formText,
    },
    calendar: {
        ...calendarSettings,
    },
    number: {
        ...numberSettings,
    },
};
