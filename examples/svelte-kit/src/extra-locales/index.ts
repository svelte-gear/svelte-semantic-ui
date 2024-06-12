// i18n/extra-locales
// Additional translations and formats.

import { registerLanguage, registerLocale } from "@svelte-gear/svelte-semantic-ui";

/** Return empty object - no changes */
async function noop(): Promise<object> {
    return {};
}

/** Tell the framework how to load these elocales. */
export function registerExtraLocales(): void {
    // add 3 more languages
    registerLanguage("be", () => import("./be"));
    registerLanguage("fi", () => import("./fi"));
    registerLanguage("ja", () => import("./ja"));

    // these are default locales for these languages, no changes required
    registerLocale("be-BY", noop);
    registerLocale("fi-FI", noop);
    registerLocale("ja-JP", noop);

    // replace existing locale
    registerLocale("en-GB", () => import("./en-GB-ext"));

    // add new English locale
    registerLocale("en-AU", () => import("./en-AU"));
}
