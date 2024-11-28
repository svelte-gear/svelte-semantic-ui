# svelte-semantic-ui

Svelte actions and data bindings for Semantic UI components

## Example

```html
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

        <input type="text class="ui input use:format={camelcaseFormatter} />
        <Data
            bind:value={firstName}
            validate={["empty", "minLengh[5]"]}
        />
    </form>
```

## Versions

Version 0.4.x is compiled in svelte 4, but may be used in Svelte 5 project.

## Design

- Keep familiar Semantic UI syntax

    - We are NOT using wrapping Svelte components for each Semantic UI element.
    - Instead of that we keep Semantic HTML layout and replace jQuery-based module initializers with `use:` actions.
    - As a result, Svelte HTML (before compilation)
        - looks similar to vanilla Semantic UI,
        - is auto-completed in IDE,
        - and is properly rendered in browser.

- Separate field behavior and data binding

    - Svelte `use:` actions modify input behaviour (for example enable dropdown).
        - They are initialized before Svelte components.
        - The actions create Svelte stores to hold data.
        - They may work without `Data` binding components.
    - `Data` binding components are nested inside the Semantic UI elements which they control.
        - On initialization, these components find the parent's store and subsribe to changes.
        - We use one `Data` component for all field types that have data bindings.
        - Differnt `bind:` attributes of `Data` component (`value`, `selected`, `active`, `date`, `position`) are used for different UI elements.
    - `Data` binding for inputs must immediteley follow the `input` or `textarea` tag.

- Separate field formatting and form data validation

    - We treat text formating as a field behavior.
        - For example input with date formatter is very similar to calendar element, as both listen to user events and produce date object at the end.
        - Use `<input use:format={formatterObject}` to define data parsing and text fomatting rules.
    - Validation may work on field or form level and is closely related to data binding.
        - We recommend to define validation rules on field level to improve code readability.
        - Use `<Data validate={...}` to define the rules using Sematic UI syntax.
        - Additional form-level rules and options may be added directly to `<form use:formValidation`.

- Start small, improve later
    - The library is written in TypeScript and we strongly recommend that you use type checking in your code. But it will work just fine with JavaScript : )
    - You may call `use:behavior` on the UI element to access internal Semantic UI behaviors, but we believe that Svelte data bindings are sufficient for most tasks and are simpler to use.

## Read more

- [Running the app](doc/RUNNING) - see {@link man/RUNNING}
- [Refernces](doc/REFERENCES) - see {@link man/REFERENCES}
