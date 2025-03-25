/**
 * Svelte Component &lt;InitDateInput&gt;
 * @module components/<InitDateInput>
 */

import type { Snippet, Component } from "svelte";
import type { CalendarSettings, RuleDefinition } from "../data/semantic-types";
import type { DateFormatter } from "../data/format-date";

/**
 * Svelte data binder and initializer for Date input.
 *
 * Type of `value` binding is Date, if an invalid text is entered into the input, value is null.
 *
 * Input have two different ways to bind data`:` <br />
 * `value` binding in the `<input>` gets raw text value and is updated immediately. <br />
 * `value` binding in `<InitDateInput>` gets parsed Date | null and is updated on blur.
 * ```
 * <input type="text" id="birthday" />
 * <InitDateInput bind:value={dob} settings={{ type: "date" }} />
 * ```
 *
 * `settings` prop allows to customize the input formatter, it uses the same settings as
 * Semantic UI Calendar, see https://fomantic-ui.com/modules/calendar.html#/settings
 *
 * `validate` prop accepts an array of Semantic UI form validation rules,
 * see https://fomantic-ui.com/behaviors/form.html#/examples for more information.
 * Validator function will receive the formatted text (not Date object).
 *
 * InitDateInput should follow the input.
 * The library may be configured to accept InitDateInput as a parent or a child on the input.
 * Optional `forId` prop allows to put InitDateInput in a any location.
 */

/* eslint-disable @typescript-eslint/naming-convention, @typescript-eslint/ban-types */
/* prettier-ignore */
declare const InitDateInput: Component<{
    /** Two-way binding for setting and reading back the Date value */
    value: Date | null;

    /** Settings for date formatter, see https://fomantic-ui.com/modules/calendar.html#/settings */
    settings?: CalendarSettings;

    /** Optional field value validator. Uses Semantic UI form validation syntax.
    See https://fomantic-ui.com/behaviors/form.html#/examples.
    To avoid typos, use `rules` helper from `data/helpers.ts` {@link data/helpers.rule}. */
    validate?: RuleDefinition;

    /** In most cases you should use the default locale-aware formatter with `settings`.
    Optional custom formatter may be used to implement non-standard formats or additional parsing logic.
    It will override `settings`, don't use both at the same time. */
    customFormatter?: DateFormatter;

    /** Id of the Semantic UI input element, takes precedence over tag position */
    forId?: string;

    /** If InitDateInput is used as a parent, render the children components */
    children?: Snippet;
}, {}, "value">;
/* eslint-enable */

export default InitDateInput;
