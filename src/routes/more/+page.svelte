<!-- <svelte:options runes={true} /> -->
<svelte:options runes={true} />

<script lang="ts">
// dialog/+page.svelte
// Sample dialog page.

import { InitModal, toast } from "../../lib";
// eslint-disable-next-line @typescript-eslint/naming-convention
import ShowCode from "../show-code.svelte";

// REACTIVE -------------------------------------------------------------------
/* eslint-disable prefer-const */

let show: boolean = $state(false);

/** Which code example is shown */
let example: string = $state("");

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

    <div style:max-width="360px" style:margin="0 auto" style:text-align="center" id="more">
        <!-- example-toast -->
        <button
            class="ui button"
            onclick={() => {
                toast({
                    class: "success",
                    title: "Congratulations!",
                    message: "You're using the good framework!",
                    displayTime: 3000,
                });
            }}
        >
            Show Toast
        </button>
        <br />
        <div class="help_text">
            display a toast in the corner of the screen
            <ShowCode file="more" component="toast" bind:selected={example} />
        </div>
        <!-- example-toast -->

        <div class="ui divider"></div>

        <!-- example-dialog -->
        <p>
            Modal dialog is {#if !show}NOT{/if} active.
        </p>
        <button
            class="ui button"
            onclick={() => {
                show = true;
            }}
        >
            Show Dialog
        </button>
        <div class="help_text">
            display a dialogue and receive a callback
            <ShowCode file="more" component="dialog" bind:selected={example} />
        </div>

        <div id="md" class="ui basic modal">
            <div class="ui icon header">
                <i class="archive icon"></i>
                Archive Old Messages
            </div>
            <div class="content">
                <p id="x3">Your inbox is getting full, enable automatic archiving?</p>
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
        <!-- example-dialog -->
    </div>
</main>

<style>
.help_text {
    font-weight: 300;
    font-size: 80%;
    font-style: italic;
    color: grey;
    float: right;
}

.ui.divider {
    clear: both;
}

:global(#more .ui.right.rail) {
    left: auto;
    right: 1rem;
    top: 1rem;
    width: 600px;
    text-align: left;
}
:global(#more .ui.right.rail textarea) {
    width: 100%;
}
</style>
