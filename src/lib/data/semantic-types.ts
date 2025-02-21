/**
 * Semantic UI types.
 *
 * Re-exports Semantic UI types from the module instead of namespaces.
 *
 * Fixes type definition inconsistencies.
 * @module data/semantic-types
 */

/// <reference types="jquery" />
/// <reference types="fomantic-ui-css" />

export type JQueryApi = JQuery<HTMLElement>;

/*
                   dP                         dP
                   88                         88
 .d8888b. .d8888b. 88 .d8888b. 88d888b. .d888b88 .d8888b. 88d888b.
 88'  `"" 88'  `88 88 88ooood8 88'  `88 88'  `88 88'  `88 88'  `88
 88.  ... 88.  .88 88 88.  ... 88    88 88.  .88 88.  .88 88
 `88888P' `88888P8 dP `88888P' dP    dP `88888P8 `88888P8 dP

*/

export type DateFormatFn = (d: Date | undefined, settings?: CalendarSettings) => string;
export type DateParseFn = (
    date: string | undefined,
    settings?: CalendarSettings
) => Date | undefined;

/**
 * Fomantic UI Calendar settings.
 * Adds 'formatter' and 'parser' documentation and fixes 'onChange' arguments.
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

    parser?: {
        date?: DateParseFn;
    };
};

export type CalendarText = FomanticUI.Calendar.Settings.Texts;

/*
 .8888b
 88   "
 88aaa  .d8888b. 88d888b. 88d8b.d8b.
 88     88'  `88 88'  `88 88'`88'`88
 88     88.  .88 88       88  88  88
 dP     `88888P' dP       dP  dP  dP

*/

/** Validation rule object: rule string and custom error prompt */
export type RuleObj = {
    type: string;
    prompt?: string;
};

/** Rule definition takes array or single instance of string or RuleObj */
export type RuleDefinition = string | string[] | RuleObj | RuleObj[]; // | BaseSchema;

/** Semantic UI value types */
export type SuiValue = string | boolean | number | Date;

/** Third argument of the rule validation function
 *  @see {@link https://fomantic-ui.com/behaviors/form.html#behaviors} */
export type SuiModule = {
    clear: () => void;
    determine: {
        isValid: () => boolean;
        isDirty: () => boolean;
    };
    get: {
        field: (identifier: string, strict: boolean) => JQueryApi;
        fields: (identifiers: string[], strict: boolean) => JQueryApi;
        fieldLabel: (identifier: string, useIdAsFallback: boolean) => string;
        value: (identifiers: string, strict: boolean) => SuiValue | SuiValue[] | undefined;
        values: (identifiers: string[], strict: boolean) => Record<string, SuiValue | SuiValue[]>;
        dirtyFields: () => JQueryApi;
    };
    has: {
        field: (identifier: string) => boolean;
    };
    is: {
        blank: (field: JQueryApi) => boolean;
        empty: (field: JQueryApi) => boolean;
        valid: (() => boolean) | ((fieldName: string, showErrors?: boolean) => boolean);
        clean: () => boolean;
        dirty: () => boolean;
        fieldDirty: (field: JQueryApi) => boolean;
        checkboxDirty: (field: JQueryApi) => boolean;
        justDirty: () => boolean;
        justClean: () => boolean;
    };
    reset: () => void;
};

/** Custom validation function */
export type RuleFunc = (value: string, ruleValue: string, module: SuiModule) => boolean;

/**
 * Fomantic UI form validation behavior.
 * Adds 'fields' and 'rules'
 *
 * @see {@link https://fomantic-ui.com/behaviors/form.html#/settings}
 */
export type FormSettings = Partial<Omit<FomanticUI.FormSettings, "prompt">> & {
    fields?: Record<string, RuleDefinition>;
    rules?: Record<string, RuleFunc>;
    prompt?: FomanticUI.FormSettings["prompt"] & Record<string, string>;
};

// formatter:
// Settings to modify default returned values.
// Actually exclusively used with calendar fields(through the dateHandling: 'formatter' setting).

export type FormPrompt = Omit<FomanticUI.Form.Settings.Prompts, "contain" | "containExactly"> & {
    // fix contain[s] spelling
    contains: string;
    containsExactly: string;

    // add custom rules
    start: string;
    isoDate: string;
    wrappedIn: string;

    // define newer rules
    maxValue?: string;
    minValue?: string;
    range?: string;
    size?: string;
    // [x]: translate range and size, make the field required in translations
};

export type FormText = FomanticUI.Form.Settings.Texts;

/*
       dP                                  dP
       88                                  88
 .d888b88 88d888b. .d8888b. 88d888b. .d888b88 .d8888b. dP  dP  dP 88d888b.
 88'  `88 88'  `88 88'  `88 88'  `88 88'  `88 88'  `88 88  88  88 88'  `88
 88.  .88 88       88.  .88 88.  .88 88.  .88 88.  .88 88.88b.88' 88    88
 `88888P8 dP       `88888P' 88Y888P' `88888P8 `88888P' 8888P Y8P  dP    dP
                            88
                            dP
*/

/**
 * Dropdown initialization settings.
 * Fixes onChange signature to allow string[] for multi-select
 *
 * @see {@link http://fomantic-ui.com/modules/dropdown.html#/settings}
 */
export type DropdownSettings = Omit<Partial<FomanticUI.DropdownSettings>, "onChange"> & {
    /** Is called after a dropdown value changes.
     *  Receives the name and value of selection and the active menu element. */
    onChange?(value: string | string[], text: string, $choice: JQuery): void;
};

export type DropdownMessages = FomanticUI.Dropdown.Settings.Messages;

/*

 88d888b. 88d888b. .d8888b. .d8888b. 88d888b. .d8888b. .d8888b. .d8888b.
 88'  `88 88'  `88 88'  `88 88'  `88 88'  `88 88ooood8 Y8ooooo. Y8ooooo.
 88.  .88 88       88.  .88 88.  .88 88       88.  ...       88       88
 88Y888P' dP       `88888P' `8888P88 dP       `88888P' `88888P' `88888P'
 88                              .88
 dP                          d8888P
*/

// [x]: implement init-progress
/** @see {@link https://fomantic-ui.com/modules/progress.html#/settings} */
export type ProgressSettings = Partial<FomanticUI.ProgressSettings>;

/**
 * Text content for each state, uses simple templating with {percent}, {value}, {total} and {bar}.
 *
 * {bar} is useful to show bar names on multiple bars.
 * Names of bars are provided by text.bars in the forms of array of string. E.g. ['bar1', 'bar2'].
 */
export type ProgressTexts = Partial<FomanticUI.Progress.Settings.Texts>;

/*
 .8888b dP                              dP
 88   " 88                              88
 88aaa  88 dP    dP .d8888b. dP    dP d8888P
 88     88 88    88 88'  `88 88    88   88
 88     88 88.  .88 88.  .88 88.  .88   88
 dP     dP `8888P88 `88888P' `88888P'   dP
                .88
            d8888P
*/

export type FlyoutTexts = {
    ok: string; //     "Ok"
    cancel: string; // "Cancel"
    close: string; //  "Close"
};

/** @see {@link https://fomantic-ui.com/modules/flyout.html#/settings} */
export type FlyoutSettings = Partial<FomanticUI.FlyoutSettings> & {
    text: FlyoutTexts;
};

/*
            dP   dP
            88   88
 .d8888b. d8888P 88d888b. .d8888b. 88d888b.
 88'  `88   88   88'  `88 88ooood8 88'  `88
 88.  .88   88   88    88 88.  ... 88
 `88888P'   dP   dP    dP `88888P' dP

*/

/** @see {@link https://fomantic-ui.com/modules/checkbox.html#/settings} */
export type CheckboxSettings = Partial<FomanticUI.CheckboxSettings>;

/** @see {@link https://fomantic-ui.com/modules/modal.html#/settings} */
export type ModalSettings = Partial<FomanticUI.ModalSettings>;

/** @see {@link https://fomantic-ui.com/modules/popup.html#/settings} */
export type PopupSettings = Partial<FomanticUI.PopupSettings>;

/** @see {@link https://fomantic-ui.com/modules/slider.html#/settings} */
export type SliderSettings = Partial<FomanticUI.SliderSettings>;

/** @see {@link https://fomantic-ui.com/modules/sticky.html#/settings} */
export type StickySettings = Partial<FomanticUI.StickySettings>;

/** @see {@link https://fomantic-ui.com/modules/toast.html#/settings} */
export type ToastSettings = Partial<FomanticUI.ToastSettings>;
