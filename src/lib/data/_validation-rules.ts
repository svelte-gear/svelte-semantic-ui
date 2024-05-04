// _validation-rules.ts
// Form validation rules and types.

/***
 * @module Validation rules.
 */

/** Shortform validation rule */
type RuleName =
    // empty
    | "empty"
    | "checked"
    // content type
    | "email"
    | "url"
    | "integer"
    | "integer[1..10]"
    | "decimal"
    | "number"
    | "regExp[//^[a-z]{2,3}$//]"
    | "creditCard"
    // content
    | "is[foo]"
    | "isExactly[foo]"
    | "not[foo]"
    | "notExactly[foo]"
    | "contain[foo]"
    | "containExactly[foo]"
    | "doesntContain[foo]"
    | "doesntContainExactly[foo]"
    | "match[field]"
    | "different[field]"
    // length
    | "minLength[8]"
    | "exactLength[16]"
    | "maxLength[32]"
    | "minCount[3]"
    | "exactCount[3]"
    | "maxCount[3]"
    // allow any string, force the first character to be lowercase
    // keeps autocomplete working by preventing flattening RuleType to string
    | Uncapitalize<string>;

/** Validation rule object */
type RuleObj = {
    type: RuleName;
    prompt?: string;
};

export type RuleDefinition = RuleName | RuleName[] | RuleObj | RuleObj[]; // | BaseSchema;

export type ValidationPrompt = {
    // semantic-ui 2.4
    empty: string;
    checked: string;
    email: string;
    url: string;
    regExp: string;
    integer: string;
    decimal: string;
    number: string;
    is: string;
    isExactly: string;
    not: string;
    notExactly: string;
    contain: string;
    containExactly: string;
    doesntContain: string;
    doesntContainExactly: string;
    minLength: string;
    length: string;
    exactLength: string;
    maxLength: string;
    match: string;
    different: string;
    creditCard: string;
    minCount: string;
    exactCount: string;
    maxCount: string;
    // fomantic-ui 2.9
    size: string;
    addErrors: string;
};

export type ValidationText = {
    // semantic-ui 2.4
    unspecifiedRule: string;
    unspecifiedField: string;
    // fomantic-ui 2.9
    leavingMessage?: string;
};
