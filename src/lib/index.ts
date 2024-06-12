/**
 * Re-export components, most common functions and objects.
 * @module index
 */

// INITIALIZATION

import { applyDefaultSettings } from "./data/settings";
import { extendValidationRules } from "./data/validation-rules";
import { registerBaseLocales } from "./i18n";

/**
 * Prepares the framework defaults and locales.
 *
 * Must run after DOM is initialized, but before the application is displayed.
 * For example from sveltekit load() function. */
export async function initializeFramework(): Promise<void> {
    extendValidationRules();
    applyDefaultSettings();
    registerBaseLocales();
}

// COMPONENTS

export { calendar } from "./components/use-calendar";
export { checkbox } from "./components/use-checkbox";
export { dropdown } from "./components/use-dropdown";
export { modal } from "./components/use-modal";
export { popup } from "./components/use-popup";
export { slider } from "./components/use-slider";
export { sticky } from "./components/use-sticky";
export { toast } from "./components/proc-toast";

// DATA

export { format } from "./components/use-format";
export { NumberFmt, MoneyFmt, TextFmt, ListFmt, DateFmt } from "./data/input-formatter";
export { validate } from "./components/use-validate";
export { formValidation } from "./data/use-form-validation";
export { default as Data } from "./data/data-bind.svelte";
export { default as FormValidator } from "./data/form-validator-bind.svelte";

// HELPERS

export { fmt, parse, rule } from "./data/helpers";
export { isoDate, isoTime } from "./data/common";

// TYPES

export type {
    CalendarSettings,
    CalendarText,
    CheckboxSettings,
    DropdownSettings,
    DropdownMessages,
    FlyoutTexts,
    FormSettings,
    FormPropmt,
    FormText,
    ModalSettings,
    NumberSettings,
    PopupSettings,
    ProgressTexts,
    SliderSettings,
    StickySettings,
    ToastSettings,
} from "./data/semantic-types";

// SETTINGS

export { calendarDefaults } from "./components/use-calendar";
export { checkboxDefaults } from "./components/use-checkbox";
export { dropdownDefaults } from "./components/use-dropdown";
export { modalDefaults } from "./components/use-modal";
export { popupDefaults } from "./components/use-popup";
export { sliderDefaults } from "./components/use-slider";
export { stickyDefaults } from "./components/use-sticky";
export { toastDefaults } from "./components/proc-toast";

export { numberDefaults } from "./data/input-formatter";
export { formDefaults } from "./data/use-form-validation";

// I18N

export {
    applyLocale,
    getLocale,
    registerBaseLocales,
    registerLanguage,
    registerLocale,
    supportedLanguages,
    supportedLocales,
} from "./i18n";
