/**
 * Svelte Component &lt;InitDropdown&gt;
 * @module components/<InitDropdown>
 */

import type { Snippet, Component } from "svelte";
import type { DropdownSettings } from "../data/semantic-types";
import type { RuleDefinition } from "../data/common";

/**
 * Svelte data binder and initializer for Semantic UI `Dropdown` component.
 *
 * Type of `value` binding is `string` for a select, or `string[]` for a multi-select.
 * If an invalid value is provided, select is reset, multi-select values are removed.
 * ```
 * <select class="ui selection dropdown">
 *     <option value="M">Male</option>
 *     <option value="F">Female</option>
 * </select>
 * <InitDropdown bind:value={gender} settings={{ clearable: true }} />
 * ```
 *
 * `settings` prop allows to customize the Semantic component,
 * see https://fomantic-ui.com/modules/dropdown.html#/settings for details.
 *
 * `validate` prop accepts an array of Semantic UI form validation rules,
 * see https://fomantic-ui.com/behaviors/form.html#/examples for more information.
 * Validator function will receive the formatted text (not Array object).
 * // TODO: test validation with multi-select.
 *
 * InitDropdown should follow the Semantic UI component (select or div.ui.dropdown).
 * The library may be configured to accept InitDropdown as a parent or a child on the Semantic UI dropdown.
 * Optional `forId` prop allows to put InitDropdown in a any location.
 */

/* eslint-disable @typescript-eslint/naming-convention, @typescript-eslint/ban-types */
/* prettier-ignore */
declare const InitDropdown: Component<{
    /** Two-way binding for setting and reading back the selected item or array of items */
    value: string | string[] | undefined;

    /** Settings for Semantic UI component, see https://fomantic-ui.com/modules/dropdown.html#/settings */
    settings?: DropdownSettings;

    /** Optional field value validator. Uses Semantic UI form validation syntax.
    See https://fomantic-ui.com/behaviors/form.html#/examples.
    To avoid typos, use `rules` helper from `data/helpers.ts` {@link data/helpers.rule}. */
    validate?: RuleDefinition;

    /** Id of the Semantic UI input element, takes precedence over tag position */
    forId?: string;

    /** If InitDropdown is used as a parent, render the children components */
    children?: Snippet;
}, {}, "value">;
/* eslint-enable */

export default InitDropdown;
