/**
 * Form validation rules and types.
 * @module data/rule-book
 */

import type { SettingsObject } from "./common";
import { fmt, parse } from "./format";
import type { FormPropmt, FormSettings, RuleFunc } from "./semantic-types";
import { formDefaults } from "./use-form-validation";
import { calendarDefaults } from "../components/use-calendar";

/*
                   dP             dP                dP
                   88             88                88
 88d888b. dP    dP 88 .d8888b.    88d888b. .d8888b. 88 88d888b. .d8888b. 88d888b.
 88'  `88 88    88 88 88ooood8    88'  `88 88ooood8 88 88'  `88 88ooood8 88'  `88
 88       88.  .88 88 88.  ...    88    88 88.  ... 88 88.  .88 88.  ... 88
 dP       `88888P' dP `88888P'    dP    dP `88888P' dP 88Y888P' `88888P' dP
                                                       88
                                                       dP
*/

/* prettier-ignore */
// eslint-disable-next-line @typescript-eslint/typedef
export const rule = {
    empty:      (): string => "empty",
    checked:    (): string => "checked",

    email:      (): string => "email",
    url:        (): string => "url",
    integer:    (): string => "integer",
    decimal:    (): string => "decimal",
    number:     (): string => "number",
    creditCard: (): string => "creditCard",
    regex:      (reg: string): string => `regExp[//${reg}//]`,

    // integer:    (min?: number, max?: number): string =>
    //     min == undefined && max == undefined ? "integer" : `integer[${min}..${max}]`,

    is:             (val: string): string => `is[${val}]`,
    isExactly:      (val: string): string => `isExactly[${val}]`,
    not:            (val: string): string => `not[${val}]`,
    notExactly:     (val: string): string => `notExactly[${val}]`,
    contain:        (val: string): string => `contain[${val}]`,
    containExactly: (val: string): string => `containExactly[${val}]`,
    doesntContain:  (val: string): string => `doesntContain[${val}]`,
    doesntContainExactly: (val: string): string => `doesntContainExactly[${val}]`,

    match:          (fld: string): string => `match[${fld}]`,
    different:      (fld: string): string => `different[${fld}]`,

    minLength:   (n: number): string => `minLength[${n}]`,
    exactLength: (n: number): string => `exactLength[${n}]`,
    maxLength:   (n: number): string => `maxLength[${n}]`,
    minCount:    (n: number): string => `minCount[${n}]`,
    exactCount:  (n: number): string => `exactCount[${n}]`,
    maxCount:    (n: number): string => `maxCount[${n}]`,

    // TODO: add custom rules
};

/*
                              dP                                            dP
                              88                                            88
 .d8888b. dP    dP .d8888b. d8888P .d8888b. 88d8b.d8b.    88d888b. dP    dP 88 .d8888b. .d8888b.
 88'  `"" 88    88 Y8ooooo.   88   88'  `88 88'`88'`88    88'  `88 88    88 88 88ooood8 Y8ooooo.
 88.  ... 88.  .88       88   88   88.  .88 88  88  88    88       88.  .88 88 88.  ...       88
 `88888P' `88888P' `88888P'   dP   `88888P' dP  dP  dP    dP       `88888P' dP `88888P' `88888P'

*/

// date: () => "date",
// greaterThan   (type: "N"|"D"|"S", val: number|Date|string) -> greaterThan[D|2012-01-01]
// greaterOrEqual(type: "N"|"D"|"S", val: number|Date|string) -> gretaerOrEqual[N|0]
// lessThan      (type: "N"|"D"|"S", val: number|Date|string) -> lessThan[S|Abc]
// lessOrEqual   (type: "N"|"D"|"S", val: number|Date|string) -> lessOrEqueal[Abc]

// Add custom rule
function isoDateFn(value: string): boolean {
    let d: Date | undefined = undefined;
    try {
        d = parse.isoDate(value + " 13:00") as Date; // TODO: use better hack
    } catch (ex) {
        d = undefined;
    }
    return value === fmt.isoDate(d);
}

// Add custom rule
function startFn(value: string, ruleValue: string): boolean {
    return value.startsWith(ruleValue);
}

// Add custom rule
function startEndFn(value: string, ruleValue: string): boolean {
    console.info("startEnd : " + value + " - " + ruleValue);
    return value.startsWith(ruleValue);
}

export function registerRule(name: string, fn: RuleFunc, defaultPrompt: string): void {
    const def: FormSettings = formDefaults.read();
    def.rules![name] = fn;
    (def.prompt as FormPropmt & SettingsObject)[name] = defaultPrompt;
}

export function extendRules(): void {
    registerRule("start", startFn, "{name} must start with '{ruleValue}'");
    registerRule("isoDate", isoDateFn, "{name} must follow the 'YYYY-MM-DD' format");
    registerRule("startEnd", startEndFn, "{name} must start and end with '{ruleValue}'");
}

export function applyDefaultSettings(locale?: string): void {
    void locale;

    calendarDefaults.apply({
        type: "date",
        touchReadonly: false,
        minTimeGap: 5,
    });

    formDefaults.apply({
        keyboardShortcuts: false,
    });
}
