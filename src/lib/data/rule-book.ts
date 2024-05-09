// rule-book.ts

/**
 * Form validation rules and types.
 * @module data/rule-book
 */

/* prettier-ignore */
export const rule = {
    empty:      () => "empty",
    checked:    () => "checked",

    email:      () => "email",
    url:        () => "url",
    integer:    () => "integer",
    decimal:    () => "decimal",
    number:     () => "number",
    creditCard: () => "creditCard",
    regex:      (reg: string) => `regExp[//${reg}//]`,

    // integer:    (min?: number, max?: number) =>
    //     min == undefined && max == undefined ? "integer" : `integer[${min}..${max}]`,

    is:             (val: string) => `is[${val}]`,
    isExactly:      (val: string) => `isExactly[${val}]`,
    not:            (val: string) => `not[${val}]`,
    notExactly:     (val: string) => `notExactly[${val}]`,
    contain:        (val: string) => `contain[${val}]`,
    containExactly: (val: string) => `containExactly[${val}]`,
    doesntContain:  (val: string) => `doesntContain[${val}]`,
    doesntContainExactly: (val: string) => `doesntContainExactly[${val}]`,

    match:          (fld: string) => `match[${fld}]`,
    different:      (fld: string) => `different[${fld}]`,

    minLength:   (n: number) => `minLength[${n}]`,
    exactLength: (n: number) => `exactLength[${n}]`,
    maxLength:   (n: number) => `maxLength[${n}]`,
    minCount:    (n: number) => `minCount[${n}]`,
    exactCount:  (n: number) => `exactCount[${n}]`,
    maxCount:    (n: number) => `maxCount[${n}]`,
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

    const win = window as unknown as WithValidationPrompt;
    if (!win.validationPrompts) {
        win.validationPrompts = new Map();
    }
    win.validationPrompts.set(name, prompt);
}

/* prettier-ignore */
export type ValidationPrompt = {
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

export type ValidationText = {
    // semantic-ui 2.4
    unspecifiedRule: string;
    unspecifiedField: string;
    // fomantic-ui 2.9
    leavingMessage?: string;
};

// /** Shortform validation rule */
// type RuleName =
//     // empty
//     | "empty"
//     | "checked"
//     // content type
//     | "email"
//     | "url"
//     | "integer"
//     | "integer[1..10]"
//     | "decimal"
//     | "number"
//     | "regExp[//^[a-z]{2,3}$//]"
//     | "creditCard"
//     // content
//     | "is[foo]"
//     | "isExactly[foo]"
//     | "not[foo]"
//     | "notExactly[foo]"
//     | "contain[foo]"
//     | "containExactly[foo]"
//     | "doesntContain[foo]"
//     | "doesntContainExactly[foo]"
//     | "match[field]"
//     | "different[field]"
//     // length
//     | "minLength[8]"
//     | "exactLength[16]"
//     | "maxLength[32]"
//     | "minCount[3]"
//     | "exactCount[3]"
//     | "maxCount[3]"
//     // allow any string, force the first character to be lowercase
//     // keeps autocomplete working by preventing flattening RuleType to string
//     | Uncapitalize<string>;
//
// type RuleHelper =
//     | ((s: string) => RuleName)
//     | ((n: number) => RuleName)
//     | ((n1: number, n2: number) => RuleName);
// type RuleDict = {
//     [key: string]: RuleHelper;
// };
// type Ustring = Uncapitalize<string>;
