/**
 * Form validation rules and types.
 * @module data/rule-book
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

// date: () => "date",
// greaterThan   (type: "N"|"D"|"S", val: number|Date|string)
// greaterOrEqual(type: "N"|"D"|"S", val: number|Date|string)
// lessThan      (type: "N"|"D"|"S", val: number|Date|string)
// lessOrEqual   (type: "N"|"D"|"S", val: number|Date|string)

export type RuleFunc = (val: string, par: string) => boolean;
type WithValidationPrompt = {
    validationPrompts?: Map<string, string>;
};
// type WithFunction = {
//     validationPrompts?: Map<string, RuleFunc>;
// };
export function registerRule(name: string, fn: RuleFunc, prompt: string): void {
    // $.fn.form.settings.rules[name] = fn;
    void fn;

    const win: WithValidationPrompt = window as unknown as WithValidationPrompt;
    if (!win.validationPrompts) {
        win.validationPrompts = new Map();
    }
    win.validationPrompts.set(name, prompt);
}

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
};

type FormPromptTranslation = {
    // semantic-ui 2.4
    unspecifiedRule: string;
    unspecifiedField: string;
    // fomantic-ui 2.9
    leavingMessage?: string;
};

export type PromptSettings = {
    prompt?: RulePromptTranslation;
    text?: FormPromptTranslation;
};

export const promptDefaults: PromptSettings = {};

// type RuleHelper =
//     | ((s: string) => RuleName)
//     | ((n: number) => RuleName)
//     | ((n1: number, n2: number) => RuleName);
// type RuleDict = {
//     [key: string]: RuleHelper;
// };
// type Ustring = Uncapitalize<string>;
