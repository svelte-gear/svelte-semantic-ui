<svelte:options runes={true} />

<script lang="ts">
interface Props {
    /** Name of the source file */
    file: string;

    /** Name of the example */
    component: string;

    /** currently displayed code fragment */
    selected: string;
}

// REACTIVE -------------------------------------------------------------------
/* eslint-disable prefer-const */

let { file, component, selected = $bindable() }: Props = $props();

// let show: boolean = $state(false);

let code: string = $state("");

let rows: number = $state(5);

/* eslint-enable */
// FUNCTIONS ------------------------------------------------------------------

function getImportList(text: string): string[] {
    const imports: string[] = [];
    const actions: string[] = ["checkbox", "popup", "sticky"];
    const components: string[] = [
        "InitForm",
        "InitCalendar",
        "InitDropdown",
        "InitSlider",
        "InitModal",
        "InitDateInput",
        "InitNumberInput",
        "InitTextInput",
    ];
    const functions: string[] = ["toast"];
    const objects: string[] = ["rule"];
    actions.forEach((action: string) => {
        if (text.includes(`use:${action}`)) {
            imports.push(action);
        }
    });
    components.forEach((comp: string) => {
        if (text.includes(`<${comp}`)) {
            imports.push(comp);
        }
    });
    functions.forEach((funct: string) => {
        if (text.includes(`${funct}(`)) {
            imports.push(funct);
        }
    });
    objects.forEach((objec: string) => {
        if (text.includes(`${objec}.`)) {
            imports.push(objec);
        }
    });
    return imports;
}

function getVarNames(text: string): string[] {
    const inCurlyBraces: RegExpMatchArray | null = text.match(/\{[^}]*\}/g);
    if (!inCurlyBraces) {
        return [];
    }
    const varNames: string[] = inCurlyBraces
        .filter((line: string) => !/[ #:/"]/.test(line)) // exclude space, #, :, /, "
        .map((line: string) => line.slice(1, -1));
    const eachNames: string[] = inCurlyBraces
        .map((line: string) => {
            const match: RegExpMatchArray | null = line.match(
                /{#(?:each\s|if\s|if\s!)([a-zA-Z0-9_]+)/
            );
            return match ? match[1] : null;
        })
        .filter((line: string | null) => !!line) as string[];
    const uniqueVarNames: string[] = [...new Set([...varNames, ...eachNames])];
    console.log("VARS", uniqueVarNames);
    return uniqueVarNames;
}

function getMinIndent(lines: string[]): number {
    let minSpace: number = 100;
    lines.forEach((line: string) => {
        if (line.trim().length > 0) {
            const match: RegExpMatchArray | null = line.match(/^ */);
            const sp: number = match ? match[0].length : 0;
            if (sp < minSpace) {
                minSpace = sp;
            }
        }
    });
    return minSpace;
}

function getLetLines(scriptText: string, varNames: string[]): string[] {
    const scriptLines: string[] = scriptText.split("\n");
    const letLines: string[] = [];
    scriptLines.forEach((line: string) => {
        varNames.forEach((varName: string) => {
            if (line.includes(`let ${varName}:`) || line.includes(`const ${varName}:`)) {
                letLines.push(line);
            }
        });
    });
    return letLines;
}

async function loadCode(): Promise<void> {
    const resp: Response = await fetch(`/code/${file}/page.html`);
    const fullText: string = await resp.text();

    const marker: string = `<!-- example-${component} -->`;
    const p1: number = fullText.indexOf(marker) + marker.length;
    const p2: number = fullText.indexOf(marker, p1);
    const textHelp: string = p1 > 0 && p2 > 0 ? fullText.slice(p1, p2) : "<!-- not found -->";
    const codeText: string = textHelp.replace(/\s*<div class="help_text">.*?<\/div>/gs, "\n");
    const codeLines: string[] = codeText.split("\n");

    const s0: number = fullText.indexOf("<script");
    const s1: number = fullText.indexOf(">", s0);
    const s2: number = fullText.indexOf("</scrip");
    const scriptText: string = s1 > 0 && s2 > 0 ? fullText.slice(s1, s2) : "";

    const imports: string[] = getImportList(codeText);
    const varNames: string[] = getVarNames(codeText);
    const letLines: string[] = getLetLines(scriptText, varNames);
    const minSpace: number = getMinIndent(codeLines);

    let res: string = `<script>\nimport { ${imports.join(", ")} } from "@svelte-gear/svelte-semantic-ui";\n`;
    let cnt: number = 1;
    letLines.forEach((letLine: string) => {
        res += `${letLine}\n`;
        cnt += 1;
    });
    res += "<script>\n\n";
    cnt += 2;

    codeLines.forEach((line: string) => {
        if (line.trim().length > 0) {
            res += `${line.slice(minSpace)}\n`;
            cnt += 1;
        }
    });
    code = res;
    rows = cnt;
}

$effect(() => {
    void selected;
    void code;
    if (selected === component && code === "") {
        void loadCode();
    }
});

async function showCode(): Promise<void> {
    // show = true;
    selected = component;
}

function hideCode(): void {
    // show = false;
    selected = "";
    window.history.pushState(null, "", "#");
}
</script>

{#if selected !== component}
    <a href="#{component}" onclick={showCode}>show code</a>
{/if}
{#if selected === component}
    <!-- svelte-ignore a11y_invalid_attribute -->
    <a href="#" onclick={hideCode} class="hide">&nbsp;hide code&nbsp;</a>
    <div class="ui right rail">
        <div class="ui segment">
            <h1>{component.replace(/_/g, " ")}</h1>
            {#if !code}
                loading...
            {/if}
            <textarea readonly rows={rows + 3}>{code}</textarea>
        </div>
        <button class="ui button tiny" onclick={hideCode}> Close </button>
    </div>
{/if}

<style>
a {
    font-weight: bold;
    opacity: 1;
    text-decoration: underline;
}
textarea {
    font-family: monospace !important;
    font-size: 80% !important;
    height: auto !important;
}

.ui.rail {
    width: 600px;
}
h1::first-letter {
    text-transform: uppercase;
}
.hide {
    color: darkred;
}
</style>
