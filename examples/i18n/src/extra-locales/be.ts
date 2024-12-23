// i18n/be-BY

// Belarusian translations and formats.
// Number: 1 000,00 р.
// Date:   01.03.2024 14:50

import type {
    CalendarSettings,
    CalendarText,
    FormPropmt,
    FormText,
    NumberSettings,
} from "@svelte-gear/svelte-semantic-ui";

const formPrompt: FormPropmt = {
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
    contains: "{name} не можа змяшчаць '{ruleValue}'",
    containsExactly: "{name} не можа змяшчаць дакладна '{ruleValue}'",
    doesntContain: "{name} павінна змяшчаць '{ruleValue}'",
    doesntContainExactly: "{name} павінна змяшчаць дакладна '{ruleValue}'",
    minLength: "{name} павінна мець прынамсі {ruleValue} сімвалы",
    exactLength: "{name} павінна мець дакладна {ruleValue} сімвалы",
    maxLength: "{name} не можа быць больш {ruleValue} сімвалаў",
    match: "{name} павінна супадаць з полем {ruleValue}",
    different: "{name} павінна мець іншае значэнне, чым поле {ruleValue}",
    creditCard: "{name} павінна быць сапраўдным нумарам крэдытнай карты",
    minCount: "{name} павінна мець прынамсі {ruleValue} выбараў",
    exactCount: "{name} павінна мець дакладна {ruleValue} выбараў",
    maxCount: "{name} павінна мець {ruleValue} ці менш выбараў",

    start: "{name} павінен пачынацца з '{ruleValue}'",
    isoDate: "{name} павінен адпавядаць фармату 'ГГГГ-ММ-ДД' (год-месяц-дзень)",
    startEnd: "{name} павінен пачынацца і заканчвацца на '{ruleValue}'",
};

const formText: FormText = {
    unspecifiedRule: "Калі ласка, увядзіце сапраўднае значэнне",
    unspecifiedField: "Гэта поле",
    leavingMessage:
        "На гэтай старонцы ёсць незахаваныя змены, якія будуць згублены, калі вы не спынiцiся",
};

const calendarText: CalendarText = {
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
    weekNo: "Тыдзень",
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
    moneySuffix: " р.",
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
