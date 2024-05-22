// i18n/extra-locales
// Additional translations and formats.

import {
    supportedLocales as baseSupportedLocales,
    applyLocale as baseApplyLocale,
} from "../../lib/i18n/base-locales";

/** Returns full list od supported locales: default and added by the application. */
export function supportedLocales(): string[] {
    return [...baseSupportedLocales(), "be-BY", "fi-FI"];
}

/** Imports locale settings added in the app, if not in list - uses default.
    Returns applied locale string or null if locale is not found */
export async function applyLocale(locale: string): Promise<string | null> {
    let i18n: Promise<unknown> | null = null;

    /* eslint-disable @typescript-eslint/brace-style */
    /* prettier-ignore */
    if (!locale) {
        console.info("missing locale");
        return null;
    }
    else if (locale === "be-BY") { i18n = import("./be-BY"); }
    else if (locale === "en-UK") { i18n = import("./en-GB-ext"); }
    else if (locale === "fi-FI") { i18n = import("./fi-FI"); }
    else {
        return baseApplyLocale(locale);
    }
    /* eslint-enable @typescript-eslint/brace-style */

    if (i18n === null) {
        return null;
    }
    await i18n;
    return locale;
}
