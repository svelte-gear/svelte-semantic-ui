<script lang="ts">
// routes/+layout.svelte

// eslint-disable-next-line import/extensions
import { page } from "$app/stores";
</script>

<div class="app-layout">
    <nav class="ui buttons">
        <a href="/" class="ui button basic">Home</a>
        <a href="/dialog" class="ui button basic">Dialog</a>
        <a href="/form" class="ui button basic">Form</a>
        <a href="/about" class="ui button basic">About</a>
        <a href="/xxx" class="ui button basic">Wrong</a>
    </nav>
    <div class="ui divider" />

    <slot />

    <div class="ui divider" />
    <p class="footer">Sample App, &nbsp; <i>location</i> = {$page.route.id}</p>
</div>

<style>
/* FIXME: move global to css file */
:global(body) {
    padding: 0 !important;
}

:global(main) {
    min-height: 200px;
}

/* hide LastPass icons*/
:global(#__lpform_input_idx_1_icon),
:global(#__lpform_input_idx_2_icon),
:global(#__lpform_input_idx_3_icon),
:global(#__lpform_input_idx_4_icon),
:global(#__lpform_input_idx_5_icon) {
    display: none;
}

div.app-layout {
    text-align: center;
    /* padding: 1rem; */
    /* margin: 0 auto; */
    max-width: 360px;
    width: 100%;
    /* background-color: antiquewhite; */
}

/* :global prevent removal of "unused" .active */
nav :global(a.active) {
    font-weight: bold !important;
    color: black;
}

@media (max-width: 639px) {
    div.app-layout {
        min-width: 240px;
    }
}
</style>
