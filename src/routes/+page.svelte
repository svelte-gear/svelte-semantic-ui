<script lang="ts">
// +page.svelte
// Home page, allows to change locale.

import { dropdown, Data } from "$lib";
import { applyLocale, supportedLocales } from "./i18n/extra-locales";
import { readLocaleCookie, saveLocaleCookie } from "./i18n/locale-cookie";

const currLocale: string = readLocaleCookie() ?? "";
let locale: string = currLocale;

$: {
    void (async () => {
        if (locale && locale !== currLocale) {
            await applyLocale(locale);
            saveLocaleCookie(locale);
            location.reload();
        }
    })();
}
</script>

<h1>Welcome to your library project</h1>

<br />

<form>
    <select class="ui selection dropdown" use:dropdown={{ clearable: true }}>
        <Data bind:selected={locale} />
        {#each supportedLocales() as locStr}
            <option value={locStr}>{locStr}</option>
        {/each}
    </select>
</form>

<p>value = {locale}</p>
