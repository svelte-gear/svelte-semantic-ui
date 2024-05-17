<script lang="ts">
// routes/form/+page.svelte

// import { number, reach } from "yup";
import {
    checkbox,
    popup,
    sticky,
    dropdown,
    calendar,
    slider,
    toast,
    formValidation,
    Data,
    FormValidator,
    MoneyFmt,
    DateFmt,
    format,
    rule,
    fmt,
} from "$lib";

const options: string[] = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];

let rank: string;
let teams: string[];
let country: string;
let gender: string;
let income: number | undefined;
let chb: boolean;
let dat: Date | undefined;
let tim: Date | undefined;
let rating: number;

function init(): void {
    rank = "5";
    teams = ["1", "2", "3"];
    country = "ar";
    gender = "";
    income = 12345;
    chb = true;
    dat = new Date("2022-02-01 13:00");
    tim = undefined;
    rating = 3;
}
init();

function reset(): void {
    init();
    toast({
        class: "success",
        title: "Better?",
        message: "You're using the good framework!",
        displayTime: 3000,
        closeIcon: true,
    });
}

let json: string;

$: {
    json = JSON.stringify({
        rank: rank,
        teams: teams,
        country: country,
        gender: gender,
        income: income !== undefined ? income : "",
        agree: chb,
        date: `${fmt.isoDate(dat)}_${fmt.isoTime(dat)}`,
        time: fmt.isoTime(tim),
        rating: rating,
    })
        .replace(/,"/g, ', "')
        .replace("{", "{ ")
        .replace("}", " }");
}

$: console.log(`nums [${teams.toString()}]`);

let active: boolean = false;
function toggleActive(): void {
    active = !active;
}
let valid: boolean = false;
</script>

<main>
    <h1>Form sample</h1>

    <!--
 .8888b
 88   "
 88aaa  .d8888b. 88d888b. 88d8b.d8b.
 88     88'  `88 88'  `88 88'`88'`88
 88     88.  .88 88       88  88  88
 dP     `88888P' dP       dP  dP  dP

    -->

    <!-- https://github.com/noahsalvi/svelte-use-form -->

    <div style:max-width="360px" style:margin="0 auto" style:text-align="left">
        <form
            class="ui form"
            use:formValidation={{
                // keyboardShortcuts: false,
                inline: true,
            }}
        >
            <FormValidator active={active} bind:valid={valid} />

            <!--
            dP   oo          dP
            88               88
 .d8888b. d8888P dP .d8888b. 88  .dP  dP    dP
 Y8ooooo.   88   88 88'  `"" 88888"   88    88
       88   88   88 88.  ... 88  `8b. 88.  .88
 `88888P'   dP   dP `88888P' dP   `YP `8888P88
                                           .88
                                       d8888P
            -->

            <div class="ui right rail">
                <div class="ui segment sticky" use:sticky={{ offset: 10 }}>
                    <div class="ui message" style:font-family="monospace">
                        {json}
                    </div>
                    <button class="ui button blue" type="button" on:click={reset}> Reset </button>
                    <button
                        class="ui button icon"
                        class:yellow={!active}
                        class:green={active && valid}
                        class:red={active && !valid}
                        type="button"
                        on:click={toggleActive}
                    >
                        {#if active}
                            Validating
                            <i class="icon" class:check={valid} class:close={!valid} />
                        {:else}
                            Validate
                        {/if}
                    </button>
                    <div class="ui message error" />
                </div>
            </div>

            <!--
                   dP                     dP
                   88                     88
 .d8888b. .d8888b. 88 .d8888b. .d8888b. d8888P
 Y8ooooo. 88ooood8 88 88ooood8 88'  `""   88
       88 88.  ... 88 88.  ... 88.  ...   88
 `88888P' `88888P' dP `88888P' `88888P'   dP

            -->

            <div class="field">
                <label for="numb3">
                    Rank <span class="explain">(single select)</span>
                </label>
                <select
                    id="numb3"
                    class="ui selection dropdown"
                    use:dropdown={{
                        clearable: true,
                    }}
                >
                    <Data bind:selected={rank} />
                    {#each options as m}
                        <option value={m}>Number {m}</option>
                    {/each}
                </select>
            </div>

            <div class="field" id="x">
                <label for="numb2">
                    Teams <span class="explain">(multi-select)</span>
                </label>
                <select id="numb2" class="ui selection dropdown fluid" multiple use:dropdown>
                    <Data bind:selected={teams} validate={[rule.empty()]} />
                    {#each options as m}
                        <option value={m}>Num {m}</option>
                    {/each}
                </select>
            </div>

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

            <div class="field">
                <!-- the label doesn't work -->
                <label for="_">
                    Country <span class="explain">(decorated dropdown with search)</span>
                </label>

                <!-- dropdown with full text search uses Dropdown component wrapper -->
                <div
                    class="ui search selection dropdown"
                    use:dropdown={{
                        fullTextSearch: "exact",
                    }}
                >
                    <Data bind:selected={country} />
                    <input type="hidden" name="country" />
                    <i class="dropdown icon" />
                    <div class="default text">Select Country</div>
                    <div class="menu">
                        <div class="item" data-value="af"><i class="af flag" />Afghanistan</div>
                        <div class="item" data-value="ax"><i class="ax flag" />Aland Isl.</div>
                        <div class="item" data-value="al"><i class="al flag" />Albania</div>
                        <div class="item" data-value="dz"><i class="dz flag" />Algeria</div>
                        <div class="item" data-value="as"><i class="as flag" />Amer. Samoa</div>
                        <div class="item" data-value="ad"><i class="ad flag" />Andorra</div>
                        <div class="item" data-value="ao"><i class="ao flag" />Angola</div>
                        <div class="item" data-value="ai"><i class="ai flag" />Anguilla</div>
                        <div class="item" data-value="ag"><i class="ag flag" />Antigua</div>
                        <div class="item" data-value="ar"><i class="ar flag" />Argentina</div>
                        <div class="item" data-value="am"><i class="am flag" />Armenia</div>
                        <div class="item" data-value="aw"><i class="aw flag" />Aruba</div>
                        <div class="item" data-value="au"><i class="au flag" />Australia</div>
                        <div class="item" data-value="at"><i class="at flag" />Austria</div>
                        <div class="item" data-value="az"><i class="az flag" />Azerbaijan</div>
                    </div>
                </div>
            </div>

            <!-- initialized from js data -->
            <div class="field">
                <!-- class:error={gender == "male"} -->
                <label for="_">
                    Gender <span class="explain">(dropdown data from js)</span>
                </label>
                <div
                    class="ui selection dropdown"
                    use:dropdown={{
                        values: [
                            { name: "Male", value: "male" },
                            { name: "Female", value: "female" },
                        ],
                    }}
                >
                    <Data bind:selected={gender} validate={[rule.not("male")]} />
                    <input type="hidden" id="gend" />
                    <i class="dropdown icon" />
                    <div class="default text">Gender</div>
                </div>
            </div>

            <div class="ui divider" />

            <!--
       dP            dP
       88            88
 .d888b88 .d8888b. d8888P .d8888b.
 88'  `88 88'  `88   88   88ooood8
 88.  .88 88.  .88   88   88.  ...
 `88888P8 `88888P8   dP   `88888P'

            -->

            <div class="field" id="y">
                <label for="_">
                    Relative date <span class="explain">(not in future)</span>
                </label>
                <div
                    class="ui calendar"
                    use:calendar={{
                        type: "datetime",
                        maxDate: new Date(),
                    }}
                >
                    <Data bind:date={dat} />
                    <div class="ui input right icon">
                        <i class="dropdown icon" />
                        <input type="text" placeholder="Date" />
                    </div>
                </div>
            </div>

            <div class="two fields">
                <div class="field">
                    <label for="_">Absolute date <span class="explain">(year first)</span></label>
                    <div
                        class="ui calendar"
                        use:calendar={{
                            // type: "date",
                            startMode: "year",
                        }}
                    >
                        <Data bind:date={dat} />
                        <div class="ui input right icon">
                            <i class="calendar outline icon" />
                            <input type="text" placeholder="Date" />
                        </div>
                    </div>
                </div>

                <div class="field">
                    <label for="_">Time <span class="explain">(required, not 00:00)</span></label>
                    <div
                        id="x15"
                        class="ui calendar"
                        use:calendar={{
                            type: "time",
                        }}
                    >
                        <Data bind:date={tim} validate={[rule.empty(), rule.not("00:00")]} />
                        <div class="ui input right icon" id="x16">
                            <i class="clock outline icon" />
                            <input type="text" placeholder="Time" />
                        </div>
                    </div>
                </div>
            </div>

            <div class="ui divider" />

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
            <!--
<input type="text" elements may use <Data bind:value component or direct <input bind:value
<input type="checkbox" and <input type="radio" must use <input bind:checked and <input bind:group

Don't use <input bind:value with formatter, as you would get the string value before formatting.
<Data bind:value returns parsed value (Date, string, or number) instead of formatted string.

<Data validate allows to add validation rules. If formatter and validate are used at the same
time, keep in mind that validator sees the formatted string, and not the parsed value.

Validator complaints about the wrong input, but leaves it unchanged.
Formatter replaces you input with correct string or empties it.
            -->
            <div class="field">
                <label for="z1">
                    Date Input <span class="explain">(format)</span>
                </label>
                <input
                    type="text"
                    name="calendar-date"
                    placeholder="date"
                    id="z1"
                    use:format={new DateFmt()}
                />
                <Data bind:value={dat} validate={[rule.empty()]} />
            </div>

            <div class="field">
                <label for="fn2">
                    Income <span class="explain">(formatted & required)</span>
                </label>
                <input
                    type="text"
                    name="first-name"
                    placeholder="money"
                    id="fn2"
                    use:format={new MoneyFmt()}
                />
                <Data bind:value={income} validate={[rule.empty()]} />
            </div>

            <!-- direct <input bind:value may be used for simple string value -->
            <div class="field">
                <label for="ln">
                    Rank <span class="explain">(with popup)</span>
                </label>
                <input
                    id="ln"
                    type="text"
                    name="last-name"
                    placeholder="Last Name"
                    bind:value={rank}
                    use:popup={{
                        content: "this input is bound to 'Rank'",
                        position: "bottom right",
                    }}
                />
            </div>
            <!--
          dP                         dP       dP
          88                         88       88
 .d8888b. 88d888b. .d8888b. .d8888b. 88  .dP  88d888b. .d8888b. dP.  .dP
 88'  `"" 88'  `88 88ooood8 88'  `"" 88888"   88'  `88 88'  `88  `8bd8'
 88.  ... 88    88 88.  ... 88.  ... 88  `8b. 88.  .88 88.  .88  .d88b.
 `88888P' dP    dP `88888P' `88888P' dP   `YP 88Y8888' `88888P' dP'  `dP

-->
            <!-- direct <input bind:checked may be used for boolean -->
            <div class="field">
                <div class="ui checkbox" use:checkbox>
                    <input type="checkbox" id="ch" bind:checked={chb} />
                    <label for="ch">
                        <u>"income of {income}"</u>
                        <b>{chb ? "agreed" : "did not agree"}</b>
                        to the Terms
                    </label>
                </div>
            </div>

            <!-- TODO: bind:group on input -->
            <div class="field">
                <div class="ui radio checkbox" use:checkbox>
                    <input type="radio" id="ch1" bind:group={gender} value="male" />
                    <label for="ch1">Male</label>
                </div>
                &nbsp;
                <div class="ui radio checkbox" use:checkbox>
                    <input type="radio" id="ch2" bind:group={gender} value="female" />
                    <label for="ch2">Female</label>
                </div>
            </div>

            <!-- TODO: bind:group on checkbox, javascript initialization is optional -->
            <div class="field">
                <div class="ui checkbox">
                    <input type="checkbox" id="ch21" bind:group={teams} value="1" />
                    <label for="ch21">1</label>
                </div>
                &nbsp; &nbsp;
                <div class="ui checkbox">
                    <input type="checkbox" id="ch22" bind:group={teams} value="2" />
                    <label for="ch22">2</label>
                </div>
                &nbsp; &nbsp;
                <div class="ui checkbox">
                    <input type="checkbox" id="ch23" bind:group={teams} value="3" />
                    <label for="ch23">3</label>
                </div>
                &nbsp; &nbsp;
                <div class="ui checkbox">
                    <input type="checkbox" id="ch24" bind:group={teams} value="4" />
                    <label for="ch24">4</label>
                </div>
                &nbsp; &nbsp;
                <div class="ui checkbox">
                    <input type="checkbox" id="ch25" bind:group={teams} value="5" />
                    <label for="ch25">5</label>
                </div>
            </div>

            <!--
          dP oo       dP
          88          88
 .d8888b. 88 dP .d888b88 .d8888b. 88d888b.
 Y8ooooo. 88 88 88'  `88 88ooood8 88'  `88
       88 88 88 88.  .88 88.  ... 88
 `88888P' dP dP `88888P8 `88888P' dP

            -->
            <div class="field">
                <label for="sl">
                    Rating <span class="explain">(number with slider)</span>
                </label>
                <div
                    id="sl"
                    class="ui labeled ticked slider bottom aligned"
                    use:slider={{ min: 0, max: 10 }}
                >
                    <!-- validate={yup.number().required()} -->
                    <Data
                        forId="sl"
                        bind:position={rating}
                        validate={[rule.not("0"), rule.not("1")]}
                    />
                </div>
            </div>

            <!-- <div class="ui message error" /> -->
        </form>
    </div>
</main>

<style>
.explain {
    font-weight: 300;
    font-style: italic;
}

form {
    padding: 0.75rem;
    background-color: #f7f7f7;
}
</style>
