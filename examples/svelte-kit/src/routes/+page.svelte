<script lang="ts">
// +page.svelte
// Home page, allows to change locale.

import type { Writable } from "svelte/store";
import { writable } from "svelte/store";
import { dropdown, Data, applyLocale, supportedLocales } from "@svelte-gear/svelte-semantic-ui";

import { readLocaleCookie, saveLocaleCookie } from "../locale-info";
import { loadTranslations, locale, locales, t } from "../sveltekit-i18n";

const currLocale: string = readLocaleCookie() ?? "";
let newLocale: string = currLocale;

// TODO: check why prettier isn't working in the subproject

$: {
    void (async () => {
        if (newLocale && newLocale !== currLocale) {
            await applyLocale(newLocale);
            const lang: string = newLocale.split("-")[0];
            if (locales.get().includes(lang)) {
                console.log(`Loading ${lang} translations`);
                await loadTranslations(lang);
            } else {
                console.log("Loading default translations");
                await loadTranslations("en");
            }
            saveLocaleCookie(newLocale);
        }
    })();
}

const link: string = "https://kit.svelte.dev";
const count: Writable<number> = writable(3);
</script>

<h1>{$t("welcome-to-your-lib")}</h1>

<br />

<form>
    <select class="ui selection dropdown" use:dropdown={{ clearable: true }}>
        <Data bind:selected={newLocale} />
        {#each supportedLocales() as locStr}
            <option value={locStr}>{locStr}</option>
        {/each}
    </select>
</form>
<p>value = {newLocale}</p>

<h1>{$t("cont.title")}</h1>
<p>
    {$t("translation-locales")}
    {#each $locales as locStr}
        <span>
            &nbsp;
            {#if locStr === $locale}
                <b><u>{locStr}</u></b>
            {:else}
                {locStr}
            {/if}
        </span>
    {/each}
</p>
<p>{$t("cont.text", { link: link })}</p>

{$t("menu.notification", { count: $count })}
