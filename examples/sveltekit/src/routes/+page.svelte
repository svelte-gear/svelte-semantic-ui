<svelte:options runes={true} />

<script lang="ts">
// form/+page.svelte
// Sample form page with components, data binding, and validation.

// import { number, reach } from "yup";
import {
    checkbox,
    InitDropdown,
    InitCalendar,
    InitSlider,
    InitForm,
    rule,
    isoDate,
    getLocale,
    InitNumberInput,
} from "@svelte-gear/svelte-semantic-ui";

const options: string[] = ["1", "2", "3", "4", "5"];

let selectedStr: string | undefined = $state();
let rating: number = $state(0);
let teams: string[] = $state([]);
let dat: Date | undefined = $state();
let income: number | undefined = $state();
let gender: string = $state("male");
let chb: boolean = $state(false);

function reset(): void {
    selectedStr = "one";
    teams = ["1", "2", "3"];
    gender = "male";
    income = 12345;
    chb = true;
    dat = undefined;
    rating = 3;
}
reset();

// eslint-disable-next-line prefer-const
let json: string = $derived(
    JSON.stringify({
        select: selectedStr ?? "",
        multi_select: teams,
        date: `${isoDate(dat)}`,
        income: income ?? "",
        gender: gender,
        agree: chb,
        slider: rating,
    })
        .replace(/,"/g, ', "')
        .replace("{", "{ ")
        .replace("}", " }")
);

let active: boolean = $state(false);
function toggleActive(): void {
    active = !active;
}
let valid: boolean = $state(false);
</script>

<!------------------------------------------------------------------------------------------------>

<div class="app-layout">
    <h1>
        <img src="favicon.png" alt="logo" />
        Svelte Semantic UI
    </h1>

    <p>
        This project uses <a href="https://www.npmjs.com/package/@svelte-gear/svelte-semantic-ui">
            svelte-semantic-ui
        </a> library to integrate Semantic UI into the Svelte app. It utilizes Svelte Kit to compile
        the application. jQuery and Semantic UI are loaded statically.
    </p>

    <p>
        The app tries to configure Semantic UI to use your browser locale, defaults to international
        English.<br />
        It is curremtly set to <b>{getLocale()}</b>
    </p>

    <!------------------------------------------------------------------------------------------------>

    <h1>Form sample</h1>

    <div style:max-width="360px" style:margin="0 auto" style:text-align="left">
        <form class="ui form">
            <InitForm
                active={active}
                bind:valid={valid}
                settings={{
                    // keyboardShortcuts: false,
                    inline: true,
                }}
            />

            <div class="field">
                <label for="numb3"> Select </label>
                <select id="numb3" class="ui selection dropdown">
                    <option value="one">One</option>
                    <option value="two">Two</option>
                    <option value="three">Three</option>
                </select>
                <InitDropdown
                    bind:value={selectedStr}
                    settings={{
                        clearable: true,
                    }}
                />
            </div>

            <div class="field" id="x">
                <label for="numb2"> Multi-select </label>
                <select id="numb2" class="ui selection dropdown fluid" multiple>
                    {#each options as m}
                        <option value={m}>Num {m}</option>
                    {/each}
                </select>
                <InitDropdown bind:value={teams} validate={[rule.empty()]} />
            </div>

            <div class="field" id="y">
                <label for="_"> Date </label>
                <div class="ui calendar">
                    <div class="ui input right icon">
                        <i class="dropdown icon"></i>
                        <input type="text" placeholder="Date" />
                    </div>
                </div>
                <InitCalendar
                    bind:value={dat}
                    validate={[rule.empty()]}
                    settings={{
                        type: "date",
                        maxDate: new Date(),
                    }}
                />
            </div>

            <div class="field">
                <label for="fn2"> Currency </label>
                <input type="text" name="first-name" id="fn2" />
                <InitNumberInput
                    bind:value={income}
                    validate={[rule.empty()]}
                    settings={{ type: "money" }}
                />
            </div>

            <div class="ui divider"></div>

            <div class="field">
                <div class="ui radio checkbox" use:checkbox>
                    <input type="radio" id="ch1" bind:group={gender} value="male" />
                    <label for="ch1">Male</label>
                </div>
                &nbsp;
                <div class="ui radio checkbox" use:checkbox>
                    <input type="radio" id="ch2" bind:group={gender} value="female" />
                    <label for="ch2">Female</label>
                </div>
            </div>

            <div class="field">
                <div class="ui checkbox" use:checkbox>
                    <input type="checkbox" id="ch" bind:checked={chb} />
                    <label for="ch">Agreed to the terms of use</label>
                </div>
            </div>

            <div class="field">
                {#each options as m}
                    <div class="ui checkbox">
                        <input type="checkbox" id="ch{m}" bind:group={teams} value={m} />
                        <label for="ch{m}">{m}</label>
                    </div>
                    &nbsp; &nbsp;
                {/each}
            </div>

            <div class="ui divider"></div>

            <div class="field">
                <label for="sl"> Slider </label>
                <div id="sl" class="ui labeled ticked slider bottom aligned"></div>
                <InitSlider
                    bind:value={rating}
                    validate={[rule.not("1"), rule.not("2"), rule.not("3")]}
                    settings={{ min: 0, max: 10 }}
                />
            </div>
            &nbsp;
        </form>
    </div>

    <h1>Form data</h1>

    <div class="data">
        <div class="ui message" style:font-family="monospace">
            {json}
        </div>
        <button class="ui button blue" type="button" onclick={reset}> Reset </button>
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
        <!-- <div class="ui message error"></div> -->
    </div>
    &nbsp;
</div>

<style>
div.app-layout {
    text-align: center;
    max-width: 360px;
    width: 100%;
}
@media (max-width: 639px) {
    div.app-layout {
        min-width: 240px;
    }
}
form {
    padding: 0.75rem;
    background-color: #f7f7f7;
}
img {
    margin-top: 1rem;
    margin-right: 1rem;
    height: 60px;
}
p {
    text-align: left;
    padding-left: 10px;
}
.data {
    max-width: 200px;
    margin: 0 auto;
}
</style>
