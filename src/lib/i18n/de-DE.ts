/**
 * Translations and formats for German.
```text
 Number: €1.000,00
 Date:   01.03.2024 14:50
```
 * @module i18n/de-DE
 */

import { numberFormatDefaults, dateFormatDefaults, fmt, pad } from "../data/format";
import { promptDefaults } from "../data/rule-book";

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

numberFormatDefaults.decimal = ",";
numberFormatDefaults.thousandSeparator = ".";
numberFormatDefaults.moneyPrefix = "€";
numberFormatDefaults.moneySuffix = "";
numberFormatDefaults.listSeparator = ",";

function deDate(d: Date | undefined): string {
    if (!d || !d.getDate) {
        return "";
    }
    const day: string = pad(d.getDate(), 2);
    const month: string = pad(d.getMonth() + 1, 2);
    const year: number = d.getFullYear();
    return `${day}.${month}.${year}`;
}

dateFormatDefaults.ampm = false;
dateFormatDefaults.firstDayOfWeek = 1;
dateFormatDefaults.monthFirst = false;
dateFormatDefaults.formatter = { date: deDate, time: fmt.isoTime };
