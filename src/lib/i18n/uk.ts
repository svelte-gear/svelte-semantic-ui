/**
 * Ukranian translations and formats.
```text
 Number: 1 000 ₴
 Date:   01.03.2024 14:50
```
 * @module i18n/uk-UA
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
    empty: "{name} має мати значення",
    notEmpty: "{name} має мати значення",
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
    contains: "{name} має містити '{ruleValue}'",
    containsExactly: "{name} має містити точно '{ruleValue}'",
    doesntContain: "{name} не може містити '{ruleValue}'",
    doesntContainExactly: "{name} не може містити точно '{ruleValue}'",
    minLength: "{name} має бути не менше {ruleValue} символів",
    exactLength: "{name} має бути точно {ruleValue} символів",
    maxLength: "{name} не може бути довше {ruleValue} символів",
    match: "{name} має збігатися з полем {ruleValue}",
    different: "{name} має відрізнятися від поля {ruleValue}",
    creditCard: "{name} має бути дійсним номером кредитної картки",
    minCount: "{name} має мати щонайменше {ruleValue} варіантів",
    exactCount: "{name} має мати точно {ruleValue} варіантів",
    maxCount: "{name} має мати не більше {ruleValue} варіантів",

    start: "{name} має починатися з '{ruleValue}'",
    isoDate: "{name} має відповідати формату 'РРРР-ММ-ДД' (рік-місяць-день)",
    wrappedIn: "{name} має починатися і закінчуватися на '{ruleValue}'",
    maxValue: "{name} має бути менше або дорівнювати {ruleValue}",
    minValue: "{name} має бути більше або дорівнювати {ruleValue}",
    range: "{name} має бути в межах [{ruleValue}]",
    size: "{name} має мати довжину від {min} до {max} символів",
};

const formText: FormText = {
    unspecifiedRule: "Будь ласка, введіть дійсне значення",
    unspecifiedField: "Це поле",
    leavingMessage: "Є незбережені зміни на цій сторінці, які будуть втрачені, якщо ви продовжите.",
};

const calendarText: CalendarTexts = {
    dayNames: ["неділя", "понеділок", "вівторок", "середа", "четвер", "п'ятниця", "субота"],
    dayNamesShort: ["Нд", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
    days: ["Нд", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
    months: [
        "січень",
        "лютий",
        "березень",
        "квітень",
        "травень",
        "червень",
        "липень",
        "серпень",
        "вересень",
        "жовтень",
        "листопад",
        "грудень",
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
    today: "сьогодні",
    now: "зараз",
    am: "AM",
    pm: "PM",
    weekNo: "Тиждень",
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
    moneySuffix: " ₴",
    moneyPrecision: 0,
};

const dropdownTexts: DropdownMessages = {
    addResult: "Додати <b>{term}</b>",
    count: "{count} обрано",
    maxSelections: "Максимум {maxCount} виборів",
    noResults: "Нічого не знайдено.",
    serverError: "Виникла помилка під час з'єднання з сервером",
};

const progressTexts: CommonProgressTexts = {
    percent: "{percent}%",
    ratio: "{value} з {total}",
};

const buttonTexts: ButtonTexts = {
    ok: "Ок",
    cancel: "Скасувати",
    close: "Закрити",
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
