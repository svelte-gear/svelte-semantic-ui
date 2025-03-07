<svelte:options runes={true} />

<script lang="ts">
// form/+page.svelte
// Sample form page with components, data binding, and validation.

import { onMount, tick } from "svelte";
// eslint-disable-next-line import/no-unresolved, import/extensions
import { page } from "$app/state";

import {
    sticky,
    InitForm,
    rule,
    InitCalendar,
    InitDateInput,
    InitCheckbox,
    doValidateForm,
    popup,
    getFormController,
} from "../../lib";
import { isoDate, isoTime } from "../../lib/data/common";
// eslint-disable-next-line @typescript-eslint/naming-convention
import ShowCode from "../show-code.svelte";

// region data ------------------------------------------------------------------------------------

/* eslint-disable prefer-const */ /* reactive */

let dat1: Date | undefined = $state();
let dat2: Date | undefined = $state();
let dateText: string = $state("");

/* Hide or show slider */
let showDate: boolean = $state(true);

/** Which code example is shown */
let example: string = $state("");

// form validation
let active: boolean = $state(false);
let vEmpty: boolean = $state(true);
let dirty: boolean = $state(false);
let valid: boolean = $state(false);
let errors: string[] = $state([]);

let json: string = $derived(
    JSON.stringify({
        date1: `${isoDate(dat1)}_${isoTime(dat1)}`,
        date2: `${isoDate(dat1)}_${isoTime(dat2)}`,
        text: dateText,
        x: "----------------",
        active: active,
        empty: vEmpty,
        dirty: dirty,
        valid: valid,
        errors: errors,
    })
        .replace(/,"/g, ', "')
        .replace("{", "{ ")
        .replace("}", " }")
);

/* eslint-enable */

// region init ------------------------------------------------------------------------------------

$effect(() => {
    const hash: string = page.url.hash;
    if (hash.length > 1) {
        example = hash.slice(1);
    }
});

async function loadData(): Promise<void> {
    dat1 = new Date("2022-02-01 13:00");
    dat2 = undefined;

    // wait for fields to initialize
    await tick();
    // remember default values for proper 'dirty' state
    getFormController("form").doResetForm();
}

function toggleActive(): void {
    active = !active;
}

function resetErrors(): void {
    getFormController("form").doResetForm();
}

onMount(async () => {
    console.info("before loadData");
    await loadData();
    console.info("after loadData");
});
</script>

<!------------------------------------------------------------------------------------------------>

<main>
    <h1>Date</h1>

    <!-- https://github.com/noahsalvi/svelte-use-form -->

    <div style:max-width="360px" style:margin="0 auto" style:text-align="left">
        <!--
            // region form
        -->
        <form class="ui form">
            <InitForm
                validateForm={active}
                validateEmpty={vEmpty}
                bind:dirty={dirty}
                bind:valid={valid}
                bind:errors={errors}
                settings={{
                    inline: false,
                }}
            />

            {#if example === ""}
                <div class="ui right rail">
                    <div class="ui segment sticky" use:sticky={{ offset: 10 }}>
                        <h2>Data bindings</h2>
                        <div class="ui message" style:font-family="monospace">
                            {json}
                        </div>
                        <!--
                            // region :    buttons
                        -->
                        <button type="button" class="ui button blue" onclick={loadData}>
                            Reset
                        </button>
                        <button
                            type="button"
                            class="ui button icon"
                            class:yellow={!active}
                            class:green={active && valid}
                            class:red={active && !valid}
                            onclick={toggleActive}
                        >
                            {#if active}
                                {valid ? "Valid" : "Invalid"}
                                <i class="icon" class:check={valid} class:close={!valid}></i>
                            {:else}
                                Validate
                            {/if}
                        </button>
                        <button
                            type="button"
                            class="ui icon button"
                            class:yellow={vEmpty}
                            onclick={() => {
                                vEmpty = !vEmpty;
                            }}
                            aria-label="empty fields"
                            use:popup={{ content: vEmpty ? "validating empty" : "ignoring empty" }}
                        >
                            {#if vEmpty}
                                <i class="icon compress"></i>
                            {:else}
                                <i class="icon expand"></i>
                            {/if}
                        </button>
                        {#if !active || true}
                            <button
                                type="button"
                                class="ui icon basic button right floated"
                                onclick={doValidateForm}
                                aria-label="revalidate"
                                use:popup={{ content: "revalidate" }}
                            >
                                <i class="icon redo"></i>
                            </button>
                            <button
                                type="button"
                                class="ui icon basic button right floated"
                                onclick={resetErrors}
                                aria-label="clear errors"
                                use:popup={{ content: "clear errors" }}
                            >
                                <i class="icon times"></i>
                            </button>
                        {/if}

                        <div class="ui message error" style="clear:both"></div>
                    </div>
                </div>
            {/if}

            <!--
                // region ex: datetime
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
                    bind:value={dat1}
                    settings={{ type: "datetime", maxDate: new Date() }}
                />
            </div>
            <div class="help_text">
                datetime -
                <ShowCode file="date" component="datetime" bind:selected={example} />
            </div>
            <!--
                'InitCalendar' follows the Semantic UI component.
            -->
            <!-- example-datetime -->

            <div style="clear: both;"></div>

            <!--
                // region ex: date & time
            -->

            <!-- example-date_and_time -->
            <div class="two fields">
                <div class="field">
                    <label for="_"> Date </label>
                    <div class="ui calendar" id="t1">
                        <InitCalendar bind:value={dat1} settings={{ type: "date" }} />
                        <div class="ui input right icon">
                            <i class="calendar outline icon"></i>
                            <input type="text" placeholder="Date" />
                        </div>
                    </div>
                </div>

                <div class="field">
                    <label for="_"> Time </label>
                    <InitCalendar
                        bind:value={dat1}
                        settings={{
                            type: "time",
                        }}
                        validate={[rule.empty(), rule.not("00:00")]}
                    >
                        <!-- onChange: (date: Date, text: string, mode: string) => {
                            console.log(`time changed: ${text} | ${date} | ${mode}`);
                        }, -->
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
                <div class="ui checkbox">
                    <input type="checkbox" bind:checked={showDate} class="ui checkbox" />
                    <label for="_">Show Date</label>
                </div>
                <InitCheckbox />
            </div>

            {#if showDate}
                <!--
                    // region ex: year first
                -->
                <!-- example-year_first -->
                <div class="field">
                    <label for="_"> Year first </label>
                    <div class="ui calendar" id="cal">
                        <div class="ui input right icon">
                            <i class="calendar outline icon"></i>
                            <input type="text" placeholder="Date" />
                        </div>
                    </div>
                </div>
                <InitCalendar
                    forId="cal"
                    settings={{ type: "date", startMode: "year" }}
                    bind:value={dat2}
                    validate={[rule.start("19")]}
                />
                <div class="help_text">
                    year first, uses forId to find Semantic component
                    <ShowCode file="date" component="year_first" bind:selected={example} />
                </div>
                <!-- example-year_first -->

                <div class="ui divider"></div>

                <!--
                    // region ex: date input
                -->
                <!-- example-date_input -->
                <div class="field">
                    <label for="z1"> Date input </label>
                    <input type="text" name="calendar-date" placeholder="date" id="z1" />
                    <InitDateInput bind:value={dat2} validate={[rule.empty()]} />
                </div>
                <div class="help_text">
                    date input -
                    <ShowCode file="date" component="date_input" bind:selected={example} />
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
/*
// region css
*/

form {
    padding: 0.75rem;
    background-color: #f7f7f7;
}

.ui.rail {
    width: 360px;
}

.help_text {
    font-weight: 300;
    font-size: 80%;
    font-style: italic;
    color: grey;
    float: right;
    margin-top: -7px;
    margin-bottom: 7px;
}

.ui.divider {
    clear: both;
}
</style>
