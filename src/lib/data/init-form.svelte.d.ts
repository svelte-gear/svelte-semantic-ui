/**
 * Svelte Component &lt;InitForm&gt;
 * @module data/<InitForm>
 */

import type { Snippet, Component } from "svelte";
import type { FormSettings } from "./semantic-types";

// Manual override for typescript declarations
// Svelte 5.1.9 & svelte kit 2.7.5, still generate ```props: Record<string, never>;```

// Svelte 5.20.2 & svelte kit 2.17.2, properly copies Props interface, but uses deprecated SvelteComponentTyped class
// using this manual d.ts override provides better mouse-over prompt in IDE

/**
 * Svelte bindings for Semantic-UI form validation.
 *
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
 *
 * If rules are supplied in form settings, fields are matched by 'id', 'name', or 'data-validate' attribute.
 * Create `<div class="ui message error"/>` to display not-inline messages.
 */

/* eslint-disable @typescript-eslint/naming-convention, @typescript-eslint/ban-types */
/* prettier-ignore */
declare const InitForm: Component<{
    /** Determines if any field change will cause form re-validation.
     *
     *  If validateForm == true (default),
     *  all fields are validated live; `valid` and `errors` bindings are updated reactively.
     *
     *  If validateForm == false,
     *  field are validated as they are touched by the user; `valid` and `errors` bindings are undefined.
     *  For smooth validate-on-touch experience we recommend form settings: inline == true, on == "submit" (default). */
    validateForm?: boolean;

    /** Determines if empty fields are validated or not; optional, defaults to true.
     *  May be set to false to hide required fields warnings,
     *  and set back to true when user tries to submit the form. */
    validateEmpty?: boolean;

    /** Read-only binding indicating form data changes.
     *  In most cases it should be set to false by calling doResetForm(), after form data is initialized. */
    dirty?: boolean;

    /** Read-only binding indicating validation result. Is undefined if `validateForm` == false */
    valid?: boolean;

    /** Read-only binding for validation error messages. Is undefined if `validateForm` == false */
    errors?: string[];

    /** Form validation settings, see https://fomantic-ui.com/behaviors/form.html#/settings */
    settings?: FormSettings;

    /** Id of the Semantic UI form element, takes precedence over tag position */
    forId?: string;

    /** If InitForm is used as a parent, render the children components */
    children?: Snippet;
}, {}, "valid" | "errors" | "dirty">;
/* eslint-enable */

export default InitForm;
