<script lang="ts">
   // import { number, reach } from "yup";
   import {
      checkbox,
      popup,
      sticky,
      dropdown,
      calendar,
      slider,
      toast,
      validate,
      formValidation,
      Data,
      FormValidationData
   } from "../lib/semantic";
   import { calendarIsoFmt } from "../lib/semantic/common";
   // import { format, numberFormatter } from "../lib/semantic/data-format";

   const options = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];

   let n = 3;
   let num = "5";
   let nums = ["1", "2", "3"];
   let country = "ar";
   let gender = "male";
   let name = "";
   let chb = true;
   let dat = new Date("2022-01-01 12:00");
   let tim: Date;

   function reset() {
      n = 3;
      num = "5";
      nums = ["1", "2", "3"];
      country = "ar";
      gender = "male";
      name = "12345";
      chb = true;
      dat = new Date("2022-01-01 12:00");
      tim = undefined as unknown as Date;

      toast({
         class: "success",
         title: "Better?",
         message: "You're using the good framework!",
         displayTime: 5000,
         closeIcon: true
      });
   }

   let json: string;

   $: {
      json = JSON.stringify({
         n: n,
         num: num,
         nums: nums,
         country: country,
         gender: gender,
         name: name,
         agree: chb,
         date: calendarIsoFmt.datetime(dat),
         time: calendarIsoFmt.time(tim)
      })
         .replace(" ", "_")
         .replaceAll(',"', ', "') // replaceAll allows spaces
         .replace("{", "{ ")
         .replace("}", " }");
   }

   $: console.log(`nums [${nums.toString()}]`);

   let active = false;
   function toggleActive() {
      active = !active;
   }
   let valid = false;
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
            inline: true
         }}
      >
         <FormValidationData active={active} bind:valid={valid} />

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
               Select <span class="explain">(single)</span>
            </label>
            <select
               id="numb3"
               class="ui selection dropdown"
               use:dropdown={{
                  clearable: true
               }}
            >
               <Data bind:selected={num} />
               {#each options as n}
                  <option value={n}>Number {n}</option>
               {/each}
            </select>
         </div>

         <!-- Dropdown wrapper around select, bind value to wrapper -->
         <div class="field" id="x">
            <label for="numb2">
               Select <span class="explain">(multiple)</span>
            </label>
            <select id="numb2" class="ui selection dropdown fluid" multiple use:dropdown use:validate={"empty"}>
               <Data bind:selected={nums} />
               {#each options as n}
                  <option value={n}>Num {n}</option>
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
               Dropdown <span class="explain">(decorated, with search)</span>
            </label>

            <!-- dropdown with full text search uses Dropdown component wrapper -->
            <div
               class="ui search selection dropdown"
               use:dropdown={{
                  fullTextSearch: "exact"
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
               Dropdown <span class="explain">(data from js)</span>
            </label>
            <div
               class="ui selection dropdown"
               use:dropdown={{
                  values: [
                     { name: "Male", value: "male" },
                     { name: "Female", value: "female" }
                  ]
               }}
            >
               <!-- use:validate={["not[male]"]} -->
               <Data bind:selected={gender} validate={["not[male]"]} />
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

         <!-- don't know how to bind yet -->
         <div class="field" id="y">
            <label for="_">
               Relative date <span class="explain">(not in future)</span>
            </label>
            <div
               class="ui calendar"
               use:calendar={{
                  type: "datetime",
                  maxDate: new Date()
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
               <label for="_">Absolute date</label>
               <div
                  class="ui calendar"
                  use:calendar={{
                     // type: "date",
                     startMode: "year"
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
               <label for="_">Time</label>
               <div
                  id="x15"
                  class="ui calendar"
                  use:calendar={{
                     type: "time"
                  }}
                  use:validate={["empty", "not[00:00]"]}
               >
                  <Data bind:date={tim} />
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

         <!-- bind 'value' on input -->
         <!-- <div class="field" class:error={!name || name.length > 16}>
                <label for="fn">
                    First Name <span class="explain">(manual)</span>
                </label>
                <input
                    type="text"
                    name="first-name"
                    placeholder="First Name"
                    id="fn"
                    bind:value={name}
                />
                {#if !name}
                    <div class="ui pointing up red basic label">Please enter a value</div>
                {/if}
            </div> -->

         <div class="field">
            <label for="fn2">
               First Name <span class="explain">(validated)</span>
            </label>
            <input type="text" name="first-name" placeholder="First Name" id="fn2" />
            <Data bind:value={name} validate={["integer"]} />
         </div>

         <!-- custom popup on input -->
         <div class="field">
            <label for="ln">
               Last Name <span class="explain">(with popup)</span>
            </label>
            <input
               id="ln"
               type="text"
               name="last-name"
               placeholder="Last Name"
               bind:value={num}
               use:popup={{
                  content: "actually this is bound to 'number'",
                  position: "bottom right"
               }}
            />
         </div>

         <!-- bind 'checked' on input -->
         <div class="field">
            <div class="ui checkbox" use:checkbox>
               <input type="checkbox" id="ch" bind:checked={chb} />
               <label for="ch">
                  <u>{name}</u>
                  <b>{chb ? "agrees" : "does not agree"}</b>
                  to the Terms and Conditions
               </label>
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
               Slider <span class="explain">(number)</span>
            </label>
            <div
               id="sl"
               class="ui labeled ticked slider bottom aligned"
               use:slider={{ min: 0, max: 10 }}
               use:validate={["not[0]", "not[1]"]}
            >
               <!-- use:validate={yup.number().required()} -->
               <!-- use:validate={["not[0]", "not[1]"]} -->
               <Data bind:position={n} />
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
