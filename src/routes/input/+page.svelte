<svelte:options runes={true} />

<script lang="ts">
// form/+page.svelte
// Sample form page with components, data binding, and validation.

// eslint-disable-next-line import/no-unresolved, import/extensions
import { page } from "$app/state";

import {
    popup,
    sticky,
    InitForm,
    rule,
    InitSlider,
    InitNumberInput,
    isoDate,
    InitDateInput,
    InitTextInput,
    InitCheckbox,
} from "../../lib";

// eslint-disable-next-line @typescript-eslint/naming-convention
import ShowCode from "../show-code.svelte";

// REACTIVE -------------------------------------------------------------------
/* eslint-disable prefer-const */

let dat: Date | undefined = $state();
let income: number | undefined = $state();
let incomeRaw: string = $state("");
let text3: string = $state("");
let text4: string = $state("");
let text5: string = $state("");
// let list: string[] = $state([]);
let ratings: number[] = $state([]);

/* Hide or show slider */
let showSlider: boolean = $state(true);

/** Which example to show */
let example: string = $state("");

// form validation
let active: boolean = $state(true);
let valid: boolean = $state(false);

let json: string = $derived(
    JSON.stringify({
        date: isoDate(dat),
        income: income !== undefined ? income : "",
        incomeRaw: incomeRaw,
        text: text3,
        input: text4,
        input_live: text5,
        ratings: ratings.join(","),
        // list: list,
    })
        .replace(/,"/g, ', "')
        .replace("{", "{ ")
        .replace("}", " }")
);

/* eslint-enable */

$effect(() => {
    const hash: string = page.url.hash;
    if (hash.length > 1) {
        example = hash.slice(1);
    }
});

function reset(): void {
    dat = new Date("2022-02-01 13:00");
    income = 12345;
    text3 = "";
    text4 = "";
    ratings = [0, 5];
    // list = ["A", "b"];
}

reset();

function toggleActive(): void {
    active = !active;
}
</script>

<!------------------------------------------------------------------------------------------------>

<main>
    <h1>Input</h1>

    <!-- https://github.com/noahsalvi/svelte-use-form -->

    <div style:max-width="360px" style:margin="0 auto" style:text-align="left">
        <form class="ui form">
            <InitForm
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
 oo                              dP
                                 88
 dP 88d888b. 88d888b. dP    dP d8888P
 88 88'  `88 88'  `88 88    88   88
 88 88    88 88.  .88 88.  .88   88
 dP dP    dP 88Y888P' `88888P'   dP
             88
             dP
            -->

            <!-- example-date -->
            <div class="field">
                <label for="_"> Date Input </label>
                <input type="text" placeholder="date" />
                <InitDateInput
                    bind:value={dat}
                    validate={[rule.empty(), rule.minValue("2024-01-01")]}
                    settings={{ formatter: { date: "MMMM DD, YYYY" } }}
                />
            </div>
            <div class="help_text">
                date formatter -
                <ShowCode file="input" component="date" bind:selected={example} />
            </div>
            <!-- example-date -->

            <!-- example-money -->
            <div class="field">
                <label for="_"> Income </label>
                <input type="text" placeholder="money" bind:value={incomeRaw} />
                <InitNumberInput
                    bind:value={income}
                    validate={[rule.empty(), rule.minValue(20000), rule.maxValue(100000)]}
                    settings={{ type: "money" /* , precision: -2 */ }}
                />
            </div>
            <div class="help_text">
                money formatter -
                <ShowCode file="input" component="money" bind:selected={example} />
            </div>
            <!--
                <InitNumberInput bind:value> returns parsed number value,
                while <input bind:value> return formatted text.
            -->

            <!-- example-money -->

            <!-- example-text -->
            <div class="field">
                <label for="_"> Text Area </label>
                <textarea placeholder="describe" rows="3"></textarea>
                <InitTextInput
                    bind:value={text3}
                    validate={[rule.empty(), rule.contains("X"), rule.size(3, 6)]}
                    settings={{
                        charset: "ascii",
                        // charset: "id_hex",
                        // case: "upper",
                        // blockEmoji: true,
                        // list: true,
                        // listSeparator: "\n",
                        // maxLen: 2,
                    }}
                />
            </div>
            <div class="help_text">
                text, uppercase formatter -
                <ShowCode file="input" component="text" bind:selected={example} />
            </div>
            <!-- example-text -->

            <!-- example-input -->
            <div class="field">
                <label for="g4"> Text Input </label>
                <input type="text" name="text-4" placeholder="describe" bind:value={text5} />
                <InitTextInput bind:value={text4} settings={{ case: "lower" }} />
            </div>
            <div class="help_text">
                input, lowercase formatter -
                <ShowCode file="input" component="input" bind:selected={example} />
            </div>
            <!-- example-input -->

            <!-- example-number -->
            <div class="ui field">
                <label for="_"> Rating Input </label>
                <input
                    type="text"
                    placeholder="enter rank"
                    use:popup={{
                        content: "this input shares data bind with the slider",
                        position: "bottom right",
                    }}
                />
                <InitNumberInput bind:value={ratings[0]} validate={[rule.minValue(6)]} />
            </div>
            <div class="help_text">
                number formatter -
                <ShowCode file="input" component="number" bind:selected={example} />
            </div>
            <!-- uses {ratings} array -->
            <!-- example-number -->

            <!--
          dP oo       dP
           88          88
  d8888b. 88 dP .d888b88 .d8888b. 88d888b.
 Y8ooooo. 88 88 88'  `88 88ooood8 88'  `88
       88 88 88 88.  .88 88.  ... 88
 `88888P' dP dP `88888P8 `88888P' dP

            -->
            <div class="ui divider"></div>

            <div style="float:right">
                <div class="ui checkbox">
                    <input type="checkbox" bind:checked={showSlider} class="ui checkbox" />
                    <label for="_">Show Sliders</label>
                </div>
                <InitCheckbox />
            </div>

            {#if showSlider}
                <!-- example-slider -->
                <div class="field">
                    <label for="_"> Rating Slider </label>
                    <div class="ui labeled ticked slider bottom aligned"></div>
                    <InitSlider
                        settings={{ min: 0, max: 10 }}
                        bind:value={ratings[0]}
                        validate={[rule.not("0"), rule.not("1")]}
                    />
                </div>
                <div class="help_text">
                    number with slider UI -
                    <ShowCode file="input" component="slider" bind:selected={example} />
                </div>
                <!-- uses {ratings} array -->
                <!-- example-slider -->

                <!-- example-range_slider -->
                <div class="field">
                    <label for="_"> Rating Slider </label>
                    <div class="ui labeled ticked slider bottom aligned range"></div>
                    <InitSlider
                        settings={{ min: 0, max: 10 }}
                        bind:value={ratings}
                        validate={[rule.not("1,3")]}
                    />
                </div>
                <div class="help_text">
                    number with slider UI -
                    <ShowCode file="input" component="range_slider" bind:selected={example} />
                </div>
                <!-- example-range_slider -->
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
    margin-top: -7px;
    margin-bottom: 7px;
}

.ui.divider {
    clear: both;
}
</style>
