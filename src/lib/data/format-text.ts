/**
 * Text formatter object, is initialized using TextInputSettings,
 * which includes Number Settings , type, and precision.
 * @module data/input-formatter
 * @module data/input-formatter
 */

import { compLog, type TextInputSettings } from "../data/common";

/** Text format function, may be used to change case or limit charset. */
export interface TextFormatter {
    format: (val: string | string[]) => string;
    parse: (val: string) => string[] | string;
}

function escapeRegex(input: string): string {
    return input.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Text formatter implementation; supports case, charset, maxLen and list options */
export class TextFmt implements TextFormatter {
    settings: TextInputSettings;

    constructor(settings?: TextInputSettings) {
        this.settings = settings ?? {};
        if (!this.settings.case) {
            this.settings.case = "none";
        }
        if (!this.settings.charset) {
            this.settings.charset = "any";
        }
        if (this.settings.blockEmoji && this.settings.charset !== "any") {
            compLog.warn(
                `TextFmt: invalid settings - blockEmoji doesn't effect charset: "${this.settings.charset}"`
            );
        }
        if (this.settings.idAllowChars && !this.settings.charset.startsWith("id_")) {
            compLog.warn(
                `TextFmt: invalid settings - idAllowChars doesn't effect charset: "${this.settings.charset}"`
            );
        }
        if (this.settings.idBlockChars && !this.settings.charset.startsWith("id_")) {
            compLog.warn(
                `TextFmt: invalid settings - idBlockChars doesn't effect charset: "${this.settings.charset}"`
            );
        }
        if (this.settings.list && !this.settings.listSeparator) {
            compLog.warn("TextFmt: invalid settings - listSeparator is required if 'list:true'");
        }
        if (!this.settings.list && this.settings.listSeparator) {
            compLog.warn("TextFmt: invalid settings - listSeparator is ignored if 'list:false'");
        }
    }

    private fixCase(val: string): string {
        switch (this.settings.case) {
            case "none":
                return val;
            case "upper":
                return val.trim().toUpperCase();
            case "lower":
                return val.trim().toLowerCase();
            case "title":
                return val
                    .trim()
                    .split(" ")
                    .map((s: string) => s.charAt(0).toUpperCase() + s.substring(1).toLowerCase())
                    .join(" ");
            default:
                throw new Error(`Unrecognized case directive ${this.settings.case}`);
        }
    }

    /** Remove characters outside the specified charset (ascii, latin, euro, any */
    private filterCharset(val: string): string {
        switch (this.settings.charset) {
            case "any":
                return val;
            case "ascii":
                return val.replace(/[^\x20-\x7F]/g, "_");
            case "latin":
                //                     ascii    latin-1      latin ext    symbols
                return val.replace(/[^\x20-\x7F\u00C0-\u024F\u1E00-\u1EFF\u2000-\u22FF]/g, "_");
            case "euro":
                return val.replace(
                    //  ascii    latin-1      latin ext    greek        cyrillic     symbols
                    /[^\x20-\x7F\u00C0-\u024F\u1E00-\u1EFF\u0370-\u03FF\u0400-\u04FF\u2000-\u22FF]/g,
                    "_"
                );
            default:
                throw new Error(`Unrecognized charset directive ${this.settings.charset}`);
        }
    }

    formatStr(val: string): string {
        if (typeof val !== "string") {
            throw new Error("textFormatter expects string as data type");
        }
        let res: string = this.fixCase(val);
        if (this.settings.charset?.startsWith("id")) {
            let regexStr: string = "";
            if (this.settings.charset === "id_num") {
                regexStr = "0-9";
            } else if (this.settings.charset === "id_hex") {
                regexStr = "0-9a-fA-F";
            } else if (this.settings.charset === "id_alpha") {
                regexStr = "0-9a-zA-Z";
            } else {
                throw new Error(`Unrecognized charset directive ${this.settings.charset}`);
            }
            this.settings.idAllowChars?.forEach((char: string) => {
                regexStr = regexStr + escapeRegex(char);
            });
            // remove unwanted characters
            res = res.replace(new RegExp(`[^${regexStr}]`, "g"), "");
            this.settings.idBlockChars?.forEach((char: string) => {
                res = res.replace(char, "");
            });
        } else {
            if (this.settings.charset === "ascii") {
                if (this.settings.blockDoubleQuotes) {
                    res = res.replace('"', "`");
                }
                if (this.settings.blockSingleQuotes) {
                    res = res.replace("'", "`");
                }
                if (!this.settings.allowHtmlTags) {
                    res = res.replace("<", "_").replace(">", "_");
                }
            } else {
                if (this.settings.blockDoubleQuotes) {
                    res = res.replace('"', "\u201D"); // right double quote
                }
                if (this.settings.blockSingleQuotes) {
                    res = res.replace("'", "\u2019"); // right single quote
                }
                if (!this.settings.allowHtmlTags) {
                    res = res.replace("<", "\u2039").replace(">", "\u203A"); // angle quotation
                }
            }
            // replace unwanted characters with "_"
            res = this.filterCharset(res);
            if (this.settings.blockEmoji) {
                // res = res.replace(/[\u1F000-\u1FFFF]/g, "");
                res = res.replace(/[\p{Extended_Pictographic}]/gu, "_");
            }
        }
        res = res.trim();
        if (this.settings.maxLen && res.length > this.settings.maxLen) {
            res = res.slice(0, this.settings.maxLen);
        }
        return res;
    }

    format(val: string[] | string): string {
        if (this.settings.list) {
            if (!val) {
                return "";
            }
            if (!Array.isArray(val)) {
                throw new Error(
                    `TextFormatter in list mode expects data of type string[], got ${typeof val} ${val}`
                );
            }
            let formatSeparator: string = this.settings.listSeparator!;
            if (!formatSeparator.includes("\n")) {
                formatSeparator = `${this.settings.listSeparator} `;
            }
            const res: string = val
                .map((s: string) => this.formatStr(s))
                .filter((s: string) => !!s)
                .join(formatSeparator);
            return res;
        } else {
            if (!val) {
                return "";
            }
            if (Array.isArray(val)) {
                throw new Error(
                    `TextFormatter expects data of type string, got ${typeof val} ${val}`
                );
            }
            return this.formatStr(val);
        }
    }

    parse(val: string): string[] | string {
        if (this.settings.list) {
            if (!val) {
                return [];
            }
            return val.split(this.settings.listSeparator!).map((r: string) => this.formatStr(r));
        } else {
            if (!val) {
                return "";
            }
            return this.formatStr(val);
        }
    }
}
