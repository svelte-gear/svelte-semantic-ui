# svelte-semantic-ui
Svelte actions and data bindings for Semantic UI components

## example
```svelte
    <form class="ui form" use:formValidation={{...}}>
        <FormValidationData
            active={isActive}
            bind:valid={isValid}
            bind:errors={errMasg}
        />

        <select class="ui dropdown selection" use:dropdown={{...}}>
            <Data
                bind:selected={selValue}
                validate={["empty", "not[USA]"]}
            />
            ...
        </select>

        <input type="text class="ui input>
            <Data
                bind:value={lastName}
                format={camelcaseFormatter}
                validate={["empty", "minLengh[5]"]}
            />
        </input>
    </form>
```
