/**
 * Svelte Component &lt;InitCalendar&gt;
 * @module components/<InitCalendar>
 */

import type { Snippet, Component } from "svelte";
import type { FormSettings } from "../data/semantic-types";

// Manual override for typescript declarations
// Svelte 5.1.9 & svelte kit 2.7.5, still generate ```props: Record<string, never>;```

/**
 * Provides Svelte bindings for Semantic-UI form validation.
 * <InitForm> tag must be a child of the Semantic UI form component, or follow the form.
 *
 * https://semantic-ui.com/behaviors/form.html
 * ```
 * <form class="ui form">
 *     <InitForm
 *         active={isActive}
 *         bind:valid={isValid}
 *         bind:errors={errors}
 *         settings={{ inline: true }}
 *     />
 *     ...
 * </form>
 * <p>This form {#if isValid} is good {:else} has errors {/if} </p>
 * ```
 *
 * The library may be configured to accept InitForm as a parent of the Semantic UI form.
 * Optional `forId` prop allows to put InitForm in a any location.
 */

/* eslint-disable @typescript-eslint/naming-convention, @typescript-eslint/ban-types */
/* prettier-ignore */
declare const InitForm: Component<{
    /** Determines if any field change will cause form re-validation. */
    active: boolean;

    /** Read-only binding indicating validation result. */
    valid?: boolean;

    /** Read-only binding for validation error messages. */
    errors?: string[];

    /** Form validation settings, see https://fomantic-ui.com/behaviors/form.html#/settings */
    settings?: FormSettings;

    /** Id of the Semantic UI form element, takes precendence over tag position */
    forId?: string;

    /** If InitForm is used as a parent, render the children components */
    children?: Snippet;
}, {}, "valid" | "errors">;
/* eslint-enable */

export default InitForm;
