/**
 * Form validation rules and types.
 * @module data/validation-rules
 */

import type { FormPrompt, FormSettings, RuleFunc } from "../data/semantic-types";
import type { SettingsObject } from "../data/settings";
import { formDefaults } from "../data/settings";
import { isoDate } from "../data/common";

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
// greaterOrEqual(type: "N"|"D"|"S", val: number|Date|string) -> greaterOrEqual[N|0]
// lessThan      (type: "N"|"D"|"S", val: number|Date|string) -> lessThan[S|Abc]
// lessOrEqual   (type: "N"|"D"|"S", val: number|Date|string) -> lessOrEqual[Abc]

// Add custom rule
function isoDateFn(value: string): boolean {
    let d: Date | undefined = undefined;
    try {
        d = new Date(`${value} 13:00`); // TODO: find better hack
    } catch (ex) {
        d = undefined;
    }
    return value === isoDate(d);
}

// Add custom rule
function startFn(value: string, ruleValue: string): boolean {
    console.log("---", value);
    return value.startsWith(ruleValue);
}

// Add custom rule
function startEndFn(value: string, ruleValue: string): boolean {
    console.info(`startEnd : ${value} - ${ruleValue}`);
    return value.startsWith(ruleValue);
}

/*
 oo          oo   dP   oo          dP oo
                  88               88
 dP 88d888b. dP d8888P dP .d8888b. 88 dP d888888b .d8888b.
 88 88'  `88 88   88   88 88'  `88 88 88    .d8P' 88ooood8
 88 88    88 88   88   88 88.  .88 88 88  .Y8P    88.  ...
 dP dP    dP dP   dP   dP `88888P8 dP dP d888888P `88888P'

*/

export function registerRule(name: string, fn: RuleFunc, defaultPrompt: string): void {
    const def: FormSettings = formDefaults.read();
    def.rules![name] = fn;
    (def.prompt as FormPrompt & SettingsObject)[name] = defaultPrompt;
}

/** Must be called after DOM is initialized. Like in sveltekit rotes/layout.ts load(). */
export function extendValidationRules(): void {
    registerRule("start", startFn, "{name} must start with '{ruleValue}'");
    registerRule("isoDate", isoDateFn, "{name} must follow the 'YYYY-MM-DD' format");
    registerRule("startEnd", startEndFn, "{name} must start and end with '{ruleValue}'");
}
