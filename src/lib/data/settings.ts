/**
 * Settings helper and global defaults.
 * @module data/settings
 */

import type { NumberSettings } from "../data/common";
import type {
    CalendarSettings,
    CheckboxSettings,
    DropdownSettings,
    FormSettings,
    ModalSettings,
    PopupSettings,
    SliderSettings,
    StickySettings,
    ToastSettings,
} from "../data/semantic-types";
import { initLog } from "../data/common";

//-------------------------------------------------------------------------------------------------
// region types

export type SettingsObject = Record<string, unknown>;

export type AllSettingsJson = Record<string, SettingsObject>;

/* prettier-ignore */
type WithJQuery = {
    jQuery?: {
        fn: Record<string, SettingsObject | undefined>;
    };
};

type JQuerySettings = Required<WithJQuery>["jQuery"];

//-------------------------------------------------------------------------------------------------
// region functions

/** Determine if the argument is object; not primitive, Array, of function */
function isObject(value: unknown): boolean {
    return value !== null && typeof value === "object" && !Array.isArray(value);
}

/** Recursive function to copy only matching fields. */
function copyFields(target: SettingsObject, source: SettingsObject, logName: string): void {
    const sourceKeys: string[] = Object.keys(source);
    const targetKeys: string[] = Object.keys(target);
    if (sourceKeys.length === 0 || targetKeys.length === 0) {
        return;
    }
    sourceKeys.forEach((key: string) => {
        if (targetKeys.includes(key)) {
            const to: boolean = isObject(target[key]);
            const so: boolean = isObject(source[key]);
            if (to) {
                if (so) {
                    // obj <- obj
                    copyFields(
                        target[key] as SettingsObject,
                        source[key] as SettingsObject,
                        `${logName}.${key}`
                    );
                } else {
                    // obj <- prim|fn|arr
                    initLog.warn(`Setting: '${key}' in ${logName} must be an Object.`);
                }
            } else {
                if (so) {
                    // prim|fn|arr <- obj
                    initLog.warn(`Setting: '${key}' in ${logName} can't be an Object.`);
                } else {
                    // prim|fn|arr <- prim|fn|arr
                    target[key] = source[key];
                }
            }
        } else {
            initLog.warn(`Unrecognized setting: '${key}' in ${logName}.`);
        }
    });
}

/** Initialize number settings if they don't yet exist */
function ensureNumberSettings(jQuery: JQuerySettings): void {
    if (!jQuery.fn.number) {
        jQuery.fn.number = {
            settings: {
                decimalSeparator: ".",
                thousandSeparator: " ",
                moneyPrefix: "$",
                moneySuffix: "",
                moneyPrecision: 2,
            },
        };
    }
}

//-------------------------------------------------------------------------------------------------
// region SettingsHelper

/** Provides access to Sematic UI settings for different components. */
export class SettingsHelper<T> {
    compName: string;

    constructor(compName: string) {
        this.compName = compName;
    }

    /** Returns settings object. */
    read(): Required<T> {
        const jQuery: JQuerySettings | undefined = (window as unknown as WithJQuery).jQuery;
        if (!jQuery) {
            throw new Error("jQuery is not initialized.");
        }
        ensureNumberSettings(jQuery);
        const settings: T | undefined = jQuery.fn[this.compName]?.settings as T | undefined;
        if (!settings) {
            throw new Error(`Semantic UI ${this.compName} is not initialized.`);
        }
        return settings as Required<T>;
    }

    /** Copy settings into the global SUI components in jQuery. */
    apply(val: T): void {
        const jQuery: JQuerySettings | undefined = (window as unknown as WithJQuery).jQuery;
        if (!jQuery) {
            throw new Error("jQuery is not initialized.");
        }
        ensureNumberSettings(jQuery);
        const settings: T | undefined = jQuery.fn[this.compName]?.settings as T | undefined;
        if (!settings) {
            throw new Error(`Semantic UI ${this.compName} is not initialized.`);
        }
        copyFields(settings, val as SettingsObject, this.compName);
    }
}

/** Copy settings into the global SUI components and number object in jQuery. */
export function applyAllSettings(json: AllSettingsJson): void {
    const jQuery: JQuerySettings | undefined = (window as unknown as WithJQuery).jQuery;
    if (!jQuery) {
        throw new Error("jQuery is not initialized.");
    }
    ensureNumberSettings(jQuery);
    if (!json) {
        return;
    }
    Object.keys(json).forEach((name: string) => {
        const settings: SettingsObject | undefined = jQuery.fn[name]?.settings as SettingsObject;
        if (!settings) {
            initLog.warn(`Ignoring unrecognized Semantic UI component: ${name}`);
        } else {
            copyFields(settings, json[name], name);
        }
    });
}

//-------------------------------------------------------------------------------------------------
// region initialize

export const formDefaults: SettingsHelper<FormSettings> = new SettingsHelper("form");

export const calendarDefaults: SettingsHelper<CalendarSettings> = new SettingsHelper("calendar");
export const checkboxDefaults: SettingsHelper<CheckboxSettings> = new SettingsHelper("checkbox");
export const dropdownDefaults: SettingsHelper<DropdownSettings> = new SettingsHelper("dropdown");
export const modalDefaults: SettingsHelper<ModalSettings> = new SettingsHelper("modal");
export const numberDefaults: SettingsHelper<NumberSettings> = new SettingsHelper("number");
export const popupDefaults: SettingsHelper<PopupSettings> = new SettingsHelper("popup");
export const sliderDefaults: SettingsHelper<SliderSettings> = new SettingsHelper("slider");
export const stickyDefaults: SettingsHelper<StickySettings> = new SettingsHelper("sticky");
export const toastDefaults: SettingsHelper<ToastSettings> = new SettingsHelper("toast");

/** Must be called after DOM is initialized. Like in sveltekit rotes/layout.ts load(). */
export function applyDefaultSettings(locale?: string): void {
    void locale;
    calendarDefaults.apply({
        type: "date",
        touchReadonly: false,
        minTimeGap: 5,
    });
    formDefaults.apply({
        keyboardShortcuts: false,
        revalidate: false, // helps to avoid second re-validation on text area
    });
}
