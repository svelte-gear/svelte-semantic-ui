<script lang="ts">
   // app.svelte

   import Router, { location } from "svelte-spa-router";
   import active from "svelte-spa-router/active";

   import Form from "./routes/form.svelte";
   import Home from "./routes/home.svelte";
   import NotFound from "./routes/notfound.svelte";

   const routes = {
      "/": Home,
      "/form": Form,
      // '/author/:first/:last?': Author,
      // '/book/*': Book,
      "*": NotFound
   };
</script>

<div class="app-layout">
   <nav class="ui buttons">
      <a href="#/" use:active class="ui button basic">Home</a>
      <a href="#/form" use:active class="ui button basic">Form</a>
      <a href="#/xxx" class="ui button basic">Wrong</a>
   </nav>
   <div class="ui divider" />

   <Router routes={routes} />

   <div class="ui divider" />
   <p class="footer">Sample App, &nbsp; <i>location</i> = {$location}</p>
</div>

<style>
   :global(body) {
      padding: 0 !important;
   }

   :global(main) {
      min-height: 200px;
   }

   /* hide LastPass icons*/
   :global(#__lpform_input_idx_1_icon),
   :global(#__lpform_input_idx_2_icon),
   :global(#__lpform_input_idx_3_icon),
   :global(#__lpform_input_idx_4_icon),
   :global(#__lpform_input_idx_5_icon) {
      display: none;
   }

   div.app-layout {
      text-align: center;
      /* padding: 1rem; */
      /* margin: 0 auto; */
      max-width: 360px;
      width: 100%;
      /* background-color: antiquewhite; */
   }

   /* :global prevent removal of "unused" .active */
   nav :global(a.active) {
      font-weight: bold !important;
      color: black;
   }

   @media (max-width: 639px) {
      div.app-layout {
         min-width: 240px;
      }
   }
</style>
