/**
 * Svelte Component &lt;InitSlider&gt;
 * @module components/<InitSlider>
 */

import type { Snippet, Component } from "svelte";
import type { SliderSettings, RuleDefinition } from "../data/semantic-types";

/**
 * Svelte data binder and initializer for Semantic UI `Slider` component.
 * ```
 * <div class="ui labeled ticked slider"></div>
 * <InitSlider bind:value={rating} settings={{ min: 0, max: 10 }} />
 * ```
 * `value` binding is number for simple slider and number[] for range slider.
 *
 * `settings` prop allows to customize the Semantic component,
 * see https://fomantic-ui.com/modules/slider.html#/settings for details.
 *
 * `validate` prop accepts an array of Semantic UI form validation rules,
 * see https://fomantic-ui.com/behaviors/form.html#/examples for more information.
 * Validator function will receive the formatted text (not Date object).
 *
 * InitSlider should follow the Semantic UI component (div.ui.slider).
 * The library may be configured to accept InitSlider as a parent or a child on the Semantic UI slider.
 * Optional `forId` prop allows to put InitSlider in a any location.
 */

/* eslint-disable @typescript-eslint/naming-convention, @typescript-eslint/ban-types */
/* prettier-ignore */
declare const InitSlider: Component<{
    /** Two-way binding for setting and reading back the slider value */
    value: number | number[];

    /** Settings for Semantic UI component, see https://fomantic-ui.com/modules/slider.html#/settings */
    settings?: SliderSettings;

    /** Optional field value validator. Uses Semantic UI form validation syntax.
    See https://fomantic-ui.com/behaviors/form.html#/examples.
    To avoid typos, use `rules` helper from `data/helpers.ts` {@link data/helpers.rule}. */
    validate?: RuleDefinition;

    /** Id of the Semantic UI input element, takes precedence over tag position */
    forId?: string;

    /** If InitCalendar is used as a parent, render the children components */
    children?: Snippet;
}, {}, "value">;
/* eslint-enable */

export default InitSlider;
