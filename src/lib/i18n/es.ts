/**
 * Castilian Spanish translations and formats.
```text
 Number: 1.234,56 €
 Date:   1-03-2024 14.50
```
 * @module i18n/es-ES
 */

import type {
    CalendarSettings,
    CalendarText,
    FormPropmt,
    FormText,
    NumberSettings,
} from "../data/semantic-types";

const formPrompt: FormPropmt = {
    empty: "{name} debe tener un valor",
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
    contains: "{name} no puede contener '{ruleValue}'",
    containsExactly: "{name} no puede contener exactamente '{ruleValue}'",
    doesntContain: "{name} debe contener '{ruleValue}'",
    doesntContainExactly: "{name} debe contener exactamente '{ruleValue}'",
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
    startEnd: "{name} debe empezar y terminar con '{ruleValue}'",
};

const formText: FormText = {
    unspecifiedRule: "Por favor, introduzca un valor válido",
    unspecifiedField: "Este campo",
    leavingMessage: "Hay cambios no guardados en esta página que se perderán si continúa.",
};

const calendarText: CalendarText = {
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
        date: "D-MM-YYYY",
        datetime: "D-MM-YYYY HH:mm",
        time: "HH:mm",
    },
};

const numberSettings: NumberSettings = {
    decimal: ",",
    thousandSeparator: ".",
    moneyPrefix: "",
    moneySuffix: " €",
    listSeparator: ",",
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
