<script lang="ts">
// routes/+page.svelte

import { dropdown, Data } from "$lib";
let s = "2";

$: {
    console.log("s = " + s);
}
</script>

<h1>Welcome to your library project</h1>

<br />

<form>
    <select class="ui selection dropdown" use:dropdown={{ clearable: true }}>
        <Data bind:selected={s} />
        <option value="1">one</option>
        <option value="2">two</option>
    </select>
</form>

<p>value = {s}</p>
