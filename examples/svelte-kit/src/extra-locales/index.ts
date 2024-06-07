// i18n/extra-locales
// Additional translations and formats.

import {
    supportedLocales as baseSupportedLocales,
    applyLocale as baseApplyLocale,
    readAndApply,
} from "../../lib/i18n";

/** Returns full list od supported locales: default and added by the application. */
export function supportedLocales(): string[] {
    return [...baseSupportedLocales(), "be-BY", "fi-FI", "en-AU", "ja-JP"];
}

let currLocale: string = "en";

export function currentLocale(): string {
    return currLocale;
}

/** Imports locale settings added in the app, if not in list - uses default.
    Returns applied locale string or null if locale is not found */
export async function applyLocale(locale: string): Promise<string | null> {
    // check locale and language
    if (!locale) {
        console.info("missing locale");
        return null;
    }

    // load library defaults, try to laod locale settings
    const base: string | null = await baseApplyLocale(locale);
    let ext: string | null = null;

    // add 3 new languages
    const lang: string = locale.split("-")[0];
    let langProm: Promise<unknown> | null = null;
    /* eslint-disable @typescript-eslint/brace-style */
    /* prettier-ignore */
    if /**/ (lang === "be") { langProm = import("./be"); }
    else if (lang === "fi") { langProm = import("./fi"); }
    else if (lang === "ja") { langProm = import("./ja"); }
    /* eslint-enable */
    if (langProm !== null) {
        await readAndApply(langProm);
        ext = lang;
    }
    if (lang === locale) {
        currLocale = lang;
        return lang;
    }

    // TODO: create registerLocale function in the base module

    let locProm: Promise<unknown> | null = null;
    /* eslint-disable @typescript-eslint/brace-style */
    /* prettier-ignore */
    if /**/ (locale === "be-BY") { locProm = null; ext = locale; }
    else if (locale === "fi-FI") { locProm = null; ext = locale; }
    else if (locale === "ja-JP") { locProm = null; ext = locale; }
    else if (locale === "en-GB") { locProm = import("./en-GB-ext"); }
    else if (locale === "en-AU") { locProm = import("./en-AU"); }
    /* eslint-enable */
    if (locProm !== null) {
        await readAndApply(locProm);
        ext = locale;
    }

    // code of the applied locale, may be lang-only, or null if no match was found
    return ext ?? base;
}
