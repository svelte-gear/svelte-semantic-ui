<!-- <svelte:options runes={true} /> -->
<svelte:options runes={true} />

<script lang="ts">
// form/+page.svelte
// Sample form page with components, data binding, and validation.

// eslint-disable-next-line import/no-unresolved, import/extensions
import { page } from "$app/state";
import {
    sticky,
    InitForm,
    rule,
    InitDropdown,
    InitTextInput,
    InitCheckbox,
    validateForm,
} from "../../lib";
// eslint-disable-next-line @typescript-eslint/naming-convention
import ShowCode from "../show-code.svelte";

const options: string[] = ["1", "2", "3", "4", "5"];

// REACTIVE -------------------------------------------------------------------
/* eslint-disable prefer-const */

let rank: string = $state("");
let teams: string[] = $state([]);
let country: string = $state("");
let gender: string = $state("");
let chb: boolean = $state(false);
let test: string = $state("");

let example: string = $state("");

// form validation
let active: boolean = $state(true);
let valid: boolean = $state(false);
let errors: string[] = $state([]);

/* Hide or show inputs */
let showGender: boolean = $state(true);

let json: string = $derived(
    JSON.stringify({
        rank: rank,
        teams: teams,
        country: country,
        gender: gender,
        agree: chb,
        test: test,
        errors: errors,
    })
        .replace(/,"/g, ', "')
        .replace("{", "{ ")
        .replace("}", " }")
);

/* eslint-enable */

$effect(() => {
    const hash: string = page.url.hash;
    if (hash.length > 1) {
        example = hash.slice(1);
    }
});

$effect(() => {
    void teams;
    // adding to multi-select ids done one item at a time
    console.log(`inspect: teams [${teams.toString()}]`);
});

function reset(): void {
    rank = "1";
    teams = ["1", "2", "3"];
    country = "ar";
    gender = "";
    chb = true;
    test = "abc";
}
reset();

function toggleActive(): void {
    active = !active;
}
</script>

<!------------------------------------------------------------------------------------------------>

<main>
    <h1>Select</h1>

    <!-- https://github.com/noahsalvi/svelte-use-form -->

    <div style:max-width="360px" style:margin="0 auto" style:text-align="left">
        <form class="ui form">
            <InitForm
                active={active}
                bind:valid={valid}
                bind:errors={errors}
                settings={{
                    // keyboardShortcuts: false,
                    inline: true,
                    on: "change",
                    autoCheckRequired: true,
                    // fields: { xx3: "empty" },
                }}
            />

            {#if example === ""}
                <div class="ui right rail" id="side">
                    <div class="ui segment sticky" use:sticky={{ offset: 10 }}>
                        <!-- <h1>Data bindings</h1> -->
                        <div class="ui message" style:font-family="monospace">
                            {json}
                        </div>
                        <button class="ui button blue" type="button" onclick={reset}>
                            Reset
                        </button>
                        <button
                            class="ui button icon"
                            class:yellow={!active}
                            class:green={active && valid}
                            class:red={active && !valid}
                            type="button"
                            onclick={toggleActive}
                        >
                            {#if active}
                                Validating
                                <i class="icon" class:check={valid} class:close={!valid}></i>
                            {:else}
                                Validate
                            {/if}
                        </button>
                        <button class="ui icon button" onclick={validateForm} aria-label="reload">
                            <i class="icon redo"></i>
                        </button>
                        <div class="ui message error"></div>
                    </div>
                </div>
            {/if}

            <!--
                   dP                     dP
                   88                     88
 .d8888b. .d8888b. 88 .d8888b. .d8888b. d8888P
 Y8ooooo. 88ooood8 88 88ooood8 88'  `""   88
       88 88.  ... 88 88.  ... 88.  ...   88
 `88888P' `88888P' dP `88888P' `88888P'   dP

            -->

            <!-- example-select -->
            <div class="field" id="r1">
                <label for="_"> Rank 1 </label>
                <select class="ui selection dropdown">
                    {#each options as m}
                        <option value={m}>Number {m}</option>
                    {/each}
                </select>
                <InitDropdown
                    bind:value={rank}
                    validate={[rule.not("1")]}
                    settings={{
                        clearable: true,
                    }}
                />
            </div>
            <div class="help_text">
                single select with 'clear' option -
                <ShowCode file="select" component="select" bind:selected={example} />
            </div>
            <!-- example-select -->

            <!-- example-select_2 -->
            <div class="field">
                <label for="_"> Rank 2 </label>
                <InitDropdown
                    bind:value={rank}
                    validate={[rule.not("1")]}
                    settings={{
                        clearable: true,
                    }}
                >
                    <select class="ui selection dropdown">
                        {#each options as m}
                            <option value={m}>Number {m}</option>
                        {/each}
                    </select>
                </InitDropdown>
            </div>
            <div class="help_text">
                single select with 'clear' option -
                <ShowCode file="select" component="select_2" bind:selected={example} />
            </div>
            <!-- example-select_2 -->

            <!-- example-multiselect -->
            <div class="field">
                <label for="_"> Teams </label>
                <select class="ui selection dropdown fluid" multiple>
                    {#each options as m}
                        <option value={m}>Num {m}</option>
                    {/each}
                </select>
                <InitDropdown
                    bind:value={teams}
                    validate={[rule.empty(), rule.doesntContainExactly("4")]}
                />
            </div>
            <div class="help_text">
                multi-select -
                <ShowCode file="select" component="multiselect" bind:selected={example} />
            </div>
            <!-- example-multiselect -->

            <!--
       dP                                  dP
       88                                  88
 .d888b88 88d888b. .d8888b. 88d888b. .d888b88 .d8888b. dP  dP  dP 88d888b.
 88'  `88 88'  `88 88'  `88 88'  `88 88'  `88 88'  `88 88  88  88 88'  `88
 88.  .88 88       88.  .88 88.  .88 88.  .88 88.  .88 88.88b.88' 88    88
 `88888P8 dP       `88888P' 88Y888P' `88888P8 `88888P' 8888P Y8P  dP    dP
                            88
                            dP
            -->

            <!-- example-select_with_flags -->
            <div class="field">
                <label for="_"> Country </label>
                <div class="ui search selection dropdown" id="country">
                    <input type="hidden" />
                    <i class="dropdown icon"></i>
                    <div class="default text">Select Country</div>
                    <div class="menu">
                        <div class="item" data-value="af">
                            <i class="af flag"></i> Afghanistan
                        </div>
                        <div class="item" data-value="al">
                            <i class="al flag"></i> Albania
                        </div>
                        <div class="item" data-value="dz">
                            <i class="dz flag"></i> Algeria
                        </div>
                        <div class="item" data-value="ao">
                            <i class="ao flag"></i> Angola
                        </div>
                        <div class="item" data-value="ar">
                            <i class="ar flag"></i> Argentina
                        </div>
                    </div>
                </div>
                <InitDropdown
                    bind:value={country}
                    settings={{
                        fullTextSearch: "exact",
                    }}
                />
            </div>
            <div class="help_text">
                decorated dropdown with search -
                <ShowCode file="select" component="select_with_flags" bind:selected={example} />
            </div>
            <!--
                includes hidden input, icon, and div for text display;
                data is supplied in .menu > .item structure
            -->
            <!-- example-select_with_flags -->

            <div class="ui divider"></div>

            <div style="float:right">
                <div class="ui checkbox">
                    <input type="checkbox" bind:checked={showGender} />
                    <label for="_">Show gender</label>
                </div>
                <InitCheckbox />
            </div>

            {#if showGender}
                <!-- example-select_with_JS -->
                <div class="field">
                    <!-- class:error={gender == "male"} -->
                    <label for="_"> Gender </label>
                    <div class="ui selection dropdown">
                        <input type="hidden" />
                        <i class="dropdown icon"></i>
                        <div class="default text"></div>
                    </div>
                    <InitDropdown
                        bind:value={gender}
                        validate={[rule.not("male")]}
                        settings={{
                            values: [
                                { name: "Male", value: "male" },
                                { name: "Female", value: "female" },
                            ],
                        }}
                    />
                </div>
                <div class="help_text">
                    dropdown with options from array -
                    <ShowCode file="select" component="select_with_JS" bind:selected={example} />
                </div>
                <!--
                    includes hidden input, icon, and div for text display,
                    values are supplied from JS
                -->
                <!-- example-select_with_JS -->

                <!-- example-select_with_JS_2 -->
                <div class="field">
                    <!-- class:error={gender == "male"} -->
                    <label for="_"> Gender </label>
                    <InitDropdown
                        bind:value={gender}
                        validate={[rule.not("male")]}
                        settings={{
                            values: [
                                { name: "Male", value: "male" },
                                { name: "Female", value: "female" },
                            ],
                        }}
                    >
                        <div class="ui selection dropdown">
                            <input type="hidden" />
                            <i class="dropdown icon"></i>
                            <div class="default text"></div>
                        </div>
                    </InitDropdown>
                </div>
                <div class="help_text">
                    dropdown with options from array -
                    <ShowCode file="select" component="select_with_JS_2" bind:selected={example} />
                </div>
                <!-- example-select_with_JS_2 -->

                <!-- example-checkbox -->
                <div class="field">
                    <div class="ui checkbox">
                        <input type="checkbox" bind:checked={chb} />
                        <label for="ch"> I Agree </label>
                    </div>
                    <InitCheckbox validate={[rule.checked()]} />
                </div>
                <div class="help_text">
                    single checkbox -
                    <ShowCode file="select" component="checkbox" bind:selected={example} />
                </div>
                <!-- example-checkbox -->
            {/if}

            <div class="ui divider"></div>

            <!--
          dP                         dP       dP
          88                         88       88
 .d8888b. 88d888b. .d8888b. .d8888b. 88  .dP  88d888b. .d8888b. dP.  .dP
 88'  `"" 88'  `88 88ooood8 88'  `"" 88888"   88'  `88 88'  `88  `8bd8'
 88.  ... 88    88 88.  ... 88.  ... 88  `8b. 88.  .88 88.  .88  .d88b.
 `88888P' dP    dP `88888P' `88888P' dP   `YP 88Y8888' `88888P' dP'  `dP

-->

            <!-- example-radio -->
            <div class="field">
                <div class="ui radio checkbox">
                    <input type="radio" bind:group={gender} value="male" />
                    <label for="_">Male</label>
                </div>
                <InitCheckbox />
                &nbsp;
                <div class="ui radio checkbox">
                    <input type="radio" bind:group={gender} value="female" />
                    <label for="_">Female</label>
                </div>
                <InitCheckbox />
            </div>
            <div class="help_text">
                radio checkboxes -
                <ShowCode file="select" component="radio" bind:selected={example} />
            </div>
            <!-- example-radio -->

            <!-- example-checkbox_group -->
            <div class="field">
                Teams: &nbsp;
                {#each options as m}
                    <div class="ui checkbox">
                        <input type="checkbox" bind:group={teams} value={m} />
                        <label for="_">{m}</label>
                    </div>
                    &nbsp; &nbsp;
                {/each}
            </div>
            <div class="help_text">
                checkbox group -
                <ShowCode file="select" component="checkbox_group" bind:selected={example} />
            </div>
            <!-- example-checkbox_group -->

            <!--
 oo                              dP
                                 88
 dP 88d888b. 88d888b. dP    dP d8888P
 88 88'  `88 88'  `88 88    88   88
 88 88    88 88.  .88 88.  .88   88
 dP dP    dP 88Y888P' `88888P'   dP
             88
             dP
-->

            <!-- example-input -->
            <div class="field">
                <label for="_"> Test 1 </label>
                <input />
                <InitTextInput bind:value={test} validate={[rule.empty()]} />
            </div>
            <div class="field">
                <label for="_"> Test 2 </label>
                <input bind:value={test} />
                <InitTextInput validate={[rule.empty()]} />
            </div>
            <div class="help_text">
                bind in Init and directly -
                <ShowCode file="select" component="input" bind:selected={example} />
            </div>
            <!-- example-input -->

            <div></div>
        </form>
    </div>
</main>

<style>
form {
    padding: 0.75rem;
    background-color: #f7f7f7;
}

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
</style>
