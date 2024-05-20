// i18n/pl-PL
// Polish translations and formats.

import { promptDefaults } from "../../lib/data/rule-book";
import { numberFormatDefaults, dateFormatDefaults, fmt, pad } from "../../lib/data/format";

promptDefaults.prompt = Object.assign({}, promptDefaults.prompt, {
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
    contain: "{name} nie może zawierać '{ruleValue}'",
    containExactly: "{name} nie może zawierać dokładnie '{ruleValue}'",
    doesntContain: "{name} musi zawierać '{ruleValue}'",
    doesntContainExactly: "{name} musi zawierać dokładnie '{ruleValue}'",
    minLength: "{name} musi mieć przynajmniej {ruleValue} znaków",
    length: "{name} musi mieć przynajmniej {ruleValue} znaków",
    exactLength: "{name} musi mieć dokładnie {ruleValue} znaków",
    maxLength: "{name} nie może być dłuższe niż {ruleValue} znaków",
    size: "{name} musi mieć długość między {min} a {max} znaków",
    match: "{name} musi odpowiadać polu {ruleValue}",
    different: "{name} musi mieć inną wartość niż pole {ruleValue}",
    creditCard: "{name} musi być prawidłowym numerem karty kredytowej",
    minCount: "{name} musi mieć przynajmniej {ruleValue} wyborów",
    exactCount: "{name} musi mieć dokładnie {ruleValue} wyborów",
    maxCount: "{name} musi mieć {ruleValue} lub mniej wyborów",
    addErrors: "{name}: {error}",
});

promptDefaults.text = Object.assign({}, promptDefaults.text, {
    unspecifiedRule: "Proszę wprowadzić prawidłową wartość",
    unspecifiedField: "To pole",
    leavingMessage:
        "Na tej stronie są niezapisane zmiany, które zostaną utracone, jeśli kontynuujesz.",
});

dateFormatDefaults.text = Object.assign({}, dateFormatDefaults.text, {
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
});

numberFormatDefaults.decimal = ",";
numberFormatDefaults.thousandSeparator = " ";
numberFormatDefaults.moneyPrefix = "";
numberFormatDefaults.moneySuffix = " zł";

function plDate(d: Date | undefined): string {
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
dateFormatDefaults.formatter = { date: plDate, time: fmt.isoTime };
