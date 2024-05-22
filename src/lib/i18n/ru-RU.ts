/**
 * Rusian translations and formats.
```text
 Number: 1 000,00 ₽
 Date:   01.03.2024 14:50
```
 * @module i18n/ru-RU
 */

import { promptDefaults } from "../../lib/data/rule-book";
import { numberFormatDefaults, dateFormatDefaults, fmt, pad } from "../../lib/data/format";

promptDefaults.prompt = Object.assign({}, promptDefaults.prompt, {
    empty: "{name} должно иметь значение",
    checked: "{name} должно быть отмечено",
    email: "{name} должно быть действительным e-mail",
    url: "{name} должно быть действительным url",
    regExp: "{name} имеет неправильный формат",
    integer: "{name} должно быть целым числом",
    decimal: "{name} должно быть десятичным числом",
    number: "{name} должно быть числом",
    is: "{name} должно быть '{ruleValue}'",
    isExactly: "{name} должно быть точно '{ruleValue}'",
    not: "{name} не может быть '{ruleValue}'",
    notExactly: "{name} не может быть точно '{ruleValue}'",
    contain: "{name} не может содержать '{ruleValue}'",
    containExactly: "{name} не может содержать точно '{ruleValue}'",
    doesntContain: "{name} должно содержать '{ruleValue}'",
    doesntContainExactly: "{name} должно содержать точно '{ruleValue}'",
    minLength: "{name} должно быть не менее {ruleValue} символов",
    length: "{name} должно быть не менее {ruleValue} символов",
    exactLength: "{name} должно быть точно {ruleValue} символов",
    maxLength: "{name} не может быть длиннее {ruleValue} символов",
    size: "{name} должно иметь длину от {min} до {max} символов",
    match: "{name} должно совпадать с полем {ruleValue}",
    different: "{name} должно иметь значение, отличное от поля {ruleValue}",
    creditCard: "{name} должно быть действительным номером кредитной карты",
    minCount: "{name} должно иметь не менее {ruleValue} вариантов",
    exactCount: "{name} должно иметь ровно {ruleValue} вариантов",
    maxCount: "{name} должно иметь не более {ruleValue} вариантов",
    addErrors: "{name}: {error}",
});

promptDefaults.text = Object.assign({}, promptDefaults.text, {
    unspecifiedRule: "Пожалуйста, введите допустимое значение",
    unspecifiedField: "Это поле",
    leavingMessage:
        "На этой странице есть несохраненные изменения, которые будут потеряны, если вы продолжите.",
});

dateFormatDefaults.text = Object.assign({}, dateFormatDefaults.text, {
    days: ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
    months: [
        "Январь",
        "Февраль",
        "Март",
        "Апрель",
        "Май",
        "Июнь",
        "Июль",
        "Август",
        "Сентябрь",
        "Октябрь",
        "Ноябрь",
        "Декабрь",
    ],
    monthsShort: [
        "Янв",
        "Фев",
        "Мар",
        "Апр",
        "Май",
        "Июн",
        "Июл",
        "Авг",
        "Сен",
        "Окт",
        "Ноя",
        "Дек",
    ],
    today: "Сегодня",
    now: "Сейчас",
    am: "AM",
    pm: "PM",
});

numberFormatDefaults.decimal = ",";
numberFormatDefaults.thousandSeparator = " ";
numberFormatDefaults.moneyPrefix = "";
numberFormatDefaults.moneySuffix = " ₽";
numberFormatDefaults.listSeparator = ",";

function ruDate(d: Date | undefined): string {
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
dateFormatDefaults.formatter = { date: ruDate, time: fmt.isoTime };
