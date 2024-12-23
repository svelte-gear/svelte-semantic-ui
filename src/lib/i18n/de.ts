/**
 * German translations and formats.
```text
 Number: €1.000,00
 Date:   01.03.2024 14:50
```
 * @module i18n/de-DE
 */

/* eslint-disable max-len */

import type { NumberSettings } from "../data/common";
import type { CalendarSettings, CalendarText, FormPrompt, FormText } from "../data/semantic-types";

const formPrompt: FormPrompt = {
    empty: "{name} muss einen Wert haben",
    checked: "{name} muss ausgewählt sein",
    email: "{name} muss eine gültige E-Mail-Adresse sein",
    url: "{name} muss eine gültige URL sein",
    regExp: "{name} hat ein ungültiges Format",
    integer: "{name} muss eine ganze Zahl sein",
    decimal: "{name} muss eine Dezimalzahl sein",
    number: "{name} muss eine Zahl sein",
    is: "{name} muss '{ruleValue}' sein",
    isExactly: "{name} muss genau '{ruleValue}' sein",
    not: "{name} darf nicht '{ruleValue}' sein",
    notExactly: "{name} darf nicht genau '{ruleValue}' sein",
    contains: "{name} muss '{ruleValue}' enthalten",
    containsExactly: "{name} muss genau '{ruleValue}' enthalten",
    doesntContain: "{name} darf '{ruleValue}' nicht enthalten",
    doesntContainExactly: "{name} darf genau '{ruleValue}' nicht enthalten",
    minLength: "{name} muss mindestens {ruleValue} Zeichen lang sein",
    exactLength: "{name} muss genau {ruleValue} Zeichen lang sein",
    maxLength: "{name} darf nicht länger als {ruleValue} Zeichen sein",
    match: "{name} muss mit dem Feld {ruleValue} übereinstimmen",
    different: "{name} muss sich vom Feld {ruleValue} unterscheiden",
    creditCard: "{name} muss eine gültige Kreditkartennummer sein",
    minCount: "{name} muss mindestens {ruleValue} Auswahlmöglichkeiten haben",
    exactCount: "{name} muss genau {ruleValue} Auswahlmöglichkeiten haben",
    maxCount: "{name} darf nicht mehr als {ruleValue} Auswahlmöglichkeiten haben",

    start: "{name} muss :) start with '{ruleValue}'",
    isoDate: "{name} muss :) follow the 'YYYY-MM-DD' format",
    startEnd: "{name} muss :) start and end with '{ruleValue}'",
};

const formText: FormText = {
    unspecifiedRule: "Bitte geben Sie einen gültigen Wert ein",
    unspecifiedField: "Dieses Feld",
    leavingMessage:
        "Es gibt nicht gespeicherte Änderungen auf dieser Seite, die verworfen werden, wenn Sie fortfahren.",
};

const calendarText: CalendarText = {
    days: ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"],
    months: [
        "Januar",
        "Februar",
        "März",
        "April",
        "Mai",
        "Juni",
        "Juli",
        "August",
        "September",
        "Oktober",
        "November",
        "Dezember",
    ],
    monthsShort: [
        "Jan",
        "Feb",
        "Mär",
        "Apr",
        "Mai",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Okt",
        "Nov",
        "Dez",
    ],
    today: "Heute",
    now: "Jetzt",
    am: "vorm.",
    pm: "nachm.",
    weekNo: "Woche",
};

const calendarSettings: CalendarSettings = {
    firstDayOfWeek: 1,
    monthFirst: false,
    formatter: {
        cellTime: "HH:mm",
        date: "DD.MM.YYYY",
        datetime: "DD.MM.YYYY HH:ss",
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
