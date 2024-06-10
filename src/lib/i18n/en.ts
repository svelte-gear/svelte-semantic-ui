/**
 * International English translations and formats.
```text
 Number: $1 000.00
 Date:   May 1, 2024 14:50
```
 * @module i18n/en-001
 */

import type {
    CalendarSettings,
    CalendarText,
    DropdownMessages,
    FormPropmt,
    FormText,
    NumberSettings,
    ProgressTexts,
} from "../data/semantic-types";

const formPrompt: FormPropmt = {
    empty: "{name} must have a value",
    checked: "{name} must be checked",
    email: "{name} must be a valid e-mail",
    url: "{name} must be a valid url",
    regExp: "{name} is not formatted correctly",
    integer: "{name} must be an integer",
    decimal: "{name} must be a decimal number",
    number: "{name} must be set to a number",
    is: "{name} must be '{ruleValue}'",
    isExactly: "{name} must be exactly '{ruleValue}'",
    not: "{name} cannot be set to '{ruleValue}'",
    notExactly: "{name} cannot be set to exactly '{ruleValue}'",
    contains: "{name} cannot contain '{ruleValue}'",
    containsExactly: "{name} cannot contain exactly '{ruleValue}'",
    doesntContain: "{name} must contain  '{ruleValue}'",
    doesntContainExactly: "{name} must contain exactly '{ruleValue}'",
    minLength: "{name} must be at least {ruleValue} characters",
    exactLength: "{name} must be exactly {ruleValue} characters",
    maxLength: "{name} cannot be longer than {ruleValue} characters",
    match: "{name} must match {ruleValue} field",
    different: "{name} must have a different value than {ruleValue} field",
    creditCard: "{name} must be a valid credit card number",
    minCount: "{name} must have at least {ruleValue} choices",
    exactCount: "{name} must have exactly {ruleValue} choices",
    maxCount: "{name} must have {ruleValue} or less choices",

    start: "{name} must start with '{ruleValue}'",
    isoDate: "{name} must follow the 'YYYY-MM-DD' format",
    startEnd: "{name} must start and end with '{ruleValue}'",
};

const formText: FormText = {
    unspecifiedRule: "Please enter a valid value",
    unspecifiedField: "This field",
    leavingMessage:
        "There are unsaved changes on this page which will be discarded if you continue.",
};

const calendarText: CalendarText = {
    days: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
    months: [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ],
    monthsShort: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
    ],
    today: "Today",
    now: "Now",
    am: "AM",
    pm: "PM",
    weekNo: "Week",
};

const calendarSettings: CalendarSettings = {
    firstDayOfWeek: 0,
    monthFirst: true,
    formatter: {
        cellTime: "HH:mm",
        date: "MMM DD, YYYY",
        datetime: "MMM DD, YYYY HH:mm",
        time: "HH:mm",
    },
};

const numberSettings: NumberSettings = {
    decimal: ".",
    thousandSeparator: " ",
    moneyPrefix: "$",
    moneySuffix: "",
    listSeparator: ",",
    moneyPrecision: 2,
};

// TODO: transpalte to other languages
const dropdownMessages: DropdownMessages = {
    addResult: "Add <b>{term}</b>",
    count: "{count} selected",
    maxSelections: "Max {maxCount} selections",
    noResults: "No results found.",
    serverError: "There was an error contacting the server",
};

const progressTexts: ProgressTexts = {
    percent: "{percent}%",
    ratio: "{value} of {total}",
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
    dropdown: {
        message: dropdownMessages,
    },
    progress: {
        test: progressTexts,
    },
};
