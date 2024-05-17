/**
 * Re-export components, most common functions and objects.
 * @module index
 */

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

export { fmt, parse } from "./data/format";
export { rule } from "./data/rule-book";

// // SETTINGS

// export { calendarDefaults } from "./components/use-calendar";
// export { checkboxDefaults } from "./components/use-checkbox";
// export { dropdownDefaults } from "./components/use-dropdown";
// export { modalDefaults } from "./components/use-modal";
// export { popupDefaults } from "./components/use-popup";
// export { sliderDefaults } from "./components/use-slider";
// export { stickyDefaults } from "./components/use-sticky";
// export { toastDefaults } from "./components/proc-toast";

// export { numberFormatDefaults, dateFormatDefaults } from "./data/format";
// export { promptDefaults } from "./data/rule-book";
// export { formValidationDefaults } from "./data/use-form-validation";

// // TYPES

// export type { CalendarSettings } from "./components/use-calendar";
// export type { CheckboxSettings } from "./components/use-checkbox";
// export type { DropdownSettings } from "./components/use-dropdown";
// export type { ModalSettings } from "./components/use-modal";
// export type { PopupSettings } from "./components/use-popup";
// export type { SliderSettings } from "./components/use-slider";
// export type { StickySettings } from "./components/use-sticky";
// export type { ToastSettings } from "./components/proc-toast";

// export type { NumberFormatSettings } from "./data/format";
// export type { PromptSettings } from "./data/rule-book";
// export type { FormValidationSettings } from "./data/use-form-validation";
