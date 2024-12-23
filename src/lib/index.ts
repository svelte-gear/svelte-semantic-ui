/**
 * Public interface of the library.
 * Re-exports components, most common functions and objects.
 * @module _index
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

export { popup } from "./components/use-popup";
export { sticky } from "./components/use-sticky";
export { toast } from "./components/proc-toast";
export { validateForm } from "./data/form-controller";

// DATA

export { default as InitForm } from "./data/init-form.svelte";

export { default as InitCalendar } from "./components/init-calendar.svelte";
export { default as InitCheckbox } from "./components/init-checkbox.svelte";
export { default as InitDropdown } from "./components/init-dropdown.svelte";
export { default as InitDateInput } from "./components/init-input-date.svelte";
export { default as InitNumberInput } from "./components/init-input-number.svelte";
export { default as InitTextInput } from "./components/init-input-text.svelte";
export { default as InitSlider } from "./components/init-slider.svelte";
export { default as InitModal } from "./components/init-modal.svelte";

// HELPERS

export { fmt, parse, rule } from "./data/helpers";
export { isoDate, isoTime } from "./data/common";
export { setComponentInitMode } from "./data/dom-jquery";

// TYPES

export type { NumberSettings } from "./data/common";
export type {
    CalendarSettings,
    CalendarText,
    CheckboxSettings,
    DropdownSettings,
    DropdownMessages,
    FlyoutTexts,
    FormSettings,
    FormPrompt,
    FormText,
    ModalSettings,
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

export { registerRule } from "./data/validation-rules";
