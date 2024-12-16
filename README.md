# svelte-semantic-ui

Svelte actions and data bindings for Semantic UI components

## Example

```html
    <form class="ui form"
        <InitForm
            active={validationIsActive}
            bind:valid={isValid}
            bind:errors={errMsg}
            settings={{...}}>
        />

        <select class="ui dropdown selection">
            ...
        </select>
        <InitDropdown
            bind:value={country}
            validate={["empty", "not[USA]"]}
            settings={{...}}>
        />


        <input type="text" class="ui input" />
        <InitNumberInput
            bind:value={salary}
            validate={["empty", "minLengh[5]"]}
            options={{ type: "money" }}
        />
    </form>
```

## Versions

Version 0.6.x introduces new simpler sysntax and more tupe checks.
Version 0.5.x is using svelte 5 and runes.
Version 0.4.x is compiled in svelte 4, but may be used in Svelte 5 project.

## Design

- Keep familiar Semantic UI syntax

    - We are NOT creating a replacement Svelte component for each Semantic UI element.
    - Instead of that we keep Semantic HTML layout and add `<Init*>` components to replace jQuery initializers.

- Data bindings

    - `<Init*>` components allow to set and receive data from Dropdown, Calendar, Slider components, inputs, or textarea.
    - `InitModal` controlls Modal component through `show` binding.
    - The Init should follow the Semantic UI compoonent, `input`, or `textarea` that it controls.
        - The library may be configured to use Init as a parent or a child of the input.

- Settings

    - Javascript calls are replaced with `settings` prop in the `Init` component

- Field formatting

    - We treat text formating as a field behavior. <br/>
      For example input with date formatter (`<InitDateInput>`) is very similar to calendar element, as both listen to user events and produce date object at the end.

- Validation

    - We recommend to define validation rules on field level to improve code readability.
    - Use `<Init* validate={...}` to define the rules using Sematic UI syntax.
    - You can regieter you own rules and use them in your app.

- TyepScript

    - The library is written in TypeScript and we strongly recommend that you use type checking in your code.
    - But it will work just fine with JavaScript :)

## Read more

- [Running the app](doc/RUNNING)
- [Refernces](doc/REFERENCES)
