// index.ts

import type { CalendarTranslation } from "./use-calendar";
import { calendarDefaults } from "./use-calendar";
import { calendarIsoFmt } from "./common";
import type { ValidatorPrompt, ValidatorText } from "./form-validation";
import { validatorDefaults } from "./form-validation";

import "./import-modules";

/*
                                                dP
                                                88
 .d8888b. dP.  .dP 88d888b. .d8888b. 88d888b. d8888P
 88ooood8  `8bd8'  88'  `88 88'  `88 88'  `88   88
 88.  ...  .d88b.  88.  .88 88.  .88 88         88
 `88888P' dP'  `dP 88Y888P' `88888P' dP         dP
                   88
                   dP
*/

export { calendar } from "./use-calendar";
export { checkbox } from "./use-checkbox";
export { dropdown } from "./use-dropdown";
export { modal } from "./use-modal";
export { popup } from "./use-popup";
export { slider } from "./use-slider";
export { sticky } from "./use-sticky";
export { validate } from "./data-validate";

export { formValidation } from "./form-validation";
export { toast } from "./functions";
export { default as Data } from "./data-bind.svelte";
export { default as FormValidationData } from "./form-validation-data.svelte";

/*
                   dP oo       dP            dP
                   88          88            88
 dP   .dP .d8888b. 88 dP .d888b88 .d8888b. d8888P .d8888b. 88d888b.
 88   d8' 88'  `88 88 88 88'  `88 88'  `88   88   88'  `88 88'  `88
 88 .88'  88.  .88 88 88 88.  .88 88.  .88   88   88.  .88 88
 8888P'   `88888P8 dP dP `88888P8 `88888P8   dP   `88888P' dP

*/

validatorDefaults.keyboardShortcuts = false;

export function translateValidator(prompt: ValidatorPrompt, text: ValidatorText) {
   validatorDefaults.prompt = prompt;
   validatorDefaults.text = text;
}

// eslint-disable-next-line @typescript-eslint/naming-convention
const validatorPrompt_en: ValidatorPrompt = {
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
   match: "{name} must match {ruleValue} field",
   different: "{name} must have a different value than {ruleValue} field",
   creditCard: "{name} must be a valid credit card number",
   minCount: "{name} must have at least {ruleValue} choices",
   exactCount: "{name} must have exactly {ruleValue} choices",
   maxCount: "{name} must have {ruleValue} or less choices"
};
// eslint-disable-next-line @typescript-eslint/naming-convention
const validatorText_en: ValidatorText = {
   unspecifiedRule: "Please enter a valid value",
   unspecifiedField: "This field"
};
translateValidator(validatorPrompt_en, validatorText_en);

/*
                   dP                         dP
                   88                         88
 .d8888b. .d8888b. 88 .d8888b. 88d888b. .d888b88 .d8888b. 88d888b.
 88'  `"" 88'  `88 88 88ooood8 88'  `88 88'  `88 88'  `88 88'  `88
 88.  ... 88.  .88 88 88.  ... 88    88 88.  .88 88.  .88 88
 `88888P' `88888P8 dP `88888P' dP    dP `88888P8 `88888P8 dP

*/

calendarDefaults.type = "date";
calendarDefaults.ampm = false;
calendarDefaults.touchReadonly = false;
calendarDefaults.formatter = {
   date: calendarIsoFmt.date,
   time: calendarIsoFmt.time
};
calendarDefaults.firstDayOfWeek = 1;

export function translateCalendar(text: CalendarTranslation) {
   calendarDefaults.text = text;
}

// CAL.DAY.SU = "Su"
// CAL.MONTH.1 = "January"
// CAL.SHORT.1 = "Jan"
// CAL.TODAY = "Today"

// eslint-disable-next-line @typescript-eslint/naming-convention
const calendarText_en: CalendarTranslation = {
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
      "December"
   ],
   monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
   today: "Today",
   now: "Now",
   am: "AM",
   pm: "PM"
};
translateCalendar(calendarText_en);
