/**
 * Ukranian translations and formats.
```text
 Number: 1 000,00 ₽
 Date:   01.03.2024 14:50
```
 * @module i18n/uk-UA
 */

import { promptDefaults } from "../../lib/data/rule-book";
import { numberFormatDefaults, dateFormatDefaults, fmt, pad } from "../../lib/data/format";

promptDefaults.prompt = Object.assign({}, promptDefaults.prompt, {
    empty: "{name} має мати значення",
    checked: "{name} має бути відмічений",
    email: "{name} має бути дійсною електронною поштою",
    url: "{name} має бути дійсним URL",
    regExp: "{name} має неправильний формат",
    integer: "{name} має бути цілим числом",
    decimal: "{name} має бути десятковим числом",
    number: "{name} має бути числом",
    is: "{name} має бути '{ruleValue}'",
    isExactly: "{name} має бути точно '{ruleValue}'",
    not: "{name} не може бути '{ruleValue}'",
    notExactly: "{name} не може бути точно '{ruleValue}'",
    contain: "{name} не може містити '{ruleValue}'",
    containExactly: "{name} не може містити точно '{ruleValue}'",
    doesntContain: "{name} має містити '{ruleValue}'",
    doesntContainExactly: "{name} має містити точно '{ruleValue}'",
    minLength: "{name} має бути не менше {ruleValue} символів",
    length: "{name} має бути не менше {ruleValue} символів",
    exactLength: "{name} має бути точно {ruleValue} символів",
    maxLength: "{name} не може бути довше {ruleValue} символів",
    size: "{name} має мати довжину між {min} і {max} символів",
    match: "{name} має збігатися з полем {ruleValue}",
    different: "{name} має відрізнятися від поля {ruleValue}",
    creditCard: "{name} має бути дійсним номером кредитної картки",
    minCount: "{name} має мати щонайменше {ruleValue} варіантів",
    exactCount: "{name} має мати точно {ruleValue} варіантів",
    maxCount: "{name} має мати не більше {ruleValue} варіантів",
    addErrors: "{name}: {error}",
});

promptDefaults.text = Object.assign({}, promptDefaults.text, {
    unspecifiedRule: "Будь ласка, введіть дійсне значення",
    unspecifiedField: "Це поле",
    leavingMessage: "Є незбережені зміни на цій сторінці, які будуть втрачені, якщо ви продовжите.",
});

dateFormatDefaults.text = Object.assign({}, dateFormatDefaults.text, {
    days: ["Нд", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
    months: [
        "Січень",
        "Лютий",
        "Березень",
        "Квітень",
        "Травень",
        "Червень",
        "Липень",
        "Серпень",
        "Вересень",
        "Жовтень",
        "Листопад",
        "Грудень",
    ],
    monthsShort: [
        "Січ",
        "Лют",
        "Бер",
        "Квіт",
        "Трав",
        "Черв",
        "Лип",
        "Серп",
        "Вер",
        "Жовт",
        "Лист",
        "Груд",
    ],
    today: "Сьогодні",
    now: "Зараз",
    am: "AM",
    pm: "PM",
});

numberFormatDefaults.decimal = ",";
numberFormatDefaults.thousandSeparator = " ";
numberFormatDefaults.moneyPrefix = "";
numberFormatDefaults.moneySuffix = " ₴";
numberFormatDefaults.listSeparator = ",";

function ukDate(d: Date | undefined): string {
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
dateFormatDefaults.formatter = { date: ukDate, time: fmt.isoTime };
