<svelte:options runes={true} />

<script lang="ts">
// form/+page.svelte
// Sample form page with components, data binding, and validation.

import { onMount, tick } from "svelte";
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
    doValidateForm,
    InitDropdown,
    getFormController,
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
let ratings: number[] = $state([0, 0]); // has to be initialized as we use ratings[0] on the page
let gender: string = $state("");

/* Hide or show slider */
let showSlider: boolean = $state(true);

/* Dynamic rule set */
let dynRulesText: string = $state("");
let dynRulesChoice: string = $state("0");
let dynRules: string[] = $derived.by(() => {
    switch (dynRulesChoice) {
        case "1":
            return [rule.empty()];
        case "2":
            return [rule.maxLength(10), rule.minLength(5)];
        default:
            return [];
    }
});

/** Which example to show */
let example: string = $state("");

// form validation
let active: boolean = $state(false);
let vEmpty: boolean = $state(false);
let dirty: boolean = $state(false);
let valid: boolean | undefined = $state();
let errors: string[] | undefined = $state();

let json: string = $derived(
    JSON.stringify({
        date: isoDate(dat),
        income: income !== undefined ? income : "",
        incomeRaw: incomeRaw,
        text: text3,
        input: text4,
        input_live: text5,
        ratings: ratings.join(","),
        dynVal: dynRulesText,
        dynRules: dynRules,
        gender: gender,
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

$effect(() => {
    const hash: string = page.url.hash;
    if (hash.length > 1) {
        example = hash.slice(1);
    }
});

async function loadData(): Promise<void> {
    dat = new Date("2022-02-01 13:00");
    income = 12345;
    text3 = "";
    text4 = "";
    ratings = [0, 5];
    dynRulesText = "";
    gender = "";

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
    <h1>Input</h1>

    <!-- https://github.com/noahsalvi/svelte-use-form -->

    <!--
 .8888b
 88   "
 88aaa  .d8888b. 88d888b. 88d8b.d8b.
 88     88'  `88 88'  `88 88'`88'`88
 88     88.  .88 88       88  88  88
 dP     `88888P' dP       dP  dP  dP

    -->

    <div style:max-width="360px" style:margin="0 auto" style:text-align="left">
        <form class="ui form">
            <InitForm
                validateForm={active}
                validateEmpty={vEmpty}
                bind:dirty={dirty}
                bind:valid={valid}
                bind:errors={errors}
                settings={{
                    inline: true,
                }}
            />

            {#if example === ""}
                <div class="ui right rail">
                    <div class="ui segment sticky" use:sticky={{ offset: 10 }}>
                        <h2>Data bindings</h2>
                        <div class="ui message" style:font-family="monospace">
                            {json}
                        </div>
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
                    validate={[rule.contains("X"), rule.size(3, 6)]}
                    settings={{
                        charset: "ascii",
                        // charset: "id_hex",
                        case: "upper",
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
                <label for="_"> Text Input </label>
                <input type="text" placeholder="describe" bind:value={text5} />
                <InitTextInput
                    bind:value={text4}
                    settings={{ case: "lower" }}
                    validate={[rule.contains(".")]}
                />
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
                    <input type="checkbox" class="ui checkbox" />
                    <label for="_">Show Sliders</label>
                </div>
                <InitCheckbox bind:checked={showSlider} />
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

            <div class="ui divider"></div>

            <div class="field">
                <label for="_"> Dynamic Validation Input </label>
                <input type="text" bind:value={dynRulesText} />
                <InitTextInput validate={dynRules} />
            </div>
            <div class="field">
                <select class="ui dropdown selection"></select>
                <InitDropdown
                    bind:value={gender}
                    validate={dynRules}
                    settings={{
                        values: [
                            { name: "Male", value: "male" },
                            { name: "Female", value: "female" },
                        ],
                        clearable: true,
                    }}
                />
            </div>
            <div id="dyn-choice" class="field">
                <div class="ui radio checkbox">
                    <input type="radio" value={0} />
                    <label for="_">No rules</label>
                </div>
                <InitCheckbox bind:group={dynRulesChoice} />
                <div class="ui radio checkbox">
                    <input type="radio" value={1} />
                    <label for="_">Required</label>
                </div>
                <InitCheckbox bind:group={dynRulesChoice} />
                <div class="ui radio checkbox">
                    <input type="radio" value={2} />
                    <label for="_">Length-based</label>
                </div>
                <InitCheckbox bind:group={dynRulesChoice} />
            </div>
        </form>
    </div>
</main>

<style>
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

#dyn-choice {
    display: flex;
    justify-content: right;
    div {
        margin-left: 1rem;
    }
}
</style>
