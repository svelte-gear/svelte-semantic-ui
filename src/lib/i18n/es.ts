/**
 * Castilian Spanish translations and formats.
```text
 Number: 1 234,56 €
 Date:   1-mar-2024 14:50
```
 * @module i18n/es-int
 */

import type { NumberSettings } from "../data/common";
import type { CalendarSettings, CalendarText, FormPrompt, FormText } from "../data/semantic-types";

const formPrompt: FormPrompt = {
    empty: "{name} debe tener un valor",
    notEmpty: "{name} debe tener un valor",
    checked: "{name} debe estar marcado",
    email: "{name} debe ser un correo electrónico válido",
    url: "{name} debe ser una URL válida",
    regExp: "{name} no está correctamente formateado",
    integer: "{name} debe ser un número entero",
    decimal: "{name} debe ser un número decimal",
    number: "{name} debe ser un número",
    is: "{name} debe ser '{ruleValue}'",
    isExactly: "{name} debe ser exactamente '{ruleValue}'",
    not: "{name} no puede ser '{ruleValue}'",
    notExactly: "{name} no puede ser exactamente '{ruleValue}'",
    contains: "{name} debe contener '{ruleValue}'",
    containsExactly: "{name} debe contener exactamente '{ruleValue}'",
    doesntContain: "{name} no puede contener '{ruleValue}'",
    doesntContainExactly: "{name} no puede contener exactamente '{ruleValue}'",
    minLength: "{name} debe tener al menos {ruleValue} caracteres",
    // length: "{name} debe tener al menos {ruleValue} caracteres",
    exactLength: "{name} debe tener exactamente {ruleValue} caracteres",
    maxLength: "{name} no puede tener más de {ruleValue} caracteres",
    // size: "{name} debe tener una longitud entre {min} y {max} caracteres",
    match: "{name} debe coincidir con el campo {ruleValue}",
    different: "{name} debe tener un valor diferente al del campo {ruleValue}",
    creditCard: "{name} debe ser un número de tarjeta de crédito válido",
    minCount: "{name} debe tener al menos {ruleValue} opciones",
    exactCount: "{name} debe tener exactamente {ruleValue} opciones",
    maxCount: "{name} debe tener {ruleValue} opciones o menos",

    // addErrors: "{name}: {error}",
    start: "{name} debe empezar con '{ruleValue}'",
    isoDate: "{name} debe seguir el formato 'AAAA-MM-DD' (año-mes-día)",
    wrappedIn: "{name} debe empezar y terminar con '{ruleValue}'",
    maxValue: "// [x]",
    minValue: "// [x]",
    range: "// [x]",
    size: "// [x]",
};

const formText: FormText = {
    unspecifiedRule: "Por favor, introduzca un valor válido",
    unspecifiedField: "Este campo",
    leavingMessage: "Hay cambios no guardados en esta página que se perderán si continúa.",
};

const calendarText: CalendarText = {
    dayNames: ["// [x]", "_", "_", "_", "_", "_", "_"],
    dayNamesShort: ["// [x]", "_", "_", "_", "_", "_", "_"],
    days: ["D", "L", "M", "X", "J", "V", "S"],
    months: [
        "enero",
        "febrero",
        "marzo",
        "abril",
        "mayo",
        "junio",
        "julio",
        "agosto",
        "septiembre",
        "octubre",
        "noviembre",
        "diciembre",
    ],
    monthsShort: [
        "ene",
        "feb",
        "mar",
        "abr",
        "may",
        "jun",
        "jul",
        "ago",
        "sep",
        "oct",
        "nov",
        "dic",
    ],
    today: "hoy",
    now: "ahora",
    am: "AM",
    pm: "PM",
    weekNo: "Semana",
};

const calendarSettings: CalendarSettings = {
    firstDayOfWeek: 1,
    monthFirst: false,
    formatter: {
        cellTime: "HH:mm",
        date: "D-MMM-YYYY",
        datetime: "D-MMM-YYYY HH:mm",
        time: "HH:mm",
    },
};

const numberSettings: NumberSettings = {
    decimalSeparator: ",",
    thousandSeparator: " ",
    moneyPrefix: "",
    moneySuffix: " €",
    moneyPrecision: 2,
};

export default {
    form: {
        prompt: formPrompt,
        text: formText,
    },
    calendar: {
        text: calendarText,
        ...calendarSettings,
    },
    number: {
        ...numberSettings,
    },
};
