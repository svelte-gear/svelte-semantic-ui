<script lang="ts">
// dialog/+page.svelte
// Sample dialog page.

import { modal, Data } from "@svelte-gear/svelte-semantic-ui";
import { t } from "../../sveltekit-i18n";
// import { behavior, ModalBehavior } from "../../lib/data/behavior";

let show: boolean = true;

// const ctrl: ModalBehavior = new ModalBehavior();

function okFn(): void {
    console.log("ok");
}
function noFn(): void {
    console.log("no");
}

$: console.log(`SHOW : ${show}`);
</script>

<main>
    <h1>{$t("nav-home")}</h1>

    <p>
        <!-- eslint-disable-next-line svelte/no-at-html-tags -->
        {@html $t("visit-svelte", { link: "https://svelte.dev/tutorial" })}
    </p>
    <p>
        {$t("modal-is-if-active", { isActive: show })}
    </p>
    <button
        class="ui button"
        on:click={() => {
            show = true;
        }}
    >
        show = true
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
            <i class="archive icon" />
            {$t("archive-old-messages")}
        </div>
        <div class="content">
            <p id="x3">
                {$t("your-inbox-is-getting-full")}
            </p>
            <p>
                {$t("modal-is-if-active", { isActive: show })}
            </p>
        </div>
        <div class="actions">
            <div class="ui red basic cancel inverted button">
                <i class="remove icon" />
                {$t("btn.no")}
            </div>
            <div class="ui green ok inverted button">
                <i class="checkmark icon" />
                {$t("btn.yes")}
            </div>
        </div>
    </div>
</main>
