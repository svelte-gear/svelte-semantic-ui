<!--
@component
Svelte data binder and initializer for Semantic-UI `Rating` components.
(see detailed description in init-rating.svelte.d.ts )
-->
<svelte:options runes={true} />

<script lang="ts">
import type { Snippet } from "svelte";
import { onMount, onDestroy, tick } from "svelte";

import type { RatingSettings, JQueryApi, RuleDefinition } from "../data/semantic-types";
import { compLog } from "../data/common";
import { copyParentKey, findComponent } from "../data/dom-jquery";
import { FieldController } from "../data/field-controller";

const FIELD_PREFIX: string = "f_rating";
const INITIAL_RATING_VALUE: number = 0;

interface Props {
    value: number;
    settings?: RatingSettings;
    validate?: RuleDefinition;
    forId?: string;
    children?: Snippet;
}

// REACTIVE -------------------------------------------------------------------
/* eslint-disable prefer-const */

let {
    value = $bindable(INITIAL_RATING_VALUE),
    settings = undefined,
    validate = undefined,
    forId = undefined,
    children = undefined,
}: Props = $props();

/** Invisible dom element created by this component. */
let span: Element | undefined = undefined;

/* eslint-enable */

// DATA -----------------------------------------------------------------------

interface RatingApi {
    rating(settings: RatingSettings): void;
    rating(command: "set rating", val: number): void;
    rating(command: "get rating"): number;
    rating(command: "destroy"): void;
}
/** jQuery slider component */
let elem: (JQueryApi & RatingApi) | undefined = undefined;

/** Hidden input for form validation */
let input: JQueryApi | undefined = undefined;

/** Field descriptor and validator */
let fieldCtrl: FieldController | undefined = undefined;

// FIXME: implement isEmpty check for rating

// FUNCTIONS ------------------------------------------------------------------

/** Propagate prop change to UI component */
function svelteToInput(newValue: number, forceUpdate?: boolean): void {
    if (!elem) {
        // effect and svelteToInput may be called before onMount()
        return;
    }
    const val: number = elem.rating("get rating");
    if (newValue !== val || forceUpdate) {
        compLog.log(`Rating (${fieldCtrl?.key}) : value -> ${newValue}`);
        elem.rating("set rating", newValue);
        input!.val(`${newValue}`);
        void fieldCtrl?.revalidate();
    }
}

/** The effect rune calls svelteToInput when prop value changes */
$effect(() => {
    void value;
    svelteToInput(value);
});

/** Update rules when the validate value changes. Fire a change event to trigger revalidation if deemed appropriate. */
$effect(() => {
    void validate;
    fieldCtrl?.replaceRules(validate);
});

//-----------------------------------------------------------------------------

/** When input value changes, modify the svelte prop */
function inputToSvelte(inputValue: number): void {
    if (!input) {
        throw new Error("Rating is not initialized");
    }
    // store in the prop only if the value is different
    if (value !== inputValue) {
        compLog.log(`Rating (${fieldCtrl?.key}) : value <- ${inputValue}`);
        value = inputValue;
        input.val(`${inputValue}`);
        void fieldCtrl?.revalidate();
    }
}

/** The callback function is calls inputToSvelte when rating value is changed by user. */
// eslint-disable-next-line no-undef
function onRatingChange(this: JQuery<HTMLElement>, newValue: number): void {
    // user-specified handler for this component
    if (settings && settings.onRate) {
        settings.onRate.call(this, newValue);
    }
    // update data binding
    inputToSvelte(newValue);
}

//-----------------------------------------------------------------------------

onMount(async () => {
    // delay initialization till form controller is ready
    await tick();

    // Initialize Semantic component and subscribe for changes
    elem = findComponent(span!, ".ui.rating", forId) as JQueryApi & RatingApi;
    if (!elem.slider) {
        throw new Error("Semantic rating is not initialized");
    }
    elem.rating({
        ...settings,
        onRate: onRatingChange,
    });

    // Add hidden input to enable slider value validation
    elem.append('<input type="hidden" />');
    input = elem.find("input");
    copyParentKey(input, elem, FIELD_PREFIX);

    // apply validation rule if the rule is supplied in <InitSlider >
    fieldCtrl = new FieldController("rating", input, validate);

    // push initial value into the Semantic UI element, required for rating as it has 0 as default
    svelteToInput(value, true);
});

/** Remove the subscription */
onDestroy(() => {
    if (fieldCtrl) {
        fieldCtrl.removeRules();
    }
    if (elem) {
        elem.rating("destroy");
    }
});
</script>

<span class="InitRating" style:display={children ? "contents" : "none"} bind:this={span}
    >{@render children?.()}</span
>

<style>
</style>
