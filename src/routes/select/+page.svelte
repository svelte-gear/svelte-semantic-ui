<!-- <svelte:options runes={true} /> -->
<svelte:options runes={true} />

<script lang="ts">
// form/+page.svelte
// Sample form page with components, data binding, and validation.

import { onMount, tick } from "svelte";

// eslint-disable-next-line import/no-unresolved, import/extensions
import { page } from "$app/state";
import {
    sticky,
    InitForm,
    rule,
    InitDropdown,
    InitTextInput,
    InitCheckbox,
    doValidateForm,
    popup,
    getFormController,
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
let agree: boolean | null = $state(null);
let test: string = $state("");

let example: string = $state("");

// form validation
let active: boolean = $state(true);
let vEmpty: boolean = $state(false);
let dirty: boolean = $state(false);
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
        agree: agree,
        test: test,
        x: "----------------",
        active: active,
        empty: vEmpty,
        dirty: dirty,
        valid: valid,
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

async function loadData(): Promise<void> {
    rank = "1";
    teams = ["1", "2", "3"];
    country = "ar";
    gender = "";
    agree = null;
    test = "abc";

    // wait for fields to initialize
    await tick();
    // remember default values for proper 'dirty' state
    getFormController("#form1").doResetForm();
}

function toggleActive(): void {
    active = !active;
}

function resetErrors(): void {
    getFormController("form").doResetForm();
}

onMount(async () => {
    console.info("before loadData");
    await loadData();
    console.info("after loadData");
});
</script>

<!------------------------------------------------------------------------------------------------>

<main>
    <h1>Select</h1>

    <!-- https://github.com/noahsalvi/svelte-use-form -->

    <!--
 .8888b
 88   "
 88aaa  .d8888b. 88d888b. 88d8b.d8b.
 88     88'  `88 88'  `88 88'`88'`88
 88     88.  .88 88       88  88  88
 dP     `88888P' dP       dP  dP  dP

    -->

    <div style:max-width="360px" style:margin="0 auto" style:text-align="left">
        <form class="ui form" id="form1">
            <InitForm
                validateForm={active}
                validateEmpty={vEmpty}
                bind:valid={valid}
                bind:errors={errors}
                bind:dirty={dirty}
                settings={{
                    inline: false,
                }}
            />

            {#if example === ""}
                <div class="ui right rail">
                    <div class="ui segment sticky" use:sticky={{ offset: 10 }}>
                        <h2>Data bindings</h2>
                        <div class="ui message" style:font-family="monospace">
                            {json}
                        </div>
                        <button type="button" class="ui button blue" onclick={loadData}>
                            Reset
                        </button>
                        <button
                            type="button"
                            class="ui button icon"
                            class:yellow={!active}
                            class:green={active && valid}
                            class:red={active && !valid}
                            onclick={toggleActive}
                        >
                            {#if active}
                                {valid ? "Valid" : "Invalid"}
                                <i class="icon" class:check={valid} class:close={!valid}></i>
                            {:else}
                                Validate
                            {/if}
                        </button>
                        <button
                            type="button"
                            class="ui icon button"
                            class:yellow={vEmpty}
                            onclick={() => {
                                vEmpty = !vEmpty;
                            }}
                            aria-label="empty fields"
                            use:popup={{ content: vEmpty ? "validating empty" : "ignoring empty" }}
                        >
                            {#if vEmpty}
                                <i class="icon compress"></i>
                            {:else}
                                <i class="icon expand"></i>
                            {/if}
                        </button>
                        {#if !active || true}
                            <button
                                type="button"
                                class="ui icon basic button right floated"
                                onclick={doValidateForm}
                                aria-label="revalidate"
                                use:popup={{ content: "revalidate" }}
                            >
                                <i class="icon redo"></i>
                            </button>
                            <button
                                type="button"
                                class="ui icon basic button right floated"
                                onclick={resetErrors}
                                aria-label="clear errors"
                                use:popup={{ content: "clear errors" }}
                            >
                                <i class="icon times"></i>
                            </button>
                        {/if}

                        <div class="ui message error" style="clear:both"></div>
                        &nbsp;
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
                    <input type="checkbox" />
                    <label for="_">Show gender</label>
                </div>
                <InitCheckbox bind:checked={showGender} />
            </div>
            <br />

            {#if showGender}
                <!-- example-select_with_JS -->
                <div class="field">
                    <!-- class:error={gender == "male"} -->
                    <label for="_"> Gender 1 </label>
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
                            clearable: true,
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
                    <label for="_"> Gender 2 </label>
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
                        <input type="checkbox" />
                        <label for="_"> I Agree </label>
                    </div>
                    <InitCheckbox validate={[rule.checked()]} bind:checked={agree} />
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
                <label for="_"> Gender 3 </label>
                <div class="ui radio checkbox">
                    <input type="radio" value="male" />
                    <label for="_">Male</label>
                </div>
                <InitCheckbox bind:group={gender} />
                &nbsp;
                <div class="ui radio checkbox">
                    <input type="radio" value="female" />
                    <label for="_">Female</label>
                </div>
                <InitCheckbox bind:group={gender} />

                <!-- to validate a group of radios, in the same div.field,
                     add a hidden input bound to the same state variable -->
                <input type="hidden" />
                <InitTextInput value={gender} validate={[rule.not("male")]} />
            </div>
            <div class="help_text">
                radio checkboxes -
                <ShowCode file="select" component="radio" bind:selected={example} />
            </div>
            <!-- example-radio -->

            <!-- example-checkbox_group -->
            <div class="field">
                <label for="">Teams 2</label>
                {#each options as m}
                    <div class="ui checkbox">
                        <input type="checkbox" value={m} name="tmg" />
                        <label for="_">{m}</label>
                    </div>
                    <InitCheckbox bind:group={teams} />
                    &nbsp; &nbsp;
                {/each}

                <!-- to validate a group of checkboxes, in the same div.field,
                     add a hidden input bound to the same state variable -->
                <input type="hidden" />
                <InitTextInput
                    settings={{ list: true }}
                    value={teams}
                    validate={[rule.empty(), rule.doesntContainExactly("4"), rule.maxCount(3)]}
                />
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
            <div class="field" id="xx">
                <label for="_"> Test 2 </label>
                <input value="hello" />
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

.ui.rail {
    width: 360px;
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
