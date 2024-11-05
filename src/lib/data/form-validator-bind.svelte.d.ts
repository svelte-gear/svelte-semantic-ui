import { SvelteComponentTyped } from "svelte";

interface Props {
    /** Determines if any field change will cause form re-validation. */
    active: boolean;

    /** Read-only binding indicating validation result. */
    valid?: boolean;

    /** Read-only binding for validation error messages. */
    errors?: string[];
}

declare const propDef: {
    props: Props;
    events: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        [evt: string]: CustomEvent<any>;
    };
    // eslint-disable-next-line @typescript-eslint/ban-types
    slots: {};
};
export type FormValidatorBindProps = typeof propDef.props;
export type FormValidatorBindEvents = typeof propDef.events;
export type FormValidatorBindSlots = typeof propDef.slots;
/**
 * Provides Svelte bindings for Semantic-UI Form validator or Yup validator.
 * In both cases the <FormValidationData> tag must be a child of the Semantic UI form component.
 *
 * https://semantic-ui.com/behaviors/form.html
 *
 * https://github.com/jquense/yup
 *
 * Example:
 * ```
 * <form calss="ui form" use:formValidation={{ inline: true }}>
 *     <FormValidationData // TODO FormValidator
 *         active={isActive}
 *         bind:valid={isValid}
 *         bind:errors={errors}
 *     />
 *     ...
 * </form>
 * <p>This form {#if isValid} is good {:else} has errors {/if} </p>
 * ```
 */

/* eslint-disable @typescript-eslint/indent */
export default class FormValidatorBind extends SvelteComponentTyped<
    FormValidatorBindProps,
    FormValidatorBindEvents,
    FormValidatorBindSlots
> {}
/* eslint-enable */

export {};

// // eslint-disable-next-line @typescript-eslint/naming-convention
// declare const FormValidator: Component<Props, object, "">;
// export default FormValidator;
