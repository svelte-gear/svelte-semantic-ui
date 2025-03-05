<!-- <svelte:options runes={true} /> -->
<svelte:options runes={true} />

<script lang="ts">
import { onDestroy, onMount } from "svelte";
// dialog/+page.svelte
// Sample dialog page.

import { InitModal, InitProgress, InitRating, InitForm, rule, toast } from "../../lib";
// eslint-disable-next-line @typescript-eslint/naming-convention
import ShowCode from "../show-code.svelte";

// REACTIVE -------------------------------------------------------------------
/* eslint-disable prefer-const */

let show: boolean = $state(false);

/** Which code example is shown */
let example: string = $state("");

let progress: number = $state(1);
let progress2: number[] = $state([2, 1]);
let tot: number = $state(210);

let rating: number = $state(2.5);

/* eslint-enable */

function okFn(): void {
    console.log("dialog - ok");
}

function noFn(): void {
    console.log("dialog - no");
}

function setProgress(): void {
    progress = Math.round(Math.random() * 100);
}
function incrementProgress(): void {
    progress2[0] = 10 + Math.round(Math.random() * 80);
    progress2[1] = 10 + Math.round(Math.random() * 40);
    setProgress();
}

let iid: unknown;

onMount(() => {
    incrementProgress();

    iid = setInterval(() => {
        if (Math.random() < 0.4) {
            progress2[0] += Math.round(Math.random() * 5);
        } else {
            progress2[1] += Math.round(Math.random() * 5);
        }
        if (progress2[0] + progress2[1] > tot) {
            incrementProgress();
        }
    }, 500);
});
onDestroy(() => {
    clearInterval(iid as number);
});
</script>

<!------------------------------------------------------------------------------------------------>

<main>
    <h1>More</h1>

    <div
        style:max-width="360px"
        style:margin="0 auto"
        style:text-align="center"
        id="more"
        style="padding: 10px;"
    >
        <!-- example-toast -->
        <button
            type="button"
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
        <br /><br />
        <div class="help_text">
            display a toast in the corner of the screen
            <ShowCode file="more" component="toast" bind:selected={example} />
        </div>
        <!-- example-toast -->
        &nbsp;

        <div class="ui divider"></div>

        <!-- example-dialog -->
        <p>
            Modal dialog is {#if !show}NOT{/if} active.
        </p>
        <button
            type="button"
            class="ui button"
            onclick={() => {
                show = true;
            }}
        >
            Show Dialog
        </button>
        <br /><br />
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
        &nbsp;

        <div class="ui divider"></div>

        <!-- example-progress -->
        <p>Progress Bar</p>

        <div class="ui multiple progress">
            <div class="blue bar">
                <div class="centered progress"></div>
            </div>
            <div class="red bar">
                <div class="centered progress"></div>
            </div>
        </div>
        <InitProgress
            value={progress2}
            total={tot}
            settings={{
                precision: 0.1,
                text: { bars: ["Up", "Dw"], percent: "{bar}: {value}Mb" },
                showActivity: false, // no "wave"
                // duration: 0, // no intermediate values
            }}
        />

        <div class="ui progress">
            <div class="bar">
                <div class="progress"></div>
            </div>
            <div class="label">{progress} files uploaded</div>
        </div>
        <InitProgress value={progress} settings={{}} />
        <button type="button" class="ui button" onclick={setProgress}>Randomize</button>

        <br /><br />
        <div class="help_text">
            randomly change progress value
            <ShowCode file="more" component="progress" bind:selected={example} />
        </div>
        <!-- example-progress -->

        <div class="ui divider"></div>

        <!-- example-rating -->
        <form class="ui form">
            <InitForm validateForm={true} validateEmpty={false} settings={{ inline: true }} />
            <div class="ui field">
                <label for="_">Rating:</label>
                <div>
                    <div class="ui red rating"></div>
                    <InitRating
                        bind:value={rating}
                        settings={{ maxRating: 5, icon: "heart", clearable: true }}
                        validate={[rule.minValue(4)]}
                    />
                </div>
            </div>
            <button
                type="button"
                class="ui button"
                onclick={() => {
                    rating = 2.5;
                }}>R={rating} : reset</button
            >
        </form>
        <br /><br />
        <div class="help_text">
            reset the rating
            <ShowCode file="more" component="rating" bind:selected={example} />
        </div>
        <!-- example-rating -->
    </div>
</main>

<style>
.help_text {
    font-weight: 300;
    font-size: 80%;
    font-style: italic;
    color: grey;
    float: right;
    margin-top: -7px;
    margin-bottom: 7px;
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
