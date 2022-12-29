# svelte-semantic-ui
Svelte actions and data bindings for Semantic UI components

## Example
```svelte
    <form class="ui form" use:formValidation={{...}}>
        <FormValidationData
            active={isActive}
            bind:valid={isValid}
            bind:errors={errMsg}
        />

        <select class="ui dropdown selection" use:dropdown={{...}}>
            <Data
                bind:selected={country}
                validate={["empty", "not[USA]"]}
            />
            ...
        </select>

        <input type="text class="ui input use:format={camelcaseFormatter}>
            <Data
                bind:value={firstName}
                validate={["empty", "minLengh[5]"]}
            />
        </input>
    </form>
```

## Design
* Keep familiar Semantic UI syntax
    * We are NOT using wrapping Svelte components for each Semantic UI element.
    * Instead of that we keep Semantic HTML layout and replace jQuery-based module initializers with `use:` actions. 
    * As a result, Svelte HTML (before compilation) is auto-completed in IDE and properly rendered in browser.

* Maintain separation of concepts
    * Svelte `use:` actions modify input behaviour (for example enable dropdown). 
        * They are initialized before Svelte components.
        * The actions create Svelte stores to hold data. 
        * They may work without `Data` binding components.
    * `Data` binding components are nested inside the tags which they control. 
        * On initialization, these components find the parent store and subsribe to changes.
        * We decided to use one `Data` component for all UI elements that have data bindings.
        * Differnt `bind:` attributes of `Data` component (`value`, `selected`, `active`, `date`, `position`) are used for different UI elements. 
    * Text input formatting and validation are interrelated.
        * We view formating as behaviour (input with date formatter is very similar to calendar element).
        * While validation is closely related to data binding.
        * Thus we recommend to use `<input use:format={...}` and `<Data validate={...}`.
        * For people who strongly disagree with above, we support `<Data format={...} validate={...}` : )
* Start small, improve later
    * The library is written in TypeScript and we strongly recommend that you use type checking in your code. But it will work just fine with JavaScript : )
    * You may need to call `use:behavior` on the UI element to access internal Semantic UI behaviors, but we recommend to use Svelte data bindings instead, whenever possible. 
    * This is work in progress and your feedback is always appreciated.
