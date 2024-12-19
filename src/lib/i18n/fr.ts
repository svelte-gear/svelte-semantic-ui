/**
 * Metropolitan French translations and formats.
```text
 Number: 1 000,00 €
 Date:   01 mar 2024, 14:50
```
 * @module i18n/fr
 */

/* eslint-disable max-len */

import type {
    CalendarSettings,
    CalendarText,
    FormPrompt,
    FormText,
    NumberSettings,
} from "../data/semantic-types";

const formPrompt: FormPrompt = {
    empty: "{name} doit avoir une valeur.",
    checked: "{name} doit être cochée.",
    email: "{name} doit être une adresse e-mail valide.",
    url: "{name} doit être une URL valide.",
    regExp: "{name} n'est pas correctement formaté.",
    integer: "{name} doit être un nombre entier.",
    decimal: "{name} doit être un nombre décimal.",
    number: "{name} doit être défini comme un nombre.",
    is: "{name} doit être '{ruleValue}'.",
    isExactly: "{name} doit être exactement '{ruleValue}'.",
    not: "{name} ne peut pas être défini comme '{ruleValue}'.",
    notExactly: "{name} ne peut pas être défini exactement comme '{ruleValue}'.",
    contains: "{name} doit contenir '{ruleValue}'.",
    containsExactly: "{name} doit contenir exactement '{ruleValue}'.",
    doesntContain: "{name} ne peut pas contenir '{ruleValue}'.",
    doesntContainExactly: "{name} ne peut pas contenir exactement '{ruleValue}'.",
    minLength: "{name} doit comporter au moins {ruleValue} caractères.",
    exactLength: "{name} doit comporter exactement {ruleValue} caractères.",
    maxLength: "{name} ne peut pas dépasser {ruleValue} caractères.",
    match: "{name} doit correspondre au champ {ruleValue}.",
    different: "{name} doit avoir une valeur différente du champ {ruleValue}.",
    creditCard: "{name} doit être un numéro de carte de crédit valide.",
    minCount: "{name} doit comporter au moins {ruleValue} choix.",
    exactCount: "{name} doit comporter exactement {ruleValue} choix.",
    maxCount: "{name} doit comporter {ruleValue} choix ou moins.",

    start: "{name} doit commencer par '{ruleValue}'",
    isoDate: "{name} doit suivre le format 'AAAA-MM-JJ' (année-mois-jour)",
    startEnd: "{name} doit commencer et se terminer par '{ruleValue}'",
};

const formText: FormText = {
    unspecifiedRule: "Veuillez entrer une valeur valide",
    unspecifiedField: "Ce champ",
    leavingMessage:
        "Des modifications non enregistrées sont présentes sur cette page et seront perdues si vous continuez.",
};

const calendarText: CalendarText = {
    days: ["dim", "lun", "mar", "mer", "jeu", "ven", "sam"],
    months: [
        "janvier",
        "février",
        "mars",
        "avril",
        "mai",
        "juin",
        "juillet",
        "août",
        "septembre",
        "octobre",
        "novembre",
        "décembre",
    ],
    monthsShort: [
        "jan",
        "fév",
        "mar",
        "avr",
        "mai",
        "juin",
        "juil",
        "aoû",
        "sep",
        "oct",
        "nov",
        "déc",
    ],
    today: "aujourd'hui",
    now: "maintenant",
    am: "AM",
    pm: "PM",
    weekNo: "Semaine",
};

const calendarSettings: CalendarSettings = {
    firstDayOfWeek: 1,
    monthFirst: false,
    formatter: {
        cellTime: "HH:mm",
        date: "D MMM YYYY",
        datetime: "D MMM YYYY, HH:mm",
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
