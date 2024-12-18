<svelte:options runes={true} />

<script lang="ts">
import { InitCalendar, InitForm, isoDate, rule } from "@svelte-gear/svelte-semantic-ui";

import svelteLogo from "./img/svelte.svg";
import viteLogo from "./img/vite.svg";
import semanticLogo from "./img/semantic.png";

// const calendarText = (window as any).jQuery.fn.calendar.settings.text;
// console.log("SEMANTIC CALENDAR TEXT", calendarDefaults.read().text);

let validate: boolean = $state(false);
let dat: Date | undefined = $state();
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
    <p>
        This project uses <a href="https://www.npmjs.com/package/@svelte-gear/svelte-semantic-ui">
            svelte-semantic-ui
        </a> library to integrate Semantic UI into the Svelte app. It utilizes Vite to compile the application
        and doesn't require Svelte Kit. jQuery and Semantic UI are loaded statically.
    </p>

    <div class="ui divider"></div>

    <form class="ui form">
        <InitForm active={validate} />

        <div class="field">
            <label for="_"> Semantic UI Date Picker: </label>
            <div class="ui calendar">
                <div class="ui input right icon">
                    <i class="dropdown icon"></i>
                    <input type="text" placeholder="Date" />
                </div>
            </div>
            <InitCalendar
                bind:value={dat}
                validate={rule.empty()}
                settings={{ type: "date", maxDate: new Date() }}
            />
        </div>
        <p>Selected date value: <b>{isoDate(dat)}</b></p>

        <div class="ui divider"></div>

        <div class="ui checkbox">
            <input type="checkbox" id="ch" bind:checked={validate} />
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
main {
    width: 360px;
}
</style>
