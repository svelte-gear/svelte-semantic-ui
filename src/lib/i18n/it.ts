/**
 * Italian translations and formats.
```text
 Number: €1.000,00
 Date:   01/03/2024 14:50
```
 * @module i18n/it-IT
 */

import type {
    CalendarSettings,
    CalendarText,
    FormPrompt,
    FormText,
    NumberSettings,
} from "../data/semantic-types";

const formPrompt: FormPrompt = {
    empty: "{name} deve avere un valore",
    checked: "{name} deve essere selezionato",
    email: "{name} deve essere un'email valida",
    url: "{name} deve essere un URL valido",
    regExp: "{name} non è formattato correttamente",
    integer: "{name} deve essere un numero intero",
    decimal: "{name} deve essere un numero decimale",
    number: "{name} deve essere un numero",
    is: "{name} deve essere '{ruleValue}'",
    isExactly: "{name} deve essere esattamente '{ruleValue}'",
    not: "{name} non può essere '{ruleValue}'",
    notExactly: "{name} non può essere esattamente '{ruleValue}'",
    contains: "{name} deve contenere '{ruleValue}'",
    containsExactly: "{name} deve contenere esattamente '{ruleValue}'",
    doesntContain: "{name} non può contenere '{ruleValue}'",
    doesntContainExactly: "{name} non può contenere esattamente '{ruleValue}'",
    minLength: "{name} deve avere almeno {ruleValue} caratteri",
    exactLength: "{name} deve avere esattamente {ruleValue} caratteri",
    maxLength: "{name} non può avere più di {ruleValue} caratteri",
    match: "{name} deve corrispondere al campo {ruleValue}",
    different: "{name} deve avere un valore diverso dal campo {ruleValue}",
    creditCard: "{name} deve essere un numero di carta di credito valido",
    minCount: "{name} deve avere almeno {ruleValue} scelte",
    exactCount: "{name} deve avere esattamente {ruleValue} scelte",
    maxCount: "{name} deve avere {ruleValue} scelte o meno",

    start: "{name} deve iniziare con '{ruleValue}'",
    isoDate: "{name} deve seguire il formato 'AAAA-MM-GG' (anno-mese-giorno)",
    startEnd: "{name} deve iniziare e finire con '{ruleValue}'",
};

const formText: FormText = {
    unspecifiedRule: "Per favore, inserisci un valore valido",
    unspecifiedField: "Questo campo",
    leavingMessage:
        "Ci sono modifiche non salvate in questa pagina che andranno perse se continui.",
};

const calendarText: CalendarText = {
    days: ["D", "L", "M", "M", "G", "V", "S"],
    months: [
        "gennaio",
        "febbraio",
        "marzo",
        "aprile",
        "maggio",
        "giugno",
        "luglio",
        "agosto",
        "settembre",
        "ottobre",
        "novembre",
        "dicembre",
    ],
    monthsShort: [
        "gen",
        "feb",
        "mar",
        "apr",
        "mag",
        "giu",
        "lug",
        "ago",
        "set",
        "ott",
        "nov",
        "dic",
    ],
    today: "oggi",
    now: "adesso",
    am: "AM",
    pm: "PM",
    weekNo: "Settimana",
};

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
    thousandSeparator: ".",
    moneyPrefix: "€",
    moneySuffix: "",
    moneyPrecision: 2,
    listSeparator: ",",
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
