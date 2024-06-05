<script lang="ts">
// +page.svelte
// Home page, allows to change locale.

import type { Writable } from "svelte/store";
import { writable } from "svelte/store";
import { dropdown, Data } from "$lib";
import { applyLocale, supportedLocales } from "../util/i18n/extra-locales";
import { readLocaleCookie, saveLocaleCookie } from "../util/i18n/locale-cookie";
import {
    currentLocale,
    loadTranslations,
    supportedLocales as translationLocales,
    t,
} from "../util/sveltekit-i18n";

const currLocale: string = readLocaleCookie() ?? "";
let locale: string = currLocale;

$: {
    void (async () => {
        if (locale && locale !== currLocale) {
            console.log(`Applying ${locale} locale to semantic-ui`);
            await applyLocale(locale);
            const lang: string = locale.split("-")[0];
            if (translationLocales.get().includes(lang)) {
                console.log(`Loading ${lang} translations`);
                await loadTranslations(lang);
            } else {
                console.log("Loading default translations");
                await loadTranslations("en");
            }
            saveLocaleCookie(locale);
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
        <Data bind:selected={locale} />
        {#each supportedLocales() as locStr}
            <option value={locStr}>{locStr}</option>
        {/each}
    </select>
</form>
<p>value = {locale}</p>

<h1>{$t("cont.title")}</h1>
<p>
    {$t("translation-locales")}
    {#each $translationLocales as locStr}
        <span>
            &nbsp;
            {#if locStr === $currentLocale}
                <b><u>{locStr}</u></b>
            {:else}
                {locStr}
            {/if}
        </span>
    {/each}
</p>
<p>{$t("cont.text", { link: link })}</p>

{$t("menu.notification", { count: $count })}
