/**
 * Common types, jQuery API, Form and Data controllers, utility functions.
 * @module data/settings
 */

import type {
    CalendarSettings,
    CheckboxSettings,
    DropdownSettings,
    FormSettings,
    ModalSettings,
    NumberSettings,
    PopupSettings,
    SliderSettings,
    StickySettings,
    ToastSettings,
} from "../data/semantic-types";

/*
                     dP     dP   oo
                     88     88
 .d8888b. .d8888b. d8888P d8888P dP 88d888b. .d8888b. .d8888b.
 Y8ooooo. 88ooood8   88     88   88 88'  `88 88'  `88 Y8ooooo.
       88 88.  ...   88     88   88 88    88 88.  .88       88
 `88888P' `88888P'   dP     dP   dP dP    dP `8888P88 `88888P'
                                                  .88
                                              d8888P
*/

export type SettingsObject = {
    [key: string]: unknown;
};

export type AllSettingsJson = {
    [key: string]: SettingsObject;
};

/* prettier-ignore */
type WithJQuery = {
    jQuery?: {
        fn: {
            [key: string]: SettingsObject | undefined;
        };
    };
};

type JQuerySettings = Required<WithJQuery>["jQuery"];

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
                    console.log(`Setting: '${key}' in ${logName} must be an Object.`);
                }
            } else {
                if (so) {
                    // prim|fn|arr <- obj
                    console.log(`Setting: '${key}' in ${logName} can't be an Object.`);
                } else {
                    // prim|fn|arr <- prim|fn|arr
                    target[key] = source[key];
                }
            }
        } else {
            console.log(`Unrecognized setting: '${key}' in ${logName}.`);
        }
    });
}

// /** Utility type to mark all fields and sub-objects Readonly. */
// export type DeepReadonly<T> = T extends unknown
//     ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
//     : T;

function ensureNumberSettings(jQuery: JQuerySettings): void {
    if (!jQuery.fn.number) {
        jQuery.fn.number = {
            settings: {
                decimalSeparator: ".",
                thousandSeparator: " ",
                moneyPrefix: "$",
                moneySuffix: "",
                moneyPrecision: 2,
                listSeparator: ", ",
            },
        };
    }
}

/*
 dP                dP
 88                88
 88d888b. .d8888b. 88 88d888b. .d8888b. 88d888b.
 88'  `88 88ooood8 88 88'  `88 88ooood8 88'  `88
 88    88 88.  ... 88 88.  .88 88.  ... 88
 dP    dP `88888P' dP 88Y888P' `88888P' dP
                      88
                      dP
*/

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

/*
                            dP
                            88
 .d8888b. 88d888b. 88d888b. 88 dP    dP
 88'  `88 88'  `88 88'  `88 88 88    88
 88.  .88 88.  .88 88.  .88 88 88.  .88
 `88888P8 88Y888P' 88Y888P' dP `8888P88
          88       88               .88
          dP       dP           d8888P
*/

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
    // eslint-disable-next-line no-restricted-syntax, guard-for-in
    Object.keys(json).forEach((name: string) => {
        const settings: SettingsObject | undefined = jQuery.fn[name]?.settings as SettingsObject;
        if (!settings) {
            console.log(`Ignoring unrecognized Semantic UI component: ${name}`);
        } else {
            copyFields(settings, json[name], name);
        }
    });
}

/*
 oo          oo   dP   oo          dP oo
                  88               88
 dP 88d888b. dP d8888P dP .d8888b. 88 dP d888888b .d8888b.
 88 88'  `88 88   88   88 88'  `88 88 88    .d8P' 88ooood8
 88 88    88 88   88   88 88.  .88 88 88  .Y8P    88.  ...
 dP dP    dP dP   dP   dP `88888P8 dP dP d888888P `88888P'

*/

export const calendarDefaults: SettingsHelper<CalendarSettings> = new SettingsHelper("calendar");
export const checkboxDefaults: SettingsHelper<CheckboxSettings> = new SettingsHelper("checkbox");
export const dropdownDefaults: SettingsHelper<DropdownSettings> = new SettingsHelper("dropdown");
export const formDefaults: SettingsHelper<FormSettings> = new SettingsHelper("form");
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
    });
}
