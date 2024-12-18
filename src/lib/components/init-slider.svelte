<!--
@component
Svelte data binder and initializer for Semantic-UI `Slider` components.
(see detailed description in init-slider.svelte.d.ts )
-->
<svelte:options runes={true} />

<script lang="ts">
import type { Snippet } from "svelte";
import { onMount, onDestroy, tick } from "svelte";

import type { RuleDefinition } from "../data/common";
import type { SliderSettings, JQueryApi } from "../data/semantic-types";
import { equalArrays, findComponent, uid } from "../data/common";
import { sliderDefaults } from "../data/settings";
import { FieldController } from "../data/field-controller";

const FIELD_PREFIX: string = "f_slider";

interface Props {
    value: number | number[];
    settings?: SliderSettings;
    validate?: RuleDefinition;
    forId?: string;
    children?: Snippet;
}

// REACTIVE -------------------------------------------------------------------
/* eslint-disable prefer-const */

let {
    value = $bindable(0),
    settings = undefined,
    validate = undefined,
    forId = undefined,
    children = undefined,
}: Props = $props();

/** Invisible dom element created by this component. */
let span: Element | undefined = undefined;

/* eslint-enable */

// DATA -----------------------------------------------------------------------

type SliderApi = {
    slider(settings: SliderSettings): void;
    slider(command: string, arg1?: unknown, arg2?: unknown): unknown;
};
/** jQuery calendar component */
let elem: (JQueryApi & SliderApi) | undefined = undefined;

/** Hidden input for form validation */
let input: JQueryApi | undefined = undefined;

/** Is this a range slider or simple slider */
let range: boolean = false;

/** Field descriptor and validator */
let fieldCtrl: FieldController | undefined = undefined;

// FUNCTIONS ------------------------------------------------------------------

/** Textual presentation of the value. */
function toStr(val: number | number[]): string {
    if (Array.isArray(val)) {
        return `${val[0]}..${val[1]}`;
    }
    return `${val}`;
}

//-----------------------------------------------------------------------------

/** Propagate prop change to UI component */
function svelteToInput(newValue: number | number[]): void {
    if (!elem) {
        // effect and svelteToInput may be called before onMount()
        return;
    }
    // console.log(`Svelte->Slider(${fieldCtrl?.key})`, newValue);
    if (range) {
        if (!Array.isArray(newValue)) {
            throw new Error(`Ranged slider expects number[] value, got ${newValue}`);
        }
        const val1: number = elem.slider("get thumbValue", "first");
        const val2: number = elem.slider("get thumbValue", "second");
        if (newValue[0] !== val1 || newValue[1] !== val2) {
            console.debug(`InitSlider -> prop change = ${toStr(newValue)}`);
            elem.slider("set rangeValue", newValue[0], newValue[1]);
            input!.val(`${newValue.join(",")}`);
            fieldCtrl?.revalidate();
        }
    } else {
        if (Array.isArray(newValue)) {
            throw new Error(`Simple slider expects number value, got ${newValue.join(",")}`);
        }
        const val: number = elem.slider("get value");
        if (newValue !== val) {
            console.debug(`InitSlider -> prop change = ${toStr(newValue)}`);
            elem.slider("set value", newValue);
            input!.val(`${newValue}`);
            fieldCtrl?.revalidate();
        }
    }
}

/** The effect rune calls svelteToInput when prop value changes */
$effect(() => {
    void value;
    // trigger effect on array element change if array wasn't assigned after init
    if (Array.isArray(value)) {
        void value[0];
        void value[1];
    }
    svelteToInput(value);
});

//-----------------------------------------------------------------------------

/** When input value changes, modify the svelte prop */
function inputToSvelte(inputValue: number | number[]): void {
    if (!input) {
        throw new Error("Slider is not initialized");
    }
    // store in the prop only if the value is different
    if (!equalArrays(value, inputValue)) {
        console.debug(`InitSlider <- input = ${toStr(inputValue)}`);
        value = inputValue;
        if (range && Array.isArray(inputValue)) {
            input.val(inputValue.join(","));
        } else {
            input.val(`${inputValue}`);
        }
        fieldCtrl?.revalidate();
    }
}

/** The callback function is calls inputToSvelte when slider value is changed by user. */
function onSliderChange(
    // eslint-disable-next-line no-undef
    this: JQuery<HTMLElement>,
    newValue: number,
    th1: number,
    th2: number
): void {
    // global calendar settings
    const def: SliderSettings = sliderDefaults.read();
    if (def.onChange) {
        def.onChange.call(this, newValue, th1, th2);
    }
    // user-specified handler for this component
    if (settings && settings.onChange) {
        settings.onChange.call(this, newValue, th1, th2);
    }
    // update data binding
    inputToSvelte(range ? [th1, th2] : newValue);
}

//-----------------------------------------------------------------------------

onMount(async () => {
    // delay initialization till all DOM UI elements are ready
    await tick();

    // Initialize Semantic component and subscribe for changes
    elem = findComponent(span!, ".ui.slider", forId) as JQueryApi & SliderApi;
    if (!elem.slider) {
        throw new Error("Semantic slider is not initialized");
    }
    elem.slider({
        ...settings,
        onChange: onSliderChange,
    });

    // check if it is a single value or range input
    range = elem.hasClass("range");
    if (range && !Array.isArray(value)) {
        throw new Error(`Range slider has a number[] 'value', got ${toStr(value)}`);
    }
    if (!range && Array.isArray(value)) {
        throw new Error(
            `Slider has a number 'value', got ${toStr(value)}, did you forget to add 'range' class?`
        );
    }

    // Add hidden input to enable slider value validation
    const sliderId: string | undefined =
        elem.attr("id") ?? elem.attr("name") ?? elem.attr("data-validate");
    const inputId: string = `${FIELD_PREFIX}_${sliderId ? sliderId : uid()}`;
    elem.append(`<input type="hidden" data-validate="${inputId}"/>`);
    input = elem.find("input");

    // apply validation rule if the rule is supplied in <InitSlider >
    fieldCtrl = new FieldController(input, validate);
    // push initial value into the Semantic UI element
    svelteToInput(value);
    // validate initial value, if validation is active
    fieldCtrl.revalidate();
});

/** Remove the subscription */
onDestroy(() => {
    if (fieldCtrl) {
        fieldCtrl.removeRules();
    }
    if (elem) {
        elem.slider("destroy");
    }
});
</script>

<span class="InitSlider" class:hidden={!children} bind:this={span}>{@render children?.()}</span>

<style>
.hidden {
    display: none;
}
</style>
