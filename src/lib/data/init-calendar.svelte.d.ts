import type { Snippet } from "svelte";
import { SvelteComponentTyped } from "svelte";
import type { CalendarSettings } from "./semantic-types";

type DataTypes = string | string[] | boolean | Date | number | undefined;
type RuleObj = {
    type: string;
    prompt?: string;
};
type RuleDefinition = string | string[] | RuleObj | RuleObj[];

interface Props {
    /** Two-way binding for controlling and reading the Calendar date, time, or datetime
    - see {@link components/use-calendar} */
    value: Date | undefined;

    /** Settings for Semantic UI component */
    settings?: CalendarSettings;

    /** Optional value validator. Uses Semantic UI validator syntax.
    The same as {@link components/use-validate}.
    Ususally takes the value generated with {@link data/helpers.rule}. */
    validate?: RuleDefinition;

    /** Id of the input element, takes precendence over tag position */
    forId?: string;

    /** Render the children components, if InitCalenda is used as a parent */
    children?: Snippet;
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
export type InitCalendarProps = typeof propDef.props;
export type InitCalendarEvents = typeof propDef.events;
export type InitCalendarSlots = typeof propDef.slots;
/**
 * Svelte data binder and initializer for Semantic-UI `Calendar` components.
 * Takes `value` binding of Date type,
 * which may represent calendar date, time, or date-and-time.
 * ```
 * <div class="ui calendar">
 *     <div class="ui input right icon">
 *         <i class="clock outline icon" />
 *         <input type="text" placeholder="Time" />
 *     </div>
 * </div>
 * <InitCalendar bind:value={alarm} settings={{ type: "time" }} />
 * ```
 * NOTE: `validate` param in `<InitCalendar>` validates the formatted text (not Date object).
 */

/* eslint-disable @typescript-eslint/indent */
export default class InitCalendar extends SvelteComponentTyped<
    InitCalendarProps,
    InitCalendarEvents,
    InitCalendarSlots
> {}
/* eslint-enable */
export {};

// // eslint-disable-next-line @typescript-eslint/naming-convention
// declare const Data: Component<Props, object, "">;
// export default Data;
