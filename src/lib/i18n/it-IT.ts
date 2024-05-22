/**
 * Italian translations and formats.
```text
 Number: €1.000,00
 Date:   01/03/2024 14:50
```
 * @module i18n/it-IT
 */

import { promptDefaults } from "../data/rule-book";
import { numberFormatDefaults, dateFormatDefaults, fmt, pad } from "../data/format";

promptDefaults.prompt = Object.assign({}, promptDefaults.prompt, {
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
    contain: "{name} non può contenere '{ruleValue}'",
    containExactly: "{name} non può contenere esattamente '{ruleValue}'",
    doesntContain: "{name} deve contenere '{ruleValue}'",
    doesntContainExactly: "{name} deve contenere esattamente '{ruleValue}'",
    minLength: "{name} deve avere almeno {ruleValue} caratteri",
    length: "{name} deve avere almeno {ruleValue} caratteri",
    exactLength: "{name} deve avere esattamente {ruleValue} caratteri",
    maxLength: "{name} non può avere più di {ruleValue} caratteri",
    size: "{name} deve avere una lunghezza tra {min} e {max} caratteri",
    match: "{name} deve corrispondere al campo {ruleValue}",
    different: "{name} deve avere un valore diverso dal campo {ruleValue}",
    creditCard: "{name} deve essere un numero di carta di credito valido",
    minCount: "{name} deve avere almeno {ruleValue} scelte",
    exactCount: "{name} deve avere esattamente {ruleValue} scelte",
    maxCount: "{name} deve avere {ruleValue} scelte o meno",
    addErrors: "{name}: {error}",
});

promptDefaults.text = Object.assign({}, promptDefaults.text, {
    unspecifiedRule: "Per favore, inserisci un valore valido",
    unspecifiedField: "Questo campo",
    leavingMessage:
        "Ci sono modifiche non salvate in questa pagina che andranno perse se continui.",
});

dateFormatDefaults.text = Object.assign({}, dateFormatDefaults.text, {
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
});

numberFormatDefaults.decimal = ",";
numberFormatDefaults.thousandSeparator = ".";
numberFormatDefaults.moneyPrefix = "€";
numberFormatDefaults.moneySuffix = "";
numberFormatDefaults.listSeparator = ",";

function itDate(d: Date | undefined): string {
    if (!d || !d.getDate) {
        return "";
    }
    const day: string = pad(d.getDate(), 2);
    const month: string = pad(d.getMonth() + 1, 2);
    const year: number = d.getFullYear();
    return `${day}/${month}/${year}`;
}

dateFormatDefaults.ampm = false;
dateFormatDefaults.firstDayOfWeek = 1;
dateFormatDefaults.monthFirst = false;
dateFormatDefaults.formatter = { date: itDate, time: fmt.isoTime };
