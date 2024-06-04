/**
 * Greek translations and formats.
```text
 Number: 1.234,56 €
 Date:   01/03/2024 14.50
```
 * @module i18n/el-GR
 */

import type {
    CalendarSettings,
    CalendarText,
    FormPropmt,
    FormText,
    NumberSettings,
} from "../data/semantic-types";

const formPrompt: FormPropmt = {
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
    contains: "{name} δεν μπορεί να περιέχει '{ruleValue}'",
    containsExactly: "{name} δεν μπορεί να περιέχει ακριβώς '{ruleValue}'",
    doesntContain: "{name} πρέπει να περιέχει '{ruleValue}'",
    doesntContainExactly: "{name} πρέπει να περιέχει ακριβώς '{ruleValue}'",
    minLength: "{name} πρέπει να έχει τουλάχιστον {ruleValue} χαρακτήρες",
    exactLength: "{name} πρέπει να έχει ακριβώς {ruleValue} χαρακτήρες",
    maxLength: "{name} δεν μπορεί να είναι μεγαλύτερο από {ruleValue} χαρακτήρες",
    match: "{name} πρέπει να ταιριάζει με το πεδίο {ruleValue}",
    different: "{name} πρέπει να έχει διαφορετική τιμή από το πεδίο {ruleValue}",
    creditCard: "{name} πρέπει να είναι έγκυρος αριθμός πιστωτικής κάρτας",
    minCount: "{name} πρέπει να έχει τουλάχιστον {ruleValue} επιλογές",
    exactCount: "{name} πρέπει να έχει ακριβώς {ruleValue} επιλογές",
    maxCount: "{name} πρέπει να έχει {ruleValue} ή λιγότερες επιλογές",

    start: "{name} πρέπει να ξεκινά με '{ruleValue}'",
    isoDate: "{name} πρέπει να ακολουθεί τη μορφή 'ΕΕΕΕ-ΜΜ-ΗΗ'",
    startEnd: "{name} πρέπει να ξεκινά και να τελειώνει με '{ruleValue}'",
};

const formText: FormText = {
    unspecifiedRule: "Παρακαλώ εισάγετε μια έγκυρη τιμή",
    unspecifiedField: "Αυτό το πεδίο",
    leavingMessage:
        "Υπάρχουν μη αποθηκευμένες αλλαγές σε αυτή τη σελίδα οι οποίες θα χαθούν αν συνεχίσετε.",
};

const calendarText: CalendarText = {
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
    weekNo: "Εβδομάδα",
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
