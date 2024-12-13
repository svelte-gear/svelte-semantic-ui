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

export { checkbox } from "./components/use-checkbox";
export { popup } from "./components/use-popup";
export { sticky } from "./components/use-sticky";
export { toast } from "./components/proc-toast";

// DATA

// export { format } from "./components/use-format";
// export { NumberFmt, TextFmt, ListFmt, DateFmt } from "./data/input-formatter";
// export { validate } from "./components/use-validate";
// export { default as Data } from "./data/data-bind.svelte";

export { default as FormValidation } from "./data/form-validation.svelte";
export { default as InitCalendar } from "./components/init-calendar.svelte";
export { default as InitDropdown } from "./components/init-dropdown.svelte";
export { default as InitSlider } from "./components/init-slider.svelte";
export { default as InitModal } from "./components/init-modal.svelte";
export { default as InitNumberInput } from "./components/init-input-number.svelte";
export { default as InitDateInput } from "./components/init-input-date.svelte";
export { default as InitTextInput } from "./components/init-input-text.svelte";

// HELPERS

export { fmt, parse, rule } from "./data/helpers";
export { isoDate, isoTime, setComponentInitMode } from "./data/common";

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

export {
    calendarDefaults,
    checkboxDefaults,
    dropdownDefaults,
    modalDefaults,
    popupDefaults,
    sliderDefaults,
    stickyDefaults,
    toastDefaults,
    numberDefaults,
    formDefaults,
} from "./data/settings";

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
