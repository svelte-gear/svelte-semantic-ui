<script lang="ts">
/* _eslint-disable import/no-unresolved */
/* _eslint-disable_ @typescript-eslint/naming-convention */

import {
    calendar,
    Data,
    formValidation,
    FormValidator,
    isoDate,
    rule,
} from "@svelte-gear/svelte-semantic-ui";

import svelteLogo from "./img/svelte.svg";
import viteLogo from "./img/vite.svg";
import semanticLogo from "./img/semantic.png";

let validate: boolean = false;
let dat: Date | undefined;
</script>

<main>
    <div>
        <a href="https://vitejs.dev" target="_blank" rel="noreferrer">
            <img src={viteLogo} class="logo" alt="Vite Logo" />
        </a>
        <a href="https://svelte.dev" target="_blank" rel="noreferrer">
            <img src={svelteLogo} class="logo svelte" alt="Svelte Logo" />
        </a>
        <a href="https://semantic-ui.com" target="_blank" rel="noreferrer">
            <img src={semanticLogo} class="logo" alt="SemanticUI Logo" />
        </a>
        <a
            href="https://github.com/svelte-gear/svelte-semantic-ui"
            target="_blank"
            rel="noreferrer"
        >
            <img src="favicon.png" class="logo" alt="Svelte Semantic UI Logo" />
        </a>
    </div>
    <h1>Vite + Svelte + Semantic UI</h1>

    <form class="ui form" use:formValidation>
        <FormValidator active={validate} />

        <div class="field">
            <label for="_"> Semantic UI Date Picker: </label>
            <div class="ui calendar" use:calendar={{ type: "date", maxDate: new Date() }}>
                <Data bind:date={dat} validate={rule.empty()} />
                <div class="ui input right icon">
                    <i class="dropdown icon" />
                    <input type="text" placeholder="Date" />
                </div>
            </div>
        </div>
        <p>Selected date value: {isoDate(dat)}</p>

        <hr />

        <div class="ui checkbox">
            <input type="checkbox" id="ch" bind:checked={validate} />
            <!-- TODO: Data bind for checkbox -->
            <label for="ch">validate form</label>
        </div>

        <div class="ui error message"></div>
    </form>
</main>

<style>
.logo {
    height: 6em;
    padding: 1.5em;
    will-change: filter;
    transition: filter 300ms;
}
.logo:hover {
    filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.svelte:hover {
    filter: drop-shadow(0 0 2em #ff3e00aa);
}
</style>
