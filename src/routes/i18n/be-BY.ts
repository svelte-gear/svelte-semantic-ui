// i18n/be-BY
// Belarusian translations and formats.

import { promptDefaults } from "../../lib/data/rule-book";
import { numberFormatDefaults, dateFormatDefaults, fmt, pad } from "../../lib/data/format";

promptDefaults.prompt = Object.assign({}, promptDefaults.prompt, {
    empty: "{name} павінна мець значэнне",
    checked: "{name} павінна быць адзначана",
    email: "{name} павінна быць сапраўдным электронным адрасам",
    url: "{name} павінна быць сапраўдным URL",
    regExp: "{name} няправільна адфарматавана",
    integer: "{name} павінна быць цэлым лікам",
    decimal: "{name} павінна быць дзесятковым лікам",
    number: "{name} павінна быць лікам",
    is: "{name} павінна быць '{ruleValue}'",
    isExactly: "{name} павінна быць дакладна '{ruleValue}'",
    not: "{name} не можа супадаць з '{ruleValue}'",
    notExactly: "{name} не можа быць дакладна '{ruleValue}'",
    contain: "{name} не можа змяшчаць '{ruleValue}'",
    containExactly: "{name} не можа змяшчаць дакладна '{ruleValue}'",
    doesntContain: "{name} павінна змяшчаць '{ruleValue}'",
    doesntContainExactly: "{name} павінна змяшчаць дакладна '{ruleValue}'",
    minLength: "{name} павінна мець прынамсі {ruleValue} сімвалы",
    length: "{name} павінна мець прынамсі {ruleValue} сімвалы",
    exactLength: "{name} павінна мець дакладна {ruleValue} сімвалы",
    maxLength: "{name} не можа быць больш {ruleValue} сімвалаў",
    size: "{name} павінна мець даўжыню паміж {min} і {max} сімваламі",
    match: "{name} павінна супадаць з полем {ruleValue}",
    different: "{name} павінна мець іншае значэнне, чым поле {ruleValue}",
    creditCard: "{name} павінна быць сапраўдным нумарам крэдытнай карты",
    minCount: "{name} павінна мець прынамсі {ruleValue} выбараў",
    exactCount: "{name} павінна мець дакладна {ruleValue} выбараў",
    maxCount: "{name} павінна мець {ruleValue} ці менш выбараў",
    addErrors: "{name}: {error}",
});

promptDefaults.text = Object.assign({}, promptDefaults.text, {
    unspecifiedRule: "Калі ласка, увядзіце сапраўднае значэнне",
    unspecifiedField: "Гэта поле",
    leavingMessage:
        "На гэтай старонцы ёсць незахаваныя змены, якія будуць згублены, калі вы не спынiцiся",
});

dateFormatDefaults.text = Object.assign({}, dateFormatDefaults.text, {
    days: ["Нд", "Пн", "Аў", "Ср", "Чц", "Пт", "Сб"],
    months: [
        "Студзень",
        "Люты",
        "Сакавік",
        "Красавік",
        "Май",
        "Чэрвень",
        "Ліпень",
        "Жнівень",
        "Верасень",
        "Кастрычнік",
        "Лістапад",
        "Снежань",
    ],
    monthsShort: [
        "Студ",
        "Лют",
        "Сак",
        "Крас",
        "Май",
        "Чэрв",
        "Ліп",
        "Жн",
        "Вер",
        "Каст",
        "Ліст",
        "Снеж",
    ],
    today: "Сёння",
    now: "Зараз",
    am: "AM",
    pm: "PM",
});

numberFormatDefaults.decimal = ",";
numberFormatDefaults.thousandSeparator = " ";
numberFormatDefaults.moneyPrefix = "";
numberFormatDefaults.moneySuffix = " руб";

function beDate(d: Date | undefined): string {
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
dateFormatDefaults.formatter = { date: beDate, time: fmt.isoTime };
