<script>
/* eslint-disable @typescript-eslint/typedef */
/* eslint-disable no-undef-init */
/* eslint-disable import/no-mutable-exports */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { calendar, Data, DateFmt, format, rule } from "@svelte-gear/svelte-semantic-ui";

export let name;

// @ts-ignore
let dat = undefined;
</script>

/** eslint-disable @typescript-eslint/no-unsafe-call */ /** eslint-disable
@typescript-eslint/no-unsafe-call */
<main>
    <h1>Hello {name}!</h1>
    <p>
        Visit the
        <a href="https://svelte.dev/tutorial">Svelte tutorial</a>
        to learn how to build Svelte apps.
    </p>

    <div class="field" id="y">
        <label for="_">
            Relative date <span class="explain">(not in future)</span>
        </label>
        <div
            class="ui calendar"
            use:calendar={{
                type: "date",
                maxDate: new Date(),
            }}
        >
            <Data bind:date={dat} />
            <div class="ui input right icon">
                <i class="dropdown icon"></i>
                <input type="text" placeholder="Date" />
            </div>
        </div>
    </div>

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
    </div>
</main>

<style>
main {
    text-align: center;
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;
}

h1 {
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 4em;
    font-weight: 100;
}

@media (min-width: 640px) {
    main {
        max-width: none;
    }
}
</style>
