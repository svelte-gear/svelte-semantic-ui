### Inspiration

- Keep Semantic UI syntax.
- Replace `jQuery.component()` calls with Svelte `<InitComponent>`.
- Some components (input, checkbox, textarea) may be bound directly.
- Where necessary, provide additional Svelte bindings (dropdown, calendar, slider).

### Imperative API

- There is no need to access jQuery in Svelte projects.
- Imperative API is available through `use:controller`.
- Furthermore, we encourage usage of Svelte bindings instead of the API.

### Implementation

- TypeScript code is safer and allows for auto-completion.
- In the first phase component options and controller behaviours are NOT yet enumerated.
- Semantic UI and Fomantic UI look very similar, but Semantic seems more stable (focus events).
- Fomantic UI has useful unique components: calendar, slider, toast.

### Modules

```
utils  <---  components    <---  index         <---  pages
             InitDropdown        (re-export)
             InitModal
             InitCalendar        behavior
             InitSlider          (optional)

             InitForm
```

### example

```html
    <form class="ui form">
        <InitForm
            active={...}
            bind:valid={...}
            bind:errors={...}
            settings={{...}}
        />

        <select class="ui dropdown selection">
            ...
        </select>
        <Data
            bind:value={...}
            validate={["empty", "not[USA]"]}
             settings={{...}}
        />

        <input type="text" class="ui input" />
        <InitNumberInput
            bind:value={...}
            validate={["empty", "minLengh[5]"]}
        />
    </form>
```
