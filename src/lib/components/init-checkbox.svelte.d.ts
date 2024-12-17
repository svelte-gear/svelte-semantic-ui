/**
 * Svelte Component &lt;InitCalendar&gt;
 * @module components/<InitCheckbox>
 */

import type { Snippet, Component } from "svelte";
import type { CheckboxSettings } from "../data/semantic-types";
import type { RuleDefinition } from "../data/common";

/** Svelte action to initialize Semantic UI Checkbox component.
 * https://semantic-ui.com/modules/checkbox.html
 *
 * Bind directly to the input ```bind:checked```.
 * ```
 * <div class="ui checkbox">
 *     <input type="checkbox" id="ch" bind:checked={agree} />
 *     <label for="ch">Agree to terms and Conditions</label>
 * </div>
 * <InitCheckbox />
 * ```
 * Svelte allows to bind checkbox ands radio inputs in two different ways:
 * ```
 * <input type="checkbox" bind:checked={boolVal} />
 * <input type="radio" bind:checked={boolValTwo} />
 *
 * <input type="checkbox" bind:group={arrayVal} />
 * <input type="radio" bind:group={strVal} />
 * ```
 */

/* eslint-disable @typescript-eslint/naming-convention, @typescript-eslint/ban-types */
/* prettier-ignore */
declare const InitCheckbox: Component<{
    /** Settings for Semantic UI component, see https://fomantic-ui.com/modules/dropdown.html#/settings */
    settings?: CheckboxSettings;

    /** Optional field value validator. Uses Semantic UI form validation syntax.
    See https://fomantic-ui.com/behaviors/form.html#/examples.
    To avoid typos, use `rules` helper from `data/helpers.ts` {@link data/helpers.rule}. */
    validate?: RuleDefinition;

    /** Id of the Semantic UI input element, takes precendence over tag position */
    forId?: string;

    /** If InitDropdown is used as a parent, render the children components */
    children?: Snippet;
}, {}, never>;
/* eslint-enable */

export default InitCheckbox;
