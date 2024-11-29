<!-- <svelte:options runes={true} /> -->
<svelte:options runes={true} />

<script lang="ts">
// form/+page.svelte
// Sample form page with components, data binding, and validation.

// eslint-disable-next-line import/no-unresolved, import/extensions
import { page } from "$app/stores";

import {
    sticky,
    calendar,
    formValidation,
    Data,
    FormValidator,
    DateFmt,
    format,
    rule,
    InitCalendar,
} from "../../lib";
import { isoDate, isoTime } from "../../lib/data/common";
// eslint-disable-next-line @typescript-eslint/naming-convention
import ShowCode from "../show-code.svelte";

// REACTIVE -------------------------------------------------------------------
/* eslint-disable prefer-const */

let dat: Date | undefined = $state();
let tim: Date | undefined = $state();
let dateText: string = $state("");

let example: string = $state("");

// form validation
let active: boolean = $state(false);
let valid: boolean = $state(false);

let json: string = $derived(
    JSON.stringify({
        date: `${isoDate(dat)}_${isoTime(dat)}`,
        time: isoTime(tim),
        text: dateText,
    })
        .replace(/,"/g, ', "')
        .replace("{", "{ ")
        .replace("}", " }")
);

/* eslint-enable */

$effect(() => {
    const hash: string = $page.url.hash;
    if (hash.length > 1) {
        example = hash.slice(1);
    }
});

// $effect(() => {
//     console.log(`nums [${teams.toString()}]`);
// });

function reset(): void {
    dat = new Date("2022-02-01 13:00");
    tim = undefined;
}
reset();

function toggleActive(): void {
    active = !active;
}
</script>

<!------------------------------------------------------------------------------------------------>

<main>
    <h1>Date</h1>

    <!-- https://github.com/noahsalvi/svelte-use-form -->

    <div style:max-width="360px" style:margin="0 auto" style:text-align="left">
        <form
            class="ui form"
            use:formValidation={{
                // keyboardShortcuts: false,
                inline: true,
                on: "change",
                autoCheckRequired: true,
            }}
        >
            <FormValidator active={active} bind:valid={valid} />

            {#if example === ""}
                <div class="ui right rail">
                    <div class="ui segment sticky" use:sticky={{ offset: 10 }}>
                        <div class="ui message" style:font-family="monospace">
                            {json}
                        </div>
                        <button class="ui button blue" type="button" onclick={reset}>
                            Reset
                        </button>
                        <button
                            class="ui button icon"
                            class:yellow={!active}
                            class:green={active && valid}
                            class:red={active && !valid}
                            type="button"
                            onclick={toggleActive}
                        >
                            {#if active}
                                Validating
                                <i class="icon" class:check={valid} class:close={!valid}></i>
                            {:else}
                                Validate
                            {/if}
                        </button>
                        <div class="ui message error"></div>
                    </div>
                </div>
            {/if}

            <!--
       dP            dP
       88            88
 .d888b88 .d8888b. d8888P .d8888b.
 88'  `88 88'  `88   88   88ooood8
 88.  .88 88.  .88   88   88.  ...
 `88888P8 `88888P8   dP   `88888P'

            -->

            <!-- example-datetime -->
            <div class="field" id="y">
                <label for="_"> Date-time 1 </label>
                <div
                    class="ui calendar"
                    use:calendar={{
                        type: "datetime",
                        maxDate: new Date(),
                    }}
                >
                    <Data bind:date={dat} />
                    <div class="ui input right icon">
                        <i class="dropdown icon"></i>
                        <input type="text" placeholder="Date" />
                    </div>
                </div>
                <div class="help_text">
                    datetime -
                    <ShowCode file="date" component="datetime" bind:selected={example} />
                </div>
            </div>
            <!--
                One <Data > component is used for all bindings
                    (Calendar, Dropdown, Slider)
                It uses different optional props for each type
                    (date, selected, position).
                Pros: One component for all data ?!
                Cons: Optional bindings, runtime checks.
            -->
            <!-- example-datetime -->

            <!-- example-datetime_2 -->
            <div class="field" id="y">
                <label for="_"> Date-time 2 </label>
                <div class="ui calendar">
                    <InitCalendar
                        bind:value={dat}
                        settings={{ type: "datetime", maxDate: new Date() }}
                    />
                    <div class="ui input right icon">
                        <i class="dropdown icon"></i>
                        <input type="text" placeholder="Date" />
                    </div>
                </div>
                <div class="help_text">
                    datetime -
                    <ShowCode file="date" component="datetime_2" bind:selected={example} />
                </div>
            </div>
            <!--
                Separate Data components for data bindings
                    (CalendarData, DropdownData, SliderData)
                They all have value prop, but it may have different type
                    (Date, number, string, string[])
                Orovides better type support and autocomplete.
            -->
            <!-- example-datetime_2 -->

            <!-- example-datetime_3 -->
            <div class="field" id="y">
                <label for="_"> Date-time 3 </label>
                <div class="ui calendar">
                    <div class="ui input right icon">
                        <i class="dropdown icon"></i>
                        <input type="text" placeholder="Date" />
                    </div>
                </div>
                <InitCalendar
                    bind:value={dat}
                    settings={{ type: "datetime", maxDate: new Date() }}
                />
                <div class="help_text">
                    datetime -
                    <ShowCode file="date" component="datetime_3" bind:selected={example} />
                </div>
            </div>
            <!--
                Initialization is done using components instead of use:action
                    ( InitCalendar, InitDropdown, InitSlider).
                Init* follows the component. Data binding is done using the same component.
            -->
            <!-- example-datetime_3 -->

            <!-- example-datetime_4 -->
            <div class="field" id="y">
                <label for="_"> Date-time 4 </label>
                <InitCalendar bind:value={dat} settings={{ type: "datetime", maxDate: new Date() }}>
                    <div class="ui calendar">
                        <div class="ui input right icon">
                            <i class="dropdown icon"></i>
                            <input type="text" placeholder="Date" />
                        </div>
                    </div>
                </InitCalendar>
                <div class="help_text">
                    datetime -
                    <ShowCode file="date" component="datetime_4" bind:selected={example} />
                </div>
            </div>
            <!--
                <InitCalendar > as a wrapper component.
            -->
            <!-- example-datetime_4 -->

            <div style="clear: both;"></div>

            <!-- example-date_and_time -->
            <div class="two fields">
                <div class="field">
                    <label for="_"> Date </label>
                    <div
                        class="ui calendar"
                        use:calendar={{
                            type: "date",
                        }}
                    >
                        <Data bind:date={dat} />
                        <div class="ui input right icon">
                            <i class="calendar outline icon"></i>
                            <input type="text" placeholder="Date" />
                        </div>
                    </div>
                </div>

                <div class="field">
                    <label for="_"> Time </label>
                    <div
                        id="x15"
                        class="ui calendar"
                        use:calendar={{
                            type: "time",
                            onChange: (date: Date, text: string, mode: string) => {
                                console.log(`time changed: ${text} | ${date} | ${mode}`);
                            },
                        }}
                    >
                        <Data bind:date={dat} validate={[rule.empty(), rule.not("00:00")]} />
                        <div class="ui input right icon" id="x16">
                            <i class="clock outline icon"></i>
                            <input type="text" placeholder="Time" />
                        </div>
                    </div>
                </div>
            </div>
            <div class="help_text">
                date and time -
                <ShowCode file="date" component="date_and_time" bind:selected={example} />
            </div>
            <!--
                if two components are bound to the same Date variable,
                each of them updates only their portion (date or time)
            -->
            <!-- example-date_and_time -->

            <!-- example-year_first -->
            <div class="field">
                <label for="_"> Year first </label>
                <div
                    class="ui calendar"
                    use:calendar={{
                        type: "date",
                        startMode: "year",
                    }}
                >
                    <Data bind:date={dat} />
                    <div class="ui input right icon">
                        <i class="calendar outline icon"></i>
                        <input type="text" placeholder="Date" />
                    </div>
                </div>
                <div class="help_text">
                    year first -
                    <ShowCode file="date" component="year_first" bind:selected={example} />
                </div>
            </div>
            <!-- example-year_first -->

            <div class="ui divider"></div>

            <!--
 oo                              dP
                                 88
 dP 88d888b. 88d888b. dP    dP d8888P
 88 88'  `88 88'  `88 88    88   88
 88 88    88 88.  .88 88.  .88   88
 dP dP    dP 88Y888P' `88888P'   dP
             88
             dP
            -->
            <!-- example-date_input -->
            <!--
                Don't use <input bind:value with formatter,
                as you would get the string value before formatting.
                And it updates only on user interaction.
                :
                <Data bind:value returns parsed value (Date, string, or number)
                instead of formatted string.
                :
                <Data validate allows to add validation rules.
                If formatter and validate are used at the same time,
                keep in mind that validator sees the formatted string,
                and not the parsed value.
                :
                Validator complaints about the wrong input, but leaves it unchanged.
                Formatter replaces you input with correct string or empties it.
            -->
            <div class="field">
                <label for="z1"> Date input </label>
                <input
                    type="text"
                    name="calendar-date"
                    placeholder="date"
                    id="z1"
                    use:format={new DateFmt()}
                />
                <Data bind:value={dat} validate={[rule.empty()]} />
                <div class="help_text">
                    date input -
                    <ShowCode file="date" component="date_input" bind:selected={example} />
                </div>
            </div>
            <!--
                this will sett time portion to 00:00
            -->
            <!-- example-date_input -->
            &nbsp;
        </form>
    </div>
</main>

<style>
form {
    padding: 0.75rem;
    background-color: #f7f7f7;
}

.help_text {
    font-weight: 300;
    font-size: 80%;
    font-style: italic;
    color: grey;
    float: right;
}

.ui.divider {
    clear: both;
}
</style>
