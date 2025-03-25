/**
 * Form validation rules and types.
 * @module data/validation-rules
 */

import type { FormPrompt, FormSettings, RuleFunc } from "../data/semantic-types";
import type { SettingsObject } from "../data/settings";
import { formDefaults } from "../data/settings";
import { isoDate } from "../data/common";
import { parse } from "../data/helpers";

//-------------------------------------------------------------------------------------------------
// region custom rules

/** Try to parse date as locale date or as any date */
function tryToParseDate(value: string): Date | null {
    // first try to parse as locale-specific date
    let d: Date | null = parse.date(value);

    if (!d) {
        // then try JS Date
        try {
            d = new Date(`${value} 13:00`);
        } catch (ex) {
            // ignore
        }
    }
    return d;
}

/** Try to parse date as locale date or as any date */
function tryToParseNumber(value: string): number | null {
    let n: number | null = null;

    // first try to parse as locale-specific date
    n = parse.num6(value);
    if (n) return n;

    n = parse.money(value);
    if (n) return n;

    // then try JS number
    n = parseFloat(value);
    if (Number.isNaN(n)) {
        n = null;
    }
    return n;
}

/** Returns true if value string represents a date in ISO format */
function isoDateFn(value: string): boolean {
    let d: Date | null = null;
    try {
        d = new Date(`${value} 13:00`);
    } catch (ex) {
        d = null;
    }
    return value === isoDate(d);
}

/** Returns true if the string starts with the given value */
function startFn(value: string, ruleValue: string): boolean {
    return value.startsWith(ruleValue);
}

/** Returns true if the string starts and ends with the given character */
function wrappedInFn(value: string, ruleValue: string): boolean {
    return value.startsWith(ruleValue) && value.endsWith(ruleValue);
}

//-------------------------------------------------------------------------------------------------
// region overrides

type CompareFn = (v1: string | number, v2: string | number) => boolean;

function greaterOrEqual(v1: string | number, v2: string | number): boolean {
    return v1 >= v2;
}

function lessOrEqual(v1: string | number, v2: string | number): boolean {
    return v1 <= v2;
}

/** Return true is value id equal or greater that rule parameter.
    Rule parameter should have type designation like `minValue[D|2015-01-19]` */
function compareTyped(value: string, ruleValue: string, compare: CompareFn): boolean {
    if (!value || !ruleValue) {
        return true;
    }
    let ruleVal: string = ruleValue.trim();

    // compare as string if rule value is wrapped in single quotes
    if (ruleVal.startsWith("'") && ruleVal.endsWith("'")) {
        ruleVal = ruleVal.slice(1, -1);
        return compare(value, ruleVal);
    }

    // compare as date if rule value looks like ISO date
    const isoDateRx: RegExp = /^\d{4}[-/.]\d{2}[-/.]\d{2}$/;
    const isoDateRule: boolean = isoDateRx.test(ruleVal);
    const ruleDate: Date | null = tryToParseDate(ruleVal);
    if (isoDateRule && ruleDate) {
        const d: Date | null = tryToParseDate(value);
        return d !== null ? compare(d.getTime(), ruleDate.getTime()) : true;
    }

    // compare as number if rule value looks like decimal number
    const numberRx: RegExp = /^\d*\.?\d*$/;
    const numberRule: boolean = numberRx.test(ruleVal);
    const ruleNumber: number | null = tryToParseNumber(ruleVal);
    if (numberRule && ruleNumber) {
        const n: number | null = tryToParseNumber(value);
        return n !== null ? compare(n, ruleNumber) : true;
    }

    // compare as string
    return compare(value, ruleVal);
}

function minValueFn(value: string, ruleValue: string): boolean {
    const res: boolean = compareTyped(value, ruleValue, greaterOrEqual);
    // formLog.debug("COMPARE :", value, ">=", ruleValue, "=", res);
    return res;
}
function maxValueFn(value: string, ruleValue: string): boolean {
    const res: boolean = compareTyped(value, ruleValue, lessOrEqual);
    // formLog.debug("COMPARE :", value, "<=", ruleValue, "=", res);
    return res;
}

//-------------------------------------------------------------------------------------------------
// region initialize

export function registerRule(name: string, fn: RuleFunc, defaultPrompt: string): void {
    const def: FormSettings = formDefaults.read();
    def.rules![name] = fn;
    (def.prompt as FormPrompt & SettingsObject)[name] = defaultPrompt;
}

/** Must be called after DOM is initialized. Like in sveltekit rotes/layout.ts load(). */
export function extendValidationRules(): void {
    registerRule("start", startFn, "{name} must start with '{ruleValue}'");
    registerRule("isoDate", isoDateFn, "{name} must follow the 'YYYY-MM-DD' format");
    registerRule("wrappedIn", wrappedInFn, "{name} must start and end with '{ruleValue}'");

    registerRule("minValue", minValueFn, "{name} must be greater or equal {ruleValue}");
    registerRule("maxValue", maxValueFn, "{name} must be less or equal {ruleValue}");
}
