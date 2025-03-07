<!-- <svelte:options runes={true} /> -->
<svelte:options runes={true} />

<script lang="ts">
// +page.svelte
// Home page, allows to change locale.

import { getLocale } from "../lib/i18n";

// region data ------------------------------------------------------------------------------------
/* eslint-disable prefer-const */

let newLocale: string = $state(getLocale());

/* eslint-enable */
</script>

<!------------------------------------------------------------------------------------------------>
<!--
    // region html
-->
<main>
    <h1>Home</h1>
    <p><b>Svelte Semantic UI</b> - demo and test pages</p>

    Libraries:
    <ul>
        <li><a href="https://svelte.dev/tutorial">Svelte</a></li>
        <li><a href="https://semantic-ui.com/introduction/getting-started.html">Semantic UI</a></li>
        <li><a href="https://fomantic-ui.com/introduction/getting-started.html">Fomantic UI</a></li>
    </ul>

    Project:
    <ul>
        <li><a href="https://github.com/svelte-gear/svelte-semantic-ui">GitHub</a></li>
        <li><a href="https://www.npmjs.com/package/@svelte-gear/svelte-semantic-ui">npm</a></li>
        <li><a href="api/index.html">API docs</a></li>
    </ul>
</main>
<div class="ui divider"></div>
<p>Semantic UI locale = {newLocale}</p>

<style>
/*
    // region css
*/
main {
    text-align: left;
    padding: 0 10px;
}
h1 {
    text-align: center;
}
</style>
