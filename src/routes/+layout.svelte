<!-- <svelte:options runes={true} /> -->
<svelte:options runes={true} />

<script lang="ts">
// +layout.svelte
// Common navigation component.

// eslint-disable-next-line import/extensions, import/no-unresolved
import { page } from "$app/stores";

interface Props {
    children?: import("svelte").Snippet;
}

// eslint-disable-next-line prefer-const
let { children }: Props = $props();
</script>

<!------------------------------------------------------------------------------------------------>

<div class="app-layout">
    <nav class="ui buttons">
        <a href="/" class="ui button basic">Home</a>
        <a href="/form" class="ui button basic">Form</a>
        <a href="/dialog" class="ui button basic">Dialog</a>
    </nav>
    <div class="ui divider"></div>

    {@render children?.()}

    <div class="ui divider"></div>
    <p class="footer">Sample App, &nbsp; <i>location</i> = {$page.route.id}</p>
</div>

<!------------------------------------------------------------------------------------------------>

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
