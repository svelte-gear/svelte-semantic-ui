/**
 * Castilian Spanish translations and formats.
```text
 Number: 1 234,56 €
 Date:   1-mar-2024 14:50
```
 * @module i18n/es-int
 */

import type { NumberSettings } from "../data/common";
import type {
    ButtonTexts,
    CalendarSettings,
    CalendarTexts,
    CommonProgressTexts,
    DropdownMessages,
    FormPrompt,
    FormText,
} from "../data/semantic-types";

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
    maxValue: "{name} debe ser menor o igual a {ruleValue}",
    minValue: "{name} debe ser mayor o igual a {ruleValue}",
    range: "{name} debe estar en el rango [{ruleValue}]",
    size: "{name} debe tener una longitud entre {min} y {max} caracteres",
};

const formText: FormText = {
    unspecifiedRule: "Por favor, introduzca un valor válido",
    unspecifiedField: "Este campo",
    leavingMessage: "Hay cambios no guardados en esta página que se perderán si continúa.",
};

const calendarText: CalendarTexts = {
    dayNames: ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"],
    dayNamesShort: ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"],
    days: ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sá"],
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
        "Ene",
        "Feb",
        "Mar",
        "Abr",
        "May",
        "Jun",
        "Jul",
        "Ago",
        "Sep",
        "Oct",
        "Nov",
        "Dic",
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

const dropdownTexts: DropdownMessages = {
    addResult: "Agregar <b>{term}</b>",
    count: "{count} seleccionados",
    maxSelections: "Máximo {maxCount} selecciones",
    noResults: "No se encontraron resultados.",
    serverError: "Hubo un error al contactar al servidor",
};

const progressTexts: CommonProgressTexts = {
    percent: "{percent}%", // TODO: chack if "{percent} por ciento" is more used
    ratio: "{value} de {total}",
};

const buttonTexts: ButtonTexts = {
    ok: "Ok",
    cancel: "Cancelar",
    close: "Cerrar",
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

    flyout: {
        text: buttonTexts,
    },
    modal: {
        text: buttonTexts,
    },
    dropdown: {
        message: dropdownTexts,
    },
    progress: {
        text: progressTexts,
    },
};
