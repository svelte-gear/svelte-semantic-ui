/**
 * Svelte Component &lt;InitCalendar&gt;
 * @module components/<InitDropdown>
 */

import type { Snippet, Component } from "svelte";
import type { TextFormatSettings } from "../data/input-formatter";
import type { RuleDefinition, TextFormatter } from "../data/common";

/**
 * Svelte data binder and initializer for text input.
 *
 * Type of `value` binding is string, if an invalid text is entered into the input, value is empty string.
 *
 * Input and textarea have two different ways to bind data`:` <br />
 * `value` binding in the `<input>` / textarea gets raw text value and is updated immediately. <br />
 * `value` binding in `<InitTextInput>` gets parsed typed data and is updated on blur.
 * ```
 * <input type="text" id="name" />
 * <InitTextInput bind:value={name} settings={{ case: "upper" }} />
 * ```
 *
 * `settings` prop allows to customize the input formatter, it has the following fields:
 * ```
 *     case: "upper" | "lower" | "title",
 * ```
 * `validate` prop accepts an array of Semantic UI form validation rules,
 * see https://fomantic-ui.com/behaviors/form.html#/examples for more information.
 *
 * InitTextInput should follow the input.
 * The library may be configured to accept InitTextInput as a parent or a child on the input.
 * Optional `forId` prop allows to put InitTextInput in a any location.
 */

/* eslint-disable @typescript-eslint/naming-convention, @typescript-eslint/ban-types */
/* prettier-ignore */
declare const InitDropdown: Component<{
    /** Two-way binding for setting and reading back the selected item or array of items */
    value?: string;

    /** Settings for date formatter, see https://fomantic-ui.com/modules/calendar.html#/settings */
    settings?: TextFormatSettings;

    /** Optional field value validator. Uses Semantic UI form validation syntax.
    See https://fomantic-ui.com/behaviors/form.html#/examples.
    To avoid typos, use `rules` helper from `data/helpers.ts` {@link data/helpers.rule}. */
    validate?: RuleDefinition;

    /** Optional formatter is used to implement custom formats or text processing.
    It will override `settings`, don't use both at the same time. */
    formatter?: TextFormatter;

    /** Id of the Semantic UI input element, takes precendence over tag position */
    forId?: string;

    /** If InitTextInput is used as a parent, render the children components */
    children?: Snippet;
}, {}, "value">;
/* eslint-enable */

export default InitDropdown;
