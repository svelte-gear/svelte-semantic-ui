<!-- <svelte:options runes={true} /> -->

<script lang="ts">
import { afterUpdate } from "svelte";
// dialog/+page.svelte
// Sample dialog page.

import { modal, Data } from "../../lib";

// REACTIVE -------------------------------------------------------------------
/* eslint-disable prefer-const */

let show: boolean = true; // $state(true);

/* eslint-enable */

afterUpdate(() => {
    // $effect(() => {
    console.log(`SHOW : ${show}`);
});

function okFn(): void {
    console.log("ok");
}

function noFn(): void {
    console.log("no");
}
</script>

<!------------------------------------------------------------------------------------------------>

<main>
    <h1>Dialog</h1>
    <p>
        Modal dialog is
        {#if !show}NOT{/if}
        active.
    </p>
    <button
        class="ui button"
        on:click={() => {
            show = true;
        }}
    >
        Show Dialog
    </button>

    <!--
                           dP          dP
                           88          88
 88d8b.d8b. .d8888b. .d888b88 .d8888b. 88
 88'`88'`88 88'  `88 88'  `88 88'  `88 88
 88  88  88 88.  .88 88.  .88 88.  .88 88
 dP  dP  dP `88888P' `88888P8 `88888P8 dP

    -->
    <div
        id="md"
        class="ui basic modal"
        use:modal={{
            onApprove: okFn,
            onDeny: noFn,
            closable: false,
        }}
    >
        <Data bind:active={show} />
        <div class="ui icon header">
            <i class="archive icon"></i>
            Archive Old Messages
        </div>
        <div class="content">
            <p id="x3">
                Your inbox is getting full, would you like us to enable automatic archiving of old
                messages?
            </p>
        </div>
        <div class="actions">
            <div class="ui red basic cancel inverted button">
                <i class="remove icon"></i>
                No
            </div>
            <div class="ui green ok inverted button">
                <i class="checkmark icon"></i>
                Yes
            </div>
        </div>
    </div>
</main>
