/**
 * Svelte Component &lt;InitCheckbox&gt;
 * @module components/<InitCheckbox>
 */

import type { Snippet, Component } from "svelte";
import type { CheckboxSettings, RuleDefinition } from "../data/semantic-types";

/**
 * Svelte action to initialize Semantic UI `Checkbox` component.
 * https://semantic-ui.com/modules/checkbox.html
 * ```
 * <div class="ui checkbox">
 *     <input type="checkbox" id="ch" />
 *     <label for="ch">Agree to terms and Conditions</label>
 * </div>
 * <InitCheckbox bind:checked={agree} />
 * ```
 * `group` binding may be used for checkbox ands radio inputs;
 *  for multi-select group of checkboxes use `group` of type `string[]`
 * ```
 * <InitCheckbox bind:checked={boolVar} />
 * <InitCheckbox bind:group={strVar} />
 * <InitCheckbox bind:group={arrayVar} />
 * ```
 */

/* eslint-disable @typescript-eslint/naming-convention, @typescript-eslint/ban-types */
/* prettier-ignore */
declare const InitCheckbox: Component<{
    /** To-way binding for the checkbox state, null value means 'indeterminate' [-].
     *
     *  For validation purposes 'indeterminate' is treated the same as 'unchecked'. */
    checked?: boolean | null;

    /** Two-way binding for checkbox group.
     *
     * `group` bindings overrides `checked` binding, which becomes read-only */
    group?: string | string[];

    /** Settings for Semantic UI component, see https://fomantic-ui.com/modules/dropdown.html#/settings */
    settings?: CheckboxSettings;

    /** Optional field value validator. Uses Semantic UI form validation syntax.
    See https://fomantic-ui.com/behaviors/form.html#/examples.
    To avoid typos, use `rules` helper from `data/helpers.ts` {@link data/helpers.rule}. */
    validate?: RuleDefinition;

    /** Id of the Semantic UI input, takes precedence over tag position */
    forId?: string;

    /** If InitDropdown is used as a parent, render the children components */
    children?: Snippet;
}, {}, "checked" | "group">;
/* eslint-enable */

export default InitCheckbox;
