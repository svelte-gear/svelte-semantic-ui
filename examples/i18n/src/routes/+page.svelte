<svelte:options runes={true} />

<script lang="ts">
// +page.svelte
// Home page, allows to change locale.

import { tick } from "svelte";
import type { Writable } from "svelte/store";
import { writable } from "svelte/store";
import {
    dropdown,
    Data,
    applyLocale,
    supportedLocales,
    calendar,
    MoneyFmt,
    format,
    formValidation,
} from "@svelte-gear/svelte-semantic-ui";

import { readLocaleCookie, saveLocaleCookie } from "../locale-info";
import { loadTranslations, locale, locales, t } from "../sveltekit-i18n";

let currLocale: string = readLocaleCookie() ?? "";

let newLocale: string = $state(currLocale);

let dat: Date | undefined = $state(new Date());

let income: number | undefined = $state(12345.67);

// eslint-disable-next-line prefer-const
let hide: boolean = $state(false);

// TODO: check why prettier isn't working in the subproject

export async function changeLocale(loc: string): Promise<void> {
    if (loc && loc !== currLocale) {
        await applyLocale(loc);
        const lang: string = loc.split("-")[0];
        if (locales.get().includes(lang)) {
            console.log(`Loading ${lang} translations`);
            await loadTranslations(lang);
        } else {
            console.log("Loading default translations");
            await loadTranslations("en");
        }

        // store current locale
        currLocale = loc;
        saveLocaleCookie(loc);

        // refresh ui componets
        hide = true;
        await tick();
        hide = false;
    }
}

$effect(() => {
    void changeLocale(newLocale);
});

const link: string = "https://kit.svelte.dev";
const count: Writable<number> = writable(3);

/* eslint-disable svelte/no-at-html-tags */
</script>

<h1>
    <img src="/sveltekit-i18n.png" alt="logo" />
    {$t("cont.title")}
</h1>
<p>{@html $t("cont.text", { link: link })}</p>

<div class="ui divider"></div>

<table width="100%">
    <tbody>
        <tr>
            <td>
                <label for="loc_select">{$t("select-your-locale")}</label>
            </td>
            <td>
                <form>
                    <select
                        class="ui selection dropdown"
                        use:dropdown={{ clearable: true }}
                        id="loc_select"
                    >
                        <Data bind:selected={newLocale} />
                        {#each supportedLocales().sort() as locStr}
                            <option value={locStr}>{locStr}</option>
                        {/each}
                    </select>
                </form>
            </td>
        </tr>
        <tr>
            <td>
                {$t("translation-locales")}
            </td>
            <td>
                &nbsp;{newLocale}&nbsp;&nbsp;&rightarrow;
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
            </td>
        </tr>
    </tbody>
</table>

<div class="ui divider"></div>

<button
    class="ui circular compact button"
    onclick={() => {
        $count = Math.max($count - 1, 0);
    }}
>
    &ndash;
</button>
{$t("menu.notification", { count: $count })}
<button
    class="ui circular compact button"
    onclick={() => {
        $count = $count + 1;
    }}
>
    +
</button>

<div class="ui divider"></div>

{#if !hide}
    <form class="ui form" use:formValidation>
        <div class="field">
            <label for="fn1">{$t("field.date")}</label>
            <div class="ui calendar" use:calendar id="fn1">
                <Data bind:date={dat} /><!-- FIXME: THIS FREEZES THE PAGE !! -->
                <div class="ui input right icon">
                    <i class="calendar outline icon"></i>
                    <input type="text" />
                </div>
            </div>
        </div>

        <div class="field">
            <label for="fn2">{$t("field.currency")}</label>
            <input
                class="ui input"
                type="text"
                name="first-name"
                id="fn2"
                use:format={new MoneyFmt()}
            />
            <Data bind:value={income} />
        </div>
    </form>
{/if}

<style>
:global(body) {
    padding: 10px !important;
    max-width: 360px;
}
img {
    float: left;
}
label {
    text-align: left;
}
</style>
