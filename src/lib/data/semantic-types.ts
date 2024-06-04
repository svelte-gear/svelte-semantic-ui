/**
 * Semantic UI types and access to settings.
 *
 * Re-exports SemanitUI types from a module instead of namespace.
 *
 * Fixes type definition inconsistencies.
 * @module data/semantic-ui-types
 */

/// <reference types="jquery" />
/// <reference types="fomantic-ui-css" />

/*
                   dP                         dP
                   88                         88
 .d8888b. .d8888b. 88 .d8888b. 88d888b. .d888b88 .d8888b. 88d888b.
 88'  `"" 88'  `88 88 88ooood8 88'  `88 88'  `88 88'  `88 88'  `88
 88.  ... 88.  .88 88 88.  ... 88    88 88.  .88 88.  .88 88
 `88888P' `88888P8 dP `88888P' dP    dP `88888P8 `88888P8 dP

*/

export type DateFormatFn = (d: Date | undefined, settings?: CalendarSettings) => string;

/**
 * Fomantic UI Calendar settings.
 * Adds 'formatter' documetation and the fix for 'onChange' arguments.
 *
 * @see {@link https://fomantic-ui.com/modules/calendar.html#/settings}
 */
export type CalendarSettings = Omit<Partial<FomanticUI.CalendarSettings>, "onChange"> & {
    /** Is called after a calendar date has changed. */
    onChange?(this: JQuery<HTMLElement>, date: Date, text: string, mode: string): void;

    formatter?: {
        cellTime?: string | DateFormatFn;
        date?: string | DateFormatFn;
        datetime?: string | DateFormatFn;
        time?: string | DateFormatFn;

        month?: string | DateFormatFn;
        year?: string | DateFormatFn;

        dayHeader?: string | DateFormatFn;
        hourHeader?: string | DateFormatFn;
        minuteHeader?: string | DateFormatFn;
        monthHeader?: string | DateFormatFn;
        yearHeader?: (date: Date, settings: CalendarSettings) => string;

        cell?: (
            cell: JQuery,
            date: Date,
            options: {
                mode: string;
                adjacent: boolean;
                disabled: boolean;
                active: boolean;
                today: boolean;
            }
        ) => string;
        dayColumnHeader?: (day: number, settings: CalendarSettings) => string;
        today?: (settings: CalendarSettings) => string;
    };
};

export type CalendarText = Required<FomanticUI.CalendarSettings["text"]>;

/*
 .8888b
 88   "
 88aaa  .d8888b. 88d888b. 88d8b.d8b.
 88     88'  `88 88'  `88 88'`88'`88
 88     88.  .88 88       88  88  88
 dP     `88888P' dP       dP  dP  dP

*/

export type RuleFunc = (value: string, ruleValue: string, form: JQuery) => boolean;

export type FormRules = {
    [key: string]: RuleFunc;
};

/**
 * Fomantic UI form validation behavior.
 *
 * @see {@link https://fomantic-ui.com/behaviors/form.html#/settings}
 */
export type FormSettings = Partial<FomanticUI.FormSettings> & {
    rules?: FormRules;
};

export type FormPropmt = Omit<FomanticUI.Form.Settings.Prompts, "contain" | "containExactly"> & {
    // fixes
    contains: string;
    containsExactly: string;

    // custom rules
    start: string;
    isoDate: string;
    startEnd: string;
};

export type FormText = FomanticUI.Form.Settings.Texts;

/*
                              dP
                              88
 88d888b. dP    dP 88d8b.d8b. 88d888b. .d8888b. 88d888b.
 88'  `88 88    88 88'`88'`88 88'  `88 88ooood8 88'  `88
 88    88 88.  .88 88  88  88 88.  .88 88.  ... 88
 dP    dP `88888P' dP  dP  dP 88Y8888' `88888P' dP

*/

export interface NumberSettings {
    decimal: string;
    thousandSeparator: string;
    listSeparator: string;
    moneyPrefix: string;
    moneySuffix: string;
    moneyPrecision: number;
} // TODO: Partial<> ?
