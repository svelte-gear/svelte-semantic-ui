import { SvelteComponentTyped } from "svelte";

type DataTypes = string | string[] | boolean | Date | number | undefined;
type RuleObj = {
    type: string;
    prompt?: string;
};
type RuleDefinition = string | string[] | RuleObj | RuleObj[];

interface Props {
    /** Two-way binding for controlling and reading the Dropdown selection
    - see {@link components/use-dropdown} */
    selected?: string | string[];

    /** Two-way binding for controlling and reading the Modal state
    - see {@link components/use-modal} */
    active?: boolean;

    /** Two-way binding for controlling and reading the Calendar date, time, or datetime
    - see {@link components/use-calendar} */
    date?: Date;

    /** Two-way binding for controlling and reading the Slider value
    - see {@link components/use-slider} */
    position?: number;

    /** Two-way binding for controlling and reading input / textarea value.
    May be used together with {@link components/use-format}. */
    value?: DataTypes; // TODO: Explain the diffrence with bind:value on the input element

    /** Optional value validator. Uses Semantic UI validator syntax.
    The same as {@link components/use-validate}.
    Ususally takes the value generated with {@link data/helpers.rule}. */
    validate?: RuleDefinition;

    /** Id of the input element, takes precendence over tag position */
    forId?: string;
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
export type DataBindProps = typeof propDef.props;
export type DataBindEvents = typeof propDef.events;
export type DataBindSlots = typeof propDef.slots;
/**
 * Svelte data binder for Semantic-UI `Calendar`, `Dropdown`, `Modal`, `Slider` components;
 * as well as `input` and `textarea` elements.
 * The <Data> tag must be a child of the corresponding Semantic UI component
 * or immeditely follow the `input` or `textarea`.
 *
 * ### calendar
 * Takes `date` binding of Date type, which may represent calendar date,
 * time, or date-and-time.
 * ```
 * <div class="ui calendar" use:calendar>
 *     <Data bind:date={alarm} />
 *     <div class="ui input right icon">
 *         <i class="clock outline icon" />
 *         <input type="text" placeholder="Time" />
 *     </div>
 * </div>
 * ```
 *
 * ### dropdown
 * Type of `selected` binding is `string` for a select, or `string[]` for a multi-select.
 * If an invalid value is provided, select is reset, multi-select values are removed.
 * ```
 * <select class="ui selection dropdown" use:dropdown>
 * <Data bind:selected={gender} />
 * <option value="M">Male</option>
 * <option value="F">Female</option>
 * </select>
 * ```
 *
 * ### modal
 * Changing the boolean variable bound to `active` will show or hide the dialogue.
 * ```
 * <div id="md" class="ui modal page" use:modal>
 * <Data bind:active={show} />
 * ...
 * </div>
 * ```
 *
 * ### slider
 * Takes `position` binding of type number.
 * ```
 * <div class="ui labeled ticked slider" use:slider>
 * <Data bind:position={num} />
 * </div>
 * ```
 *
 * ### input / textarea
 * Input and textarea have two different ways to bind data`:` <br />
 * `value` binding in the `<input>` / textarea gets raw text value and is updated immediately. <br />
 * 🔥 `parsed` binding in `<Data>` gets parsed typed data and is updated on blur.
 * ```
 * <input bind:value={text} />
 * <input /><Data bind:parsed={typed} />
 * ```
 *
 * ### checkbox / radio
 * Svelte allows to bind checkbox ands radio inputs in two different ways:
 * ```
 * <input type="checkbox" bind:checked={boolVal} />
 * <input type="radio" bind:checked={boolValTwo} />
 *
 * <input type="checkbox" bind:group={arrayVal} />
 * <input type="radio" bind:group={strVal} />
 * ```
 *
 * ### validation
 * `validate` param in `<Data>` validates the formatted text (not typed data).<br />
 * For `<input>` / textarea / select `use:validate` on the element will produce the same result.
 * ```
 * <input bind:value={text} use:validate={...} />
 * <input /><Data bind:parsed={val} validate={...}>
 * ```
 */

/* eslint-disable @typescript-eslint/indent */
export default class DataBind extends SvelteComponentTyped<
    DataBindProps,
    DataBindEvents,
    DataBindSlots
> {}
/* eslint-enable */
export {};

// // eslint-disable-next-line @typescript-eslint/naming-convention
// declare const Data: Component<Props, object, "">;
// export default Data;
