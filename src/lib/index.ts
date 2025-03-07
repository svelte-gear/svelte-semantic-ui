/**
 * Public interface of the library.
 * Re-exports components, most common functions and objects.
 * @module _index
 */

import type { LogLevel } from "./data/common";
import { initLog, formLog, compLog } from "./data/common";
import { applyDefaultSettings } from "./data/settings";
import { extendValidationRules } from "./data/validation-rules";
import { registerBaseLocales } from "./i18n";

// region initialization --------------------------------------------------------------------------

/**
 * Prepares the framework defaults and locales.
 *
 * Must run after DOM is initialized, but before the application is displayed.
 * For example from sveltekit load() function. */
export async function initializeFramework(loglevel: LogLevel = "warn"): Promise<void> {
    initLog.build(loglevel);
    formLog.build(loglevel);
    compLog.build(loglevel);
    extendValidationRules();
    applyDefaultSettings();
    registerBaseLocales();
}

export { registerRule } from "./data/validation-rules";
export { setComponentInitMode } from "./data/dom-jquery";
export { formLog, compLog, initLog } from "./data/common";

// region components ------------------------------------------------------------------------------

export { default as InitForm } from "./data/init-form.svelte";

export { default as InitCalendar } from "./components/init-calendar.svelte";
export { default as InitCheckbox } from "./components/init-checkbox.svelte";
export { default as InitDropdown } from "./components/init-dropdown.svelte";
export { default as InitDateInput } from "./components/init-input-date.svelte";
export { default as InitNumberInput } from "./components/init-input-number.svelte";
export { default as InitTextInput } from "./components/init-input-text.svelte";
export { default as InitSlider } from "./components/init-slider.svelte";
export { default as InitModal } from "./components/init-modal.svelte";
export { default as InitProgress } from "./components/init-progress.svelte";
export { default as InitRating } from "./components/init-rating.svelte";

export { popup } from "./components/use-popup";
export { sticky } from "./components/use-sticky";
export { toast } from "./components/proc-toast";

export type { FormController } from "./data/form-controller";

export { doValidateForm, doResetForm, getFormController } from "./data/form-controller";
export { fmt, parse, rule } from "./data/helpers";
export { isoDate, isoTime } from "./data/common";

// region settings --------------------------------------------------------------------------------

// TYPES

export type { NumberSettings } from "./data/common";
export type {
    CalendarSettings,
    CalendarTexts as CalendarText,
    CheckboxSettings,
    DropdownSettings,
    DropdownMessages,
    ButtonTexts as FlyoutTexts,
    FormSettings,
    FormPrompt,
    FormText,
    ModalSettings,
    PopupSettings,
    CommonProgressTexts as ProgressTexts,
    SliderSettings,
    StickySettings,
    ToastSettings,
} from "./data/semantic-types";

// DEFAULTS

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

// region I18N ------------------------------------------------------------------------------------

export {
    applyLocale,
    getLocale,
    registerBaseLocales,
    registerLanguage,
    registerLocale,
    supportedLanguages,
    supportedLocales,
} from "./i18n";
