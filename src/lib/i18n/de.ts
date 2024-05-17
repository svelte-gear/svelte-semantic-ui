/**
 * German translations.
 * @module i18n/de
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
    contain: "{name} darf '{ruleValue}' nicht enthalten",
    containExactly: "{name} darf genau '{ruleValue}' nicht enthalten",
    doesntContain: "{name} muss '{ruleValue}' enthalten",
    doesntContainExactly: "{name} muss genau '{ruleValue}' enthalten",
    minLength: "{name} muss mindestens {ruleValue} Zeichen lang sein",
    length: "{name} muss mindestens {ruleValue} Zeichen lang sein",
    exactLength: "{name} muss genau {ruleValue} Zeichen lang sein",
    maxLength: "{name} darf nicht länger als {ruleValue} Zeichen sein",
    size: "{name} muss eine Länge zwischen {min} und {max} Zeichen haben",
    match: "{name} muss mit dem Feld {ruleValue} übereinstimmen",
    different: "{name} muss sich vom Feld {ruleValue} unterscheiden",
    creditCard: "{name} muss eine gültige Kreditkartennummer sein",
    minCount: "{name} muss mindestens {ruleValue} Auswahlmöglichkeiten haben",
    exactCount: "{name} muss genau {ruleValue} Auswahlmöglichkeiten haben",
    maxCount: "{name} darf nicht mehr als {ruleValue} Auswahlmöglichkeiten haben",
    addErrors: "{name}: {error}",
});

promptDefaults.text = Object.assign({}, promptDefaults.text, {
    unspecifiedRule: "Bitte geben Sie einen gültigen Wert ein",
    unspecifiedField: "Dieses Feld",
    leavingMessage:
        "Es gibt nicht gespeicherte Änderungen auf dieser Seite, die verworfen werden, wenn Sie fortfahren.",
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
});
