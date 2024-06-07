<script lang="ts">
// +page.svelte
// Home page, allows to change locale.

import { dropdown, Data } from "$lib";

import { applyLocale, supportedLocales } from "../lib/i18n";
import { readLocaleCookie, saveLocaleCookie } from "../locale-info";

let currLocale: string = readLocaleCookie() ?? "";
let newLocale: string = currLocale;

$: {
    void (async () => {
        if (newLocale && newLocale !== currLocale) {
            await applyLocale(newLocale);
            saveLocaleCookie(newLocale);
            currLocale = newLocale;
        }
    })();
}
</script>

<h1>Home</h1>
<p><b>Svelte Semantic UI</b> - demo and test pages</p>

<p>
    <a href="https://svelte.dev/tutorial">Svelte</a> |
    <a href="https://semantic-ui.com/introduction/getting-started.html">Semantic UI</a> |
    <a href="https://fomantic-ui.com/introduction/getting-started.html">Fomantic UI</a>
    <br />
    <a href="https://github.com/svelte-gear/svelte-semantic-ui">GitHub</a> |
    <a href="https://www.npmjs.com/package/@svelte-gear/svelte-semantic-ui">npm</a>
</p>

<form>
    <select class="ui selection dropdown" use:dropdown={{ clearable: true }}>
        <Data bind:selected={newLocale} />
        {#each supportedLocales() as locStr}
            <option value={locStr}>{locStr}</option>
        {/each}
    </select>
</form>
<p>locale = {newLocale}</p>
