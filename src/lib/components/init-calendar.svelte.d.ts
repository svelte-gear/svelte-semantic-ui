/**
 * Svelte Component &lt;InitCalendar&gt;
 * @module components/<InitCalendar>
 */

import type { Snippet, Component } from "svelte";
import type { CalendarSettings } from "../data/semantic-types";
import type { RuleDefinition } from "../data/common";

/**
 * Svelte data binder and initializer for Semantic UI Calendar component.
 * ```
 * <div class="ui calendar">
 *     <div class="ui input right icon">
 *         <i class="clock outline icon" />
 *         <input type="text" placeholder="Time" />
 *     </div>
 * </div>
 * <InitCalendar bind:value={alarm} options={{ type: "time" }} />
 * ```
 * `value` binding uses Date type, which may represent calendar 'date', 'time', or 'datetime'.
 * In 'date' or 'time' mode the calendar updates only the corresponding portion of the Date object.
 *
 * `settings` prop allows to customize the Semantic component,
 * see https://fomantic-ui.com/modules/calendar.html#/settings for details.
 *
 * `validate` prop accepts an array of Semantic UI form validation rules,
 * see https://fomantic-ui.com/behaviors/form.html#/examples for more information.
 * Validator function will receive the formatted text (not Date object).
 *
 * InitCalendar should follow the Semantic UI component (div.ui.calendar).
 * The library may be configured to accept InitCalendar as a parent or a child on the Semantic UI calendar.
 * Optional `forId` prop allows to put InitCalendar in a any location.
 */

/* eslint-disable @typescript-eslint/naming-convention, @typescript-eslint/ban-types */
/* prettier-ignore */
declare const InitCalendar: Component<{
    /** Two-way binding for setting and reading back the Calendar date, time, or datetime */
    value: Date | undefined;

    /** Settings for Semantic UI component, see https://fomantic-ui.com/modules/calendar.html#/settings */
    settings?: CalendarSettings;

    /** Optional field value validator. Uses Semantic UI form validation syntax.
    See https://fomantic-ui.com/behaviors/form.html#/examples.
    To avoid typos, use `rules` helper from `data/helpers.ts` {@link data/helpers.rule}. */
    validate?: RuleDefinition;

    /** Id of the Semantic UI input element, takes precendence over tag position */
    forId?: string;

    /** If InitCalendar is used as a parent, render the children components */
    children?: Snippet;
}, {}, "value">;
/* eslint-enable */

export default InitCalendar;
