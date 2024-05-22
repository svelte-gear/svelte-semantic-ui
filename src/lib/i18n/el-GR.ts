/**
 * Greek translations and formats.
```text
 Number: 1.234,56 €
 Date:   01/03/2024 14.50
```
 * @module i18n/el-GR
 */

import { promptDefaults } from "../../lib/data/rule-book";
import { numberFormatDefaults, dateFormatDefaults, fmt, pad } from "../../lib/data/format";

dateFormatDefaults.text = Object.assign({}, dateFormatDefaults.text, {
    days: ["Κυ", "Δε", "Τρ", "Τε", "Πε", "Πα", "Σα"],
    months: [
        "Ιανουάριος",
        "Φεβρουάριος",
        "Μάρτιος",
        "Απρίλιος",
        "Μάιος",
        "Ιούνιος",
        "Ιούλιος",
        "Αύγουστος",
        "Σεπτέμβριος",
        "Οκτώβριος",
        "Νοέμβριος",
        "Δεκέμβριος",
    ],
    monthsShort: [
        "Ιαν",
        "Φεβ",
        "Μαρ",
        "Απρ",
        "Μαι",
        "Ιουν",
        "Ιουλ",
        "Αυγ",
        "Σεπ",
        "Οκτ",
        "Νοε",
        "Δεκ",
    ],
    today: "Σήμερα",
    now: "Τώρα",
    am: "ΠΜ",
    pm: "ΜΜ",
});

promptDefaults.prompt = Object.assign({}, promptDefaults.prompt, {
    empty: "{name} πρέπει να έχει μια τιμή",
    checked: "{name} πρέπει να είναι επιλεγμένο",
    email: "{name} πρέπει να είναι έγκυρο email",
    url: "{name} πρέπει να είναι έγκυρο url",
    regExp: "{name} δεν είναι μορφοποιημένο σωστά",
    integer: "{name} πρέπει να είναι ακέραιος αριθμός",
    decimal: "{name} πρέπει να είναι δεκαδικός αριθμός",
    number: "{name} πρέπει να είναι αριθμός",
    is: "{name} πρέπει να είναι '{ruleValue}'",
    isExactly: "{name} πρέπει να είναι ακριβώς '{ruleValue}'",
    not: "{name} δεν μπορεί να είναι '{ruleValue}'",
    notExactly: "{name} δεν μπορεί να είναι ακριβώς '{ruleValue}'",
    contain: "{name} δεν μπορεί να περιέχει '{ruleValue}'",
    containExactly: "{name} δεν μπορεί να περιέχει ακριβώς '{ruleValue}'",
    doesntContain: "{name} πρέπει να περιέχει '{ruleValue}'",
    doesntContainExactly: "{name} πρέπει να περιέχει ακριβώς '{ruleValue}'",
    minLength: "{name} πρέπει να έχει τουλάχιστον {ruleValue} χαρακτήρες",
    length: "{name} πρέπει να έχει τουλάχιστον {ruleValue} χαρακτήρες",
    exactLength: "{name} πρέπει να έχει ακριβώς {ruleValue} χαρακτήρες",
    maxLength: "{name} δεν μπορεί να είναι μεγαλύτερο από {ruleValue} χαρακτήρες",
    size: "{name} πρέπει να έχει μήκος μεταξύ {min} και {max} χαρακτήρων",
    match: "{name} πρέπει να ταιριάζει με το πεδίο {ruleValue}",
    different: "{name} πρέπει να έχει διαφορετική τιμή από το πεδίο {ruleValue}",
    creditCard: "{name} πρέπει να είναι έγκυρος αριθμός πιστωτικής κάρτας",
    minCount: "{name} πρέπει να έχει τουλάχιστον {ruleValue} επιλογές",
    exactCount: "{name} πρέπει να έχει ακριβώς {ruleValue} επιλογές",
    maxCount: "{name} πρέπει να έχει {ruleValue} ή λιγότερες επιλογές",
    addErrors: "{name}: {error}",
});

promptDefaults.text = Object.assign({}, promptDefaults.text, {
    unspecifiedRule: "Παρακαλώ εισάγετε μια έγκυρη τιμή",
    unspecifiedField: "Αυτό το πεδίο",
    leavingMessage:
        "Υπάρχουν μη αποθηκευμένες αλλαγές σε αυτή τη σελίδα οι οποίες θα χαθούν αν συνεχίσετε.",
});

numberFormatDefaults.decimal = ",";
numberFormatDefaults.thousandSeparator = ".";
numberFormatDefaults.moneyPrefix = "";
numberFormatDefaults.moneySuffix = " €";
numberFormatDefaults.listSeparator = ",";

function grDate(d: Date | undefined): string {
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
dateFormatDefaults.formatter = { date: grDate, time: fmt.isoTime };
