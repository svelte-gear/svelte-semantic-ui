/**
 * Spanish translations.
 * @module i18n/es
 */

import { promptDefaults } from "../data/rule-book";
import { dateFormatDefaults } from "../data/format";

/*
                   dP oo       dP            dP
                   88          88            88
 dP   .dP .d8888b. 88 dP .d888b88 .d8888b. d8888P .d8888b. 88d888b.
 88   d8' 88'  `88 88 88 88'  `88 88'  `88   88   88'  `88 88'  `88
 88 .88'  88.  .88 88 88 88.  .88 88.  .88   88   88.  .88 88
 8888P'   `88888P8 dP dP `88888P8 `88888P8   dP   `88888P' dP

*/

promptDefaults.prompt = Object.assign({}, promptDefaults.prompt, {
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
    contain: "{name} no puede contener '{ruleValue}'",
    containExactly: "{name} no puede contener exactamente '{ruleValue}'",
    doesntContain: "{name} debe contener '{ruleValue}'",
    doesntContainExactly: "{name} debe contener exactamente '{ruleValue}'",
    minLength: "{name} debe tener al menos {ruleValue} caracteres",
    length: "{name} debe tener al menos {ruleValue} caracteres",
    exactLength: "{name} debe tener exactamente {ruleValue} caracteres",
    maxLength: "{name} no puede tener más de {ruleValue} caracteres",
    size: "{name} debe tener una longitud entre {min} y {max} caracteres",
    match: "{name} debe coincidir con el campo {ruleValue}",
    different: "{name} debe tener un valor diferente al del campo {ruleValue}",
    creditCard: "{name} debe ser un número de tarjeta de crédito válido",
    minCount: "{name} debe tener al menos {ruleValue} opciones",
    exactCount: "{name} debe tener exactamente {ruleValue} opciones",
    maxCount: "{name} debe tener {ruleValue} opciones o menos",
    addErrors: "{name}: {error}",
});

promptDefaults.text = Object.assign({}, promptDefaults.text, {
    unspecifiedRule: "Por favor, introduzca un valor válido",
    unspecifiedField: "Este campo",
    leavingMessage: "Hay cambios no guardados en esta página que se perderán si continúa.",
});

/*
                   dP                         dP
                   88                         88
 .d8888b. .d8888b. 88 .d8888b. 88d888b. .d888b88 .d8888b. 88d888b.
 88'  `"" 88'  `88 88 88ooood8 88'  `88 88'  `88 88'  `88 88'  `88
 88.  ... 88.  .88 88 88.  ... 88    88 88.  .88 88.  .88 88
 `88888P' `88888P8 dP `88888P' dP    dP `88888P8 `88888P8 dP

*/

dateFormatDefaults.text = Object.assign({}, dateFormatDefaults.text, {
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
});
