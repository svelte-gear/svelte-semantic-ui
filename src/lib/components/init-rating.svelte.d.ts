/**
 * Svelte Component &lt;InitRating&gt;
 * @module components/<InitRating>
 */

import type { Snippet, Component } from "svelte";
import type { RatingSettings, RuleDefinition } from "../data/semantic-types";

/**
 * Svelte data binder and initializer for Semantic UI `Rating` component.
 * ```
 * <div class="ui rating"></div>
 * <InitRating bind:value={rating} settings={{ icon: "heart", maxRating: 5 }} />
 * ```
 * `value` binding is a number.
 *
 * `settings` prop allows to customize the Semantic component,
 * see https://fomantic-ui.com/modules/rating.html#/settings for details.
 *
 * `validate` prop accepts an array of Semantic UI form validation rules,
 * see https://fomantic-ui.com/behaviors/form.html#/examples for more information.
 * Validator function will receive the formatted text (not number).
 *
 * InitRating should follow the Semantic UI component (div.ui.rating).
 * The library may be configured to accept InitSlider as a parent or a child on the Semantic UI rating.
 * Optional `forId` prop allows to put InitRating in a any location.
 */

/* eslint-disable @typescript-eslint/naming-convention, @typescript-eslint/ban-types */
/* prettier-ignore */
declare const InitRating: Component<{
    /** Two-way binding for setting and reading back the rating value */
    value: number;

    /** Settings for Semantic UI component, see https://fomantic-ui.com/modules/rating.html#/settings */
    settings?: RatingSettings;

    /** Optional field value validator. Uses Semantic UI form validation syntax.
    See https://fomantic-ui.com/behaviors/form.html#/examples.
    To avoid typos, use `rules` helper from `data/helpers.ts` {@link data/helpers.rule}. */
    validate?: RuleDefinition;

    /** Id of the Semantic UI component, takes precedence over tag position */
    forId?: string;

    /** If InitRating is used as a parent, render the children components */
    children?: Snippet;
}, {}, "value">;
/* eslint-enable */

export default InitRating;
