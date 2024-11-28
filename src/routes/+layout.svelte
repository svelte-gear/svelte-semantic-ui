<!-- <svelte:options runes={true} /> -->
<svelte:options runes={true} />

<script lang="ts">
// +layout.svelte
// Common navigation component.

import type { Snippet } from "svelte";
import { applyLocale, getLocale, supportedLocales } from "../lib/i18n";

interface Props {
    children: Snippet;
}

// eslint-disable-next-line prefer-const
let { children }: Props = $props();

let refresh: boolean = $state(false);

let currLocale: string = $state(getLocale());

async function apply(locale: string): Promise<void> {
    await applyLocale(locale);
    currLocale = locale;

    refresh = true;
    await Promise.resolve();
    refresh = false;
}
</script>

<!------------------------------------------------------------------------------------------------>

<div class="app-layout">
    <nav class="ui buttons">
        <a href="/" class="ui button basic">Home</a>
        <a href="/select" class="ui button basic">Select</a>
        <a href="/date" class="ui button basic">Date</a>
        <a href="/input" class="ui button basic">Input</a>
        <a href="/more" class="ui button basic">More</a>
    </nav>
    <div class="ui divider"></div>

    {#if !refresh}
        {@render children?.()}
    {/if}

    <div class="ui divider"></div>

    <a id="locale" aria-label="locale"></a>
    {#each supportedLocales().sort() as locale}
        <a href="#locale" onclick={() => apply(locale)}>
            {#if locale === currLocale}
                <b><u>{locale}</u></b>
            {:else}
                {locale}
            {/if}
        </a> &nbsp;
    {/each}
</div>

<!------------------------------------------------------------------------------------------------>

<style>
div.app-layout {
    text-align: center;
    max-width: 360px;
    width: 100%;
    padding-bottom: 10px;
}
@media (max-width: 639px) {
    div.app-layout {
        min-width: 240px;
    }
}
/* :global prevents removal of "unused" .active */
nav :global(a.active) {
    font-weight: bold !important;
    color: black;
}
:global(body) {
    padding: 0 !important;
}
:global(main) {
    min-height: 200px;
}
</style>
