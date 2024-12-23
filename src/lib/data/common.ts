/**
 * Common types, jQuery API, Form and Data controllers, utility functions.
 * @module data/common
 */

//-----------------------------------------------------------------------------

/*
   dP
   88
 d8888P dP    dP 88d888b. .d8888b. .d8888b.
   88   88    88 88'  `88 88ooood8 Y8ooooo.
   88   88.  .88 88.  .88 88.  ...       88
   dP   `8888P88 88Y888P' `88888P' `88888P'
             .88 88
         d8888P  dP
*/

/** Validation rule object: rule string and custom error prompt */
export type RuleObj = {
    type: string;
    prompt?: string;
};

/** Rule definition takes array or single instance of string or RuleObj */
export type RuleDefinition = string | string[] | RuleObj | RuleObj[]; // | BaseSchema;

/** Controls Semantic UI form element and it's data validation. */
export interface FormController {
    addRule: (key: string, rules: RuleDefinition) => void;
    removeRule: (key: string, rules: RuleDefinition) => void;
    doValidateField: (key: string) => void;
    doValidateForm: () => void;
    onFieldChange: (key: string) => void;
}

/** Settings controlling number, money, and list formatting. */
export interface NumberSettings {
    decimalSeparator: string;
    thousandSeparator: string;
    moneyPrefix: string;
    moneySuffix: string;
    moneyPrecision: number;
}

/** Settings used to initialize a number input component. */
export interface NumberInputSettings extends Partial<NumberSettings> {
    type?: "integer" | "decimal" | "money";
    precision?: number;
}

export type TextInputSettings = {
    case?: "upper" | "lower" | "title" | "none";
    charset?: "any" | "euro" | "latin" | "ascii" | "id_alpha" | "id_hex" | "id_num";
    idAllowChars?: Array<"_" | "-" | ".">;
    idBlockChars?: Array<"I" | "O" | "i" | "o" | "l">;
    blockSingleQuotes?: boolean;
    blockDoubleQuotes?: boolean;
    allowHtmlTags?: boolean;
    blockEmoji?: boolean; // works with charset "any"

    /** Maximum value length. Intended for "id_*" charset, in other cases it is often better to use validation */
    maxLen?: number; //

    /** The input returns string[] */
    list?: boolean;

    /** Character user to separate values */
    listSeparator?: string;
};

// /** Semantic UI component behavior API */
// export type SemanticCommand = (
//     command: string,
//     v1?: unknown,
//     v2?: unknown,
//     v3?: unknown
// ) => unknown;

// /** Return type for a simple svelte action; with destroy(), but without update(). */
// export type ActionReturnType = {
//     destroy: () => void;
// } | void;

//-----------------------------------------------------------------------------

/*
            dP   oo dP
            88      88
 dP    dP d8888P dP 88
 88    88   88   88 88
 88.  .88   88   88 88
 `88888P'   dP   dP dP

*/

/** Compare two Date objects */
export function equalDates(a1: Date | undefined, a2: Date | undefined): boolean {
    if (a1 instanceof Date && a2 instanceof Date) {
        return a1.getTime() === a2.getTime();
    }
    return a1 === a2;
}

/** Compare two string arrays or strings */
export function equalStringArrays(
    a1: string[] | string | undefined,
    a2: string[] | string | undefined
): boolean {
    if (Array.isArray(a1) && Array.isArray(a2)) {
        if (a1.length !== a2.length) {
            return false;
        }
        for (let i: number = 0; i < a1.length; i++) {
            if (a1[i] !== a2[i]) {
                return false;
            }
        }
        return true;
    }
    return a1 === a2;
}

/** Compare two number arrays or numbers */
export function equalNumberArrays(
    a1: number[] | number | undefined,
    a2: number[] | number | undefined
): boolean {
    if (Array.isArray(a1) && Array.isArray(a2)) {
        if (a1.length !== a2.length) {
            return false;
        }
        for (let i: number = 0; i < a1.length; i++) {
            if (a1[i] !== a2[i]) {
                return false;
            }
        }
        return true;
    }
    return a1 === a2;
}

/** Format a number, padded with "0" to the minimum length */
export function pad(n: number, size: number): string {
    let str: string = n.toString();
    while (str.length < size) {
        str = `0${str}`;
    }
    return str;
}

/** Format Date using YYYY-MM-DD format */
export function isoDate(d: Date | undefined): string {
    if (!d || !d.getDate) {
        return "";
    }
    const day: string = pad(d.getDate(), 2);
    const month: string = pad(d.getMonth() + 1, 2);
    const year: string = pad(d.getFullYear(), 4);
    return `${year}-${month}-${day}`;
}

/** Format Date as time using HH:mm format (24 hours) */
export function isoTime(d: Date | undefined): string {
    if (!d || !d.getDate) {
        return "";
    }
    const hour: string = pad(d.getHours(), 2);
    const minute: string = pad(d.getMinutes(), 2);
    return `${hour}:${minute}`;
}
