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

//-------------------------------------------------------------------------------------------------
// region Calendar

export type DateFormatFn = (d: Date | undefined, settings?: CalendarSettings) => string;
export type DateParseFn = (date: string | undefined, settings?: CalendarSettings) => Date | null;

/**
 * Fomantic UI Calendar settings.
 * Adds 'formatter' and 'parser' documentation and fixes 'onChange' arguments.
 *
 * @see {@link https://fomantic-ui.com/modules/calendar.html#/settings}
 */
export type CalendarSettings = Omit<Partial<FomanticUI.CalendarSettings>, "onChange" | "parser"> & {
    /** Is called after a calendar date has changed. */
    onChange?(this: JQuery<HTMLElement>, date: Date, text: string, mode: string): void;
    // TODO: prove that mode is passed in 2.9.4

    // formatter?: {
    //     cellTime?: string | DateFormatFn; // : string
    //     date?: string | DateFormatFn;
    //     datetime?: string | DateFormatFn;
    //     time?: string | DateFormatFn;
    //     month?: string | DateFormatFn;
    //     year?: string | DateFormatFn;

    //     dayHeader?: string | DateFormatFn; // : string;
    //     hourHeader?: string | DateFormatFn;
    //     minuteHeader?: string | DateFormatFn;
    //     monthHeader?: string | DateFormatFn;
    //     yearHeader?: (date: Date, settings: CalendarSettings) => string; // settings?: CalendarSettings

    //     cell?: (
    //         cell: JQuery,
    //         date: Date,
    //         options: { // : any
    //             mode: string;
    //             adjacent: boolean;
    //             disabled: boolean;
    //             active: boolean;
    //             today: boolean;
    //         }
    //     ) => string; // => any
    //     dayColumnHeader?: (day: number, settings: CalendarSettings) => string;
    //     today?: (settings: CalendarSettings) => string;
    // };

    parser?: {
        date?: DateParseFn; // this function can return null
    };
};

export type CalendarTexts = FomanticUI.Calendar.Settings.Texts;

//-------------------------------------------------------------------------------------------------
// region Form

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
export type FormSettings = Partial<Omit<FomanticUI.FormSettings, "prompt" | "rules" | "fields">> & {
    // TODO: check if new Semantic d.ts is correct and useful
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
    maxValue: string;
    minValue: string;
    range: string;
    size: string;
};

export type FormText = FomanticUI.Form.Settings.Texts;

//-------------------------------------------------------------------------------------------------
// region Dropdown

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

//-------------------------------------------------------------------------------------------------
// region Progress

/** @see {@link https://fomantic-ui.com/modules/progress.html#/settings} */
export type ProgressSettings = Partial<FomanticUI.ProgressSettings> & {
    duration?: number;
};

/**
 * Text content for each state, uses simple templating with {percent}, {value}, {total} and {bar}.
 * This type describes only prefilled texts (for translation purposes).
 *
 * {bar} is useful to show bar names on multiple bars.
 * Names of bars are provided by text.bars in the forms of array of string. E.g. ['bar1', 'bar2'].
 */
export type CommonProgressTexts = Pick<FomanticUI.Progress.Settings.Texts, "percent" | "ratio">;

//-------------------------------------------------------------------------------------------------
// region Flyout & Modal

export type ButtonTexts = {
    ok: string;
    cancel: string;
    close: string;
};

/** @see {@link https://fomantic-ui.com/modules/flyout.html#/settings} */
export type FlyoutSettings = Partial<FomanticUI.FlyoutSettings> & {
    text?: ButtonTexts;
};

/** @see {@link https://fomantic-ui.com/modules/modal.html#/settings} */
export type ModalSettings = Partial<FomanticUI.ModalSettings> & {
    text?: ButtonTexts;
};

//-------------------------------------------------------------------------------------------------
// region other

/** @see {@link https://fomantic-ui.com/modules/checkbox.html#/settings} */
export type CheckboxSettings = Partial<FomanticUI.CheckboxSettings>;

/** @see {@link https://fomantic-ui.com/modules/popup.html#/settings} */
export type PopupSettings = Partial<FomanticUI.PopupSettings>;

/** @see {@link https://fomantic-ui.com/modules/slider.html#/settings} */
export type SliderSettings = Partial<FomanticUI.SliderSettings>;

/** @see {@link https://fomantic-ui.com/modules/sticky.html#/settings} */
export type StickySettings = Partial<FomanticUI.StickySettings>;

/** @see {@link https://fomantic-ui.com/modules/toast.html#/settings} */
export type ToastSettings = Partial<FomanticUI.ToastSettings>;

/** @see {@link https://fomantic-ui.com/modules/rating.html#/settings} */
export type RatingSettings = Partial<FomanticUI.RatingSettings>;

// export type VisibilitySettings = Partial<FomanticUI.VisibilitySettings>;
// export type EmbedSettings = Partial<FomanticUI.EmbedSettings>;
// export type DimmerSettings = Partial<FomanticUI.DimmerSettings>;
