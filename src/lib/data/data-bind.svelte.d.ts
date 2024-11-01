import { SvelteComponent } from "svelte";
import type { DataTypes, RuleDefinition } from "./common";

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
    value?: DataTypes; // TODO: Explain the diffrence with bind:value on the input e;ement

    /** Optional value validator. Uses Semantic UI validator syntax.
    The same as {@link components/use-validate}.
    Ususally takes the value generated with {@link data/helpers.rule}. */
    validate?: RuleDefinition;

    /** Id of the input element, takes precendence over tag position */
    forId?: string;
}

// eslint-disable-next-line @typescript-eslint/naming-convention
declare const Data: SvelteComponent<Props, never, never>;
export default Data;
