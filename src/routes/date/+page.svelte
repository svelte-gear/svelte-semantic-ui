<svelte:options runes={true} />

<script lang="ts">
// form/+page.svelte
// Sample form page with components, data binding, and validation.

// eslint-disable-next-line import/no-unresolved, import/extensions
import { page } from "$app/stores";

import { sticky, FormValidation, rule, InitCalendar, checkbox, InitDateInput } from "../../lib";
import { isoDate, isoTime } from "../../lib/data/common";
// eslint-disable-next-line @typescript-eslint/naming-convention
import ShowCode from "../show-code.svelte";

// REACTIVE -------------------------------------------------------------------
/* eslint-disable prefer-const */

let dat: Date | undefined = $state();
let tim: Date | undefined = $state();
let dateText: string = $state("");

/* Hide or show slider */
let showDate: boolean = $state(true);

/** Which code example is shown */
let example: string = $state("");

// form validation
let active: boolean = $state(true);
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
        <form class="ui form">
            <FormValidation
                active={active}
                bind:valid={valid}
                settings={{
                    // keyboardShortcuts: false,
                    inline: true,
                    on: "change",
                    autoCheckRequired: true,
                }}
            />

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
                <label for="_"> Date-time </label>
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
                    <ShowCode file="date" component="datetime" bind:selected={example} />
                </div>
            </div>
            <!--
                'InitCalendar' follows the Semantic UI component.
            -->
            <!-- example-datetime -->

            <div style="clear: both;"></div>

            <!-- example-date_and_time -->
            <div class="two fields">
                <div class="field">
                    <label for="_"> Date </label>
                    <div class="ui calendar">
                        <InitCalendar bind:value={dat} settings={{ type: "date" }} />
                        <div class="ui input right icon">
                            <i class="calendar outline icon"></i>
                            <input type="text" placeholder="Date" />
                        </div>
                    </div>
                </div>

                <div class="field">
                    <label for="_"> Time </label>
                    <InitCalendar
                        bind:value={dat}
                        settings={{
                            type: "time",
                            onChange: (date: Date, text: string, mode: string) => {
                                console.log(`time changed: ${text} | ${date} | ${mode}`);
                            },
                        }}
                        validate={[rule.empty(), rule.not("00:00")]}
                    >
                        <div class="ui calendar">
                            <div class="ui input right icon" id="x16">
                                <i class="clock outline icon"></i>
                                <input type="text" placeholder="Time" />
                            </div>
                        </div>
                    </InitCalendar>
                </div>
            </div>
            <div class="help_text">
                child in date, parent in time, with event handler
                <ShowCode file="date" component="date_and_time" bind:selected={example} />
            </div>
            <!--
                two components are bound to the same Date variable,
                each of them updates only their portion (date or time)
            -->
            <!-- example-date_and_time -->

            <div class="ui divider"></div>

            <div style="float:right">
                <input type="checkbox" bind:checked={showDate} use:checkbox /> Show Date
            </div>

            {#if showDate}
                <!-- example-year_first -->
                <div class="field">
                    <label for="_"> Year first </label>
                    <div class="ui calendar" id="cal">
                        <div class="ui input right icon">
                            <i class="calendar outline icon"></i>
                            <input type="text" placeholder="Date" />
                        </div>
                    </div>
                    <div class="help_text">
                        year first, uses forId to find Semantic component
                        <ShowCode file="date" component="year_first" bind:selected={example} />
                    </div>
                </div>
                <InitCalendar
                    forId="cal"
                    settings={{ type: "date", startMode: "year" }}
                    bind:value={dat}
                    validate={[rule.start("19")]}
                />
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
                    <input type="text" name="calendar-date" placeholder="date" id="z1" />
                    <InitDateInput bind:value={dat} validate={[rule.empty()]} />
                    <div class="help_text">
                        date input -
                        <ShowCode file="date" component="date_input" bind:selected={example} />
                    </div>
                </div>
                <!--
                this will sett time portion to 00:00
            -->
                <!-- example-date_input -->
            {/if}
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
