/**
 * Greek translations and formats.
```text
 Number: 1.234,56 €
 Date:   01/03/2024 14.50
```
 * @module i18n/el-GR
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
    empty: "{name} πρέπει να έχει μια τιμή",
    notEmpty: "{name} πρέπει να έχει μια τιμή",
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
    contains: "{name} πρέπει να περιέχει '{ruleValue}'",
    containsExactly: "{name} πρέπει να περιέχει ακριβώς '{ruleValue}'",
    doesntContain: "{name} δεν μπορεί να περιέχει '{ruleValue}'",
    doesntContainExactly: "{name} δεν μπορεί να περιέχει ακριβώς '{ruleValue}'",
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
    wrappedIn: "{name} πρέπει να ξεκινά και να τελειώνει με '{ruleValue}'",
    maxValue: "{name} πρέπει να είναι μικρότερο ή ίσο του {ruleValue}",
    minValue: "{name} πρέπει να είναι μεγαλύτερο ή ίσο του {ruleValue}",
    range: "{name} πρέπει να βρίσκεται στην περιοχή [{ruleValue}]",
    size: "{name} πρέπει να έχει μήκος μεταξύ {min} και {max} χαρακτήρων",
};

const formText: FormText = {
    unspecifiedRule: "Παρακαλώ εισάγετε μια έγκυρη τιμή",
    unspecifiedField: "Αυτό το πεδίο",
    leavingMessage:
        "Υπάρχουν μη αποθηκευμένες αλλαγές σε αυτή τη σελίδα οι οποίες θα χαθούν αν συνεχίσετε.",
};

const calendarText: CalendarTexts = {
    dayNames: ["Κυριακή", "Δευτέρα", "Τρίτη", "Τετάρτη", "Πέμπτη", "Παρασκευή", "Σάββατο"],
    dayNamesShort: ["Κυρ", "Δευ", "Τρι", "Τετ", "Πεμ", "Παρ", "Σαβ"],
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
    decimalSeparator: ",",
    thousandSeparator: ".",
    moneyPrefix: "",
    moneySuffix: " €",
    moneyPrecision: 2,
};

const dropdownTexts: DropdownMessages = {
    addResult: "Προσθήκη <b>{term}</b>",
    count: "{count} επιλεγμένα",
    maxSelections: "Μέγιστο {maxCount} επιλογές",
    noResults: "Δεν βρέθηκαν αποτελέσματα.",
    serverError: "Προέκυψε σφάλμα κατά την επικοινωνία με τον διακομιστή",
};

const progressTexts: CommonProgressTexts = {
    percent: "{percent}%",
    ratio: "{value} από {total}",
};

const buttonTexts: ButtonTexts = {
    ok: "Οκ",
    cancel: "Ακύρωση",
    close: "Κλείσιμο",
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
