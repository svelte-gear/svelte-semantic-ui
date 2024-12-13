<!-- <svelte:options runes={true} /> -->
<svelte:options runes={true} />

<script lang="ts">
// dialog/+page.svelte
// Sample dialog page.

import { InitModal, toast } from "../../lib";

// REACTIVE -------------------------------------------------------------------
/* eslint-disable prefer-const */

let show: boolean = $state(false);

/* eslint-enable */

function okFn(): void {
    console.log("dialog - ok");
}

function noFn(): void {
    console.log("dialog - no");
}
</script>

<!------------------------------------------------------------------------------------------------>

<main>
    <h1>More</h1>
    <p>
        Modal dialog is
        {#if !show}NOT{/if}
        active.
    </p>
    <button
        class="ui button"
        onclick={() => {
            show = true;
        }}
    >
        Show Dialog
    </button>

    <div class="ui divider"></div>

    <button
        class="ui button"
        onclick={() => {
            toast({
                class: "success",
                title: "Congradulations!",
                message: "You're using the good framework!",
                displayTime: 3000,
            });
        }}
    >
        Show Toast
    </button>

    <div id="md" class="ui basic modal">
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
    <InitModal
        bind:show={show}
        settings={{
            onApprove: okFn,
            onDeny: noFn,
            closable: false,
        }}
    />
</main>
