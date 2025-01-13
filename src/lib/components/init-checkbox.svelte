<!--
@component
Svelte initializer for Semantic UI `Checkbox` component.
(see detailed description in init-checkbox.svelte.d.ts )
-->
<svelte:options runes={true} />

<script lang="ts">
import type { Snippet } from "svelte";
import { onMount, onDestroy, tick } from "svelte";

import type { RuleDefinition } from "../data/common";
import type { CheckboxSettings, JQueryApi } from "../data/semantic-types";
import { copyParentKey, findComponent } from "../data/dom-jquery";
import { FieldController } from "../data/form-controller";
// import { checkboxDefaults } from "../data/settings";

const FIELD_PREFIX: string = "f_checkbox";

interface Props {
    settings?: CheckboxSettings;
    validate?: RuleDefinition;
    forId?: string;
    children?: Snippet;
}

// REACTIVE -------------------------------------------------------------------
/* eslint-disable prefer-const */

let {
    settings = undefined,
    validate = undefined,
    forId = undefined,
    children = undefined,
}: Props = $props();

/** Invisible dom element created by this component. */
let span: Element | undefined = undefined;

/* eslint-enable */

// DATA -----------------------------------------------------------------------

type CheckboxApi = {
    checkbox(settings: CheckboxSettings): void;
    checkbox(command: string, arg1?: unknown): unknown;
};
/** jQuery dropdown component */
let elem: (JQueryApi & CheckboxApi) | undefined = undefined;

/** Inner input for form validation */
let input: JQueryApi | undefined = undefined;

/** Field descriptor and validator */
let fieldCtrl: FieldController | undefined = undefined;

// FUNCTIONS ------------------------------------------------------------------

function onInputChange(this: JQueryApi): void {
    // user-specified handler for this component
    if (settings && settings.onChange) {
        settings.onChange.call(this);
    }
    void fieldCtrl?.revalidate();
}

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
    copyParentKey(input, elem, FIELD_PREFIX);

    // select is already attaching the inner label to inner input
    // no need for label for="_" shortcut

    // apply validation rule if the rule is supplied in <InitCheckbox >
    fieldCtrl = new FieldController(input, validate);
    void fieldCtrl.revalidate();
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
