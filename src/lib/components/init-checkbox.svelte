<!--
@component
Svelte initializer for Semantic UI `Checkbox` component.
(see detailed description in init-checkbox.svelte.d.ts )
-->
<svelte:options runes={true} />

<script lang="ts">
import type { Snippet } from "svelte";
import { onMount, onDestroy, tick } from "svelte";

import type { CheckboxSettings, JQueryApi, RuleDefinition } from "../data/semantic-types";
import { compLog } from "../data/common";
import { copyParentKey, findComponent } from "../data/dom-jquery";
import { FieldController } from "../data/field-controller";

const FIELD_PREFIX: string = "f_checkbox";

// region props -----------------------------------------------------------------------------------

type Undetermined = null;

interface Props {
    /** To-way binding for the checkbox state, null value means 'indeterminate' [-].
     *
     *  For validation purposes 'indeterminate' is treated the same as 'unchecked'. */
    checked?: boolean | Undetermined;

    /** Two-way binding for checkbox group.
     *
     * `group` bindings overrides `checked` binding, which becomes read-only */
    group?: string | string[];

    /** Settings for Semantic UI component, see https://fomantic-ui.com/modules/dropdown.html#/settings */
    settings?: CheckboxSettings;

    /** Optional field value validator. Uses Semantic UI form validation syntax.
     *  See https://fomantic-ui.com/behaviors/form.html#/examples.
     *  To avoid typos, use `rules` helper from `data/helpers.ts` {@link data/helpers.rule}. */
    validate?: RuleDefinition;

    /** Id of the Semantic UI input element, takes precedence over tag position */
    forId?: string;

    /** If InitCheckbox is used as a parent, render the children components */
    children?: Snippet;
}

// region data ------------------------------------------------------------------------------------

/* eslint-disable prefer-const */

let {
    checked = $bindable(),
    group = $bindable(),
    settings = undefined,
    validate = undefined,
    forId = undefined,
    children = undefined,
}: Props = $props();

/** Invisible dom element created by this component. */
let span: Element;

/* eslint-enable */

interface CheckboxApi {
    checkbox(settings: CheckboxSettings): void;
    checkbox(command: "check"): void;
    checkbox(command: "set unchecked"): void;
    checkbox(command: "uncheck"): void;
    checkbox(command: "set indeterminate"): void;
    checkbox(command: "is checked"): void;
    checkbox(command: "is unchecked"): void;
    checkbox(command: "is indeterminate"): void;
    checkbox(command: "destroy"): void;
}
/** jQuery dropdown component */
let elem: JQueryApi & CheckboxApi;

/** Inner input for form validation */
let input: JQueryApi;

/** Field descriptor and validator */
let fieldCtrl: FieldController;

// region svelte -> checkbox ----------------------------------------------------------------------

/** // [x] */
function svelteToInput(newValue: boolean | Undetermined): void {
    if (newValue === null) {
        elem.checkbox("set unchecked");
        elem.checkbox("set indeterminate");
    } else {
        if (newValue === true) {
            elem.checkbox("check");
        }
        if (newValue === false) {
            elem.checkbox("uncheck");
        }
    }
    compLog.log(`Checkbox (${fieldCtrl.key}) : checked -> ${newValue}`);
    void fieldCtrl.revalidate();
}

/** // [x] */
$effect(() => {
    void checked;
    void group;
    if (Array.isArray(group)) {
        if (group.length > 0) {
            void group[0];
        }
        for (let i: number = 0; i < group.length; i++) {
            void group[i];
        }
    }
    if (!elem) {
        return; // effect may be called before onMount
    }

    // TODO: move to svelteToInput()
    if (group !== undefined) {
        const value: string = input.val() as string;
        if (Array.isArray(group)) {
            svelteToInput(group.includes(value));
        } else {
            svelteToInput(value === group);
        }
        return; // group overrides checked
    }
    if (checked !== undefined) {
        svelteToInput(checked);
    }
});

/** Update rules when the validate value changes. Fire a change event to trigger revalidation if deemed appropriate. */
$effect(() => {
    void validate;
    if (!elem) {
        return; // effect may be called before onMount
    }
    fieldCtrl.replaceRules(validate);
});

// region checkbox -> svelte ----------------------------------------------------------------------

/** When input value changes, modify the svelte prop */
function inputToSvelte(newState: boolean | Undetermined): void {
    // update group binding
    if (group !== undefined) {
        const value: string = input.val() as string;
        if (Array.isArray(group)) {
            if (newState === true && !group.includes(value)) {
                compLog.log(`Checkbox (${fieldCtrl.key}) : group <- (+)${value}`);
                group.push(value);
                void fieldCtrl.revalidate();
            }
            if (newState === false && group.includes(value)) {
                compLog.log(`Checkbox (${fieldCtrl.key}) : group <- (-)${value}`);
                group = group.filter((val: string) => val !== value);
                void fieldCtrl.revalidate();
            }
            // indeterminate checkbox doesn't change 'group' binding
        } else {
            if (newState === true && group !== value) {
                compLog.log(`Checkbox (${fieldCtrl.key}) : group <- ${value}`);
                group = value;
                void fieldCtrl.revalidate();
            }
            if (newState === false && group === value) {
                compLog.log(`Checkbox (${fieldCtrl.key}) : group <- ""`);
                group = "";
                void fieldCtrl.revalidate();
            }
            // indeterminate checkbox doesn't change 'group' binding
        }
    }
    // update checked binding
    if (checked !== undefined) {
        if (checked !== newState) {
            compLog.log(`Checkbox (${fieldCtrl.key}) : checked <- ${newState}`);
            checked = newState;
            void fieldCtrl.revalidate();
        }
    }
    // direct svelte bindings are used
    if (group === undefined && checked === undefined) {
        void fieldCtrl.revalidate();
    }
}

function onInputChange(this: JQueryApi): void {
    // first call user-specified event handler for this component
    if (settings && settings.onChange) {
        settings.onChange.call(this);
    }
    let state: boolean | Undetermined = null;
    if (elem.checkbox("is indeterminate")) {
        state = null;
    } else {
        if (elem.checkbox("is checked")) {
            state = true;
        }
        if (elem.checkbox("is unchecked")) {
            state = false;
        }
    }
    void inputToSvelte(state);
}

// region init ------------------------------------------------------------------------------------

onMount(async () => {
    // delay initialization till form controller is ready
    await tick();

    elem = findComponent(span!, ".ui.checkbox", forId);
    if (!elem.checkbox) {
        throw new Error("Semantic checkbox is not initialized");
    }
    elem.checkbox({
        ...settings,
        onChange: onInputChange,
    });

    // Find inner input
    input = elem.find("input");
    if (!input.length) {
        throw new Error("Semantic checkbox doesn't have input");
    }
    copyParentKey(input, elem, FIELD_PREFIX);

    // select is already attaching the inner label to inner input
    // no need for label for="_" shortcut

    // apply validation rule if the rule is supplied in <InitCheckbox >
    fieldCtrl = new FieldController("checkbox", input, validate);
    void fieldCtrl.revalidate();

    if (group !== undefined) {
        const value: string = input.val() as string;
        if (Array.isArray(group)) {
            svelteToInput(group.includes(value));
        } else {
            svelteToInput(value === group);
        }
        // TODO: create hidden text input (if it doesn't yet exist) ?
        // apply validation rules to it (make sure there are no duplicates)
        // update input value on change, similar to slider
        return; // group overrides checked
    }
    if (checked !== undefined) {
        svelteToInput(checked);
    }
});

/** Remove event handlers */
onDestroy(() => {
    if (fieldCtrl) {
        fieldCtrl.removeRules();
    }
    if (elem) {
        elem.checkbox("destroy");

        // select is already attaching the inner label to inner input
        // no need for label for="_" shortcut
    }
});
</script>

<span class="InitCheckbox" style:display={children ? "contents" : "none"} bind:this={span}
    >{@render children?.()}</span
>

<style>
</style>
