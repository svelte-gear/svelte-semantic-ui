/**
 * English translations.
 * @module i18n/en
 */

import { promptDefaults } from "../data/rule-book";
import { dateFormatDefaults } from "../data/format";

promptDefaults.prompt = Object.assign({}, promptDefaults.prompt, {
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
    contain: "{name} cannot contain '{ruleValue}'",
    containExactly: "{name} cannot contain exactly '{ruleValue}'",
    doesntContain: "{name} must contain  '{ruleValue}'",
    doesntContainExactly: "{name} must contain exactly '{ruleValue}'",
    minLength: "{name} must be at least {ruleValue} characters",
    length: "{name} must be at least {ruleValue} characters",
    exactLength: "{name} must be exactly {ruleValue} characters",
    maxLength: "{name} cannot be longer than {ruleValue} characters",
    size: "{name} must have a length between {min} and {max} characters",
    match: "{name} must match {ruleValue} field",
    different: "{name} must have a different value than {ruleValue} field",
    creditCard: "{name} must be a valid credit card number",
    minCount: "{name} must have at least {ruleValue} choices",
    exactCount: "{name} must have exactly {ruleValue} choices",
    maxCount: "{name} must have {ruleValue} or less choices",
    addErrors: "{name}: {error}",
});

promptDefaults.text = Object.assign({}, promptDefaults.text, {
    unspecifiedRule: "Please enter a valid value",
    unspecifiedField: "This field",
    leavingMessage:
        "There are unsaved changes on this page which will be discarded if you continue.",
});

dateFormatDefaults.text = Object.assign({}, dateFormatDefaults.text, {
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
});
