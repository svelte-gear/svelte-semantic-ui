<!-- <svelte:options runes={true} /> -->
<svelte:options runes={true} />

<script lang="ts">
// form/+page.svelte
// Sample form page with components, data binding, and validation.

// eslint-disable-next-line import/no-unresolved, import/extensions
import { page } from "$app/stores";

import {
    popup,
    sticky,
    formValidation,
    Data,
    FormValidator,
    MoneyFmt,
    DateFmt,
    NumberFmt,
    TextFmt,
    format,
    rule,
    slider,
    isoDate,
} from "../../lib";

// eslint-disable-next-line @typescript-eslint/naming-convention
import ShowCode from "../show-code.svelte";

// REACTIVE -------------------------------------------------------------------
/* eslint-disable prefer-const */

let dat: Date | undefined = $state();
let income: number | undefined = $state();
let text3: string = $state("");
let text4: string = $state("");
let text5: string = $state("");
let rating: number = $state(0);

let example: string = $state("");

// form validation
let active: boolean = $state(false);
let valid: boolean = $state(false);

let json: string = $derived(
    JSON.stringify({
        date: isoDate(dat),
        income: income !== undefined ? income : "",
        text: text3,
        input: text4,
        input_live: text5,
        rating: rating,
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

function reset(): void {
    dat = new Date("2022-02-01 13:00");
    income = 12345;
    text3 = "";
    text4 = "";
    rating = 3;
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
                <label for="z1">
                    Date Input <span class="explain">(format)</span>
                </label>
                <input
                    type="text"
                    name="calendar-date"
                    placeholder="date"
                    id="z1"
                    use:format={new DateFmt()}
                />
                <Data bind:value={dat} validate={[rule.empty()]} />
                <div class="help_text">
                    date formatter -
                    <ShowCode file="input" component="date" bind:selected={example} />
                </div>
            </div>
            <!-- example-date -->

            <!-- example-money -->
            <div class="field">
                <label for="fn2"> Income </label>
                <input
                    type="text"
                    name="first-name"
                    placeholder="money"
                    id="fn2"
                    use:format={new MoneyFmt()}
                />
                <Data bind:value={income} validate={[rule.empty()]} />
                <div class="help_text">
                    money formatter -
                    <ShowCode file="input" component="money" bind:selected={example} />
                </div>
            </div>
            <!-- example-money -->

            <!-- example-text -->
            <div class="field">
                <label for="g3"> Text Area </label>
                <textarea name="text-3" placeholder="describe" rows="3" id="g3"></textarea>
                <Data bind:value={text3} validate={[rule.empty(), rule.contains("X")]} />
                <div class="help_text">
                    text, uppercase formatter -
                    <ShowCode file="input" component="text" bind:selected={example} />
                </div>
            </div>
            <!--
                FIXME: why does it return data before formatting it ?
                while Rank works as expected...
            -->
            <!-- example-text -->

            <!-- example-input -->
            <div class="field">
                <label for="g4"> Text Input </label>
                <input
                    type="text"
                    name="text-4"
                    placeholder="describe"
                    id="g4"
                    use:format={new TextFmt("lower")}
                    bind:value={text5}
                />
                <Data bind:value={text4} />
                <div class="help_text">
                    inpit, lowercase formatter -
                    <ShowCode file="input" component="input" bind:selected={example} />
                </div>
            </div>
            <!--
                            why does it return data before formatting it ?
                            while Rank works as expected...
                        -->
            <!-- example-input -->

            <!-- example-number -->
            <div class="field">
                <label for="ln"> Rating Input </label>
                <input
                    id="ln"
                    type="text"
                    name="rank"
                    placeholder="entrr rank"
                    use:popup={{
                        content: "this input shares data bind with the slider",
                        position: "bottom right",
                    }}
                    use:format={new NumberFmt()}
                />
                <Data bind:value={rating} />
                <div class="help_text">
                    number formatter -
                    <ShowCode file="input" component="number" bind:selected={example} />
                </div>
            </div>
            <!-- example-number -->

            <!--
          dP oo       dP
           88          88
  d8888b. 88 dP .d888b88 .d8888b. 88d888b.
 Y8ooooo. 88 88 88'  `88 88ooood8 88'  `88
       88 88 88 88.  .88 88.  ... 88
 `88888P' dP dP `88888P8 `88888P' dP

            -->

            <!-- example-slider -->
            <div class="field">
                <label for="sl"> Rating Slider </label>
                <div
                    id="sl"
                    class="ui labeled ticked slider bottom aligned"
                    use:slider={{ min: 0, max: 10 }}
                >
                    <Data
                        forId="sl"
                        bind:position={rating}
                        validate={[rule.not("0"), rule.not("1")]}
                    />
                </div>
                <div class="help_text" style="margin-top: 5px;">
                    number with slider UI -
                    <ShowCode file="input" component="slider" bind:selected={example} />
                </div>
            </div>
            <!-- example-slider -->
            &nbsp;
        </form>
    </div>
</main>

<style>
.explain {
    font-weight: 300;
    font-style: italic;
}

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
</style>
