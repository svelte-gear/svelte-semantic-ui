/**
 * Polish translations and formats.
```text
 Number: 1 000,00 zł
 Date:   01.03.2024 14:50
```
 * @module i18n/pl-PL
 */

import type { NumberSettings } from "../data/common";
import type { CalendarSettings, CalendarText, FormPrompt, FormText } from "../data/semantic-types";

const formPrompt: FormPrompt = {
    empty: "{name} musi mieć wartość",
    checked: "{name} musi być zaznaczone",
    email: "{name} musi być prawidłowym adresem e-mail",
    url: "{name} musi być prawidłowym adresem URL",
    regExp: "{name} jest niepoprawnie sformatowany",
    integer: "{name} musi być liczbą całkowitą",
    decimal: "{name} musi być liczbą dziesiętną",
    number: "{name} musi być liczbą",
    is: "{name} musi być '{ruleValue}'",
    isExactly: "{name} musi być dokładnie '{ruleValue}'",
    not: "{name} nie może być ustawione na '{ruleValue}'",
    notExactly: "{name} nie może być dokładnie '{ruleValue}'",
    contains: "{name} musi zawierać '{ruleValue}'",
    containsExactly: "{name} musi zawierać dokładnie '{ruleValue}'",
    doesntContain: "{name} nie może zawierać '{ruleValue}'",
    doesntContainExactly: "{name} nie może zawierać dokładnie '{ruleValue}'",
    minLength: "{name} musi mieć przynajmniej {ruleValue} znaków",
    exactLength: "{name} musi mieć dokładnie {ruleValue} znaków",
    maxLength: "{name} nie może być dłuższe niż {ruleValue} znaków",
    match: "{name} musi odpowiadać polu {ruleValue}",
    different: "{name} musi mieć inną wartość niż pole {ruleValue}",
    creditCard: "{name} musi być prawidłowym numerem karty kredytowej",
    minCount: "{name} musi mieć przynajmniej {ruleValue} wyborów",
    exactCount: "{name} musi mieć dokładnie {ruleValue} wyborów",
    maxCount: "{name} musi mieć {ruleValue} lub mniej wyborów",

    start: "{name} musi zaczynać się od '{ruleValue}'",
    isoDate: "{name} musi być w formacie 'RRRR-MM-DD' (rok-miesiąc-dzień)",
    startEnd: "{name} musi zaczynać się i kończyć na '{ruleValue}'",
};

const formText: FormText = {
    unspecifiedRule: "Proszę wprowadzić prawidłową wartość",
    unspecifiedField: "To pole",
    leavingMessage:
        "Na tej stronie są niezapisane zmiany, które zostaną utracone, jeśli kontynuujesz.",
};

const calendarText: CalendarText = {
    days: ["Nd", "Pn", "Wt", "Śr", "Cz", "Pt", "So"],
    months: [
        "Styczeń",
        "Luty",
        "Marzec",
        "Kwiecień",
        "Maj",
        "Czerwiec",
        "Lipiec",
        "Sierpień",
        "Wrzesień",
        "Październik",
        "Listopad",
        "Grudzień",
    ],
    monthsShort: [
        "Sty",
        "Lut",
        "Mar",
        "Kwi",
        "Maj",
        "Cze",
        "Lip",
        "Sie",
        "Wrz",
        "Paź",
        "Lis",
        "Gru",
    ],
    today: "Dzisiaj",
    now: "Teraz",
    am: "AM",
    pm: "PM",
    weekNo: "Tydzień",
};

const calendarSettings: CalendarSettings = {
    firstDayOfWeek: 1,
    monthFirst: false,
    formatter: {
        cellTime: "HH:mm",
        date: "DD.MM.YYYY",
        datetime: "DD.MM.YYYY HH:mm",
        time: "HH:mm",
    },
};

const numberSettings: NumberSettings = {
    decimalSeparator: ",",
    thousandSeparator: " ",
    moneyPrefix: "",
    moneySuffix: " zł",
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
