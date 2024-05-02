<script lang="ts">
// routes/dialog/+page.svelte

import { modal, Data } from "$lib";
import { behavior, ModalBehavior } from "../../lib/use-behavior";

let show: boolean = true;

// const ctrl = {} as { modal: SemanticCommand };
const ctrl = new ModalBehavior();

function okFn() {
    console.log("ok");
}
function noFn() {
    console.log("no");
}

$: console.log(`SHOW : ${show}`);
</script>

<main>
    <h1>Home</h1>

    <p>
        Visit the
        <a href="https://svelte.dev/tutorial">Svelte tutorial</a>
        to learn how to build Svelte apps.
    </p>
    <p>
        Modal is {#if !show}NOT{/if} active
    </p>
    <button
        class="ui button"
        on:click={() => {
            show = true;
        }}
    >
        show = true
    </button>
    <button
        class="ui button basic"
        on:click={() => {
            ctrl.show();
        }}
    >
        ctrl.show()
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
        use:behavior={ctrl}
        use:modal={{
            onApprove: okFn,
            onDeny: noFn,
            closable: false,
        }}
    >
        <Data bind:active={show} />
        <div class="ui icon header">
            <i class="archive icon" />
            Archive Old Messages
        </div>
        <div class="content">
            <p id="x3">
                Your inbox is getting full, would you like us to enable automatic archiving of old
                messages?
            </p>
            <p>
                Modal is {#if !show}NOT{/if} active
            </p>
        </div>
        <div class="actions">
            <div class="ui red basic cancel inverted button">
                <i class="remove icon" />
                No
            </div>
            <div class="ui green ok inverted button">
                <i class="checkmark icon" />
                Yes
            </div>
        </div>
    </div>
</main>
