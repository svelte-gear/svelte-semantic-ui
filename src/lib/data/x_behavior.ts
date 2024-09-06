/**
 * Todo - usage example.
 * Experimental, maybe it's not required.
 * @module data/behavior
 * @experimental
 */

/* eslint-disable_ @typescript-eslint/lines-between-class-members */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-multi-spaces */

import type { JQueryApi, RuleDefinition, SemanticCommand } from "./common";
import { jQueryElem } from "./common";

/** Possible behaviour extensions for Semntic UI components. */
export interface SemanticBehavior {
    checkbox?: SemanticCommand;
    dropdown?: SemanticCommand;
    modal?: SemanticCommand;
    popup?: SemanticCommand;
    sticky?: SemanticCommand;

    calendar?: SemanticCommand;
    slider?: SemanticCommand;

    form?: SemanticCommand;
}

/*
 dP                dP                         oo
 88                88
 88d888b. .d8888b. 88d888b. .d8888b. dP   .dP dP .d8888b. 88d888b.
 88'  `88 88ooood8 88'  `88 88'  `88 88   d8' 88 88'  `88 88'  `88
 88.  .88 88.  ... 88    88 88.  .88 88 .88'  88 88.  .88 88
 88Y8888' `88888P' dP    dP `88888P8 8888P'   dP `88888P' dP

*/

/** Optional imperative behavour interface for Semantic UI components.
 * Assigns behaviour functions from jQuery element to svelte controller object.
 * The element may potentially implement multiple behavours at the same time,
 * like checkbox and popup.
 *
 * Example:
```
    <div class="ui modal" use:modal={options} use:behavior={ctl}
```
 * The controller may be a simple object and use behaviour functions directly:
```
    const ctl = {} as { modal: SemanticCommand };
    ctl.modal('show');
```
 * Or you can implement an object with methods, which calls behaviour functions internally:
```
    const ctl = {
        modal() { thow new Error('this will be replaced'); }
        show() { this.modal('show'); }
    };
    ctl.show();
```
 */
export function behavior(node: Element, bhv: SemanticBehavior): void {
    const elem: SemanticBehavior & JQueryApi = jQueryElem(node) as SemanticBehavior & JQueryApi;
    let bound: boolean = false;

    if (elem.checkbox && elem.hasClass("checkbox")) {
        bhv.checkbox = elem.checkbox.bind(elem);
        bound = true;
    }
    if (elem.dropdown && elem.hasClass("dropdown")) {
        bhv.dropdown = elem.dropdown.bind(elem);
        bound = true;
    }
    if (elem.modal && elem.hasClass("modal")) {
        bhv.modal = elem.modal.bind(elem);
        bound = true;
    }
    if (elem.popup && elem.hasClass("popup")) {
        bhv.popup = elem.popup.bind(elem);
        bound = true;
    }
    if (elem.sticky && elem.hasClass("sticky")) {
        bhv.sticky = elem.sticky.bind(elem);
        bound = true;
    }

    if (elem.calendar && elem.hasClass("calendar")) {
        bhv.calendar = elem.calendar.bind(elem);
        bound = true;
    }
    if (elem.slider && elem.hasClass("slider")) {
        bhv.slider = elem.slider.bind(elem);
        bound = true;
    }

    if (elem.form && elem.hasClass("form")) {
        bhv.form = elem.form.bind(elem);
        bound = true;
    }

    if (!bound) {
        throw new Error(
            // eslint-disable-next-line max-len
            "'use:behavior' can only be called on one of the following components: 'checkbox', 'dropdown', 'modal', 'popup', 'sticky', 'calendar', 'slider', 'form'"
        );
    }
}
/*
          dP
          88
 .d8888b. 88 .d8888b. .d8888b. .d8888b. .d8888b. .d8888b.
 88'  `"" 88 88'  `88 Y8ooooo. Y8ooooo. 88ooood8 Y8ooooo.
 88.  ... 88 88.  .88       88       88 88.  ...       88
 `88888P' dP `88888P8 `88888P' `88888P' `88888P' `88888P'

*/

/** Checkbox behaviour class.
 * Implements only basic control functions.
 *
 * Doesn't implement `set*()` methods without callback, `can*()` methods,
 * `shouldAllow*()` methods. As well as `indeterminate() and determinate()` methods
 * which appear to not work.
 */ /* prettier-ignore */
export class CheckboxBehavior {
    checkbox: SemanticCommand = () => {
        throw new Error("Initialize CheckboxBehavior with use:behavior");
    };

    toggle(): void  { this.checkbox("toggle"); }
    check(): void   { this.checkbox("check"); }
    uncheck(): void { this.checkbox("uncheck"); }
    enable(): void  { this.checkbox("enable"); }
    disable(): void { this.checkbox("disable"); }

    isRadio(): boolean     { return this.checkbox("is radio") as boolean; }
    isChecked(): boolean   { return this.checkbox("is checked") as boolean; }
    isUnchecked(): boolean { return this.checkbox("is unchecked") as boolean; }
    isEnabled(): boolean   { return this.checkbox("is enabled") as boolean; }
    isDisabled(): boolean  { return this.checkbox("is disabled") as boolean; }
}

export class DropdownBehavior {
    dropdown: SemanticCommand = () => {
        throw new Error("Initialize DropdownBehavior with use:behavior");
    };
}

/** Modal behaviour class.
 * Implements only visibility functions.
 *
 * Doesn"t implement dimmer and sizing functions,
 * as well as `setActive()` which doesn't work as expected
 */ /* prettier-ignore */
export class ModalBehavior {
    modal: SemanticCommand = () => {
        throw new Error("Initialize ModalBehavior with use:behavior");
    };

    show(): void        { this.modal("show"); }
    hide(): void        { this.modal("hide"); }
    toggle(): void      { this.modal("toggle"); }
    isActive(): boolean { return this.modal("is active") as boolean; }
}

export class PopupBehavior {
    popup: SemanticCommand = () => {
        throw new Error("Initialize PopupBehavior with use:behavior");
    };
}

export class StickyBehavior {
    sticky: SemanticCommand = () => {
        throw new Error("Initialize StickyBehavior with use:behavior");
    };
}

export class CalendarBehavior {
    calendar: SemanticCommand = () => {
        throw new Error("Initialize CalendarBehavior with use:behavior");
    };
}

export class SliderBehavior {
    slider: SemanticCommand = () => {
        throw new Error("Initialize SliderBehavior with use:behavior");
    };
}

/*
 .8888b
 88   "
 88aaa  .d8888b. 88d888b. 88d8b.d8b.
 88     88'  `88 88'  `88 88'`88'`88
 88     88.  .88 88       88  88  88
 dP     `88888P' dP       dP  dP  dP

*/

/** Form validation behaviour class.
 * Exposes internal behaviour of Semantic form component.
 * Use with caution as it may conflict with form controller.
 *
 * Implements rule creation and validation functions.
 *
 * Doesn't implement data manipulation (submit, reset, clear) and get/set field/value functions.
 */ /* prettier-ignore */
export class FormBehavior {
    form: SemanticCommand = () => {
        throw new Error("Initialize FormBehavior with use:behavior");
    };

    addRule(key: string, rules: RuleDefinition): void    { this.form("add rule", key, rules); }
    removeRule(key: string, rules: RuleDefinition): void { this.form("remove rule", key, rules); }
    setPrompt(key: string, error: string): void          { this.form("add prompt", key, error);  }
    setErrors(errors: string[]): void                    { this.form("add errors", errors); }

    isFormValid(): boolean             { return this.form("is valid") as boolean; }
    ifFieldValid(key: string): boolean { return this.form("is valid", key) as boolean; }
    validateForm(): void               { this.form("validate form"); }
    validateField(key: string): void   { this.form("validate field", key); }

    hasField(key: string): boolean     { return this.form("has field", key) as boolean; }
}
