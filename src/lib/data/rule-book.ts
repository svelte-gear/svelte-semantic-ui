/**
 * Form validation rules and types.
 * @module data/rule-book
 */

import type { JQueryApi } from "./common";
import { fmt, parse } from "./format";

/*
 dP                dP
 88                88
 88d888b. .d8888b. 88 88d888b. .d8888b. 88d888b.
 88'  `88 88ooood8 88 88'  `88 88ooood8 88'  `88
 88    88 88.  ... 88 88.  .88 88.  ... 88
 dP    dP `88888P' dP 88Y888P' `88888P' dP
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
};

/*
                     dP     dP   oo
                     88     88
 .d8888b. .d8888b. d8888P d8888P dP 88d888b. .d8888b. .d8888b.
 Y8ooooo. 88ooood8   88     88   88 88'  `88 88'  `88 Y8ooooo.
       88 88.  ...   88     88   88 88    88 88.  .88       88
 `88888P' `88888P'   dP     dP   dP dP    dP `8888P88 `88888P'
                                                  .88
                                              d8888P
*/

/* prettier-ignore */
type RulePromptTranslation = {
    // semantic-ui 2.4
    empty:      string;
    checked:    string;

    email:      string;
    url:        string;
    regExp:     string;
    integer:    string;
    decimal:    string;
    number:     string;
    // creditCard?

    is:             string;
    isExactly:      string;
    not:            string;
    notExactly:     string;
    contain:        string;
    containExactly: string;
    doesntContain:  string;
    doesntContainExactly: string;
    // match?
    // different?

    minLength:   string;
    length:      string;
    exactLength: string;
    maxLength:   string;
    match:       string;
    different:   string;
    creditCard:  string;
    minCount:    string;
    exactCount:  string;
    maxCount:    string;

    // fomantic-ui 2.9
    size:        string;
    addErrors:   string;

    // // svelte-semantic-ui
    // date:           string;
    // greaterThen:    string;
    // greaterOrEqual: string;
    // lessThen:       string;
    // lessOrEqual:    string;
};

type FormPromptTranslation = {
    // semantic-ui 2.4
    unspecifiedRule: string;
    unspecifiedField: string;
    // fomantic-ui 2.9
    leavingMessage?: string;
};

export type PromptSettings = {
    prompt?: RulePromptTranslation & { [key: string]: string };
    text?: FormPromptTranslation;
};

export const promptDefaults: PromptSettings = {};

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

export type RuleFunc = (value: string, ruleValue: string, form: JQueryApi) => boolean;

export function registerRule(name: string, fn: RuleFunc, defaultPrompt: string): void {
    // eslint-disable-next-line @typescript-eslint/typedef, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
    const jQuery = (window as any).jQuery;
    if (!jQuery) {
        throw new Error("jQuery in not initialized");
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/typedef
    const rules = jQuery.fn.form.settings.rules as { [key: string]: RuleFunc };
    if (!rules) {
        throw new Error("Semantic UI form in not initialized");
    }
    rules[name] = fn;

    if (!promptDefaults.prompt) {
        promptDefaults.prompt = {} as RulePromptTranslation;
    }
    promptDefaults.prompt[name] = defaultPrompt;
}

// Add custom rule
function isoDateFn(value: string): boolean {
    let d: Date | undefined = undefined;
    try {
        d = parse.isoDate(value + " 13:00") as Date;
    } catch (ex) {
        d = undefined;
    }
    return value === fmt.isoDate(d);
}
registerRule("isoDate", isoDateFn, "{name} must follow the 'YYYY-MM-DD' format");

// Add custom rule
function startFn(value: string, ruleValue: string): boolean {
    return value.startsWith(ruleValue);
}
registerRule("start", startFn, "{name} must start with '{ruleValue}'");

// Add custom rule
function startEndFn(value: string, ruleValue: string): boolean {
    console.info("startEnd : " + value + " - " + ruleValue);
    return value.startsWith(ruleValue);
}
registerRule("startEnd", startEndFn, "{name} must start and end with '{ruleValue}'");
