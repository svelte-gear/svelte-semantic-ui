# inspiration

-  Keep Semantic UI syntax.
-  Replace `jQuery.component()` calls with Svelte `use:component`.
-  Many component (input, checkbox) may be bound directly.
-  Where necessary, provide additional Svelte bindings (dropdown, calendar).

Imperative API

-  There is no need to access jQuery in Svelte projects.
-  Imperative API is available through `use:controller`.
-  Furthermore, we encourage usage of Svelte bindings instead of the API.

# implementation

-  TypeScript code is safer and allows for auto-completion.
-  In the first phase component options and controller behaviours are NOT yet enumerated.
-  Semantic UI and Fomantic UI look very similar, but Semantic seems more stable (focus events).
-  Few new components are imported from Fomantic UI: calendar, slider, toast.

# modules

```
utils  <---  use-action    <---  index         <---  pages
             use-dropdown        (re-export)
             use-modal
             use-calendar        behavior
             use-slider          (optional)

             data-bind.svelte
             form-data.svelte
```

# data binding

```
                                <select class="ui dropdown" use:dropdown>

<Data bind:value={var}>         StoreHolder      dropdown(...)

   prop  -->   onChange   -->   doUpdate()  -->  set value
    |
    --- <--  subscribed   <--   store       <--  onChange
```

# example

```svelte
    <form class="ui form" use:formValidation={{...}}>
        <FormValidationData
            active={...}
            bind:valid={...}
            bind:errors={...}
        />

        <select class="ui dropdown selection" use:dropdown={{...}}>
            <Data
                bind:selected={...}
                validate={["empty", "not[USA]"]}
            />
            ...
        </select>

        <input type="text class="ui input use:format={upperCase}>
            <Data
                bind:value={...}
                validate={["empty", "minLengh[5]"]}
            />
        </input>

        <input type="text class="ui input"banting school
            bind:value={...}
            use:validate={["empty", "minLengh[5]"]}
        />
    </form>
```
