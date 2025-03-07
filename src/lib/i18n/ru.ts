/**
 * Rusian translations and formats.
```text
 Number: 1 000,00 ₽
 Date:   01.03.2024 14:50
```
 * @module i18n/ru-RU
 */

/* eslint-disable max-len */

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
    empty: "{name} должно иметь значение",
    notEmpty: "{name} должно иметь значение",
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
    contains: "{name} должно содержать '{ruleValue}'",
    containsExactly: "{name} должно содержать точно '{ruleValue}'",
    doesntContain: "{name} не может содержать '{ruleValue}'",
    doesntContainExactly: "{name} не может содержать точно '{ruleValue}'",
    minLength: "{name} должно быть не менее {ruleValue} символов",
    exactLength: "{name} должно быть точно {ruleValue} символов",
    maxLength: "{name} не может быть длиннее {ruleValue} символов",
    match: "{name} должно совпадать с полем {ruleValue}",
    different: "{name} должно иметь значение, отличное от поля {ruleValue}",
    creditCard: "{name} должно быть действительным номером кредитной карты",
    minCount: "{name} должно иметь не менее {ruleValue} вариантов",
    exactCount: "{name} должно иметь ровно {ruleValue} вариантов",
    maxCount: "{name} должно иметь не более {ruleValue} вариантов",

    start: "{name} должно начинаться с '{ruleValue}'",
    isoDate: "{name} должно быть в формате 'ГГГГ-ММ-ДД' (год-месяц-день)",
    wrappedIn: "{name} должно начинаться и заканчиваться '{ruleValue}'",
    maxValue: "{name} должно быть меньше или равно {ruleValue}",
    minValue: "{name} должно быть больше или равно {ruleValue}",
    range: "{name} должно находиться в диапазоне [{ruleValue}]",
    size: "{name} должно иметь длину от {min} до {max} символов",
};

const formText: FormText = {
    unspecifiedRule: "Пожалуйста, введите допустимое значение",
    unspecifiedField: "Это поле",
    leavingMessage:
        "На этой странице есть несохраненные изменения, которые будут потеряны, если вы продолжите.",
};

const calendarText: CalendarTexts = {
    dayNames: ["воскресенье", "понедельник", "вторник", "среда", "четверг", "пятница", "суббота"],
    dayNamesShort: ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
    days: ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
    months: [
        "январь",
        "февраль",
        "март",
        "апрель",
        "май",
        "июнь",
        "июль",
        "август",
        "сентябрь",
        "октябрь",
        "ноябрь",
        "декабрь",
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
    today: "сегодня",
    now: "сейчас",
    am: "AM",
    pm: "PM",
    weekNo: "Неделя",
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
    moneySuffix: " ₽",
    moneyPrecision: 0,
};

const dropdownTexts: DropdownMessages = {
    addResult: "Добавить <b>{term}</b>",
    count: "{count} выбрано",
    maxSelections: "Максимум {maxCount} выборов",
    noResults: "Ничего не найдено.",
    serverError: "Произошла ошибка при подключении к серверу",
};

const progressTexts: CommonProgressTexts = {
    percent: "{percent}%",
    ratio: "{value} из {total}",
};

const buttonTexts: ButtonTexts = {
    ok: "Ок",
    cancel: "Отмена",
    close: "Закрыть",
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
