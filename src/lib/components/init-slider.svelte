<!--
@component
Svelte data binder and initializer for Semantic-UI `Slider` components.
(see detailed description in init-slider.svelte.d.ts )
-->
<svelte:options runes={true} />

<script lang="ts">
import type { Snippet } from "svelte";
import { onMount, onDestroy, tick } from "svelte";

import type { SliderSettings, JQueryApi, RuleDefinition } from "../data/semantic-types";
import { arrayToString, compLog, equalNumberArrays } from "../data/common";
import { copyParentKey, findComponent } from "../data/dom-jquery";
import { FieldController } from "../data/field-controller";

const FIELD_PREFIX: string = "f_slider";
const INITIAL_SLIDER_VALUE: number = 0;

// region props -----------------------------------------------------------------------------------

interface Props {
    /** Two-way binding for setting and reading back the slider value */
    value: number | number[];

    /** Settings for Semantic UI component, see https://fomantic-ui.com/modules/slider.html#/settings */
    settings?: SliderSettings;

    /** Optional field value validator. Uses Semantic UI form validation syntax.
    See https://fomantic-ui.com/behaviors/form.html#/examples.
    To avoid typos, use `rules` helper from `data/helpers.ts` {@link data/helpers.rule}. */
    validate?: RuleDefinition;

    /** Id of the Semantic UI component, takes precedence over tag position */
    forId?: string;

    /** If InitSlider is used as a parent, render the children components */
    children?: Snippet;
}

// region data ------------------------------------------------------------------------------------

/* eslint-disable prefer-const */

let {
    value = $bindable(INITIAL_SLIDER_VALUE),
    settings = undefined,
    validate = undefined,
    forId = undefined,
    children = undefined,
}: Props = $props();

/** Invisible dom element created by this component. */
let span: Element;

/* eslint-enable */

interface SliderApi {
    slider(settings: SliderSettings): void;
    slider(command: "get thumbValue", arg: "first" | "second"): number;
    slider(command: "set rangeValue", v1: number, v2: number): void;
    slider(command: "set value", val: number): void;
    slider(command: "get value"): number;
    slider(command: "destroy"): void;
}
/** jQuery slider component */
let elem: JQueryApi & SliderApi;

/** Hidden input for form validation */
let input: JQueryApi;

/** Is this a range slider or simple slider */
let range: boolean = false;

/** Field descriptor and validator */
let fieldCtrl: FieldController;

// region svelte -> slider ------------------------------------------------------------------------

/** Propagate prop change to UI component */
function svelteToInput(newValue: number | number[], forceUpdate?: boolean): void {
    if (range) {
        if (!Array.isArray(newValue)) {
            throw new Error(`Ranged slider expects number[] value, got ${newValue}`);
        }
        const val1: number = elem.slider("get thumbValue", "first");
        const val2: number = elem.slider("get thumbValue", "second");
        if (newValue[0] !== val1 || newValue[1] !== val2 || forceUpdate) {
            compLog.log(`Slider (${fieldCtrl.key}) : value -> ${arrayToString(newValue)}`);
            elem.slider("set rangeValue", newValue[0], newValue[1]);
            input.val(`${newValue.join(",")}`);
            void fieldCtrl.revalidate();
        }
    } else {
        if (Array.isArray(newValue)) {
            throw new Error(`Simple slider expects number value, got [${newValue.join(",")}]`);
        }
        const val: number = elem.slider("get value");
        if (newValue !== val || forceUpdate) {
            compLog.log(`Slider (${fieldCtrl.key}) : value -> ${arrayToString(newValue)}`);
            elem.slider("set value", newValue);
            input.val(`${newValue}`);
            void fieldCtrl.revalidate();
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
    if (!elem) {
        return; // effect may be called before onMount
    }
    svelteToInput(value);
});

/** Update rules when the validate value changes. Fire a change event to trigger revalidation if deemed appropriate. */
$effect(() => {
    void validate;
    if (!elem) {
        return; // effect may be called before onMount
    }
    fieldCtrl.replaceRules(validate);
});

// region slider -> svelte ------------------------------------------------------------------------

/** When input value changes, modify the svelte prop */
function inputToSvelte(inputValue: number | number[]): void {
    if (!input) {
        throw new Error("Slider is not initialized");
    }
    // store in the prop only if the value is different
    if (!equalNumberArrays(value, inputValue)) {
        compLog.log(`Slider (${fieldCtrl.key}) : value <- ${arrayToString(inputValue)}`);
        value = inputValue;
        if (range && Array.isArray(inputValue)) {
            input.val(inputValue.join(","));
        } else {
            input.val(`${inputValue}`);
        }
        void fieldCtrl.revalidate();
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
    // user-specified handler for this component
    if (settings && settings.onChange) {
        settings.onChange.call(this, newValue, th1, th2);
    }
    // update data binding
    inputToSvelte(range ? [th1, th2] : newValue);
}

// region init ------------------------------------------------------------------------------------

onMount(async () => {
    // delay initialization till form controller is ready
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
        throw new Error(`Range slider has a number[] 'value', got ${arrayToString(value)}`);
    }
    if (!range && Array.isArray(value)) {
        throw new Error(
            `Slider has a number 'value', got ${arrayToString(value)}, did you forget to add 'range' class?`
        );
    }

    // Add hidden input to enable slider value validation
    elem.append('<input type="hidden" />');
    input = elem.find("input");
    copyParentKey(input, elem, FIELD_PREFIX);

    // apply validation rule if the rule is supplied in <InitSlider >
    fieldCtrl = new FieldController("slider", input, validate);

    // push initial value into the Semantic UI element, required for slider as it has 0 as default
    svelteToInput(value, true);
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

<span class="InitSlider" style:display={children ? "contents" : "none"} bind:this={span}
    >{@render children?.()}</span
>

<style>
</style>
