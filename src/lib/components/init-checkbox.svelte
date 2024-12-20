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
import { findComponent, nextUid } from "../data/common";
import { FieldController } from "../data/field-controller";
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

function onInputChange(this: JQueryApi, p1?: unknown, p2?: unknown): void {
    console.log("CHECK", this, p1, p2);
    // // global checkbox settings
    // const def: CheckboxSettings = checkboxDefaults.read();
    // if (def.onChange) {
    //     def.onChange.call(this);
    // }
    // user-specified handler for this component
    if (settings && settings.onChange) {
        settings.onChange.call(this);
    }
    fieldCtrl?.revalidate();
}

onMount(async () => {
    // delay initialization till all DOM UI elements are ready
    await tick();

    elem = findComponent(span!, ".ui.checkbox", forId);
    if (!elem.checkbox) {
        throw new Error("Semantic checkbox is not initialized");
    }
    elem.checkbox({
        ...settings,
        onChange: onInputChange,
    });

    // Find select or inner input
    input = elem.find("input");
    const inputId: string | undefined =
        input.attr("id") ?? input.attr("name") ?? input.attr("data-validate");
    if (!inputId) {
        const checkboxId: string | undefined =
            elem.attr("id") ?? elem.attr("name") ?? elem.attr("data-validate");
        input.attr("data-validate", `${FIELD_PREFIX}_${checkboxId ? checkboxId : nextUid()}`);
    }

    // select is already attaching the inner label to inner input
    // no need for label for="_" shortcut

    // apply validation rule if the rule is supplied in <InitCheckbox >
    fieldCtrl = new FieldController(input, validate);
    fieldCtrl.revalidate();
});

/** Remove event handlers */
onDestroy(() => {
    if (fieldCtrl) {
        fieldCtrl.removeRules(); // FIXME: testing (AK)
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
