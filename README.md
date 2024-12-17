# svelte-semantic-ui

Svelte actions and data bindings for Semantic UI components. <br/>
https://fomantic-ui.com/ <br/>
https://svelte.dev/

## Example

```html
    <script lang="ts">
        import { InitForm, InitDropdown, InitNumberInput } from "@svelte-gear/svelte-semantic-ui";

        let liveValidation: boolean = $state(true);
        let isValid: boolean = $state(true);
        let country: string = $state("");
        let salary: number | undefined = $state();
    </script>
    <form class="ui form"
        <InitForm
            active={liveValidation}
            bind:valid={isValid}
            settings={{...}}>
        />

        <select class="ui dropdown selection">
            <option value="CA">Canada</option>
            <option value="MX">Mexico</option>
            <option value="US">USA</option>
        </select>
        <InitDropdown
            bind:value={country}
            validate={["empty", "not[US]"]}
            settings={{...}}>
        />

        <input type="text" class="ui input" />
        <InitNumberInput
            bind:value={salary}
            validate={["empty", "minLengh[5]"]}
            settings={{ type: "money" }}
        />
    </form>
```

## Versions

- Version 0.6.x introduces new simpler syntax and more type checks.
- Version 0.5.x is using svelte 5 and runes.
- Version 0.4.x is compiled in svelte 4, but may be used in Svelte 5 project.

## Design principles

#### Keep Semantic UI syntax

- We are NOT creating a replacement Svelte component for each Semantic UI element.
- Instead of that we keep Semantic HTML layout and add `<Init*>` components to replace jQuery code. (see `doc/COMPONENTS.md`)

#### Data bindings

- `Init*` components allow to set and receive data from Dropdown, Calendar, Slider components, inputs, or textarea.
- `InitModal` controls Modal component visibility through `show` binding.
- The `Init*` should follow the Semantic UI component, input, or textarea that it controls.
    - `InitForm` may additionally be used as a child of the form.
    - The library may be configured to use Init as a parent or a child of the input.

#### Settings

- Javascript initialization calls used by Semantic UI are replaced with `settings` prop in the `Init*` component.
- There are default settings fro each component. A component may optinaly override the settings.

## Features

#### Field formatting

- The library introduces `InitDateInput`, `InitNumberInput`, and `InitTextInput` with field formating behavior.
- `InitDateInput` works very similar to calendar component, as both take user input and produce date object.
- `InitNumberInput` supports integer, decimal and money formats controlled by i18n number settings.
- `InitTextInput` may be used for simple formatting or validation.
- You may override settings for individual input or create and use you own formatter.

#### Validation

- While formatting is strict and will remove invalid input, validation leaves entered data as is and displays a warning.
- We recommend to define validation rules on field level to improve code readability.
- Use `<Init* validate={...}` to define the rules using Sematic UI syntax (see https://fomantic-ui.com/behaviors/form.html#/settings)
- You can register you own rules and use them in your app (see `src/lib/data/validation-rules.ts` )

#### i18n

- Semantic UI allows to set custom messages and formats.
- svelte-semantic-ui uses this function to supports multiple locales.
- A locale changes date and number formattinga swell as validation maessages.
- You can add more locales yourself (see `examples/i18n/src/extra-locales/` )

#### TypeScript

- The library is written in TypeScript. It works for both TS and JS projects.
- We strongly recommend that you use type checking in your code :)
