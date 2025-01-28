/**
 * Common types, utility functions.
 * @module data/common
 */

import type { JQueryApi } from "./semantic-types";

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

/** Settings controlling number and money formatting. */
export interface NumberSettings {
    decimalSeparator: string;
    thousandSeparator: string;
    moneyPrefix: string;
    moneySuffix: string;
    moneyPrecision: number;
}

/** Settings used to initialize a number input component: number settings, type, and precision */
export interface NumberInputSettings extends Partial<NumberSettings> {
    type?: "integer" | "decimal" | "money";
    precision?: number;
}

/** Settings used to initialize a text input component */
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
    } else {
        return a1 === a2;
    }
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
    } else {
        return a1 === a2;
    }
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

/** Convert objects to JSON string, for jQuery and DOM elements - get the HTML */
export function stringify(obj: unknown): string {
    if (!obj || typeof obj !== "object") {
        return `${obj}`;
    }
    const jqueryObj: JQueryApi = obj as JQueryApi;
    if (jqueryObj.prop && typeof jqueryObj.prop === "function") {
        const html: string = jqueryObj.prop("outerHTML") as string;
        if (html) {
            return `jQuery: ${html.slice(0, html.indexOf(">") + 1)}`;
        }
    }
    const domObj: Element = obj as Element;
    if (domObj.outerHTML) {
        const html: string = domObj.outerHTML;
        if (html) {
            return `DOM: ${html.slice(0, html.indexOf(">") + 1)}`;
        }
    }
    // Exclude circular references and '__' props
    const seen: WeakSet<object> = new WeakSet();
    return JSON.stringify(obj, (key: string, value: unknown) => {
        if (typeof value === "object" && value !== null) {
            if (seen.has(value)) {
                return undefined;
            }
            seen.add(value);
        }
        if (key.startsWith("__")) {
            return undefined;
        }
        return value;
    });
}

/*
 dP
 88
 88 .d8888b. .d8888b.
 88 88'  `88 88'  `88
 88 88.  .88 88.  .88
 dP `88888P' `8888P88
                  .88
              d8888P
*/

export type LogLevel = "error" | "warn" | "log" | "info" | "debug";

type LogFunction = (...args: unknown[]) => void;

function noop(..._args: unknown[]): void {
    void _args;
}

type LogImplFunction = (level: LogLevel, ...args: unknown[]) => void;

export class Logger {
    prefix: string = "";

    error: LogFunction = noop;
    warn: LogFunction = noop;
    log: LogFunction = noop;
    info: LogFunction = noop;
    debug: LogFunction = noop;

    private LOG_LEVELS: Array<LogLevel | "off"> = ["off", "error", "warn", "log", "info", "debug"];

    private loglevelToNumber(lev: LogLevel | "off"): number {
        for (let i: number = 0; i < this.LOG_LEVELS.length; i++) {
            if (this.LOG_LEVELS[i] === lev) {
                return i;
            }
        }
        throw new Error(`Unrecognized log level: ${lev}`);
    }

    constructor(prefix: string) {
        this.prefix = prefix;
    }

    build(level: LogLevel | "off", fn?: LogImplFunction): void {
        const numLevel: number = this.loglevelToNumber(level);
        for (let i: number = 1; i < this.LOG_LEVELS.length; i++) {
            const iLevel: LogLevel = this.LOG_LEVELS[i] as LogLevel;
            if (numLevel >= i) {
                if (fn) {
                    this[iLevel] = (...args: unknown[]) => {
                        fn(iLevel, this.prefix, ...args);
                    };
                } else {
                    this[iLevel] = (...args: unknown[]) => {
                        console[iLevel](this.prefix, ...args);
                    };
                }
            } else {
                this[iLevel] = noop;
            }
        }
    }
}

function localTime(): string {
    const currentDate: Date = new Date();
    const localDate: Date = new Date(
        currentDate.getTime() - currentDate.getTimezoneOffset() * 60000
    );
    return localDate.toISOString().slice(0, -1).replace("T", " ");
}

export function buildHttpLogger(logger: Logger, level: LogLevel | "off", url: string): void {
    function httpLogImpl(lev: LogLevel, ...args: unknown[]): void {
        async function sendHttpLog(): Promise<void> {
            const params: Record<string, string> = {};
            params.time = localTime();
            params.level = lev;
            args.forEach((arg: unknown, ind: number) => {
                params[`msg_${ind}`] = stringify(arg);
            });
            const urlWithParams: string = `${url}?${new URLSearchParams(params).toString()}`;
            try {
                const response: Response = await fetch(urlWithParams);
                await response.text();
            } catch (error) {
                // ignore errors
            }
        }
        // don't wait for promise completion
        void sendHttpLog();
    }
    logger.build(level, httpLogImpl);
}

export const formLog: Logger = new Logger("FORM");
export const compLog: Logger = new Logger("--");
export const initLog: Logger = new Logger(">>>");
