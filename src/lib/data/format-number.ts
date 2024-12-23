/**
 * 'fmt' and 'parse' utility object, input formatter classes.
 * @module data/input-formatter
 */

import type { NumberSettings, NumberInputSettings } from "../data/common";
import { numberDefaults } from "../data/settings";

/** Number format function, must return null if it can't parse value and doesn't want to override it. */
export interface NumberFormatter {
    format: (val: number | undefined) => string;
    parse: (val: string) => number | undefined;
}

/** Encode . * + ? ^ $ { } ( ) | [ ] \ to do literal match in regex */
function escapeRegExp(val: string): string {
    return val.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").trim();
}

export class NumberFmt implements NumberFormatter {
    type: "integer" | "decimal" | "money";

    precision: number;

    settings: NumberSettings;

    prefixRegex: RegExp | undefined;

    suffixRegex: RegExp | undefined;

    constructor(inputSettings: NumberInputSettings) {
        if (inputSettings.type && !["integer", "decimal", "money"].includes(inputSettings.type)) {
            throw new Error(`Unsupported number type: ${inputSettings.type}`);
        }
        if (inputSettings.precision && Math.abs(inputSettings.precision) > 6) {
            throw new Error(`Unsupported precision number ${inputSettings.precision}`);
        }

        // this settings are flat, shallow copy works well
        this.settings = {
            ...numberDefaults.read(),
            ...inputSettings,
        };

        this.type = inputSettings.type ?? "integer";

        this.precision =
            inputSettings.precision ?? (this.type === "money" ? this.settings.moneyPrecision : 0);

        if (this.type === "money") {
            this.prefixRegex = new RegExp(`^\\s*${escapeRegExp(this.settings.moneyPrefix)}\\s*`);
            this.suffixRegex = new RegExp(`\\s*${escapeRegExp(this.settings.moneySuffix)}\\s*$`);
        }
    }

    parse(value: string): number | undefined {
        let val: string = value;
        if (this.type === "money") {
            val = val.replace(this.prefixRegex!, "").replace(this.suffixRegex!, "");
        }
        val = val.replace(/\s/g, ""); // remove whitespace
        val = val.split(this.settings.thousandSeparator).join(""); // replace all
        val = val.replace(this.settings.decimalSeparator, ".");
        const num: number = parseFloat(val);
        if (Number.isNaN(num)) {
            return undefined;
        }
        const pwr: number = 10.0 ** -this.precision;
        // console.log("PWR", pwr, val, num, Math.round(num / pwr) * pwr);
        const res: number = Math.round(num / pwr) * pwr;
        return Number(res.toFixed(6));
    }

    format(val: number | undefined): string {
        if (val === undefined) {
            return "";
        }
        if (typeof val !== "number") {
            throw new Error(`numberFormatter expects number as data type, got ${typeof val}`);
        }
        let str: string = val.toFixed(Math.max(this.precision, 0));
        str = str.replace(".", this.settings.decimalSeparator);
        if (this.type !== "integer") {
            // thousand separator is not applicable to integer, use decimal with precision 0 to enable it
            const len: number = str.length;
            const firstPos: number = this.precision > 0 ? this.precision + 1 : 0;
            for (let n: number = 3 + firstPos; n < len; n += 3) {
                str =
                    str.substring(0, len - n) +
                    this.settings.thousandSeparator +
                    str.substring(len - n);
            }
        }
        if (this.type === "money") {
            str = this.settings.moneyPrefix + str + this.settings.moneySuffix;
        }
        return str;
    }
}
